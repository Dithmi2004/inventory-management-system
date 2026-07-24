import * as Yup from "yup";

export const productSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters")
    .required("Product name is required"),

  sku: Yup.string()
    .trim()
    .matches(/^PRD-\d{6}$/,"Product ID must follow the format PRD-123456")
    .required("Product ID is required"),

  categoryId: Yup.string()
    .required("Category is required"),

  price: Yup.number()
    .typeError("Price must be a valid number")
    .moreThan(0, "Price must be greater than zero")
    .required("Price is required"),

  stockQuantity: Yup.number()
    .typeError("Stock quantity must be a valid number")
    .integer("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative")
    .required("Stock quantity is required"),
});