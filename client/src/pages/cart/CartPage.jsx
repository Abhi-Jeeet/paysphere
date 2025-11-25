import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        items.map((item) => (
          <div key={item._id} className="border rounded p-4 mb-4">
            <h3 className="text-xl">{item.name}</h3>
            <p>₹{item.price}</p>

            <input
              type="number"
              value={item.quantity}
              min="1"
              className="border px-3 py-1 mt-2"
              onChange={(e) =>
                dispatch(
                  updateQuantity({
                    productId: item._id,
                    quantity: Number(e.target.value),
                  })
                )
              }
            />

            <button
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => dispatch(removeFromCart(item._id))}
            >
              Remove
            </button>
          </div>
        ))
      )}

      {items.length > 0 && (
        <>
          <h3 className="text-xl mt-4">Total: ₹{total}</h3>

          <button
            className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>

          <button
            className="bg-gray-600 text-white px-4 py-2 mt-4 ml-4 rounded"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
