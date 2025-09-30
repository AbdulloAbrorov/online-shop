import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/use-auth";
import { User } from "../../types/user";
import { userService } from "../../api/user-service/userService";
import removeIcon from "../../shared/ui/icon/delet-icon.png";

const UsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({});

  const startEdit = (u: User) => {
    setEditingUser(u);
    setForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email,
      role: u.role,
    });
  };

  const saveEdit = async () => {
    if (!editingUser) return;

    const payload: Partial<User> = {};
    if ((form.firstName || "").trim() !== "") payload.firstName = form.firstName!.trim();
    if ((form.lastName || "").trim() !== "") payload.lastName = form.lastName!.trim();
    if ((form.email || "").trim() !== "") payload.email = form.email!.trim();
    if (form.role === "ADMIN" || form.role === "USER") payload.role = form.role;

    try {
      await userService.update(editingUser.id, payload);
      await loadUsers();
      setEditingUser(null);
    } catch (e: unknown) {
      const message =
        isAxiosError(e)
          ? e.response?.data?.message
          : e instanceof Error
            ? e.message
            : "Failed to update user";
      alert(typeof message === 'string' ? message : "Failed to update user");
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (e: unknown) {
      const message =
        isAxiosError(e)
          ? e.response?.data?.message
          : e instanceof Error
            ? e.message
            : "Failed to load users";
      setError(typeof message === 'string' ? message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      navigate("/");
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const onDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await userService.remove(id);
      await loadUsers();
    } catch (e: unknown) {
      const message =
        isAxiosError(e)
          ? e.response?.data?.message
          : e instanceof Error
            ? e.message
            : "Failed to delete user";
      alert(typeof message === 'string' ? message : "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold leading-[24px] text-primary">Users Management</h2>
      {editingUser && (
        <div className="bg-gray-100 p-4 rounded shadow my-6">
          <h3 className="text-lg font-medium mb-2">Edit User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={form.firstName || ""}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName || ""}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="border px-2 py-1 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border px-2 py-1 rounded"
            />
            <select
              value={form.role || ""}
              onChange={(e) => setForm({ ...form, role: e.target.value as "ADMIN" | "USER" })}
              className="border px-2 py-1 rounded"
            >
              <option value="">Select role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={saveEdit} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-pink-600 to-black text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-pink-800">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                  <button onClick={() => startEdit(u)} className="button px-3 py-1 rounded-[30px]">
                    Edit
                  </button>
                  <button onClick={() => onDelete(u.id)} className="text-red-600 hover:text-red-900 w-[20px] h-[20px]">
                    <img src={removeIcon} alt="remove" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;