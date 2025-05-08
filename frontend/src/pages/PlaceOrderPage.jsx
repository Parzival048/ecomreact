import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Message from '../components/Message';

const PlaceOrderPage = () => {
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Transform cart items to match the expected format in the backend
      const transformedItems = cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id, // Map _id to product field as required by the backend
      }));

      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: transformedItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error('Order error:', error);

      // Extract detailed error message
      let errorMessage = 'An error occurred while placing your order';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Place Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2" /> Customer
            </h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Shipping
            </h2>
            <p>
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCreditCard className="mr-2" /> Payment Method
            </h2>
            <p>
              <strong>Method:</strong> {paymentMethod}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaShoppingCart className="mr-2" /> Order Items
            </h2>
            {cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div className="divide-y">
                {cartItems.map((item, index) => (
                  <div key={index} className="py-4 flex items-center">
                    <div className="flex-shrink-0 w-16 h-16">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Items:</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax:</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <span className="font-bold">Total:</span>
              <span className="font-bold">${Number(totalPrice).toFixed(2)}</span>
            </div>

            {error && (
              <div className="mb-4">
                <Message variant="error">{error}</Message>
              </div>
            )}

            <button
              type="button"
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
              className={`w-full py-3 rounded-md ${
                cartItems.length === 0 || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
