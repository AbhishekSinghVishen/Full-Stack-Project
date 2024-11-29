import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";
import { CreditCard, Truck, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';

const CheckOut = ({ cart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expirationDate: "",
    cvv: "",
  });
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const generateInvoice = (orderId) => {
    const invoiceWindow = window.open("", "_blank");
    const date = new Date().toLocaleDateString();
    const total = calculateTotal();
    const tax = (0.1 * total).toFixed(2);
    const shipping = 5.0;
    const grandTotal = (parseFloat(total) + parseFloat(tax) + parseFloat(shipping)).toFixed(2);

    const invoiceHTML = `
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: 'Helvetica', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f7fafc;
          }
          .invoice-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            color: #2d3748;
          }
          .header h1 {
            font-size: 28px;
            margin: 0;
            color: #4a5568;
          }
          .header p {
            font-size: 16px;
            color: #718096;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            font-size: 20px;
            margin-bottom: 15px;
            color: #4a5568;
            border-bottom: 2px solid #edf2f7;
            padding-bottom: 10px;
          }
          .details, .items, .summary {
            background-color: #f8fafc;
            border-radius: 6px;
            padding: 20px;
          }
          .items table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px;
          }
          .items th, .items td {
            text-align: left;
            padding: 12px;
          }
          .items th {
            background-color: #edf2f7;
            color: #4a5568;
            font-weight: 600;
          }
          .items tr {
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .summary {
            text-align: right;
          }
          .summary div {
            margin-bottom: 10px;
            font-size: 16px;
          }
          .summary .total {
            font-size: 20px;
            font-weight: bold;
            color: #2d3748;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #718096;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>Invoice</h1>
            <p>Thank you for your purchase!</p>
          </div>
          
          <div class="section">
            <h2>Order Details</h2>
            <div class="details">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Order Date:</strong> ${date}</p>
              <p><strong>Shipping Address:</strong></p>
              <p>${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}</p>
            </div>
          </div>
          
          <div class="section">
            <h2>Items</h2>
            <div class="items">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${cart
                    .map(
                      (item) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${Number(item.price).toFixed(2)}</td>
                        <td>$${(Number(item.price) * item.quantity).toFixed(2)}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="section">
            <h2>Summary</h2>
            <div class="summary">
              <div><strong>Subtotal:</strong> $${total}</div>
              <div><strong>Tax (10%):</strong> $${tax}</div>
              <div><strong>Shipping:</strong> $${shipping.toFixed(2)}</div>
              <div class="total"><strong>Total:</strong> $${grandTotal}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Need help? Contact us at support@example.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    setTimeout(() => {
      invoiceWindow.print();
    }, 250);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setError("Please fill in all shipping details.");
      setLoading(false);
      return;
    }

    if (
      !paymentDetails.cardNumber ||
      !paymentDetails.cardName ||
      !paymentDetails.expirationDate ||
      !paymentDetails.cvv
    ) {
      setError("Please fill in all payment details.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to place an order.");
      setLoading(false);
      return;
    }

    const orderData = {
      orderItems: cart.map((item) => ({
        product: item._id,
        qty: item.quantity,
        price: item.price,
      })),
      paymentMethod: "Credit Card",
      taxPrice: (0.1 * calculateTotal()).toFixed(2),
      shippingPrice: "5.00",
      totalPrice: calculateTotal(),
      shippingAddress,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders/add/",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order placed successfully:", response.data);
      generateInvoice(response.data._id);
      setSuccess(true);
   
      setTimeout(() => {
        navigate("/order-success");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error.response || error.message);
      setError(
        error.response?.data?.detail || "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h2 className="text-3xl font-extrabold text-white">Checkout</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Add some items to your cart to checkout.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Summary</h3>
                <div className="bg-gray-50 rounded-md p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center">
                        <img src={
    item.image.includes('/media/')
      ? item.image.replace('/media/', '')
      : `http://127.0.0.1:8000${item.image}`
  }  alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-medium text-gray-900">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                  <Truck className="mr-2" /> Shipping Address
                </h3>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCard className="mr-2" /> Payment Details
                </h3>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium
text-gray-700">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={paymentDetails.cardName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Expiration Date (MM/YY)</label>
                    <input
                      type="text"
                      id="expirationDate"
                      name="expirationDate"
                      value={paymentDetails.expirationDate}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, expirationDate: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">There was an error processing your order</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-green-50 p-4"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Order placed successfully</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your order has been placed and is being processed. Thank you for your purchase!</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || success}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    (loading || success) && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Processing..." : success ? "Order Placed!" : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOut;

