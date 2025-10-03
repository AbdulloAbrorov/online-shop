import { useAuth } from "../../../contexts/use-auth";
import type { NavLink } from "./type";

export const useNavLinks = (): NavLink[] => {
  const { user } = useAuth();

  return [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    ...(user?.role === "ADMIN" ? [{ to: "/admin", label: "Admin" }] : []),
  ];
};