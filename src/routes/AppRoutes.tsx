import { Navigate, Route, Routes } from "react-router-dom";
import CategoriesPage from "../pages/categories/categoryPage";
import DashboardPage from "../pages/dashboard/dashboardPage";
import ProductsPage from "../pages/products/productsPage";
import AppLayout from "../components/layout/appLayout";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;