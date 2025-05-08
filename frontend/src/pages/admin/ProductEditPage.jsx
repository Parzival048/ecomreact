import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import AdminNav from '../../components/AdminNav';

const ProductEditPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      if (id !== 'new') {
        fetchProductDetails();
      }
    }
  }, [user, navigate, id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);

      setName(data.name);
      setPrice(data.price);
      setImage(data.image);
      setBrand(data.brand);
      setCategory(data.category);
      setCountInStock(data.countInStock);
      setDescription(data.description);

      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch product details');
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
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

      const productData = {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      };

      if (id === 'new') {
        await axios.post('http://localhost:5000/api/products', productData, config);
      } else {
        await axios.put(`http://localhost:5000/api/products/${id}`, productData, config);
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
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
          <Link to="/admin/products" className="flex items-center text-blue-600 mb-4">
            <FaArrowLeft className="mr-1" /> Back to Products
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">
              {id === 'new' ? 'Create Product' : 'Edit Product'}
            </h1>

            {loading && <Loader />}
            {error && <Message variant="error">{error}</Message>}
            {success && <Message variant="success">Product saved successfully!</Message>}

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
                <label htmlFor="price" className="block mb-2">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block mb-2">
                  Image
                </label>
                <input
                  type="text"
                  id="image"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="file"
                  id="image-file"
                  onChange={uploadFileHandler}
                  className="mt-2"
                />
                {uploading && <Loader />}
              </div>

              <div className="mb-4">
                <label htmlFor="brand" className="block mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="countInStock" className="block mb-2">
                  Count In Stock
                </label>
                <input
                  type="number"
                  id="countInStock"
                  placeholder="Enter count in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
