import { RotateCcw, Search } from "lucide-react";
import type { Category } from "../../types/category";
import type { StockFilter } from "../../types/productFilters";

interface ProductFiltersProps {
  categories: Category[];
  searchTerm: string;
  selectedCategoryId: string;
  stockFilter: StockFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStockFilterChange: (value: StockFilter) => void;
  onClearFilters: () => void;
}

const ProductFilters = ({
  categories,
  searchTerm,
  selectedCategoryId,
  stockFilter,
  onSearchChange,
  onCategoryChange,
  onStockFilterChange,
  onClearFilters,
}: ProductFiltersProps) => {
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategoryId !== "" ||
    stockFilter !== "ALL";

  return (
    <div className="product-filters">
      <div className="search-input-wrapper">
        <Search size={18} />

        <input type="search" value={searchTerm} onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by product name or SKU"
          aria-label="Search products" />
      </div>

      <select value={selectedCategoryId} onChange={(event) => onCategoryChange(event.target.value)}
        className="filter-select" aria-label="Filter products by category">
        <option value="">All categories</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select value={stockFilter} onChange={(event) => onStockFilterChange(event.target.value as StockFilter)}
        className="filter-select" aria-label="Filter products by stock status">
        <option value="ALL">All stock statuses</option>
        <option value="IN_STOCK">In Stock</option>
        <option value="OUT_OF_STOCK">Out of Stock</option>
      </select>

      <button type="button" className="secondary-button clear-filter-button"
        onClick={onClearFilters} disabled={!hasActiveFilters}>
        <RotateCcw size={16} />
        Clear
      </button>
    </div>
  );
};

export default ProductFilters;
