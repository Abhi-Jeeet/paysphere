import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import UserRoute from "./components/UserRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetails";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import Cart from "./pages/cart/CartPage";
import OrderSuccess from "./pages/checkout/OrderSuccess";
import CheckoutPage from "./pages/checkout/CheckoutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />


          {/* user routes */}
        <Route path="/user/dashboard" element={
            <UserRoute>
            <UserDashboard/>
            </UserRoute>
          
        }/>
        <Route path="/cart" element={<UserRoute><Cart/></UserRoute>} />
        <Route
            path="/checkout"
            element={
              <UserRoute>
                <CheckoutPage />
              </UserRoute>
            }
              />

            <Route
              path="/order-success"
              element={
                <UserRoute>
                  <OrderSuccess />
                </UserRoute>
              }
            />

          {/* admin routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard/>
          </AdminRoute>
            
          
        }/>
        <Route path="/admin/products" element={<AdminRoute><AdminProducts/></AdminRoute>} />

        <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm/></AdminRoute>} />

        <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductForm/></AdminRoute>} />

        {/* Shared */}
        <Route path="/unauthorized" element={<Unauthorized/>} />

        <Route path="*" element={<Login />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
