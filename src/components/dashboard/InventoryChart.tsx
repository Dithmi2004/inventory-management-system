import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface InventoryChartProps {
  categoryLabels: string[];
  categoryCounts: number[];
  inStock: number;
  outOfStock: number;
}

const InventoryChart = ({ categoryLabels, categoryCounts, inStock, outOfStock, }: InventoryChartProps) => {
  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4",
        ],
      },
    ],
  };

  const barData = {
    labels: ["In Stock", "Out of Stock"],
    datasets: [
      {
        label: "Products",
        data: [inStock, outOfStock],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const hasCategoryData = categoryCounts.some((count) => count > 0);

  const hasStockData = inStock > 0 || outOfStock > 0;

  return (
    <div className="dashboard-charts">
      <article className="chart-card">
        <div className="chart-card-header">
          <h2>Products by Category</h2>
        </div>

        {hasCategoryData ? (
          <div className="chart-wrapper">
            <Pie data={pieData}
              options={{ responsive: true, maintainAspectRatio: false, }} />
          </div>
        ) : (
          <div className="chart-empty-state">
            <p>No category data available.</p>
          </div>
        )}
      </article>

      <article className="chart-card">
        <div className="chart-card-header">
          <h2>Products by Stock Status</h2>
        </div>

        {hasStockData ? (
          <div className="chart-wrapper">
            <Bar data={barData}
              options={{ responsive: true, maintainAspectRatio: false, }} />
          </div>
        ) : (
          <div className="chart-empty-state">
            <p>No stock data available.</p>
          </div>
        )}
      </article>
    </div>
  );
};

export default InventoryChart;
