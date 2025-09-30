import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { userService } from '../../api/user-service/userService';
import { productsApi } from '../../api/products/products';
import { ordersApi } from '../../api/orders/orders';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await userService.getAllUsers();
        const products = await productsApi.list();
        const orders = await ordersApi.listAll();

        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
        });
      } catch (err: unknown) {
        const message =
          isAxiosError(err)
            ? err.response?.data?.message
            : err instanceof Error
              ? err.message
              : 'Failed to load dashboard data';
        setError(typeof message === 'string' ? message : 'Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;