import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../utils/api';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.product.id &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: number; size?: string; color?: string }>) => {
      state.items = state.items.filter(
        (i) =>
          !(i.product.id === action.payload.productId &&
            i.size === action.payload.size &&
            i.color === action.payload.color)
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number; size?: string; color?: string }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.product.id === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i !== item);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
