import React from "react";
import axios from "axios";

const MarkAsDelivered = ({ orderId }) => {
  const markDelivered = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`http://dummyapi.com/api/orders/${orderId}/delivered`, {}, config);
      alert("Order marked as delivered.");
    } catch (err) {
      alert("Failed to mark order as delivered.");
    }
  };

  return <button onClick={markDelivered}>Mark as Delivered</button>;
};

export default MarkAsDelivered;
