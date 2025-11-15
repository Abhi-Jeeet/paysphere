import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Dashboard(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token) return navigate("/login");

        axios
            .get("http://localhost:5001/api/auth/me",{
                headers:{Authorization: `Bearer ${token}`},
            })
            .then((res)=> setUser(res.data.user))
            .catch(()=>{
                localStorage.removeItem("token");
                navigate("/login");
            })
    }, []);

    const handleLogout =()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }



      return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome Dashboard 🎉</h1>

        {user ? (
          <>
            <p className="mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-4"><strong>Role:</strong> {user.role}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </div>
  );
}