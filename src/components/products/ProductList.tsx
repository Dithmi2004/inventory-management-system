import { Pencil, Trash2 } from "lucide-react";
import { LOW_STOCK_THRESHOLD } from "../../constants/inventory";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";
import StockAdjustment from "./StockAdjustment";

interface ProductListProps {
    products: Product[];
    categories: Category[];
    selectedProductIds: string[];
    onToggleProductSelection: (productId: string) => void;
    onToggleAllProducts: (productIds: string[]) => void;
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
    selectedProductIds,
    onToggleProductSelection,
    onToggleAllProducts,
    onEdit,
    onDelete,
    onUpdateStock,
}: ProductListProps) => {
    const productIds = products.map((product) => product.id);
    const allProductsSelected =
        productIds.length > 0 &&
        productIds.every((productId) =>
            selectedProductIds.includes(productId)
        );

    const getCategoryName = (categoryId: string): string => {
        const category = categories.find(
            (item) => item.id === categoryId
        );

        return category?.name ?? "Unknown category";
    };

    const getStockBadgeClass = (stockQuantity: number): string => {
        if (stockQuantity === 0) {
            return "stock-badge out-of-stock";
        }

        if (stockQuantity <= LOW_STOCK_THRESHOLD) {
            return "stock-badge low-stock";
        }

        return "stock-badge in-stock";
    };

    const getStockLabel = (stockQuantity: number): string => {
        if (stockQuantity === 0) {
            return "Out of Stock";
        }

        if (stockQuantity <= LOW_STOCK_THRESHOLD) {
            return `${stockQuantity} Low Stock`;
        }

        return `${stockQuantity} In Stock`;
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
                            <th className="selection-column">
                                <input
                                    type="checkbox"
                                    checked={allProductsSelected}
                                    onChange={() => onToggleAllProducts(productIds)}
                                    aria-label="Select all products"
                                />
                            </th>
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
                                <td className="selection-column">
                                    <input
                                        type="checkbox"
                                        checked={selectedProductIds.includes(product.id)}
                                        onChange={() => onToggleProductSelection(product.id)}
                                        aria-label={`Select ${product.name}`}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>{getCategoryName(product.categoryId)}</td>
                                <td>Rs. {product.price.toFixed(2)}
                                </td>
                                <td>
                                    <span className={getStockBadgeClass(product.stockQuantity)}>
                                        {getStockLabel(product.stockQuantity)}
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
