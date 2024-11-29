import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders/myorders/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-lg text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Order #{order._id}</h3>
              <p className="text-gray-500 mb-2">Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-lg font-medium mb-2">Total: ${order.totalPrice.toFixed(2)}</p>
              <div className="space-y-2">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} (x{item.qty})</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p>Status: {order.isPaid ? "Paid" : "Paid"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
