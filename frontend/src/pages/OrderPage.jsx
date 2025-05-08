import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaUser, FaMapMarkerAlt, FaCreditCard, FaCheck, FaTimes } from 'react-icons/fa';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import StripeCheckout from '../components/StripeCheckout';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_stripe_key');

const OrderPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          config
        );

        setOrder(data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || 'Failed to fetch order details'
        );
        setLoading(false);
      }
    };

    if (!order || order._id !== id) {
      fetchOrder();
    }
  }, [order, id, user]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (order && !order.isPaid && order.paymentMethod === 'Stripe') {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
          };

          const { data } = await axios.post(
            'http://localhost:5000/api/orders/create-payment-intent',
            { amount: order.totalPrice },
            config
          );

          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Error creating payment intent:', error);
        }
      }
    };

    createPaymentIntent();
  }, [order, user]);

  const successPaymentHandler = async (paymentResult) => {
    try {
      setLoadingPay(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/orders/${id}/pay`,
        paymentResult,
        config
      );

      setOrder(data);
      setLoadingPay(false);
    } catch (error) {
      setLoadingPay(false);
      console.error('Payment error:', error);
    }
  };

  const deliverHandler = async () => {
    try {
      setLoadingDeliver(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/orders/${id}/deliver`,
        {},
        config
      );

      setOrder(data);
      setLoadingDeliver(false);
    } catch (error) {
      setLoadingDeliver(false);
      console.error('Deliver error:', error);
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="error">{error}</Message>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Order {order._id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2" /> Customer
            </h2>
            <p>
              <strong>Name:</strong> {order.user.name}
            </p>
            <p>
              <strong>Email:</strong> {order.user.email}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Shipping
            </h2>
            <p>
              <strong>Address:</strong> {order.shippingAddress.address},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message variant="success">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </Message>
            ) : (
              <Message variant="error">Not Delivered</Message>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCreditCard className="mr-2" /> Payment Method
            </h2>
            <p>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant="success">
                Paid on {new Date(order.paidAt).toLocaleDateString()}
              </Message>
            ) : (
              <Message variant="error">Not Paid</Message>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaShoppingCart className="mr-2" /> Order Items
            </h2>
            <div className="divide-y">
              {order.orderItems.map((item, index) => (
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
                      to={`/product/${item.product}`}
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
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Items:</span>
                <span>${Number(order.itemsPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>${Number(order.shippingPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax:</span>
                <span>${Number(order.taxPrice).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <span className="font-bold">Total:</span>
              <span className="font-bold">${Number(order.totalPrice).toFixed(2)}</span>
            </div>

            {!order.isPaid && order.paymentMethod === 'Stripe' && clientSecret && (
              <div className="mt-4">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeCheckout
                    orderId={order._id}
                    onSuccess={successPaymentHandler}
                  />
                </Elements>
              </div>
            )}

            {loadingPay && <Loader />}

            {user && user.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type="button"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4"
                onClick={deliverHandler}
                disabled={loadingDeliver}
              >
                {loadingDeliver ? 'Processing...' : 'Mark As Delivered'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
