import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaEye, FaHeart, FaTag } from 'react-icons/fa';
import CartContext from '../context/CartContext';
import axios from 'axios';

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

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActiveDiscounts = async () => {
      try {
        setLoading(true);
        console.log('Fetching active discounts for products');
        const { data } = await axios.get('http://localhost:5000/api/discounts/active');
        console.log('Active discounts data:', data);
        setActiveDiscounts(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching discounts:', error);
        // Set empty array instead of showing error
        setActiveDiscounts([]);
        setLoading(false);
      }
    };

    fetchActiveDiscounts();
  }, []);

  // Check if product has an applicable discount
  const getApplicableDiscount = () => {
    if (!activeDiscounts || activeDiscounts.length === 0) return null;

    // Find discounts that apply to this product
    const applicableDiscount = activeDiscounts.find(discount =>
      discount.applyToAllProducts ||
      (discount.applicableProducts && discount.applicableProducts.includes(product._id))
    );

    return applicableDiscount;
  };

  const discount = getApplicableDiscount();
  const discountedPrice = discount
    ? (product.price - (product.price * (discount.discountPercentage / 100))).toFixed(2)
    : null;

  const handleAddToCart = () => {
    // If there's a discount, pass the discounted price to the cart
    if (discount) {
      const productWithDiscount = {
        ...product,
        discountedPrice: parseFloat(discountedPrice),
        discountPercentage: discount.discountPercentage
      };
      addToCart(productWithDiscount, 1);
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <div className="overflow-hidden h-56">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-56 object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
          </div>
          {product.countInStock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Out of Stock
            </div>
          )}
        </Link>

        <div className={`absolute right-2 top-2 flex flex-col space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <button
            className="bg-white text-gray-700 hover:text-indigo-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            title="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Wishlist functionality can be added here
            }}
            aria-label="Add to wishlist"
          >
            <FaHeart />
          </button>
          <Link
            to={`/product/${product._id}`}
            className="bg-white text-gray-700 hover:text-indigo-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            title="Quick view"
            onClick={(e) => {
              // Allow default behavior for this link
              e.stopPropagation();
            }}
            aria-label="Quick view"
          >
            <FaEye />
          </Link>
        </div>
      </div>

      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold mb-2 hover:text-indigo-600 transition-colors duration-200 line-clamp-2 h-14">
            {product.name}
          </h2>
        </Link>

        <Rating
          value={product.rating}
          text={`${product.numReviews} reviews`}
        />

        <div className="flex justify-between items-center mt-4">
          <div>
            {discount ? (
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                  ${discountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center mt-1">
                  <FaTag className="text-red-500 text-xs mr-1" />
                  <span className="text-xs font-semibold text-red-500">
                    {discount.discountPercentage}% OFF
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.countInStock === 0}
            className={`p-3 rounded-lg flex items-center transition-all duration-200 ${
              product.countInStock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-orange-500 hover:from-indigo-700 hover:to-orange-600 text-white shadow-md hover:shadow-lg cursor-pointer'
            }`}
            title={product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            aria-label="Add to Cart"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
