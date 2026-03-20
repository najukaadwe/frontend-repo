import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// ✅ Define Type
export type OrderType = {
  name: string;
  price: number;
  quantity: number;
};

export const saveOrder = async (data: OrderType) => {
  try {
    await addDoc(collection(db, "orders"), {
      ...data,
      createdAt: Timestamp.now(), // 🔥 better than new Date()
    });

    console.log("Order saved ✅");
  } catch (error) {
    console.error("Error:", error);
  }
};