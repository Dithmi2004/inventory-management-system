import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {Boxes,FolderOpen,LayoutDashboard,Moon,Package,Sun,} from "lucide-react";
import { STORAGE_KEYS } from "../../constants/storageKeys";

type ThemeMode = "light" | "dark";

const AppLayout = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Package size={28} />
          <span>Smart Inventory</span>
        </div>

        <nav className="sidebar-navigation">
          <NavLink to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "sidebar-link nav-dashboard active"
                : "sidebar-link nav-dashboard"}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/products"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link nav-products active"
                : "sidebar-link nav-products"}>
            <Boxes size={20} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link nav-categories active"
                : "sidebar-link nav-categories"}>
            <FolderOpen size={20} />
            <span>Categories</span>
          </NavLink>

          <button
            type="button"
            className="theme-toggle"
            onClick={handleToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Light" : "Dark"} Mode</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;