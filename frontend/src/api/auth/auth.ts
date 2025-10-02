import api from "../../config/api";
import { User } from "../../types";
import type { LoginData } from "./type-login";
import type { RegisterData } from "./type-register";
import { parseError } from "./parse-error";

export const register = async (data: RegisterData) => {
  try {
    const response = await api.post<{
      user: User;
      access_token: string;
      refresh_token?: string;
    }>("/auth/register", data);
    return response.data;
  } catch (error: unknown) {
throw new Error(parseError(error, "Registration failed"));
  }
};

export const login = async (data: LoginData) => {
  try {
    const response = await api.post<{
      user: User;
      access_token: string;
      refresh_token?: string;
    }>("/auth/login", data);
    return response.data;
  } catch (error: unknown) {
   throw new Error(parseError(error, "Login failed"));
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (error: unknown) {
    console.error("Logout error:", error);
  } finally {
    ["localStorage", "sessionStorage"].forEach((storageType) => {
      try {
        const storage =
          window[storageType as "localStorage" | "sessionStorage"];
        storage.removeItem("token");
        storage.removeItem("refreshToken");
      } catch (e) {
        console.error(`Error clearing ${storageType}:`, e);
      }
    });
  }
};
