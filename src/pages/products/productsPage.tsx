import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/common/ConfirmModal";
import ProductForm from "../../components/products/ProductForm";
import ProductFilters from "../../components/products/ProductFilters";
import ProductList from "../../components/products/ProductList";
import { categoryStorageService } from "../../services/categoryStorageService";
import { productStorageService } from "../../services/productStorageService";
import type { Category } from "../../types/category";
import type { StockFilter } from "../../types/productFilters";
import type { Product, ProductFormValues, } from "../../types/product";
import { getCurrentTimestamp } from "../../utils/date";
import { generateInventoryId } from "../../utils/inventoryIdentifiers";
import { filterProducts } from "../../utils/productFilters";
import "../../styles/product.css";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(() => productStorageService.getProducts());

  const [categories] = useState<Category[]>(() => categoryStorageService.getCategories());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");

  const handleEdit = (product: Product) => {
    setEditingProduct(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) {
      return;
    }

    try {
      const updatedProducts =
        productStorageService.deleteProduct(
          productToDelete.id
        );

      setProducts(updatedProducts);

      if (editingProduct?.id === productToDelete.id) {
        setEditingProduct(null);
      }

      toast.success("Product deleted successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete product.";

      toast.error(message);
    } finally {
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleUpdateStock = (productId: string, quantityChange: number) => {
    try {
      const updatedProducts = productStorageService.updateStock(productId, quantityChange);

      setProducts(updatedProducts);
      toast.success(
        quantityChange > 0 ? "Stock increased successfully." : "Stock decreased successfully."
      );
    }
    catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update stock.";

      toast.error(message);
    }
  };

  const handleClearFilters = () => { setSearchTerm(""); setSelectedCategoryId(""); setStockFilter("ALL"); };

  const handleSubmit = (
    values: ProductFormValues
  ): boolean => {
    const normalizedValues: ProductFormValues = {
      ...values,
      name: values.name.trim(),
      sku: values.sku.trim().toUpperCase(),
      description: values.description?.trim() ?? "",
    };

    const skuExists = productStorageService.isSkuExists(normalizedValues.sku, editingProduct?.id);

    if (skuExists) {
      toast.error("A product with this SKU already exists.");
      return false;
    }

    if (editingProduct) {
      const updatedAt = getCurrentTimestamp();
      const updatedProduct: Product = {
        ...editingProduct,
        ...normalizedValues,
        price: Number(normalizedValues.price),
        stockQuantity: Number(normalizedValues.stockQuantity),
        updatedAt,
      };

      const updatedProducts = productStorageService.updateProduct(updatedProduct);

      setProducts(updatedProducts);
      setEditingProduct(null);
      toast.success("Product updated successfully.");
      return true;
    }

    const currentTimestamp = getCurrentTimestamp();
    const newProduct: Product = {
      id: generateInventoryId(),
      ...normalizedValues,
      price: Number(normalizedValues.price),
      stockQuantity: Number(normalizedValues.stockQuantity),
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    const updatedProducts = productStorageService.addProduct(newProduct);
    setProducts(updatedProducts);
    toast.success("Product added successfully.");
    return true;
  };

  const filteredProducts = filterProducts({
    products,
    searchTerm,
    selectedCategoryId,
    stockFilter,
  });

  return (
    <div className="product-page">
      <header className="page-header">
        <h1>Product Management</h1>
        <p>Add, update, and manage inventory products.</p>
      </header>

      <div className="product-content">
        <ProductForm categories={categories} editingProduct={editingProduct} onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit} />

        <section className="product-list-section">
          <ProductFilters categories={categories} searchTerm={searchTerm} selectedCategoryId={selectedCategoryId}
            stockFilter={stockFilter} onSearchChange={setSearchTerm} onCategoryChange={setSelectedCategoryId}
            onStockFilterChange={setStockFilter} onClearFilters={handleClearFilters} />

          <ProductList products={filteredProducts} categories={categories} onEdit={handleEdit}
            onDelete={handleDelete} onUpdateStock={handleUpdateStock} />

          <ConfirmModal
            isOpen={productToDelete !== null}
            title="Delete Product"
            message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;