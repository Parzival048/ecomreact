import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import AdminNav from '../../components/AdminNav';

const UserEditPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchUserDetails();
    }
  }, [user, navigate, id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5000/api/users/${id}`, config);

      setName(data.name);
      setEmail(data.email);
      setIsAdmin(data.isAdmin);

      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user details');
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { name, email, isAdmin },
        config
      );

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AdminNav />
        </div>
        <div className="md:col-span-3">
          <Link to="/admin/users" className="flex items-center text-blue-600 mb-4">
            <FaArrowLeft className="mr-1" /> Back to Users
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Edit User</h1>

            {loading && <Loader />}
            {error && <Message variant="error">{error}</Message>}
            {success && <Message variant="success">User updated successfully!</Message>}

            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-gray-900">
                    Admin User
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;
