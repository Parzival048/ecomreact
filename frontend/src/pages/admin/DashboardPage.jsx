import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign, FaEdit, FaTrash, FaPlus, FaTag } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import AdminNav from '../../components/AdminNav';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    userCount: 0,
    orderCount: 0,
    productCount: 0,
    totalSales: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchStats();
      fetchRecentOrders();
    }
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch users count
      const usersConfig = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data: users } = await axios.get('http://localhost:5000/api/users', usersConfig);

      // Fetch orders
      const ordersConfig = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data: orders } = await axios.get('http://localhost:5000/api/orders', ordersConfig);

      // Fetch products
      const { data: productsData } = await axios.get('http://localhost:5000/api/products');
      const products = productsData.products;

      // Calculate total sales
      const totalSales = orders.reduce((sum, order) => {
        return order.isPaid ? sum + Number(order.totalPrice) : sum;
      }, 0);

      setStats({
        userCount: users.length,
        orderCount: orders.length,
        productCount: products.length,
        totalSales,
      });

      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      setLoadingOrders(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('http://localhost:5000/api/orders', config);

      // Sort by date and get the 5 most recent orders
      const sortedOrders = [...data].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }).slice(0, 5);

      setRecentOrders(sortedOrders);
      setLoadingOrders(false);
    } catch (error) {
      setErrorOrders(error.response?.data?.message || 'Failed to fetch recent orders');
      setLoadingOrders(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AdminNav />
        </div>
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Total Users</h2>
                <p className="text-2xl font-bold">{stats.userCount}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <FaShoppingCart className="text-green-600 text-xl" />
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Total Orders</h2>
                <p className="text-2xl font-bold">{stats.orderCount}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <FaBox className="text-purple-600 text-xl" />
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Total Products</h2>
                <p className="text-2xl font-bold">{stats.productCount}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <FaDollarSign className="text-yellow-600 text-xl" />
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Total Sales</h2>
                <p className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <Link to="/admin/orders" className="text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>

                {loadingOrders ? (
                  <Loader />
                ) : errorOrders ? (
                  <Message variant="error">{errorOrders}</Message>
                ) : recentOrders.length === 0 ? (
                  <Message>No orders found</Message>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            USER
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DATE
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TOTAL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PAID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DELIVERED
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.user?.name || 'User deleted'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${Number(order.totalPrice).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.isPaid ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {new Date(order.paidAt).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Not Paid
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.isDelivered ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {new Date(order.deliveredAt).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Not Delivered
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                to={`/order/${order._id}`}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Quick Links</h2>
                </div>
                <div className="space-y-4">
                  <Link
                    to="/admin/users"
                    className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    <FaUsers className="mr-3 text-blue-600" />
                    Manage Users
                  </Link>
                  <Link
                    to="/admin/products"
                    className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    <FaBox className="mr-3 text-purple-600" />
                    Manage Products
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    <FaShoppingCart className="mr-3 text-green-600" />
                    Manage Orders
                  </Link>
                  <Link
                    to="/admin/discounts"
                    className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    <FaTag className="mr-3 text-red-500" />
                    Manage Discounts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
