import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { addCartItem } from '../../store/cart-slice';
import { useEffect, useMemo, useState } from 'react';
import { productsApi } from '../../api/products/products';
import type { Product } from '../../api/products/type';
import { useAuth } from '../../contexts/use-auth';
import type { TypeFilter } from './type';
import { API_URL } from '../../config/api';

export const  Products=()=> {
  const{ user}=useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

   const dispatch = useDispatch<AppDispatch>();

  const params = useMemo(() => {
    const p: TypeFilter = {};
    if (name) p.name = name;
    if (category) p.category = category;
    if (minPrice) p.minPrice = Number(minPrice);
    if (maxPrice) p.maxPrice = Number(maxPrice);
    return p;
  }, [name, category, minPrice, maxPrice]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.list(Object.keys(params).length ? params : undefined);
        if (mounted) setProducts(data);
      } catch (e: unknown) {
  if (mounted) {
    if (e instanceof Error) {
      setError(e.message);
    } else {
      setError('Failed to load products');
    }
  }
} finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params]);

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);

  return (
    <div className='container '>
         {user?.role === 'ADMIN' &&<p className="font-monster font-500 text-[32px] text-main tracking-wide bg-gradient-to-r from-pink-600 to-black pl-10 border border-main">
             Admin panel
        </p>
        }
  

      <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className=" border-2 rounded p-2  border-pink-800 "
          placeholder="🔎  Search " 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="border-2 rounded p-2   border-pink-800 " value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="" >All categories</option>
          {categories.map((c) => (
            <option key={c} value={c} >
              {c}
            </option>
          ))}
        </select>
        <input
          className=" border-2 rounded p-2  border-pink-800"
          placeholder="Min price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className=" border-2 rounded p-2  border-pink-800"
          placeholder="Max price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {loading && <div className="mt-6">Loading...</div>}
      {error && <div className="mt-6 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="mt-20 flex flex-wrap justify-between gap-y-[24px] ">
          {products
            .filter((p) => (category ? p.category === category : true))
            .filter((p) => (name ? p.name.toLowerCase().includes(name.toLowerCase()) : true))
            .filter((p) => (minPrice ? p.price >= Number(minPrice) : true))
            .filter((p) => (maxPrice ? p.price <= Number(maxPrice) : true))
            .map((p) => (
              <div key={p.id} className="w-[266px] h-[432px] flex flex-col items-center gap-13 rounded-[9px] bg-[#F6F6F6] py-[24px] px-[16px]">
                <div className=" flex justify-centerw-[160px] h-[160px] mt-[25px]">
                  <img src={`${API_URL}${p.imageUrl}`} alt={p.name}  className="w-full h-48 object-fill" />
                </div>
                <div className="">
                  <h3 className="text-lg text-[16px] font-medium text-primary  text-center leading-[24px]">{p.name}</h3>
                  <p className="text-lg  text-[16px] font-medium text-primary  text-center leading-[24px]">{p.description}</p>
                  <div className="mt-[24px] flex items-center flex-col justify-center gap-[28px] ">
                    <span className="text-[24px] font-semibold leading-[3%]  text-primary ">${p.price.toFixed(2)}</span>
                    <button
                      onClick={() => dispatch(addCartItem({ productId: p.id, quantity: 1 }))}
                      className="button px-[64px] py-[12px] rounded-[8px]  "
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
