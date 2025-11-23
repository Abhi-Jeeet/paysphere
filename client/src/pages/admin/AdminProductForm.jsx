import { useState, useEffect } from "react";
import { createProduct, fetchProduct, updateProduct } from "../../services/productApi";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminProductForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [form,setForm] = useState({ name:"", description:"", price:0, stock:0 });

  useEffect(()=> {
    if(id) {
      fetchProduct(id).then(res => setForm(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(id) await updateProduct(id, form);
    else await createProduct(form);
    navigate("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl">
      <h2 className="text-2xl mb-4">{id ? "Edit" : "Create"} Product</h2>
      <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="mb-2 p-2 border w-full" />
      <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="mb-2 p-2 border w-full" />
      <input type="number" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} placeholder="Price" className="mb-2 p-2 border w-full" />
      <input type="number" value={form.stock} onChange={e=>setForm({...form, stock:Number(e.target.value)})} placeholder="Stock" className="mb-2 p-2 border w-full" />
      <button className="bg-blue-600 text-white px-3 py-2 rounded">{id ? "Update" : "Create"}</button>
    </form>
  );
}
