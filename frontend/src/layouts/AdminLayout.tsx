import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/use-auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-gradient-to-r from-blue-500 to-pink-600 "
      : "";
  };

  const handleLogout = async () => {
    try {
      await logout?.();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="container">
      <div className="flex h-screen bg-gray-100 ">
        <div className="bg-gradient-to-r from-pink-600 to-black   text-white w-64 p-4 flex flex-col">
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav className="space-y-2 flex-1">
            <Link
              to="/admin"
              className={`block p-2 hover:bg-gradient-to-r hover:to-pink-600 hover:from-blue-500 rounded ${isActive(
                "/admin"
              )}`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`block p-2 hover:bg-gradient-to-r hover:to-pink-600 hover:from-blue-500 rounded ${isActive(
                "/admin/users"
              )}`}
            >
              Users
            </Link>
            <Link
              to="/admin/products"
              className={`block p-2 hover:bg-gradient-to-r hover:to-pink-600 hover:from-blue-500 rounded ${isActive(
                "/admin/products"
              )}`}
            >
              Products
            </Link>
          </nav>
          <div className="mt-auto pt-4 border-t ">
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 text-main hover:bg-gradient-to-r hover:to-pink-600 hover:from-blue-500 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
