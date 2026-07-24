import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Category } from "../types/category";

// getall
const getCategories = (): Category[] => {
    try {
        const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (!storedCategories) {
            return [];
        }
        const parsedCategories = JSON.parse(storedCategories);
        return Array.isArray(parsedCategories) ? parsedCategories : [];
    }
    catch (error) {
        console.error("Failed to load categories:", error);
        return [];
    }
};

// save
const saveCategories = (categories: Category[]): void => {
    try {
        localStorage.setItem(
            STORAGE_KEYS.CATEGORIES,
            JSON.stringify(categories)
        );
    }
    catch (error) {
        console.error("Failed to save categories:", error);
    }
};

// getbyid
const getCategoryById = (id: string): Category | undefined => {
    return getCategories().find((category) => category.id === id);
};

// check
const categoryExists = (name: string, excludedCategoryId?: string): boolean => {
    const normalizedName = name.trim().toLowerCase();
    return getCategories().some((category) => {
        const hasSameName = category.name.trim().toLowerCase() === normalizedName;
        const isDifferentCategory = category.id !== excludedCategoryId;
        return hasSameName && isDifferentCategory;
    });
};

// add
const addCategory = (category: Category): Category[] => {
    const categories = getCategories();
    const updatedCategories = [...categories, category];
    saveCategories(updatedCategories);
    return updatedCategories;
};

// update
const updateCategory = (updatedCategory: Category): Category[] => {
    const categories = getCategories();
    const updatedCategories = categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category);
    saveCategories(updatedCategories);
    return updatedCategories;
};

// delete
const deleteCategory = (id: string): Category[] => {
    const categories = getCategories();
    const updatedCategories = categories.filter((category) => category.id !== id);
    saveCategories(updatedCategories);
    return updatedCategories;
};

export const categoryStorageService = {
    getCategories,
    getCategoryById,
    categoryExists,
    addCategory,
    updateCategory,
    deleteCategory,
};