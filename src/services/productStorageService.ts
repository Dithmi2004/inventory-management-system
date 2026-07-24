import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Product } from "../types/product";

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
    catch (error) {
        console.error("Failed to load products:", error);
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
    catch (error) {
        console.error("Failed to save products:", error);
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

export const productStorageService = {
    getProducts,
    getProductById,
    isSkuExists,
    addProduct,
    updateProduct,
    deleteProduct,
};