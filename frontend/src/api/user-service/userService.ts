import api from "../../config/api";
import { User } from "../../types/user";
import { handleApiError } from "./api-error";



export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>("/users");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch users");
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "User not found");
    }
  },

  updateProfile: async (userId: number, data: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch<User>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update profile");
    }
  },

  remove: async (id: number): Promise<{ success: boolean }> => {
    try {
      const res = await api.delete<{ success: boolean }>(`/users/${id}`);
      return res.data;
    } catch (error) {
      throw handleApiError(error, "Failed to delete user");
    }
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    try {
      const res = await api.put<User>(`/users/${id}`, data);
      return res.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update user");
    }
  },
};

