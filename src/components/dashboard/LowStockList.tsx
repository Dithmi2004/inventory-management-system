import { LOW_STOCK_THRESHOLD } from "../../constants/inventory";
import type { Product } from "../../types/product";

interface LowStockListProps {
  products: Product[];
}

const LowStockList = ({ products }: LowStockListProps) => {
  if (products.length === 0) {
    return (
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h3>Low Stock Products</h3>
        </div>

        <div className="dashboard-empty-state">
          <p>No low-stock products.</p>
          <p>
            Products with {LOW_STOCK_THRESHOLD} or fewer items are shown here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h3>Low Stock Products</h3>
        <span>{products.length} products</span>
      </div>

      <div className="low-stock-list">
        {products.map((product) => (
          <div key={product.id} className="low-stock-item">
            <div>
              <h4>{product.name}</h4>
              <p>SKU: {product.sku}</p>
            </div>

            <span className={product.stockQuantity === 0 ? "stock-status stock-status-out" : "stock-status stock-status-low"}>
              {product.stockQuantity === 0 ? "Out of stock" : `${product.stockQuantity} remaining`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockList;
