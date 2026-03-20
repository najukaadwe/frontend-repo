import React, { useEffect, useState } from "react";
import { getProducts, calculateBill } from "./redux/api";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, setBill } from "./redux/cartSlice";
import { saveOrder } from "./firebaseService";
import type { RootState } from "./redux/store";

// ==============================
// ✅ TYPES
// ==============================
type Product = {
  id: string;
  name: string;
  price: number;
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
  itemSavings?: Record<string, number>; // 🔥 important
};

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const dispatch = useDispatch();

  const basket = useSelector((state: RootState) => state.cart.basket);
  const bill = useSelector((state: RootState) => state.cart.bill) as Bill | null;

  // ==============================
  // ✅ FETCH PRODUCTS
  // ==============================
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  // ==============================
  // ✅ CALCULATE BILL
  // ==============================
  const handleCalculate = async () => {
    const payload = Object.entries(basket).map(([id, quantity]) => ({
      id,
      quantity,
    }));

    const data = await calculateBill(payload);

    dispatch(setBill(data));

    await saveOrder({
      basket,
      bill: data,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-500">
        🛒 Shopping Cart
      </h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* ================= PRODUCTS ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>

          {products.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-gray-500 text-sm">£{p.price}</p>
              </div>

              <button
                onClick={() => dispatch(addItem(p.id))}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* ================= BASKET ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basket</h2>

          {Object.keys(basket).length === 0 && (
            <p className="text-gray-500">No items added</p>
          )}

          {Object.keys(basket).map((itemId) => {
            const product = products.find((p) => p.id === itemId);
            const quantity = basket[itemId];
            const price = product?.price || 0;

            const itemTotal = price * quantity;

            // 🔥 GET EXACT SAVING FROM BACKEND
            const saving = bill?.itemSavings?.[itemId] || 0;

            const finalCost = itemTotal - saving;

            return (
              <div key={itemId} className="border-b py-3">
                <div className="flex justify-between">
                  <p>{product?.name}</p>
                  <p>£{price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2 my-2">
                  <button
                    onClick={() => dispatch(removeItem(itemId))}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    -
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={() => dispatch(addItem(itemId))}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  Item price £{price.toFixed(2)} * {quantity} = £
                  {itemTotal.toFixed(2)}
                </p>

                {saving > 0 && (
                  <p className="text-red-500">
                    Savings £{saving.toFixed(2)}
                  </p>
                )}

                <p className="font-semibold">
                  Item cost £{finalCost.toFixed(2)}
                </p>
              </div>
            );
          })}

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6"
          >
            Calculate Bill
          </button>

          {/* ================= BILL SUMMARY ================= */}
          {bill && (
            <div className="mt-6 border-t pt-4 space-y-2">
              <p className="flex justify-between">
                <span>Sub Total:</span>
                <span>£{bill.subtotal.toFixed(2)}</span>
              </p>

              <p className="flex justify-between text-red-500">
                <span>Savings:</span>
                <span>£{bill.savings.toFixed(2)}</span>
              </p>

              <p className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>£{bill.total.toFixed(2)}</span>
              </p>

              {/* OFFERS */}
              {bill.offers && bill.offers.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">
                    Offers Applied
                  </h3>

                  {bill.offers.map((offer, index) => (
                    <p key={index} className="text-green-600 text-sm">
                      ✔ {offer.item} - {offer.offer} → Saved £
                      {offer.savings.toFixed(2)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;