import { useSelector, useDispatch } from "react-redux";
import API from "../../services/api";
import { clearCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const { data } = await API.post("/booking/checkout", {
      items: items.map((i) => ({
        productId: i._id,
        quantity: i.quantity,
      })),
    });

    alert("Order Created — Redirecting to payment...");
    dispatch(clearCart());
    navigate("/order-success");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl">Checkout</h2>

      <button
        onClick={handleCheckout}
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
      >
        Confirm Checkout
      </button>
    </div>
  );
}
