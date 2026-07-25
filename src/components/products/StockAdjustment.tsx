import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "../../types/product";

interface StockAdjustmentProps {
  product: Product;
  onUpdateStock: (
    productId: string,
    quantityChange: number
  ) => void;
}

const StockAdjustment = ({ product, onUpdateStock, }: StockAdjustmentProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleIncrease = () => { onUpdateStock(product.id, quantity); setQuantity(1); };

  const handleDecrease = () => {
    if (quantity > product.stockQuantity) {
      alert("You cannot remove more stock than is available.");
      return;
    }

    onUpdateStock(product.id, -quantity);
    setQuantity(1);
  };

  return (
    <div className="stock-adjustment">
      <input type="number" min="1" step="1" value={quantity} onChange={(event) => {
        const value = Number(event.target.value);
        setQuantity(value > 0 ? value : 1);
      }}
        className="stock-quantity-input" aria-label={`Stock quantity for ${product.name}`} />

      <button type="button" className="stock-button increase-button"
        onClick={handleIncrease} aria-label={`Increase stock for ${product.name}`}>
        <Plus size={16} />
      </button>

      <button type="button" className="stock-button decrease-button" onClick={handleDecrease}
        disabled={product.stockQuantity === 0} aria-label={`Decrease stock for ${product.name}`}>
        <Minus size={16} />
      </button>
    </div>
  );
};

export default StockAdjustment;
