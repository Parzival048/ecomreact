import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import Message from './Message';

const FeaturedDiscount = () => {
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedDiscount = async () => {
      try {
        setLoading(true);
        console.log('Fetching featured discount');
        const { data } = await axios.get('http://localhost:5000/api/discounts/featured');
        console.log('Featured discount data:', data);
        setDiscount(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured discount:', error);
        // Don't set error - just use default discount
        setLoading(false);
      }
    };

    fetchFeaturedDiscount();
  }, []);

  // Default discount content if no active discount is found
  const defaultDiscount = {
    name: 'Special Discount Today!',
    description: 'Get up to 50% off on selected electronics. Limited time offer, don\'t miss out!',
    discountPercentage: 50,
    featuredImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80'
  };

  // Use default discount if no active discount is found
  const displayDiscount = discount || defaultDiscount;

  if (loading) return <Loader />;

  return (
    <div className="mb-16 bg-gradient-to-r from-indigo-50 to-orange-50 rounded-xl p-8 shadow-md">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
          <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
            Deal of the Day
          </div>
          <h2 className="text-3xl font-bold mb-4">{displayDiscount.name}</h2>
          <p className="text-gray-600 mb-6">{displayDiscount.description}</p>
        </div>
        <div className="md:w-1/2">
          <div className="relative">
            <img
              src={displayDiscount.featuredImage || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12'}
              alt="Deal of the Day"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute -top-4 -right-4 bg-red-500 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg">
              <span className="text-xs">Save</span>
              <span className="text-xl font-bold">{displayDiscount.discountPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDiscount;
