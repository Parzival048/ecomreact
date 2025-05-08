import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaTag } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import AdminNav from '../../components/AdminNav';

const DiscountEditPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [applyToAllProducts, setApplyToAllProducts] = useState(true);
  const [applicableProducts, setApplicableProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchDiscount();
      fetchProducts();
    }
  }, [user, navigate, id]);

  const fetchDiscount = async () => {
    try {
      setLoading(true);

      // Check if user and token exist
      if (!user || !user.token) {
        setError('User authentication failed. Please log in again.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      console.log('Fetching discount with ID:', id);
      console.log('Using token:', user.token);

      const { data } = await axios.get(`http://localhost:5000/api/discounts/${id}`, config);

      setName(data.name);
      setDescription(data.description);
      setDiscountPercentage(data.discountPercentage);
      setStartDate(new Date(data.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(data.endDate).toISOString().split('T')[0]);
      setIsActive(data.isActive);
      setFeaturedImage(data.featuredImage || '');
      setApplyToAllProducts(data.applyToAllProducts);
      setApplicableProducts(data.applicableProducts || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching discount:', error);
      setError(error.response?.data?.message || 'Failed to fetch discount');
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await axios.get('http://localhost:5000/api/products');
      setAvailableProducts(data.products);
      setLoadingProducts(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoadingProducts(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Check if user and token exist
      if (!user || !user.token) {
        setError('User authentication failed. Please log in again.');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      console.log('Updating discount with ID:', id);

      await axios.put(
        `http://localhost:5000/api/discounts/${id}`,
        {
          name,
          description,
          discountPercentage,
          startDate,
          endDate,
          isActive,
          featuredImage,
          applyToAllProducts,
          applicableProducts: applyToAllProducts ? [] : applicableProducts,
          createdBy: user._id, // Add the user ID as the creator
        },
        config
      );

      setSuccess(true);
      window.scrollTo(0, 0);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating discount:', error);
      setError(error.response?.data?.message || 'Failed to update discount');
    }
  };

  const handleProductSelection = (productId) => {
    if (applicableProducts.includes(productId)) {
      setApplicableProducts(applicableProducts.filter(id => id !== productId));
    } else {
      setApplicableProducts([...applicableProducts, productId]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AdminNav />
        </div>
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Edit Discount</h1>
            <Link
              to="/admin/discounts"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" /> Back to Discounts
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : (
            <>
              {success && (
                <Message variant="success">Discount updated successfully</Message>
              )}
              <form onSubmit={submitHandler} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Discount Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Discount Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="99"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Featured Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="applyToAllProducts"
                        checked={applyToAllProducts}
                        onChange={(e) => setApplyToAllProducts(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="applyToAllProducts" className="ml-2 block text-gray-700">
                        Apply to all products
                      </label>
                    </div>

                    {!applyToAllProducts && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Select Products
                        </label>
                        {loadingProducts ? (
                          <Loader />
                        ) : (
                          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                            {availableProducts.map((product) => (
                              <div key={product._id} className="flex items-center py-2 border-b border-gray-200 last:border-b-0">
                                <input
                                  type="checkbox"
                                  id={`product-${product._id}`}
                                  checked={applicableProducts.includes(product._id)}
                                  onChange={() => handleProductSelection(product._id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`product-${product._id}`} className="ml-2 block text-gray-700">
                                  {product.name} - ${product.price.toFixed(2)}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md flex items-center justify-center"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountEditPage;
