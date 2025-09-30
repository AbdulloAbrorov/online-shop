import api from "../../config/api";
import { User } from "../../types/user";
import { AxiosError } from "axios";

const handleApiError = (error: unknown, defaultMessage: string): never => {
  let errorMessage = defaultMessage;

  if (error instanceof AxiosError) {
    const msg = error.response?.data?.message;
    if (msg) errorMessage = Array.isArray(msg) ? msg[0] : msg;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  throw new Error(errorMessage);
};

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

  changePassword: async (
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> => {
    try {
      const response = await api.post<{ success: boolean }>(
        `/users/${userId}/change-password`,
        { currentPassword, newPassword }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to change password");
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

