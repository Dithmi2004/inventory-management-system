import { NavLink, Outlet } from "react-router-dom";
import {
  Boxes,
  FolderOpen,
  LayoutDashboard,
  Package,
} from "lucide-react";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Package size={28} />
          <span>StockFlow</span>
        </div>

        <nav className="sidebar-navigation">
          <NavLink to="/"
            end
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/products"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"}>
            <Boxes size={20} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"}>
            <FolderOpen size={20} />
            <span>Categories</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;