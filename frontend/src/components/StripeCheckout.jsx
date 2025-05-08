import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Message from './Message';

const StripeCheckout = ({ orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/${orderId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful
      const paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        payer: { email_address: 'customer@example.com' }, // This would come from Stripe in a real implementation
      };
      
      onSuccess(paymentResult);
    } else {
      setErrorMessage('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <Message variant="error">{errorMessage}</Message>}
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md mt-4"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default StripeCheckout;
