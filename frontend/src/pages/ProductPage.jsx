import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center">
      <span>
        {value >= 1 ? (
          <FaStar className="text-yellow-500" />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt className="text-yellow-500" />
        ) : (
          <FaRegStar className="text-yellow-500" />
        )}
      </span>
      <span>
        {value >= 2 ? (
          <FaStar className="text-yellow-500" />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt className="text-yellow-500" />
        ) : (
          <FaRegStar className="text-yellow-500" />
        )}
      </span>
      <span>
        {value >= 3 ? (
          <FaStar className="text-yellow-500" />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt className="text-yellow-500" />
        ) : (
          <FaRegStar className="text-yellow-500" />
        )}
      </span>
      <span>
        {value >= 4 ? (
          <FaStar className="text-yellow-500" />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt className="text-yellow-500" />
        ) : (
          <FaRegStar className="text-yellow-500" />
        )}
      </span>
      <span>
        {value >= 5 ? (
          <FaStar className="text-yellow-500" />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt className="text-yellow-500" />
        ) : (
          <FaRegStar className="text-yellow-500" />
        )}
      </span>
      <span className="ml-1 text-sm">{text && text}</span>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || 'Failed to fetch product details'
        );
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, reviewSuccess]);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      setReviewError('Please select a rating');
      return;
    }

    try {
      setReviewSubmitLoading(true);
      setReviewError(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { rating, comment },
        config
      );

      setReviewSuccess(true);
      setRating(0);
      setComment('');
      setReviewSubmitLoading(false);
    } catch (error) {
      setReviewError(
        error.response?.data?.message || 'Failed to submit review'
      );
      setReviewSubmitLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-blue-600 hover:underline mb-6">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="mb-4">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </div>
              <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
              <p className="mb-4">{product.description}</p>

              {product.countInStock > 0 && (
                <div className="mb-4">
                  <label className="block mb-2">Quantity</label>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="border rounded p-2 w-full md:w-1/3"
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                      (x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`w-full md:w-auto px-6 py-3 rounded-md ${
                  product.countInStock === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              {product.reviews.length === 0 ? (
                <Message>No Reviews</Message>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="border-b pb-4">
                      <p className="font-bold">{review.name}</p>
                      <Rating value={review.rating} />
                      <p className="text-gray-600 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
              {reviewSuccess && (
                <Message variant="success">
                  Review submitted successfully!
                </Message>
              )}
              {user ? (
                <form onSubmit={submitReviewHandler}>
                  {reviewError && <Message variant="error">{reviewError}</Message>}
                  <div className="mb-4">
                    <label className="block mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="3"
                      className="border rounded p-2 w-full"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={reviewSubmitLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
                  >
                    {reviewSubmitLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <Message>
                  Please <Link to="/login" className="text-blue-600 hover:underline">sign in</Link> to write a review
                </Message>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
