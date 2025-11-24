import { useEffect, useState } from "react";
import { fetchProduct } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
   const navigate = useNavigate();

  useEffect(()=> {
    fetchProduct(id).then(res=> setProduct(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: id, quantity: 1 });
      alert("Added to cart");
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(err.response?.data?.error || "Add to cart failed");
    }
  };

  if(!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl">{product.name}</h1>
      <p className="mt-2">{product.description}</p>
      <p className="mt-4 text-xl">₹{product.price}</p>

      <div className="mt-4">
        <button onClick={handleAddToCart} className="bg-green-600 text-white px-4 py-2 rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
