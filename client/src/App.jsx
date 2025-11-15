import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import UserRoute from "./components/UserRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
