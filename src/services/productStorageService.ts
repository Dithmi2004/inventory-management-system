import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Product } from "../types/product";
import { getCurrentTimestamp } from "../utils/date";

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

        return {
            ...product,
            stockQuantity: updatedStockQuantity,
            updatedAt: getCurrentTimestamp(),
        };
    });

    saveProducts(updatedProducts);

    return updatedProducts;
};

export const productStorageService = {
    getProducts,
    getProductById,
    isSkuExists,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
};
