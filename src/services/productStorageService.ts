import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Product, StockHistoryEntry } from "../types/product";
import { getCurrentTimestamp } from "../utils/date";
import { generateInventoryId } from "../utils/inventoryIdentifiers";

// get all
const getProducts = (): Product[] => {
    try {
        const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (!storedProducts) {
            return [];
        }
        const parsedProducts = JSON.parse(storedProducts);
        return Array.isArray(parsedProducts) ? parsedProducts : [];
    }
    catch {
        return [];
    }
};

// save
const saveProducts = (products: Product[]): void => {
    try {
        localStorage.setItem(
            STORAGE_KEYS.PRODUCTS,
            JSON.stringify(products)
        );
    }
    catch {
        return;
    }
};

const getStockHistory = (): StockHistoryEntry[] => {
    try {
        const storedHistory = localStorage.getItem(STORAGE_KEYS.STOCK_HISTORY);
        if (!storedHistory) {
            return [];
        }

        const parsedHistory = JSON.parse(storedHistory);
        return Array.isArray(parsedHistory) ? parsedHistory : [];
    }
    catch {
        return [];
    }
};

const saveStockHistory = (history: StockHistoryEntry[]): void => {
    try {
        localStorage.setItem(
            STORAGE_KEYS.STOCK_HISTORY,
            JSON.stringify(history)
        );
    }
    catch {
        return;
    }
};

const addStockHistoryEntry = (entry: StockHistoryEntry): void => {
    const history = getStockHistory();
    saveStockHistory([entry, ...history]);
};

// getbyid
const getProductById = (id: string): Product | undefined => {
    const products = getProducts();
    return products.find((product) => product.id === id);
};

// checksku
const isSkuExists = (sku: string, excludedProductId?: string): boolean => {
    const normalizedSku = sku.trim().toLowerCase();
    return getProducts().some((product) => {
        const isSameSku = product.sku.trim().toLowerCase() === normalizedSku;
        const isDifferentProduct = product.id !== excludedProductId;
        return isSameSku && isDifferentProduct;
    });
};

// add
const addProduct = (product: Product): Product[] => {
    const products = getProducts();
    const updatedProducts = [...products, product];
    saveProducts(updatedProducts);
    return updatedProducts;
};

// edit
const updateProduct = (updatedProduct: Product): Product[] => {
    const products = getProducts();
    const existingProduct = products.find(
        (product) => product.id === updatedProduct.id
    );

    if (
        existingProduct &&
        existingProduct.stockQuantity !== updatedProduct.stockQuantity
    ) {
        addStockHistoryEntry({
            id: generateInventoryId(),
            productId: updatedProduct.id,
            productName: updatedProduct.name,
            sku: updatedProduct.sku,
            quantityChange:
                updatedProduct.stockQuantity -
                existingProduct.stockQuantity,
            previousStockQuantity: existingProduct.stockQuantity,
            updatedStockQuantity: updatedProduct.stockQuantity,
            createdAt: updatedProduct.updatedAt,
        });
    }

    const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product);
    saveProducts(updatedProducts);
    return updatedProducts;
};

// delete
const deleteProduct = (id: string): Product[] => {
    const products = getProducts();
    const updatedProducts = products.filter(
        (product) => product.id !== id);
    saveProducts(updatedProducts);
    return updatedProducts;
};

const deleteProducts = (productIds: string[]): Product[] => {
    const productIdSet = new Set(productIds);
    const products = getProducts();
    const updatedProducts = products.filter(
        (product) => !productIdSet.has(product.id)
    );

    saveProducts(updatedProducts);
    return updatedProducts;
};

// update stock
const updateStock = (
    productId: string,
    quantityChange: number
): Product[] => {
    if (
        !Number.isInteger(quantityChange) ||
        quantityChange === 0
    ) {
        throw new Error(
            "Stock change must be a non-zero whole number."
        );
    }

    const products = getProducts();

    const productExists = products.some(
        (product) => product.id === productId
    );

    if (!productExists) {
        throw new Error("Product not found.");
    }

    const updatedProducts = products.map((product) => {
        if (product.id !== productId) {
            return product;
        }

        const updatedStockQuantity =
            product.stockQuantity + quantityChange;

        if (updatedStockQuantity < 0) {
            throw new Error(
                "Stock quantity cannot be negative."
            );
        }

        const updatedProduct = {
            ...product,
            stockQuantity: updatedStockQuantity,
            updatedAt: getCurrentTimestamp(),
        };

        addStockHistoryEntry({
            id: generateInventoryId(),
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            quantityChange,
            previousStockQuantity: product.stockQuantity,
            updatedStockQuantity,
            createdAt: updatedProduct.updatedAt,
        });

        return updatedProduct;
    });

    saveProducts(updatedProducts);

    return updatedProducts;
};

const updateStockForProducts = (
    productIds: string[],
    quantityChange: number
): Product[] => {
    if (
        !Number.isInteger(quantityChange) ||
        quantityChange === 0
    ) {
        throw new Error(
            "Stock change must be a non-zero whole number."
        );
    }

    const productIdSet = new Set(productIds);
    const products = getProducts();
    const selectedProducts = products.filter((product) =>
        productIdSet.has(product.id)
    );

    if (selectedProducts.length === 0) {
        throw new Error("Select at least one product.");
    }

    const wouldGoNegative = selectedProducts.some(
        (product) => product.stockQuantity + quantityChange < 0
    );

    if (wouldGoNegative) {
        throw new Error(
            "One or more selected products would have negative stock."
        );
    }

    const timestamp = getCurrentTimestamp();

    const updatedProducts = products.map((product) => {
        if (!productIdSet.has(product.id)) {
            return product;
        }

        const updatedStockQuantity =
            product.stockQuantity + quantityChange;

        addStockHistoryEntry({
            id: generateInventoryId(),
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            quantityChange,
            previousStockQuantity: product.stockQuantity,
            updatedStockQuantity,
            createdAt: timestamp,
        });

        return {
            ...product,
            stockQuantity: updatedStockQuantity,
            updatedAt: timestamp,
        };
    });

    saveProducts(updatedProducts);
    return updatedProducts;
};

const escapeCsvValue = (value: string | number): string => {
    const stringValue = String(value);

    if (
        stringValue.includes(",") ||
        stringValue.includes("\"") ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue.replaceAll("\"", "\"\"")}"`;
    }

    return stringValue;
};

const createProductsCsv = (products: Product[]): string => {
    const headers = [
        "Name",
        "SKU",
        "Category ID",
        "Price",
        "Stock Quantity",
        "Description",
        "Created At",
        "Updated At",
    ];

    const rows = products.map((product) => [
        product.name,
        product.sku,
        product.categoryId,
        product.price,
        product.stockQuantity,
        product.description ?? "",
        product.createdAt,
        product.updatedAt,
    ]);

    return [headers, ...rows]
        .map((row) => row.map(escapeCsvValue).join(","))
        .join("\n");
};

export const productStorageService = {
    getProducts,
    getProductById,
    getStockHistory,
    isSkuExists,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
    updateStock,
    updateStockForProducts,
    createProductsCsv,
};
