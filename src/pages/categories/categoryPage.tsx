import { useState } from "react";
import CategoryForm from "../../components/category/categoryForm";
import CategoryList from "../../components/category/categoryList";
import { categoryStorageService } from "../../services/categoryStorageService";
import type {Category,CategoryFormValues,} from "../../types/category";
import { generateProductId } from "../../utils/productIdentifiers";
import "../../styles/category.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>(() =>
    categoryStorageService.getCategories()
  );

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const handleSubmit = (values: CategoryFormValues) => {
    const categoryAlreadyExists =
      categoryStorageService.categoryExists(
        values.name,
        editingCategory?.id
      );

    if (categoryAlreadyExists) {
      window.alert("Category already exists.");
      return;
    }

    if (editingCategory) {
      const updatedCategory: Category = {
        ...editingCategory,
        name: values.name,
      };

      const updatedCategories =
        categoryStorageService.updateCategory(updatedCategory);

      setCategories(updatedCategories);
      setEditingCategory(null);
      return;
    }

    const newCategory: Category = {
      id: generateProductId(),
      name: values.name,
      createdAt: new Date().toISOString(),
    };

    const updatedCategories =
      categoryStorageService.addCategory(newCategory);

    setCategories(updatedCategories);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDelete = (category: Category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedCategories =
      categoryStorageService.deleteCategory(category.id);

    setCategories(updatedCategories);

    if (editingCategory?.id === category.id) {
      setEditingCategory(null);
    }
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
        <CategoryForm
          editingCategory={editingCategory}
          onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit}
        />

        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;