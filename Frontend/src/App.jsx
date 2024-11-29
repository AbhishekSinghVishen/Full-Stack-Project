import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Import your components
import { AuthProvider } from "./features/auth/AuthContext";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Profile from "./features/auth/Dashboard";
import ProductList from "./features/auth/ProductList";
import UpdateProduct from "./features/auth/UpdateProduct";
import ProfileView from "./features/auth/ProfileView";
import AddOrderItems from "./orders/AddOrderItems";
import Navbar from "./components/Navbar";
import SellerProduct from "./features/auth/SellerDashboard";
import SellerCreatedProd from "./features/auth/ProductList";
import Home from "./components/HomePage";
import Cart from "./components/Cart";
import Checkout from "./components/CheckOut";
import Orders from "./components/Orders";
import MyOrders from "./components/MyOrders";
import OrderSuccess from "./components/OrderSuccess";
import Footer from "./components/Footer";
import Shop from "./components/Shop";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51QNtL8FQS6IjHa9ruk50Ml0BuPS6t8Vv8LSYbNHXUU03F5pmKkhn5fEG488cX4XdaAhwoWaNH2vqeno8bQ2s1bXY00JEn7vmpx");

const App = () => {
  const [cart, setCart] = useState([]);
  const [login,setIsLogin]=useState();

  useEffect(()=>{

    // if(localStorage.getItem('token')){
    //   setIsLogin(true);
    // }else{
    //   setIsLogin(false);
    // }

  },[]);

  return (
    <Router>
      {/* Navbar (optional, always visible) */}
      
    <Navbar setIsLogin={setIsLogin} isLogin={login} cart={cart}/>
      {/* Application Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login setIsLogin={setIsLogin}  />} />
        <Route path="/register" element={<Register  setIsLogin={setIsLogin}/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/myorders" element={<MyOrders/>} />

        <Route path="/order-success" element={<OrderSuccess/>} />
        {/* Checkout Route inside Elements Provider */}
        <Route
          path="/checkout"
          element={
            <Elements stripe={stripePromise}>
              <Checkout cart={cart} setCart={setCart} />
            </Elements>
          }
        />

        {/* Seller/Protected Routes */}
        <Route path="/create-product" element={<SellerProduct />} />
        <Route path="/view-products" element={<SellerCreatedProd />} />
        <Route
          path="/updateproducts/*"
          element={
            <Routes>
              <Route path=":productId" element={<UpdateProduct />} />
            </Routes>
          }
        />
        <Route path="/profileView" element={<ProfileView />} />
        <Route path="/addOrders" element={<AddOrderItems />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
