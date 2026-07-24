import { Form, Formik } from "formik";
import type { Category, CategoryFormValues } from "../../types/category";
import { categorySchema } from "../../validation/categorySchema";

interface CategoryFormProps {
    editingCategory: Category | null;
    onSubmit: (values: CategoryFormValues) => void;
    onCancelEdit: () => void;
}

const initialValues: CategoryFormValues = {
    name: "",
};

const CategoryForm = ({ editingCategory, onSubmit, onCancelEdit, }: CategoryFormProps) => {
    const formValues: CategoryFormValues = editingCategory ? {
        name: editingCategory.name,
    } : initialValues;

    return (
        <div className="category-form-card">
            <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>

            <Formik
                initialValues={formValues}
                validationSchema={categorySchema}
                enableReinitialize
                onSubmit={(values, { resetForm }) => {
                    onSubmit({ name: values.name.trim(), });
                    resetForm();
                }}>

                {({ errors, touched, isSubmitting, handleChange, values }) => (
                    <Form className="category-form">
                        <div className="form-group">
                            <label htmlFor="name">Category Name</label>

                            <input id="name"
                                name="name"
                                type="text"
                                placeholder="Enter category name"
                                value={values.name}
                                onChange={handleChange}
                                className={
                                    errors.name && touched.name
                                        ? "form-input input-error"
                                        : "form-input"
                                } />

                            {errors.name && touched.name && (
                                <p className="error-message">{errors.name}</p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="primary-button" disabled={isSubmitting}>
                                {editingCategory ? "Update Category" : "Add Category"}
                            </button>

                            {editingCategory && (
                                <button type="button" className="secondary-button" onClick={onCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CategoryForm;
