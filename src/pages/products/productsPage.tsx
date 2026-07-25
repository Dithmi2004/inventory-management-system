import { useState } from "react";
import ProductForm from "../../components/products/ProductForm";
import ProductFilters, { type StockFilter, } from "../../components/products/ProductFilters";
import ProductList from "../../components/products/ProductList";
import { categoryStorageService } from "../../services/categoryStorageService";
import { productStorageService } from "../../services/productStorageService";
import type { Category } from "../../types/category";
import type { Product, ProductFormValues, } from "../../types/product";
import { generateProductId } from "../../utils/productIdentifiers";
import "../../styles/product.css";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(() => productStorageService.getProducts());

  const [categories] = useState<Category[]>(() => categoryStorageService.getCategories());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");

  const handleEdit = (product: Product) => { setEditingProduct(product); };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(`Delete "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    const updatedProducts = productStorageService.deleteProduct(product.id);

    setProducts(updatedProducts);

    if (editingProduct?.id === product.id) {
      setEditingProduct(null);
    }
  };

  const handleUpdateStock = (productId: string, quantityChange: number) => {
    try {
      const updatedProducts = productStorageService.updateStock(productId, quantityChange);

      setProducts(updatedProducts);
    }
    catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update stock.";

      alert(message);
    }
  };

  const handleClearFilters = () => { setSearchTerm(""); setSelectedCategoryId(""); setStockFilter("ALL"); };

  const handleSubmit = (values: ProductFormValues) => {
    const skuExists = productStorageService.isSkuExists(values.sku, editingProduct?.id);

    if (skuExists) {
      alert("A product with this Product ID already exists.");
      return;
    }

    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        name: values.name,
        sku: values.sku,
        categoryId: values.categoryId,
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity),
        updatedAt: new Date().toISOString(),
      };

      const updatedProducts = productStorageService.updateProduct(updatedProduct);

      setProducts(updatedProducts);
      setEditingProduct(null);
      return;
    }

    const currentDate = new Date().toISOString();

    const newProduct: Product = {
      id: generateProductId(),
      name: values.name,
      sku: values.sku,
      categoryId: values.categoryId,
      price: Number(values.price),
      stockQuantity: Number(values.stockQuantity),
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const updatedProducts = productStorageService.addProduct(newProduct);
    setProducts(updatedProducts);
  };

  const filteredProducts = products.filter((product) => {
    const normalizedSearchTerm =
      searchTerm.trim().toLowerCase();

    const matchesSearch = product.name.toLowerCase().includes(normalizedSearchTerm) ||
      product.sku.toLowerCase().includes(normalizedSearchTerm);

    const matchesCategory = selectedCategoryId === "" || product.categoryId === selectedCategoryId;

    const matchesStock = stockFilter === "ALL" ||
      (stockFilter === "IN_STOCK" && product.stockQuantity > 0) ||
      (stockFilter === "OUT_OF_STOCK" && product.stockQuantity === 0);

    return (matchesSearch && matchesCategory && matchesStock);
  });

  return (
    <div className="product-page">
      <header className="page-header">
        <h1>Product Management</h1>
        <p>Add, update, and manage inventory products.</p>
      </header>

      <div className="product-content">
        <ProductForm categories={categories} editingProduct={editingProduct} onSubmit={handleSubmit}
          onCancelEdit={() => setEditingProduct(null)} />

        <section className="product-list-section">
          <ProductFilters categories={categories} searchTerm={searchTerm} selectedCategoryId={selectedCategoryId}
            stockFilter={stockFilter} onSearchChange={setSearchTerm} onCategoryChange={setSelectedCategoryId}
            onStockFilterChange={setStockFilter} onClearFilters={handleClearFilters} />

          <ProductList products={filteredProducts} categories={categories} onEdit={handleEdit}
            onDelete={handleDelete} onUpdateStock={handleUpdateStock} />
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;