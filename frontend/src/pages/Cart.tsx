import  { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchCart, removeCartItem, updateCartQuantity, clearCartItems } from '../store/cart-slice';
import { API_URL } from '../config/api';

import trashIcon from '../shared/ui/icon/delet-icon.png';

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (productId: number) => dispatch(removeCartItem(productId));
  const handleUpdate = (productId: number, quantity: number) => dispatch(updateCartQuantity({ productId, quantity }));
  const handleClear = () => dispatch(clearCartItems());

  if (loading) return <p className="mt-[100px] text-center">Loading...</p>;

  return (
    <div className="mt-[100px]">
      <div className='container'>
        <h1 className="text-2xl font-semibold leading-[24px] text-primary">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="mt-6">
            <p>Your cart is empty.</p>
            <Link to="/products" className="text-indigo-600 hover:underline">Browse products</Link>
          </div>
        ) : (
          <div className="mt-[40px] flex justify-between">
            <div className="flex flex-col gap-[40px]">
              {items.map((ci) => (
                <div key={ci.product.id} className="w-[700px] flex items-center justify-between border-b-2 border-pink-800 pt-[16px] pb-[16px]">
                  <img src={`${API_URL}${ci.product.imageUrl}`} alt={ci.product.name} className="w-[90px] h-[90px] object-cover rounded" />
                  <div className="w-[360px] flex items-center justify-between">
                    <div className="w-[150px] font-medium text-base leading-[24px]">{ci.product.name}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={ci.quantity}
                        onChange={(e) => handleUpdate(ci.product.id, Math.max(1, Number(e.target.value)))}
                        className="w-13 border py-0.5 pl-[2px] border-[#D9D9D9] rounded"
                      />
                    </div>
                    <div className="w-[80px] text-xl text-primary font-medium leading-[32px]">${ci.product.price.toFixed(0)}</div>
                  </div>
                  <button onClick={() => handleRemove(ci.product.id)} className="hover:scale-110">
                    <img src={trashIcon} alt="trash-icon" />
                  </button>
                </div>
              ))}

              <button onClick={handleClear} className="button w-[300px] py-[15px] rounded-[30px]">Clear cart</button>
            </div>

            <div className="border-2 border-pink-800 rounded py-[40px] px-[40px] h-fit flex flex-col gap-10">
              <div className="text-xl font-bold leading-[16px] text-primary">Order Summary</div>
              <div className="text-base font-normal leading-[32px] text-primary flex justify-between">
                Items: <span className='font-bold'>{totalItems}</span>
              </div>
              <div className="text-base font-medium leading-[24px] flex justify-between mt-4">
                Total: <span className='font-bold'>${totalPrice.toFixed(0)}</span>
              </div>
              <Link to="/checkout" className="button py-[15px] px-[50px] rounded-[30px]">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}