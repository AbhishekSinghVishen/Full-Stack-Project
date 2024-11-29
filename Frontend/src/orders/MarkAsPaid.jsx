import React from "react";
import axios from "axios";

const MarkAsPaid = ({ orderId }) => {
  const markPaid = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`http://dummyapi.com/api/orders/${orderId}/paid`, {}, config);
      alert("Order marked as paid.");
    } catch (err) {
      alert("Failed to mark order as paid.");
    }
  };

  return <button onClick={markPaid}>Mark as Paid</button>;
};

export default MarkAsPaid;
