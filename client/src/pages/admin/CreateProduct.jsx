import { useState } from "react";
import { createProduct } from "../../services/api";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";


export default function CreateProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct(form);
    navigate("/admin/products");
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-6">Create Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border p-2 w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <button className="bg-black text-white px-4 py-2 rounded">
            Create
          </button>
        </form>
      </div>
    </>
  );
}
