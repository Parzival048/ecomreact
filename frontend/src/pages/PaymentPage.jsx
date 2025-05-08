import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard } from 'react-icons/fa';
import CartContext from '../context/CartContext';

const PaymentPage = () => {
  const { savePaymentMethod } = useContext(CartContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <FaCreditCard className="mr-2" /> Payment Method
        </h1>

        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block mb-4 text-lg font-medium">
              Select Method
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="stripe"
                  name="paymentMethod"
                  type="radio"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-blue-600"
                />
                <label htmlFor="stripe" className="ml-3">
                  Stripe (Credit Card)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paypal"
                  name="paymentMethod"
                  type="radio"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-blue-600"
                />
                <label htmlFor="paypal" className="ml-3">
                  PayPal
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
