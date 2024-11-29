import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, ShoppingCart, Star, X, Filter } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsHome = ({ setCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/");
        if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        } else {
          setError("Products data is not in the expected format.");
        }
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category ? product.category === category : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, category, products]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      const newProduct = { ...product, quantity: 1 };
      setCart([...cart, newProduct]);
    }
    toast.success(`${product.name} has been added to your cart!`);
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 text-xl mt-10">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="relative w-full md:w-1/4">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
          >
            <option value="">All Categories</option>
            {Array.from(new Set(products.map((product) => product.category))).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <ToastContainer 
        position="bottom-center" 
        autoClose={3000} 
        hideProgressBar 
        newestOnTop 
        closeButton={false} 
        toastClassName="bg-blue-500 text-white rounded-lg shadow-lg"
      />

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            <img
            src={
              selectedProduct.image.includes('/media/')
                ? selectedProduct.image.replace('/media/', '')
                : `${selectedProduct.image}`
            }
              
              alt={selectedProduct.name}
              className="h-64 object-cover rounded-lg mb-6"
            />
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-blue-600">
                ${parseFloat(selectedProduct.price).toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">In Stock: {selectedProduct.countInStock}</span>
            </div>
            <button
              onClick={() => addToCart(selectedProduct)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <ShoppingCart className="mr-2" size={20} /> Add to Cart
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <img
            src={
              product.image.includes('/media/')
                ? product.image.replace('/media/', '')
                : `${product.image}`
            }
              
              alt={product.name}
              className="h-64 object-cover"
            />
            <div className="p-6">
              <h3
                className="text-xl font-semibold text-blue-600 cursor-pointer hover:underline mb-2"
                onClick={() => setSelectedProduct(product)}
              >
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                ₹{parseFloat(product.price).toFixed(2)}
                </span>
                {product.rating && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating} ({product.numReviews})
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <ShoppingCart className="mr-2" size={16} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsHome;
