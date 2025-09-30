import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartApi } from '../api/cart/cart';
import type { CartItemDTO } from '../api/cart/type-cart-item';
import type { Product } from '../api/products/type';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  loading: boolean;
  error?: string;
};

const initialState: CartState = {
  items: [],
  loading: false,
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await cartApi.get();
  return res.items as CartItemDTO[];
});


export const addCartItem = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    await cartApi.add(productId, quantity);
    const res = await cartApi.get();
    return res.items as CartItemDTO[];
  }
);


export const removeCartItem = createAsyncThunk(
  'cart/remove',
  async (productId: number) => {
    await cartApi.remove(productId);
    const res = await cartApi.get();
    return res.items as CartItemDTO[];
  }
);


export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    await cartApi.update(productId, quantity);
    const res = await cartApi.get();
    return res.items as CartItemDTO[];
  }
);


export const clearCartItems = createAsyncThunk('cart/clear', async () => {
  await cartApi.clear();
  const res = await cartApi.get();
  return res.items as CartItemDTO[];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItemDTO[]>) => {
        state.items = action.payload.map(d => ({ product: d.product, quantity: d.quantity }));
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })

      .addCase(addCartItem.fulfilled, (state, action: PayloadAction<CartItemDTO[]>) => {
        state.items = action.payload.map(d => ({ product: d.product, quantity: d.quantity }));
      })
      .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<CartItemDTO[]>) => {
        state.items = action.payload.map(d => ({ product: d.product, quantity: d.quantity }));
      })
      .addCase(updateCartQuantity.fulfilled, (state, action: PayloadAction<CartItemDTO[]>) => {
        state.items = action.payload.map(d => ({ product: d.product, quantity: d.quantity }));
      })
      .addCase(clearCartItems.fulfilled, (state, action: PayloadAction<CartItemDTO[]>) => {
        state.items = action.payload.map(d => ({ product: d.product, quantity: d.quantity }));
      });
  },
});

export default cartSlice.reducer;