import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Message from '../components/Message';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartItemQty } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty cart"
            className="w-32 h-32 mx-auto mb-6 opacity-50"
          />
          <Message>
            Your cart is empty.{' '}
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Continue Shopping
            </Link>
          </Message>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-20 w-20 object-cover"
                              />
                            </div>
                            <div className="ml-4 max-w-xs">
                              <Link
                                to={`/product/${item._id}`}
                                className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-150 line-clamp-2"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={item.qty}
                            onChange={(e) =>
                              updateCartItemQty(item._id, Number(e.target.value))
                            }
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            {[...Array(Math.min(item.countInStock, 10)).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.discountedPrice ? (
                            <div>
                              <span className="font-medium text-gray-900">${(item.discountedPrice * item.qty).toFixed(2)}</span>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500 line-through mr-1">${(item.price * item.qty).toFixed(2)}</span>
                                <span className="text-xs font-semibold text-red-500">
                                  {item.discountPercentage}% OFF
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="font-medium text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors duration-150 p-2 rounded-full hover:bg-red-50"
                            aria-label="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-150"
              >
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                  <span className="font-medium">
                    ${cartItems
                      .reduce((acc, item) => {
                        const price = item.discountedPrice || item.price;
                        return acc + item.qty * price;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {cartItems.reduce((acc, item) => {
                      const price = item.discountedPrice || item.price;
                      return acc + item.qty * price;
                    }, 0) > 100
                      ? <span className="text-green-600">Free</span>
                      : <span>${'10.00'}</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax (15%):</span>
                  <span className="font-medium">
                    ${(
                      cartItems.reduce((acc, item) => {
                        const price = item.discountedPrice || item.price;
                        return acc + item.qty * price;
                      }, 0) * 0.15
                    ).toFixed(2)}
                  </span>
                </div>

                {cartItems.reduce((acc, item) => {
                  const price = item.discountedPrice || item.price;
                  return acc + item.qty * price;
                }, 0) > 100 && (
                  <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm mt-4">
                    <span className="font-medium">You've qualified for free shipping!</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                    ${(
                      cartItems.reduce((acc, item) => {
                        const price = item.discountedPrice || item.price;
                        return acc + item.qty * price;
                      }, 0) +
                      (cartItems.reduce((acc, item) => {
                        const price = item.discountedPrice || item.price;
                        return acc + item.qty * price;
                      }, 0) > 100
                        ? 0
                        : 10) +
                      cartItems.reduce((acc, item) => {
                        const price = item.discountedPrice || item.price;
                        return acc + item.qty * price;
                      }, 0) * 0.15
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  cartItems.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-orange-500 hover:from-indigo-700 hover:to-orange-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 flex items-center justify-center space-x-4 text-gray-500 text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Multiple Payment Options
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
