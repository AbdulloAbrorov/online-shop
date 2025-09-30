import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productsApi } from '../../api/products/products';
import type { Product } from '../../api/products/type';
import { API_URL } from '../../config/api';
import removeIcon from '../../shared/ui/icon/delet-icon.png'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.list();
      setProducts(data);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load products';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.remove(id);
      await load();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to delete product';
      alert(message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold leading-[24px] text-primary ">Manage Products</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="button py-[10px] px-[40px] rounded"
        >
          Add Product
        </button>
      </div>

      {loading && <div className="mt-6">Loading...</div>}
      {error && <div className="mt-6 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-pink-600 to-black text-white ">
              <tr>
                <th className="px-4 py-5 text-left text-xs font-medium  uppercase tracking-wider">Image</th>
                <th className="px-4  text-left text-xs font-medium  uppercase tracking-wider">Name</th>
                <th className="px-4 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-4  text-left text-xs font-medium  uppercase tracking-wider">Price</th>
                <th className="px-4 "></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-pink-800">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2">
                    {p.imageUrl && (
                      <img src={`${API_URL}${p.imageUrl}`} alt={p.name} className="w-16 h-16 object-cover rounded" />
                    )}
                  </td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.category}</td>
                  <td className="px-4 py-2">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="button py-1 px-3 rounded-2xl"
                    >
                      Edit
                    </Link>
                    <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline hover:scale-110  "><img src={removeIcon} alt="removeIcon" className='w-[20px] h-[20px] ' /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
