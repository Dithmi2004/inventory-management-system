import * as Yup from "yup";

export const productSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Product name must contain at least 2 characters.")
    .max(100, "Product name cannot exceed 100 characters.")
    .required("Product name is required."),

  sku: Yup.string()
    .trim()
    .min(3, "SKU must contain at least 3 characters.")
    .max(30, "SKU cannot exceed 30 characters.")
    .matches(
      /^[A-Za-z0-9-_]+$/,
      "SKU can only contain letters, numbers, hyphens, and underscores."
    )
    .required("SKU is required."),

  categoryId: Yup.string()
    .required("Category is required."),

  price: Yup.number()
    .typeError("Price must be a valid number.")
    .moreThan(0, "Price must be greater than zero.")
    .max(100000000, "Price is too large.")
    .required("Price is required."),

  stockQuantity: Yup.number()
    .typeError("Stock quantity must be a valid number.")
    .integer("Stock quantity must be a whole number.")
    .min(0, "Stock quantity cannot be negative.")
    .max(1000000, "Stock quantity is too large.")
    .required("Stock quantity is required."),

  description: Yup.string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
});