import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// ✅ Correct Type
export type OrderType = {
  basket: Record<string, number>;
  bill: {
    subtotal: number;
    savings: number;
    total: number;
    offers?: {
      item: string;
      offer: string;
      savings: number;
    }[];
    itemSavings?: Record<string, number>;
  };
};

export const saveOrder = async (data: OrderType) => {
  try {
    await addDoc(collection(db, "orders"), {
      ...data,
      createdAt: Timestamp.now(),
    });

    console.log("Order saved ✅");
  } catch (error) {
    console.error("Error:", error);
  }
};