import React from 'react';
import { Link } from 'react-router-dom';
import { Smile, ShoppingBag, Gift } from 'lucide-react';

const RegisterPrompt = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col justify-center items-center text-center">
          <ShoppingBag className="w-20 h-20 mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold mb-4">Welcome to E-Shop!</h2>
          <p className="text-lg mb-8">Discover amazing products and exclusive offers.</p>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex flex-col items-center">
              <Gift className="w-10 h-10 mb-2" />
              <span className="text-sm">Special Offers</span>
            </div>
            <div className="flex flex-col items-center">
              <Smile className="w-10 h-10 mb-2" />
              <span className="text-sm">Happy Customers</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-8 md:p-12 bg-white">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Join Us Today!</h3>
          <p className="text-gray-600 mb-8">
            Unlock exclusive products, special offers, and more by signing up or logging in.
          </p>
          <div className="space-y-4">
            <Link 
              to="/login" 
              className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="block w-full py-3 px-4 bg-green-500 text-white rounded-lg text-center font-semibold hover:bg-green-600 transition duration-300 transform hover:scale-105 shadow-md"
            >
              Register
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-600 text-center">
            <p>Already have an account? <Link to="/login" className="text-blue-500 font-semibold hover:underline">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPrompt;

