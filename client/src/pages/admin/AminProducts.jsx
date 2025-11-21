import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar"; 

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const loadData = () => {
    getProducts().then((res) => setProducts(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await deleteProduct(id);
    loadData();
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">All Products (Admin)</h1>

        <table className="w-full border text-left">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-3">
                  <a
                    href={`/admin/products/edit/${p._id}`}
                    className="text-blue-600"
                  >
                    Edit
                  </a>
                  <button
                    className="text-red-600"
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
    </>
  );
}
