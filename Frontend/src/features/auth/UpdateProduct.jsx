import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {

  const {productId}=useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  // Fetch the product details when the component loads
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get token from localStorage
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const { data } = await axios.get(`http://127.0.0.1:8000/api/products/${productId}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        setName(data.name);
        setPrice(data.price);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to fetch product details. Please check your authentication.");
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      price,
      countInStock,
      description,
    };

    try {
      const token = localStorage.getItem("authToken"); // Get token from localStorage
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.put(`http://127.0.0.1:8000/api/products/update/${productId}/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });

      alert("Product updated successfully!");
      console.log("Updated Product:", response.data);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please check your authentication and try again.");
    }
  };

  return (
    <div>
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label>Count in Stock:</label>
          <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
