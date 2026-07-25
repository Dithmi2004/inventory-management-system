import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import type { Product } from "../../types/product";

interface StockAdjustmentProps {
  product: Product;
  onUpdateStock: (
    productId: string,
    quantityChange: number
  ) => void;
}

const StockAdjustment = ({ product, onUpdateStock, }: StockAdjustmentProps) => {
  const [quantity, setQuantity] = useState("1");

  const getValidQuantity = (): number | null => {
    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      toast.error(
        "Quantity must be a whole number greater than zero."
      );

      return null;
    }

    return parsedQuantity;
  };

  const handleIncrease = () => {
    const validQuantity = getValidQuantity();

    if (validQuantity === null) {
      return;
    }

    onUpdateStock(product.id, validQuantity);
    setQuantity("1");
  };

  const handleDecrease = () => {
    const validQuantity = getValidQuantity();

    if (validQuantity === null) {
      return;
    }

    if (validQuantity > product.stockQuantity) {
      toast.error(
        "You cannot remove more stock than is available."
      );

      return;
    }

    onUpdateStock(product.id, -validQuantity);
    setQuantity("1");
  };

  return (
    <div className="stock-adjustment">
      <input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)}
        onBlur={() => {
          if (quantity.trim() === "") {
            setQuantity("1");
          }
        }}
        className="stock-quantity-input"
        aria-label={`Stock quantity for ${product.name}`}
      />

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
