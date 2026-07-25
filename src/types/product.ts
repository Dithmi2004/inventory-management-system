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

