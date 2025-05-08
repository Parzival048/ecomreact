import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import CartContext from '../context/CartContext';
import FeaturedDiscount from '../components/FeaturedDiscount';
import { FaSearch, FaArrowRight, FaArrowLeft, FaStar, FaTag, FaFire, FaShoppingCart } from 'react-icons/fa';

const HomePage = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [cartNotification, setCartNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [activeDiscounts, setActiveDiscounts] = useState([]);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';

  // Handle adding a product to cart
  const handleAddToCart = (product) => {
    const discount = getApplicableDiscount(product);
    const discountedPrice = calculateDiscountedPrice(product);

    // If there's a discount, pass the discounted price to the cart
    if (discount) {
      const productWithDiscount = {
        ...product,
        discountedPrice: parseFloat(discountedPrice),
        discountPercentage: discount.discountPercentage
      };
      addToCart(productWithDiscount, 1);
      setAddedProduct(productWithDiscount);
    } else {
      addToCart(product, 1);
      setAddedProduct(product);
    }

    setCartNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setCartNotification(false);
    }, 3000);
  };

  // Function to fetch active discounts
  const fetchActiveDiscounts = async () => {
    try {
      console.log('Fetching active discounts for homepage');
      const { data } = await axios.get('http://localhost:5000/api/discounts/active');
      console.log('Active discounts data:', data);
      setActiveDiscounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      setActiveDiscounts([]);
    }
  };

  // Function to check if a product has an applicable discount
  const getApplicableDiscount = (product) => {
    if (!activeDiscounts || activeDiscounts.length === 0) return null;

    // Find discounts that apply to this product
    const applicableDiscount = activeDiscounts.find(discount =>
      discount.applyToAllProducts ||
      (discount.applicableProducts && discount.applicableProducts.includes(product._id))
    );

    return applicableDiscount;
  };

  // Function to calculate discounted price
  const calculateDiscountedPrice = (product) => {
    const discount = getApplicableDiscount(product);
    if (!discount) return null;

    return (product.price - (product.price * (discount.discountPercentage / 100))).toFixed(2);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Update active category based on URL parameter
        if (category) {
          setActiveCategory(category);
        } else {
          setActiveCategory('All Products');
        }

        // Build API URL with filters
        let url = `http://localhost:5000/api/products?`;
        if (keyword) {
          url += `keyword=${keyword}&`;
        }
        if (category) {
          url += `category=${category}&`;
        }

        const { data } = await axios.get(url);
        setProducts(data.products);

        // Set featured products (top 5 products)
        if (!keyword && !category && data.products.length > 0) {
          // In a real app, you might have a specific API endpoint for featured products
          // Here we're just using the first 5 products as featured
          setFeaturedProducts(data.products.slice(0, 5));
        }

        // Fetch active discounts
        await fetchActiveDiscounts();

        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || 'Failed to fetch products'
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Preserve category when searching
    const params = {};

    if (searchTerm.trim()) {
      params.keyword = searchTerm;
    }

    if (category) {
      params.category = category;
    }

    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Cart Notification */}
      {cartNotification && addedProduct && (
        <div className="fixed top-24 right-4 bg-white rounded-lg shadow-lg p-4 z-50 border-l-4 border-green-500 max-w-md animate-slideIn">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full">
              <FaShoppingCart className="text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Added to Cart!</h3>
              <p className="text-sm text-gray-600">{addedProduct.name}</p>
            </div>
            <button
              onClick={() => setCartNotification(false)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="mt-3 flex justify-end">
            <Link
              to="/cart"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}

      {/* Category Navigation */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          <button
            onClick={() => {
              setSearchParams({});
              setActiveCategory('All Products');
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium ${
              activeCategory === 'All Products'
                ? 'bg-gradient-to-r from-indigo-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => {
              setSearchParams({ category: 'Electronics' });
              setActiveCategory('Electronics');
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium ${
              activeCategory === 'Electronics'
                ? 'bg-gradient-to-r from-indigo-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Electronics
          </button>
          <button
            onClick={() => {
              setSearchParams({ category: 'Clothing' });
              setActiveCategory('Clothing');
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium ${
              activeCategory === 'Clothing'
                ? 'bg-gradient-to-r from-indigo-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Clothing
          </button>
          <button
            onClick={() => {
              setSearchParams({ category: 'Home & Kitchen' });
              setActiveCategory('Home & Kitchen');
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium ${
              activeCategory === 'Home & Kitchen'
                ? 'bg-gradient-to-r from-indigo-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Home & Kitchen
          </button>
          <button
            onClick={() => {
              setSearchParams({ category: 'Beauty' });
              setActiveCategory('Beauty');
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium ${
              activeCategory === 'Beauty'
                ? 'bg-gradient-to-r from-indigo-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Beauty
          </button>
          <button
            onClick={() => {
              setSearchParams({ category: 'Sports' });
              setActiveCategory('Sports');
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium ${
              activeCategory === 'Sports'
                ? 'bg-gradient-to-r from-indigo-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Sports
          </button>
          <button
            onClick={() => {
              setSearchParams({ category: 'Books' });
              setActiveCategory('Books');
            }}
            className={`whitespace-nowrap px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium ${
              activeCategory === 'Books'
                ? 'bg-gradient-to-r from-indigo-600 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Books
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-orange-500 rounded-2xl shadow-xl mb-12 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="p-8 md:p-12 md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome to EShop</h1>
            <p className="text-indigo-100 mb-6">Discover amazing products at unbeatable prices. Shop now and enjoy free shipping on all orders!</p>
            <form onSubmit={handleSearch} className="flex w-full max-w-md bg-white rounded-lg overflow-hidden shadow-lg p-1">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-3 w-full border-none focus:outline-none focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-orange-500 text-white px-6 py-3 rounded-md hover:from-indigo-700 hover:to-orange-600 flex items-center transition-all duration-200"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          <div className="md:w-1/2 p-6 md:p-0">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Shopping"
              className="rounded-lg shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Featured Products Carousel */}
      {!keyword && featuredProducts.length > 0 && (
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent flex items-center">
              <FaFire className="mr-3 text-orange-500" /> Featured Products
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentSlide(prev => (prev === 0 ? featuredProducts.length - 1 : prev - 1))}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200"
                aria-label="Previous slide"
              >
                <FaArrowLeft className="text-gray-700" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1))}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200"
                aria-label="Next slide"
              >
                <FaArrowRight className="text-gray-700" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredProducts.map((product) => (
                <div key={product._id} className="min-w-full">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/2 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 md:h-96 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                          <FaTag className="mr-1" /> Featured
                        </div>
                        {getApplicableDiscount(product) && (
                          <div className="absolute top-14 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                            <FaTag className="mr-1" /> {getApplicableDiscount(product).discountPercentage}% OFF
                          </div>
                        )}
                      </div>
                      <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                          <div className="flex items-center mb-4">
                            <div className="flex text-yellow-500 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"} />
                              ))}
                            </div>
                            <span className="text-gray-600">({product.numReviews} reviews)</span>
                          </div>
                          <p className="text-gray-600 mb-6 line-clamp-3">{product.description || "Experience the amazing features of this high-quality product designed to meet your needs."}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            {getApplicableDiscount(product) ? (
                              <div>
                                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                                  ${calculateDiscountedPrice(product)}
                                </span>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ${product.price.toFixed(2)}
                                </span>
                                <div className="flex items-center mt-1">
                                  <FaTag className="text-red-500 text-xs mr-1" />
                                  <span className="text-xs font-semibold text-red-500">
                                    {getApplicableDiscount(product).discountPercentage}% OFF
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                            {product.countInStock > 0 ? (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">In Stock</span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Out of Stock</span>
                            )}
                          </div>
                          <div className="flex space-x-4">
                            <Link
                              to={`/product/${product._id}`}
                              className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-lg flex-1 text-center font-medium transition-colors duration-200"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-gradient-to-r from-indigo-600 to-orange-500 hover:from-indigo-700 hover:to-orange-600 text-white px-6 py-2 rounded-lg flex-1 font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                              disabled={product.countInStock === 0}
                            >
                              <FaShoppingCart className="mr-2" /> Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deal of the Day */}
      {!keyword && products.length > 0 && (
        <FeaturedDiscount />
      )}

      {/* Products Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
            Latest Products
          </h2>

          {keyword && (
            <button
              onClick={() => {
                // Preserve category when clearing search
                if (category) {
                  setSearchParams({ category });
                } else {
                  setSearchParams({});
                }
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg flex items-center transition-all duration-200 shadow-sm"
            >
              <span className="mr-2">←</span> Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="error">{error}</Message>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                  alt="No products"
                  className="w-32 h-32 mx-auto mb-6 opacity-50"
                />
                <Message>No products found matching your search criteria</Message>
                <p className="mt-4 text-gray-500">Try using different keywords or browse our categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Features Section */}
      {!keyword && !loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-start hover:shadow-lg transition-shadow duration-300">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">We ensure that all our products meet the highest quality standards.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start hover:shadow-lg transition-shadow duration-300">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your products delivered to your doorstep within 2-3 business days.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start hover:shadow-lg transition-shadow duration-300">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">All transactions are secure and your information is protected.</p>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Subscription */}
      {!keyword && (
        <div className="mb-16 bg-gradient-to-r from-indigo-600 to-orange-500 rounded-xl p-8 shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-indigo-100 mb-8">Stay updated with the latest products, exclusive offers, and discounts.</p>
            <form className="flex flex-col sm:flex-row max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-lg sm:rounded-r-none flex-1 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="mt-3 sm:mt-0 bg-white text-indigo-600 font-medium px-6 py-3 rounded-lg sm:rounded-l-none hover:bg-gray-100 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-indigo-100 mt-4">By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time.</p>
          </div>
        </div>
      )}

      {/* Brand Showcase */}
      {!keyword && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Trusted by Top Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Samsung_logo_%28blue%29.svg" alt="Samsung" className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/85/Sony_logo.svg" alt="Sony" className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
