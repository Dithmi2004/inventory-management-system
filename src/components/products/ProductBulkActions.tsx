import { Download, PackagePlus, Trash2 } from "lucide-react";

interface ProductBulkActionsProps {
  selectedCount: number;
  restockQuantity: number;
  onRestockQuantityChange: (quantity: number) => void;
  onBulkRestock: () => void;
  onBulkDelete: () => void;
  onExportCsv: () => void;
  onClearSelection: () => void;
}

const ProductBulkActions = ({
  selectedCount,
  restockQuantity,
  onRestockQuantityChange,
  onBulkRestock,
  onBulkDelete,
  onExportCsv,
  onClearSelection,
}: ProductBulkActionsProps) => {
  const hasSelection = selectedCount > 0;

  return (
    <div className="product-bulk-actions">
      <div>
        <strong>{selectedCount}</strong>
        <span> selected</span>
      </div>

      <input type="number" min="1" step="1" value={restockQuantity} onChange={(event) => {
        const value = Number(event.target.value);
        onRestockQuantityChange(value > 0 ? value : 1);
      }}
        className="bulk-restock-input" aria-label="Bulk restock quantity" />

      <button type="button" className="bulk-button bulk-restock-button" onClick={onBulkRestock} disabled={!hasSelection}>
        <PackagePlus size={16} />
        Restock
      </button>

      <button type="button" className="bulk-button bulk-delete-button" onClick={onBulkDelete} disabled={!hasSelection}>
        <Trash2 size={16} />
        Delete
      </button>

      <button type="button" className="bulk-button bulk-export-button" onClick={onExportCsv}>
        <Download size={16} />
        Export CSV
      </button>

      <button type="button" className="bulk-clear-button" onClick={onClearSelection} disabled={!hasSelection}>
        Clear
      </button>
    </div>
  );
};

export default ProductBulkActions;
