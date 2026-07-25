import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/common/ConfirmModal";
import CategoryForm from "../../components/category/categoryForm";
import CategoryList from "../../components/category/categoryList";
import { categoryStorageService } from "../../services/categoryStorageService";
import type {Category,CategoryFormValues,} from "../../types/category";
import { getCurrentTimestamp } from "../../utils/date";
import { generateInventoryId } from "../../utils/inventoryIdentifiers";
import "../../styles/category.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>(() =>
    categoryStorageService.getCategories()
  );

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);

  const handleSubmit = (
    values: CategoryFormValues
  ): boolean => {
    const normalizedName = values.name.trim();
    const categoryAlreadyExists =
      categoryStorageService.categoryExists(
        normalizedName,
        editingCategory?.id
      );

    if (categoryAlreadyExists) {
      toast.error("Category already exists.");
      return false;
    }

    if (editingCategory) {
      const updatedCategory: Category = {
        ...editingCategory,
        name: normalizedName,
        updatedAt: getCurrentTimestamp(),
      };

      const updatedCategories =
        categoryStorageService.updateCategory(updatedCategory);

      setCategories(updatedCategories);
      setEditingCategory(null);

      toast.success("Category updated successfully.");
      return true;
    }

    const currentDate = getCurrentTimestamp();

    const newCategory: Category = {
      id: generateInventoryId(),
      name: normalizedName,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const updatedCategories =
      categoryStorageService.addCategory(newCategory);

    setCategories(updatedCategories);

    toast.success("Category added successfully.");
    return true;
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) {
      return;
    }

    try {
      const updatedCategories =
        categoryStorageService.deleteCategory(
          categoryToDelete.id
        );

      setCategories(updatedCategories);
      toast.success("Category deleted successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete category.";

      toast.error(message);
    } finally {
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="category-page">
      <header className="page-header">
        <h1>Category Management</h1>
        <p>Create and manage inventory categories.</p>
      </header>

      <div className="category-content">
        <CategoryForm editingCategory={editingCategory} onSubmit={handleSubmit} onCancelEdit={handleCancelEdit}/>

        <CategoryList categories={categories} onEdit={handleEdit} onDelete={handleDelete}/>

        <ConfirmModal isOpen={categoryToDelete !== null} title="Delete Category"
          message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;