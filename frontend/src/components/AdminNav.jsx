import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaShoppingCart, FaBox, FaTag } from 'react-icons/fa';

const AdminNav = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Admin Navigation</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center p-2 rounded-md ${
                path === '/admin/dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FaTachometerAlt className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`flex items-center p-2 rounded-md ${
                path.includes('/admin/user')
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FaUsers className="mr-2" />
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className={`flex items-center p-2 rounded-md ${
                path.includes('/admin/product')
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FaBox className="mr-2" />
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              className={`flex items-center p-2 rounded-md ${
                path === '/admin/orders'
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FaShoppingCart className="mr-2" />
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/discounts"
              className={`flex items-center p-2 rounded-md ${
                path.includes('/admin/discount')
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FaTag className="mr-2" />
              Discounts
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminNav;
