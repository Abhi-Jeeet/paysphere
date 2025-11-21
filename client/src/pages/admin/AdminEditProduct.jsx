import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar"; 

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  });

  useEffect(() => {
    getProductById(id).then((res) => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(id, form);
    navigate("/admin/products");
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border p-2 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            className="border p-2 w-full"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            className="border p-2 w-full"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <button className="bg-black text-white px-4 py-2 rounded">
            Update
          </button>
        </form>
      </div>
    </>
  );
}
