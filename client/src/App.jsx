import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import UserRoute from "./components/UserRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProductList from "./pages/products/ProductList";
import ProductDetails from "./pages/products/ProductDetails";
import AdminProducts from "./pages/admin/AminProducts";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/AdminEditProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProductList/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>


          {/* user routes */}
        <Route path="/user/dashboard" element={
            <UserRoute>
            <UserDashboard/>
            </UserRoute>
          
        }/>

          {/* admin routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard/>
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/create" element={<CreateProduct />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          </AdminRoute>
            
          
        }/>

        {/* Shared */}
        <Route path="/unauthorized" element={<Unauthorized/>} />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
