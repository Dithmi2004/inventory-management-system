import type { StockHistoryEntry } from "../../types/product";

interface StockHistoryLogProps {
  history: StockHistoryEntry[];
}

const StockHistoryLog = ({ history }: StockHistoryLogProps) => {
  return (
    <section className="stock-history-card">
      <div className="stock-history-header">
        <h2>Stock History</h2>
        <span>{history.length} changes</span>
      </div>

      {history.length === 0 ? (
        <div className="stock-history-empty">
          <p>No stock changes recorded yet.</p>
        </div>
      ) : (
        <div className="stock-history-list">
          {history.slice(0, 8).map((entry) => (
            <div key={entry.id} className="stock-history-item">
              <div>
                <h3>{entry.productName}</h3>
                <p>
                  {entry.sku} • {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>

              <span className={ entry.quantityChange > 0 ? "history-change increase" : "history-change decrease"}>
                {entry.quantityChange > 0 ? "+" : ""}
                {entry.quantityChange}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default StockHistoryLog;
