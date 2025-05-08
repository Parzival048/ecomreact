import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaTag } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import AdminNav from '../../components/AdminNav';

const DiscountListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchDiscounts();
    }
  }, [user, navigate]);

  const fetchDiscounts = async () => {
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

      console.log('Making API request with token:', user.token);
      const { data } = await axios.get('http://localhost:5000/api/discounts', config);
      setDiscounts(data);
      setLoading(false);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.response?.data?.message || 'Failed to fetch discounts');
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        // Check if user and token exist
        if (!user || !user.token) {
          setError('User authentication failed. Please log in again.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        await axios.delete(`http://localhost:5000/api/discounts/${id}`, config);
        setDeleteSuccess(true);
        fetchDiscounts();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setDeleteSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Delete Error:', error);
        setError(error.response?.data?.message || 'Failed to delete discount');
      }
    }
  };

  const createDiscountHandler = async () => {
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

      const { data } = await axios.post(
        'http://localhost:5000/api/discounts',
        {
          name: 'New Discount',
          description: 'Discount description',
          discountPercentage: 10,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
          isActive: false,
          applyToAllProducts: true,
          createdBy: user._id, // Add the user ID as the creator
        },
        config
      );

      setCreateSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setCreateSuccess(false);
      }, 3000);

      navigate(`/admin/discount/${data._id}/edit`);
    } catch (error) {
      console.error('Create Error:', error);
      setError(error.response?.data?.message || 'Failed to create discount');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if discount is currently active
  const isDiscountActive = (discount) => {
    const now = new Date();
    return discount.isActive &&
           new Date(discount.startDate) <= now &&
           new Date(discount.endDate) >= now;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AdminNav />
        </div>
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Discounts</h1>
            <button
              onClick={createDiscountHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
            >
              <FaPlus className="mr-2" /> Create Discount
            </button>
          </div>

          {deleteSuccess && (
            <Message variant="success">Discount deleted successfully</Message>
          )}
          {createSuccess && (
            <Message variant="success">Discount created successfully</Message>
          )}
          {error && <Message variant="error">{error}</Message>}

          {loading ? (
            <Loader />
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Discount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Range
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {discounts.map((discount) => (
                      <tr key={discount._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full">
                              <FaTag className="text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {discount.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {discount.applyToAllProducts ? 'All Products' : 'Selected Products'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{discount.discountPercentage}% off</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isDiscountActive(discount)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {isDiscountActive(discount) ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-4">
                            <Link
                              to={`/admin/discount/${discount._id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => deleteHandler(discount._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountListPage;
