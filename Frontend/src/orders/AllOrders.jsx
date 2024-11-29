import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get("http://dummyapi.com/api/admin/orders", config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>All Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order ID: {order._id}, User: {order.user}, Total: {order.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllOrders;
