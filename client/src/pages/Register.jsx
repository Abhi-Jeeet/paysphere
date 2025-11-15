import InputField from '../components/InputField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({name:"", email:"", password:""});
    const [loading, setLoading]= useState(false);

    const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { data } = await registerUser(form);
    if (data && data._id) {
      alert("Signup successful!");
      navigate("/login");
    } else {
      alert("Signup successful!");
      navigate("/login");
    }
  } catch (err) {
    alert(err.response?.data?.error || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>

        <InputField
          label="Full Name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <InputField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <InputField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
    
    
  )
}

export default Register