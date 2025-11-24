import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem, checkoutCart, clearCart } from "../../services/cartApi";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error("Load cart error:", err);
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeQty = async (productId, qty) => {
    try {
      await updateCartItem(productId, { quantity: qty });
      await load();
    } catch (err) {
      alert("Update failed");
    }
  };

  const removeItem = async (productId) => {
    if (!confirm("Remove this item?")) return;
    try {
      await removeCartItem(productId);
      await load();
    } catch (err) {
      alert("Remove failed");
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await checkoutCart();
      alert(`Checkout: ${res.data.message} — total: ${res.data.total}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.error || "Checkout failed");
    }
  };
  const clearCart = async()=>{
    try {
        
    } catch (error) {
        
    }
  }

  if (loading) return <p>Loading cart...</p>;
  if (!cart || !cart.items.length) return <p>Your cart is empty</p>;

  const total = cart.items.reduce((s,i) => s + (i.price || 0) * (i.quantity || 0), 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cart.items.map(item => (
          <div key={item.productId} className="flex items-center justify-between border p-4 rounded">
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm">₹{item.price}</div>
            </div>

            <div className="flex items-center gap-3">
              <input type="number" min="1" value={item.quantity} onChange={(e)=> changeQty(item.productId, Number(e.target.value))} className="w-20 p-1 border rounded" />
              <button className="text-red-600" onClick={()=> removeItem(item.productId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div>
          <div className="text-lg">Total: <strong>₹{total}</strong></div>
          <button onClick={async ()=> { await clearCart(); await load(); }} className="mt-2 text-sm underline">Clear cart</button>
        </div>

        <div>
          <button onClick={handleCheckout} className="bg-blue-600 text-white px-4 py-2 rounded">Checkout</button>
        </div>
      </div>
    </div>
  );
}
