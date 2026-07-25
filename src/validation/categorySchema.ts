import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Category name must contain at least 2 characters.")
    .max(50, "Category name cannot exceed 50 characters.")
    .matches(
      /^[A-Za-z0-9\s&-]+$/,
      "Category name can only contain letters, numbers, spaces, hyphens, and ampersands."
    )
    .required("Category name is required."),
});