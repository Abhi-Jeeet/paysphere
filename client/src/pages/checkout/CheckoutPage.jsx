import React from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../../services/api";
import { clearCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const items = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    try {
      // 1) send cart snapshot to gateway -> booking service -> creates razorpay order
      const res = await API.post("/booking/checkout", {
        items: items.map(i => ({ productId: i._id, quantity: i.quantity }))
      });

      const { orderId, amount, currency, bookingId, keyId } = res.data;

      // 2) open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Your Shop Name",
        description: `Booking ${bookingId}`,
        order_id: orderId,
        handler: async function (response) {
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            // send to backend to verify and finalize booking
            await API.post("/booking/verify", {
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            dispatch(clearCart());
            navigate("/order-success", { state: { bookingId } });
          } catch (err) {
            console.error("Verify failed:", err);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "", // optionally fill from user profile
          email: ""
        },
        theme: { color: "#3399cc" }
      };

      // load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.response?.data?.error || "Checkout failed");
    }
  };

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl">Checkout</h2>
      <div>
        {items.map(it => (
          <div key={it._id} className="border p-2 mb-2">
            <div>{it.name} x {it.quantity}</div>
            <div>₹{it.price}</div>
          </div>
        ))}
      </div>
      <h3 className="mt-4">Total: ₹{total}</h3>
      <button onClick={handleCheckout} className="bg-green-600 text-white px-4 py-2 mt-3 rounded">Pay Now</button>
    </div>
  );
}
