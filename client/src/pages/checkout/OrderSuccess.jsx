import { useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const { state } = useLocation();
  const bookingId = state?.bookingId;
  return (
    <div className="p-6">
      <h1>Order Success</h1>
      <p>Your booking id: {bookingId}</p>
    </div>
  );
}
