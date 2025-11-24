import { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../../services/productApi";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res.data.items || []);
      } catch (err) {
        console.error("AdminProducts error:", err);
      }
    };
    load();
  }, []);

const handleDelete = async (id) => {
  if (!confirm("Delete this product?")) return;

  try {
    await deleteProduct(id);
    const res = await fetchProducts();
    setProducts(res.data.items || []);
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete product");
  }
};


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Manage Products</h2>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          New Product
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <Link
                  to={`/admin/products/${p._id}/edit`}
                  className="mr-3 text-indigo-600"
                >
                  Edit
                </Link>

                <button
                  className="text-red-500"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
