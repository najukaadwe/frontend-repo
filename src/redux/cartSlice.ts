import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ✅ Basket Type
type Basket = {
  [key: string]: number;
};

// ✅ Offer Type
type Offer = {
  item: string;
  offer: string;
  savings: number;
};

// ✅ Bill Type (FIXED 🔥)
type Bill = {
  subtotal: number;
  savings: number;
  total: number;
  offers?: Offer[];
};

// ✅ State Type
interface CartState {
  basket: Basket;
  bill: Bill | null;
}

// ✅ Initial State
const initialState: CartState = {
  basket: {},
  bill: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Add Item
    addItem: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      state.basket[name] = (state.basket[name] || 0) + 1;
    },

    // ✅ Remove Item
    removeItem: (state, action: PayloadAction<string>) => {
      const name = action.payload;

      if (!state.basket[name]) return;

      state.basket[name] -= 1;

      // ✅ remove item if 0 (clean state 🔥)
      if (state.basket[name] <= 0) {
        delete state.basket[name];
      }
    },

    // ✅ Set Bill
    setBill: (state, action: PayloadAction<Bill>) => {
      state.bill = action.payload;
    },

    // ✅ Clear Cart (recommended 🚀)
    clearCart: (state) => {
      state.basket = {};
      state.bill = null;
    },
  },
});

export const { addItem, removeItem, setBill, clearCart } = cartSlice.actions;
export default cartSlice.reducer;