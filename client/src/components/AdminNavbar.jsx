import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex gap-6">
      <Link to="/admin/products">Products</Link>
      <Link to="/admin/products/create">Create Product</Link>
    </nav>
  );
}
