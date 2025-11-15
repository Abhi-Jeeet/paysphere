import { Navigate } from "react-router-dom";

export default function AdminRoute({children}){
const token = localStorage.getItem("token");
if(!token) return <Navigate to= "/login" replace />;

try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if(payload.role !== "admin") return <Navigate to="/unauthorized" replace />;
    return children;
} catch (error) {
    return <Navigate to="/login" replace />;
}

}