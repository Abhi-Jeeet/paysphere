import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/api"; 

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mt-3">{product.description}</p>
      <p className="text-2xl mt-4 font-semibold">₹ {product.price}</p>
    </div>
  );
}
