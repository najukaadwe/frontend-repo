import axios from "axios";
import type { AxiosResponse } from "axios";

// ✅ Base URL
const BASE_URL = "https://shopping-backend-4x5g.onrender.com";



// Product
export interface Product {
  id: string;
  name: string;
  price: number;
}

// Basket Item
export interface BasketItem {
  id: string;
  quantity: number;
}

// Offer
export interface Offer {
  item: string;
  offer: string;
  savings: number;
}

// Bill Response (FIXED 🔥)
export interface BillResponse {
  subtotal: number;
  savings: number;
  total: number;
  offers?: Offer[];
}


export const getProducts = async (): Promise<Product[]> => {
  try {
    const res: AxiosResponse<Product[]> = await axios.get(
      `${BASE_URL}/products`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


export const calculateBill = async (
  basket: BasketItem[]
): Promise<BillResponse> => {
  try {
    const res: AxiosResponse<BillResponse> = await axios.post(
      `${BASE_URL}/calculate`,
      basket
    );
    return res.data;
  } catch (error) {
    console.error("Error calculating bill:", error);
    throw error;
  }
};