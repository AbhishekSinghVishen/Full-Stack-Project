import React from "react";
import Navbar from "./Navbar"; // Import your Navbar component
import ProductHome from "./ProductsHome";
import RegisterPrompt from "./RegisterPrompt"; // Import your ProductList component
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const HomePage = ({setCart,cart}) => {
  const [isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLogin(!!authToken);
  }, []);
  return (
    <div>
      {/* Navbar */}
     

      {isLogin ? (
        <ProductHome setCart={setCart} cart={cart} />
      ) : (
        <RegisterPrompt />
      )}
    </div>
  );
};

export default HomePage;
