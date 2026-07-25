import type { Product } from "../types/product";
import type { StockFilter } from "../types/productFilters";

interface FilterProductsParams {
  products: Product[];
  searchTerm: string;
  selectedCategoryId: string;
  stockFilter: StockFilter;
}

export const filterProducts = ({
  products,
  searchTerm,
  selectedCategoryId,
  stockFilter,
}: FilterProductsParams): Product[] => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(normalizedSearchTerm) ||
      product.sku.toLowerCase().includes(normalizedSearchTerm);

    const matchesCategory =
      selectedCategoryId === "" ||
      product.categoryId === selectedCategoryId;

    const matchesStock =
      stockFilter === "ALL" ||
      (stockFilter === "IN_STOCK" && product.stockQuantity > 0) ||
      (stockFilter === "OUT_OF_STOCK" && product.stockQuantity === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });
};
