import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogIn, Loader2 } from 'lucide-react';

const Login = ({ setIsLogin }) => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      username: username.trim(),
      password: password.trim(),
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }
      const data = await response.json();
      console.log("Login Successful:", data);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.id);
      setIsLogin(true);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all hover:scale-105">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Information */}
          <div className="md:w-1/2 p-6 md:p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col justify-center items-center text-center">
            <LogIn className="w-16 h-16 mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-lg mb-8">Please login to access your account</p>
          </div>

          {/* Right side - Login Form */}
          <div className="md:w-1/2 p-6 md:p-8 bg-white">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}
              <div className="relative">
                <User className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
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
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  <LogIn className="mr-2" size={20} />
                )}
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
