import { Boxes, Layers3, PackageCheck, PackageX, } from "lucide-react";
import InventoryChart from "../../components/dashboard/InventoryChart";
import LowStockList from "../../components/dashboard/LowStockList";
import SummaryCard from "../../components/dashboard/SummaryCard";
import { LOW_STOCK_THRESHOLD } from "../../constants/inventory";
import { categoryStorageService } from "../../services/categoryStorageService";
import { productStorageService } from "../../services/productStorageService";
import "../../styles/dashboard.css";

const DashboardPage = () => {
  const products = productStorageService.getProducts();
  const categories = categoryStorageService.getCategories();

  const totalStockQuantity = products.reduce((total, product) => total + product.stockQuantity, 0);

  const outOfStockProducts = products.filter((product) => product.stockQuantity === 0).length;
  const inStockProducts = products.filter((product) => product.stockQuantity > 0).length;
  const categoryLabels = categories.map((category) => category.name);
  const categoryCounts = categories.map(
    (category) =>
      products.filter((product) => product.categoryId === category.id).length
  );
  const lowStockProducts = products
    .filter(
      (product) =>
        product.stockQuantity >= 0 &&
        product.stockQuantity <= LOW_STOCK_THRESHOLD
    )
    .sort(
      (firstProduct, secondProduct) =>
        firstProduct.stockQuantity -
        secondProduct.stockQuantity
    );

  return (
    <section className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your inventory performance.</p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard title="Total Products" value={products.length} icon={Boxes} />
        <SummaryCard title="Total Categories" value={categories.length} icon={Layers3} />
        <SummaryCard title="Total Stock" value={totalStockQuantity} icon={PackageCheck} />
        <SummaryCard title="Out of Stock" value={outOfStockProducts} icon={PackageX} />
      </div>

      <InventoryChart categoryLabels={categoryLabels} categoryCounts={categoryCounts}
        inStock={inStockProducts} outOfStock={outOfStockProducts} />

      <LowStockList products={lowStockProducts} />
    </section>
  );
};

export default DashboardPage;
