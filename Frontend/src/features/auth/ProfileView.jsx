import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Briefcase, ShoppingBag, Plus, List, Package } from 'lucide-react';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get("http://127.0.0.1:8000/api/users/profile/", config);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCreateProduct = () => navigate("/create-product");
  const handleViewCreatedProducts = () => navigate("/products");
  const handleCheckOrders = () => navigate("/myorders");

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <h2 className="text-2xl font-bold">User Profile</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 mr-2 text-gray-500" />
            <p><span className="font-semibold">Username:</span> {profile.username}</p>
          </div>
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 mr-2 text-gray-500" />
            <p><span className="font-semibold">Email:</span> {profile.email}</p>
          </div>
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 mr-2 text-gray-500" />
            <p><span className="font-semibold">Name:</span> {profile.name}</p>
          </div>
          <div className="flex items-center mb-6">
            <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
            <p><span className="font-semibold">Role:</span> {profile.isAdmin ? "Admin" : "Buyer"}</p>
          </div>

          <div className="space-y-3">
            {profile.isAdmin ? (
              <>
                <button
                  onClick={handleCreateProduct}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Product
                </button>
                <button
                  onClick={handleViewCreatedProducts}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
                >
                  <List className="w-5 h-5 mr-2" />
                  View Created Products
                </button>
              </>
            ) : (
              <button
                onClick={handleCheckOrders}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
              >
                <Package className="w-5 h-5 mr-2" />
                Check My Orders
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

