import { Form, Formik } from "formik";
import type { Product, ProductFormValues } from "../../types/product";
import type { Category } from "../../types/category";
import { productSchema } from "../../validation/productSchema";
import { generateSku } from "../../utils/productIdentifiers";

interface ProductFormProps {
  categories: Category[];
  editingProduct: Product | null;
  onSubmit: (values: ProductFormValues) => void;
  onCancelEdit: () => void;
}

const ProductForm = ({
  categories,
  editingProduct,
  onSubmit,
  onCancelEdit,
}: ProductFormProps) => {
  const initialValues: ProductFormValues = editingProduct
    ? {
      name: editingProduct.name,
      sku: editingProduct.sku,
      categoryId: editingProduct.categoryId,
      price: editingProduct.price,
      stockQuantity: editingProduct.stockQuantity,
    }
    : {
      name: "",
      sku: generateSku(),
      categoryId: "",
      price: "",
      stockQuantity: "",
    };

  return (
    <div className="product-form-card">
      <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

      <Formik initialValues={initialValues} validationSchema={productSchema}
        enableReinitialize onSubmit={(values, { resetForm }) => {
          onSubmit({
            name: values.name.trim(),
            sku: values.sku.trim().toUpperCase(),
            categoryId: values.categoryId,
            price: Number(values.price),
            stockQuantity: Number(values.stockQuantity),
          });
          resetForm();
        }}>
        {({ errors, touched, values, handleChange, setFieldValue }) => (
          <Form className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>

              <input id="name" name="name" type="text" placeholder="Enter product name"
                value={values.name}
                onChange={handleChange}
                className={
                  errors.name && touched.name ? "form-input input-error" : "form-input"} />
              {errors.name && touched.name && (
                <p className="error-message">{errors.name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sku">Product ID</label>

              <div className="sku-input-row">
                <input id="sku" name="sku" type="text" value={values.sku} onChange={handleChange}
                  className={errors.sku && touched.sku ? "form-input input-error" : "form-input"} />

                {!editingProduct && (
                  <button type="button" className="secondary-button" onClick={() => setFieldValue("sku", generateSku())}>
                    Generate
                  </button>
                )}
              </div>

              {errors.sku && touched.sku && (
                <p className="error-message">{errors.sku}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">Category</label>

              <select id="categoryId"
                name="categoryId" value={values.categoryId} onChange={handleChange}
                className={errors.categoryId && touched.categoryId ? "form-input input-error" : "form-input"}>
                <option value="">Select a category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {errors.categoryId && touched.categoryId && (
                <p className="error-message">{errors.categoryId}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>

              <input id="price" name="price" type="number" min="0" step="0.01" placeholder="Enter price"
                value={values.price} onChange={handleChange}
                className={errors.price && touched.price ? "form-input input-error" : "form-input"} />

              {errors.price && touched.price && (
                <p className="error-message">{errors.price}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="stockQuantity">Stock Quantity</label>

              <input id="stockQuantity" name="stockQuantity" type="number"
                min="0" step="1" placeholder="Enter stock quantity"
                value={values.stockQuantity} onChange={handleChange}
                className={errors.stockQuantity && touched.stockQuantity ? "form-input input-error" : "form-input"} />

              {errors.stockQuantity && touched.stockQuantity && (
                <p className="error-message">{errors.stockQuantity}</p>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={categories.length === 0}>
                {editingProduct ? "Update Product" : "Add Product"}
              </button>

              {editingProduct && (
                <button type="button" className="secondary-button" onClick={onCancelEdit}>
                  Cancel
                </button>
              )}
            </div>

            {categories.length === 0 && (
              <p className="form-notice">
                Create at least one category before adding a product.
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;
