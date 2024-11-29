import React from 'react';

const Shop = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Oops! This page is under construction 🚧</h2>
        <p className="text-lg text-gray-600 mb-6">
          We're working hard to bring you something awesome. Please check back soon!
        </p>
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Thank you for your patience and support. We can't wait to show you what's coming!
        </p>
      </div>
    </div>
  );
};

export default Shop;
