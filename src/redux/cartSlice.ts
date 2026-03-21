import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Basket = {
  [key: string]: number;
};

type Offer = {
  item: string;
  offer: string;
  savings: number;
};

type Bill = {
  subtotal: number;
  savings: number;
  total: number;
  offers?: Offer[];
  itemSavings?: Record<string, number>;
};

interface CartState {
  basket: Basket;
  bill: Bill | null;
}

const initialState: CartState = {
  basket: {},
  bill: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.basket[id] = (state.basket[id] || 0) + 1;
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      if (!state.basket[id]) return;

      state.basket[id] -= 1;

      if (state.basket[id] <= 0) {
        delete state.basket[id];
      }
    },

    setBill: (state, action: PayloadAction<Bill>) => {
      state.bill = action.payload;
    },

    clearCart: (state) => {
      state.basket = {};
      state.bill = null;
    },
  },
});

export const { addItem, removeItem, setBill, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;