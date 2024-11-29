import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, ChevronDown, Search, Menu } from 'lucide-react';

const Navbar = ({isLogin, setIsLogin, cart}) => {
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if(authToken){
      console.log("AUTH token")
      setIsLogin(true);
    }else{
      setIsLogin(false);
    }
   
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLogin(false);
    navigate("");
  };
  console.log(cart)
  const cartCount = cart.length; // Replace with dynamic count from state or context

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight hover:text-purple-200 transition-colors">
            E-Shop
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link to="/" className="hover:text-purple-200 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-purple-200 transition-colors">
                Shop
              </Link>
            </li>
          </ul>

          {/* Actions (My Account, Cart, Hamburger) */}
          <div className="flex items-center space-x-4">
            {/* My Account (Desktop Only) */}
            {isLogin ? (
              <div className="relative group hidden md:flex">
                <span className="cursor-pointer flex items-center hover:text-purple-200 transition-colors">
                  <User className="w-6 h-6 mr-1" /> My Account <ChevronDown className="ml-1 w-4 h-4" />
                </span>
                <ul className="absolute right-0 mt-2 bg-white z-10 text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                  <li>
                    <Link to="/profileView" className="block px-4 py-2 hover:bg-purple-100">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/myorders" className="block px-4 py-2 hover:bg-purple-100">
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link to="/login" className="hover:text-purple-200 transition-colors">
                  Login
                </Link>
                <span>/</span>
                <Link to="/register" className="hover:text-purple-200 transition-colors">
                  Signup
                </Link>
              </div>
            )}

            {/* Cart Icon (Visible on both mobile and desktop) */}
            {isLogin && (
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              </Link>
            )}

            {/* Hamburger Icon (Mobile Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="bg-indigo-800 py-2 md:hidden">
          <ul className="space-y-2 px-4">
            <li>
              <Link to="/" className="block py-2 hover:bg-indigo-700 rounded px-2">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="block py-2 hover:bg-indigo-700 rounded px-2">
                Shop
              </Link>
            </li>
            {isLogin && (
              <>
                <li>
                  <Link to="/profileView" className="block py-2 hover:bg-indigo-700 rounded px-2">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/myorders" className="block py-2 hover:bg-indigo-700 rounded px-2">
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 hover:bg-indigo-700 rounded px-2"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {!isLogin && (
              <>
                <li>
                  <Link to="/login" className="block py-2 hover:bg-indigo-700 rounded px-2">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block py-2 hover:bg-indigo-700 rounded px-2">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
