import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "../../types/category";

interface CategoryListProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

const CategoryList = ({ categories, onEdit, onDelete,}: CategoryListProps) => {
    if (categories.length === 0) {
        return (
            <div className="empty-state">
                <h3>No categories found</h3>
                <p>Add your first category to organize products.</p>
            </div>
        );
    }

    return (
        <div className="category-list-card">
            <div className="category-list-header">
                <h2>Categories</h2>
                <span>{categories.length} total</span>
            </div>

            <div className="category-table-wrapper">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Created Date</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.name}</td>

                                <td>
                                    {new Date(category.createdAt).toLocaleDateString()}
                                </td>

                                <td>
                                    <div className="table-actions">
                                        <button type="button" className="icon-button edit-button"
                                            aria-label={`Edit ${category.name}`} onClick={() => onEdit(category)}>
                                            <Pencil size={18}/>
                                        </button>

                                        <button type="button" className="icon-button delete-button"
                                            aria-label={`Delete ${category.name}`}
                                            onClick={() => onDelete(category)}>
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryList;