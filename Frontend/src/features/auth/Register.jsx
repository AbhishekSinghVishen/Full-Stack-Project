import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';

const Register = ({ setIsLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      name,
      email,
      password,
      isAdmin,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }
      const data = await response.json();
      toast.success("Registration successful!", {
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      console.log("User registered successfully:", data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all hover:scale-105">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Information */}
          <div className="md:w-1/2 p-6 md:p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col justify-center items-center text-center">
            <UserPlus className="w-16 h-16 mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold mb-4">Create Account</h2>
            <p className="text-lg mb-8">Unlock exclusive products, special offers, and more!</p>
          </div>

          {/* Right side - Registration Form */}
          <div className="md:w-1/2 p-6 md:p-8 bg-white">
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}
              <div className="relative">
                <User className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <label htmlFor="isAdmin" className="ml-2 text-sm text-gray-700">Register as Admin</label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  <UserPlus className="mr-2" size={20} />
                )}
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
