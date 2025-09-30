import { useState } from "react";
import { isAxiosError } from "axios";
import { useAuth } from "../../contexts/use-auth";
import api from "../../config/api";
import type { FormData } from "./type";

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      await login(formData.email, formData.password);
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.response?.data?.message
        : err instanceof Error
        ? err.message
        : "Registration failed. Please try again.";
      setError(
        typeof message === "string"
          ? message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[550px] mx-auto mt-40">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="font-monster text-center font-bold text-[32px] tracking-wide bg-gradient-to-r from-pink-800 to-black bg-clip-text text-transparent hover:from-pink-600 hover:to-blue-500">
            Create your account
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-[20px]">
            <div className="grid grid-cols-2 gap-3 ">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-[25px] relative block w-full px-3 py-3 border-2  placeholder-gray-500 text-pink-900  border-gradient-r from-pink-600 to-blue-500"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-[25px] relative block w-full px-3 py-3 border-2  placeholder-gray-500 text-pink-900  border-gradient-r from-pink-600 to-blue-500"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-[25px] relative block w-full px-3 py-3 border-2  placeholder-gray-500 text-pink-900  border-gradient-r from-pink-600 to-blue-500"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none rounded-[25px] relative block w-full px-3 py-3 border-2  placeholder-gray-500 text-pink-900  border-gradient-r from-pink-600 to-blue-500"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="appearance-none rounded-[25px] w-full px-3 py-3 border-2 
             bg-gradient-to-r from-pink-800 to-black 
              text-[#ffffff]
             hover:from-pink-600 hover:to-blue-500 
             hover:scale-110 transition-colors duration-300"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
