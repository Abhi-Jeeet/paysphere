import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/productApi";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetchProducts();
    setProducts(res.data.items || []);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Products</h2>
      <input placeholder="Search" value={q} onChange={(e)=>setQ(e.target.value)} className="mb-4 p-2 border" />
      <div className="grid grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="border p-4 rounded">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm">{p.description}</p>
            <p className="mt-2 font-bold">₹{p.price}</p>
            <Link to={`/products/${p._id}`} className="text-blue-600">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
