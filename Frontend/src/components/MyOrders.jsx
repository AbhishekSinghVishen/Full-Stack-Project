import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, CreditCard, Package, ChevronDown, ChevronUp } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (isPaid) => {
    return isPaid ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-10">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white shadow-md rounded-lg">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                className="bg-white overflow-hidden shadow-md rounded-lg divide-y divide-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Order ID: <span className="text-blue-600">{order._id}</span>
                    </h3>
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.isPaid)}`}>
                      {order.isPaid ? 'Paid' : 'Paid'}
                    </p>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <CreditCard className="mr-2 h-5 w-5 text-gray-400" /> Total Price
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900"> {order.totalPrice ? `₹${parseFloat(order.totalPrice).toFixed(2)}` : "N/A"}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Truck className="mr-2 h-5 w-5 text-gray-400" /> Shipping Address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.paymentMethod}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Shipping Price</dt>
                      <dd className="mt-1 text-sm text-gray-900"> {order.shippingPrice ? `₹${parseFloat(order.shippingPrice).toFixed(2)}` : "N/A"}</dd>
                    </div>
                  </dl>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <button
                    onClick={() => toggleOrderExpansion(order._id)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center focus:outline-none"
                  >
                    {expandedOrder === order._id ? (
                      <>
                        Hide Items <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View Items <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
                {expandedOrder === order._id && (
                  <div className="px-4 py-5 sm:p-6 bg-gray-50">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Order Items</h4>
                    <ul className="divide-y divide-gray-200">
                      {order.orderItems.map((item) => (
                        <li key={item._id} className="py-4 flex items-center">
                          <img
                            src={
                              item.image.includes('/media/')
                                ? item.image.replace('/media/', '')
                                : `${item.image}`
                            }
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            
                          ₹{(item.price * item.qty).toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

