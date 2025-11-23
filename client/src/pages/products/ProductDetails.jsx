import { useEffect, useState } from "react";
import { fetchProduct } from "../../services/productApi";
import { useParams } from "react-router-dom";

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(()=> {
    fetchProduct(id).then(res=> setProduct(res.data));
  }, [id]);

  if(!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl">{product.name}</h1>
      <p className="mt-2">{product.description}</p>
      <p className="mt-4 text-xl">₹{product.price}</p>
    </div>
  );
}
