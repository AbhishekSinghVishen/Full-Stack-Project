import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Authentication token is missing. Please login again.");
        setLoading(false);
        return;
      }

      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/products/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (Array.isArray(data.products)) {
          const filteredProducts = data.products.filter(
            (product) => product.user == userId
          );
          setProducts(filteredProducts);
        } else {
          setProducts([]);
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/delete/${productId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = (product) => {
    setCurrentProduct(product);
    setShowUpdateForm(true);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    const updatedProduct = {
      ...currentProduct,
      name: event.target.name.value,
      price: parseFloat(event.target.price.value),
      countInStock: parseInt(event.target.countInStock.value, 10),
      description: event.target.description.value,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/update/${updatedProduct._id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();

      setProducts(
        products.map((product) =>
          product._id === data._id ? { ...product, ...data } : product
        )
      );

      toast.success("Product updated successfully!");
      setShowUpdateForm(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-700">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold text-center mb-8">Your Products</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl =
              product.image && product.image.startsWith("http")
                ? product.image
                : `http://127.0.0.1:8000${product.image}`;

            return (
              <div
                key={product._id}
                className="relative border rounded-lg shadow-lg hover:shadow-xl p-6 bg-white transition-transform transform hover:scale-105"
              >
                <img
                  src={imageUrl}
                  alt={product.name || "Product"}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/128";
                  }}
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {product.name || "Unnamed Product"}
                </h3>
                <p className="text-gray-600 mb-2 text-sm">
                  {product.description || "No description provided"}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-700">
                  <p>
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {product.countInStock}
                  </p>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                    onClick={() => handleUpdate(product)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products available.</p>
      )}

      {showUpdateForm && currentProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-center">
              Update Product
            </h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentProduct.name}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price:</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={currentProduct.price}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Stock:</label>
                <input
                  type="number"
                  name="countInStock"
                  defaultValue={currentProduct.countInStock}
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description:</label>
                <textarea
                  name="description"
                  defaultValue={currentProduct.description}
                  className="w-full border px-4 py-2 rounded-md"
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
