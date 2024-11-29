import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderDetails = ({ match }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(`http://dummyapi.com/api/orders/${match.params.id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order.");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [match.params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id}</p>
      <p>Total: {order.totalPrice}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default OrderDetails;
