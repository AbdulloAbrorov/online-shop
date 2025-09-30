import { useState } from "react";
import { useAuth } from "../../contexts/use-auth";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container bg-[#ffffff]">
      <div className="max-w-[400px] mx-auto mt-40">
        <div>
          <h2 className=" font-monster text-center font-bold text-[32px] tracking-wide bg-gradient-to-r from-pink-800 to-black bg-clip-text text-transparent hover:from-pink-600 hover:to-blue-500">
            Login
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
          <div className="rounded-md  flex flex-col gap-[20px]">
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-[25px] relative block w-full px-3 py-3 border-2    border-gradient-r from-pink-600 to-blue-500"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="appearance-none rounded-[25px] w-full px-3 py-3 border-2 
             bg-gradient-to-r from-pink-800 to-black 
              text-[#ffffff]
             hover:from-pink-600 hover:to-blue-500 
             hover:scale-110 transition-colors duration-300"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
