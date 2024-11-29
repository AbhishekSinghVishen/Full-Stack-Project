import React, { useState } from "react";
import axios from "axios";

const AddOrderItems = () => {
  const [orderData, setOrderData] = useState({
    orderItems: [],
    paymentMethod: "",
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const [response, setResponse] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("http://127.0.0.1:8000/api/orders/add/", orderData, config);
      setResponse(data);
    } catch (err) {
      setResponse(err.response ? err.response.data.detail : "Error occurred");
    }
  };

  return (
    <div>
      <h2>Add Order Items</h2>
      <form onSubmit={handleSubmit}>
        {/* Add fields for shippingAddress, orderItems, and payment details */}
        <button type="submit">Add Order</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default AddOrderItems;
