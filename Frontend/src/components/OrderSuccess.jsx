import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
const OrderSuccess = () => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate("/myorders");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500" size={64} />
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Order Placed Successfully!
        </h2>
        <p className="text-lg text-gray-600">
          Thank you for your purchase. Your order has been placed and will be
          processed shortly.
        </p>

        {/* Order Actions */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleViewOrders}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            View My Orders
          </button>
          <button
            onClick={handleGoHome}
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Return to Home
          </button>
        </div>

        {/* Decorative Divider */}
        <div className="mt-8">
          <div className="border-t border-gray-200"></div>
          <p className="mt-4 text-sm text-gray-500">
            You will receive a confirmation email shortly with the details of
            your order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
