import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderListPage from './pages/admin/OrderListPage';
import UserListPage from './pages/admin/UserListPage';
import UserEditPage from './pages/admin/UserEditPage';
import DiscountListPage from './pages/admin/DiscountListPage';
import DiscountEditPage from './pages/admin/DiscountEditPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/placeorder" element={<PlaceOrderPage />} />
                <Route path="/order/:id" element={<OrderPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><ProductListPage /></AdminRoute>} />
                <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><OrderListPage /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserListPage /></AdminRoute>} />
                <Route path="/admin/user/:id/edit" element={<AdminRoute><UserEditPage /></AdminRoute>} />
                <Route path="/admin/discounts" element={<AdminRoute><DiscountListPage /></AdminRoute>} />
                <Route path="/admin/discount/:id/edit" element={<AdminRoute><DiscountEditPage /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
