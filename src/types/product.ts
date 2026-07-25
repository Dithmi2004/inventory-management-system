export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormValues {
  name: string;
  sku: string;
  categoryId: string;
  price: number | "";
  stockQuantity: number | "";
  description?: string;
}

export interface StockHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantityChange: number;
  previousStockQuantity: number;
  updatedStockQuantity: number;
  createdAt: string;
}

