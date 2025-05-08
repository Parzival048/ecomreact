import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-orange-400 bg-clip-text text-transparent">EShop</h3>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Your one-stop shop for all your shopping needs. Quality products at
              affordable prices with worldwide shipping.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 bg-gray-700 hover:bg-indigo-600 p-2 rounded-full">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 bg-gray-700 hover:bg-indigo-600 p-2 rounded-full">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 bg-gray-700 hover:bg-indigo-600 p-2 rounded-full">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 bg-gray-700 hover:bg-indigo-600 p-2 rounded-full">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FaArrowRight className="mr-2 text-xs text-indigo-400" />
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FaArrowRight className="mr-2 text-xs text-indigo-400" />
                  Featured Items
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FaArrowRight className="mr-2 text-xs text-indigo-400" />
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FaArrowRight className="mr-2 text-xs text-indigo-400" />
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FaArrowRight className="mr-2 text-xs text-indigo-400" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FaArrowRight className="mr-2 text-xs text-indigo-400" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FaArrowRight className="mr-2 text-xs text-indigo-400" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FaArrowRight className="mr-2 text-xs text-indigo-400" />
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-indigo-400" />
                <span className="text-gray-300">123 Commerce St, Shopping City, SC 12345</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-indigo-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-indigo-400" />
                <span className="text-gray-300">support@eshop.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-300">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-md focus:outline-none text-gray-800 bg-gray-100 focus:bg-white transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-orange-500 px-4 py-2 rounded-r-md hover:from-indigo-700 hover:to-orange-600 transition-all duration-200"
                >
                  <FaArrowRight />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">&copy; {currentYear} EShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
