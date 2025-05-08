import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import AdminNav from '../../components/AdminNav';

const ProductListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [user, navigate, deleteSuccess, createSuccess]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/products',
        {},
        config
      );

      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        navigate(`/admin/product/${data._id}/edit`);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create product');
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
            <h1 className="text-3xl font-bold">Products</h1>
            <button
              onClick={createProductHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
            >
              <FaPlus className="mr-2" /> Create Product
            </button>
          </div>

          {deleteSuccess && (
            <Message variant="success">Product deleted successfully</Message>
          )}
          {createSuccess && (
            <Message variant="success">Product created successfully</Message>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NAME
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PRICE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CATEGORY
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        BRAND
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/admin/product/${product._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="text-red-600 hover:text-red-900"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
