import { useEffect, useState } from "react";
import { getProducts } from "../../services/api";
import ProductCard from "../../components/product-service/ProductCard"; 

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="p-8 grid grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
