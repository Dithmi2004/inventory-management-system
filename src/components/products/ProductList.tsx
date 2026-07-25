import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";
import StockAdjustment from "./StockAdjustment";

interface ProductListProps {
    products: Product[];
    categories: Category[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onUpdateStock: (
        productId: string,
        quantityChange: number
    ) => void;
}

const ProductList = ({
    products,
    categories,
    onEdit,
    onDelete,
    onUpdateStock,
}: ProductListProps) => {
    const getCategoryName = (categoryId: string): string => {
        const category = categories.find(
            (item) => item.id === categoryId
        );

        return category?.name ?? "Unknown category";
    };

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <h3>No products found</h3>
                <p>
                    Try changing your search term or filter options.
                </p>
            </div>
        );
    }

    return (
        <div className="product-list-card">
            <div className="product-list-header">
                <h2>Products</h2>
                <span>{products.length} total</span>
            </div>

            <div className="product-table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Product ID</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Stock Update</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{getCategoryName(product.categoryId)}</td>
                                <td>Rs. {product.price.toFixed(2)}
                                </td>
                                <td>
                                    <span className={product.stockQuantity > 0 ? "stock-badge in-stock" : "stock-badge out-of-stock"}>
                                        {product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : "Out of Stock"}
                                    </span>
                                </td>
                                <td>
                                    <StockAdjustment product={product} onUpdateStock={onUpdateStock} />
                                </td>

                                <td>
                                    <div className="table-actions">
                                        <button type="button" className="icon-button edit-button"
                                            aria-label={`Edit ${product.name}`} onClick={() => onEdit(product)}>
                                            <Pencil size={18} />
                                        </button>

                                        <button type="button" className="icon-button delete-button"
                                            aria-label={`Delete ${product.name}`} onClick={() => onDelete(product)}>
                                            <Trash2 size={18} />
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

export default ProductList;
