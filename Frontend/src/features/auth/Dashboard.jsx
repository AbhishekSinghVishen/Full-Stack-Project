import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerDashboard from "./SellerDashboard";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("You are not logged in!");
      navigate("/login"); // Redirect to login page
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        alert("Something went wrong. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      {isAdmin ? (
        <SellerDashboard />
      ) : (
        <p className="text-red-500">Access Denied: You are not an admin.</p>
      )}
    </div>
  );
};

export default Dashboard;
