import { FormEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { clearCartItems } from '../store/cart-slice';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/orders/orders';

export default function Checkout() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    numberPhone: "+992 003 11 20 58",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return;

    await ordersApi.createFromCart({
      shipping: {
        fullName: form.fullName,
        address: form.address,
        city: form.city,
        numberPhone: form.numberPhone,
      },
    });

    dispatch(clearCartItems()); 
    navigate('/');
  };

  return (
    <div className=" mt-[100px]">
      <div className='container'>
        <h1 className="text-2xl font-semibold leading-[24px] text-primary ">Checkout</h1>

        {items.length === 0 ? (
          <div className="mt-6">Your cart is empty.</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={onSubmit} className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 gap-[24px] ">
                <input className="input" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                <input className="input" placeholder="Number Phone" value={form.numberPhone} onChange={(e) => setForm({ ...form, numberPhone: e.target.value })} required />
                <textarea className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>

              <button type="submit" className="button rounded-[30px] py-[15px] px-[60px] mt-[20px]">Place order</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}