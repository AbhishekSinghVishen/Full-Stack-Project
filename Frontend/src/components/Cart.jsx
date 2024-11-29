import React, { useState ,useEffect} from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = ({ cart, setCart }) => {


  useEffect(()=>{
   console.log("hello i am cart");
    const temp=localStorage.getItem('cart');

    



    if(temp){
      const data=JSON.parse(temp);
          console.log(data);
      setCart(data);
  
    }

  },[]);
  const [isCartEmpty, setIsCartEmpty] = useState(cart.length === 0);

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    updateCart(updatedCart);
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
    setIsCartEmpty(true);
  };

  const updateCart = (newCart) => {
    console.log(newCart);
    setCart(newCart);
    console.log(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setIsCartEmpty(newCart.length === 0);
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + Number(item.price) * item.quantity, 0)
      .toFixed(2);
  };

  const proceedToCheckout = () => {
    localStorage.setItem("totalAmount", calculateTotal());
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-500 to-indigo-600">
          <h2 className="text-3xl font-extrabold text-white flex items-center">
            <ShoppingCart className="mr-2" /> Your Shopping Cart
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <AnimatePresence>
            {isCartEmpty ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart!</p>
                <div className="mt-6">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ul className="divide-y divide-gray-200">
                  {cart.map((product) => (
                    <motion.li
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="py-6 flex"
                    >
                      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                        <img
                        src={
                          product.image.includes('/media/')
                            ? product.image.replace('/media/', '')
                            : `${product.image}`
                        }
                          
                          alt={product.name}
                          className="h-full object-center object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{product.name}</h3>
                            <p className="ml-4">₹{(product.price * product.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">₹{product.price} each</p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => decreaseQuantity(product._id)}
                              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <Minus className="h-5 w-5" />
                            </button>
                            <span className="font-medium text-gray-700">{product.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(product._id)}
                              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => removeFromCart(product._id)}
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹{calculateTotal()}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={clearCart}
                      className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="mr-2 h-5 w-5" /> Clear Cart
                    </button>
                    <Link
                      to="/checkout"
                      onClick={proceedToCheckout}
                      className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Checkout <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or{" "}
                      <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Cart;

