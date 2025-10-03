import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginForm } from "../pages/login-forum/login-forum";
import { RegisterForm } from "../pages/register-form/register-form";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UsersPage from "../pages/admin/UsersPage";
import{ Navbar} from "../components/navbar/Navbar";
import Home from "../pages/Home";
import { Products } from "../pages/products/Products";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductForm from "../pages/admin/AdminProductForm";
import { ProtectedRoute } from "./protect-routes";

export const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <main className="">
        <div className="">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            <Route path="/" element={<Home />} />

            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <Outlet />
                  </AdminLayout>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id" element={<AdminProductForm />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </>
  );
};
