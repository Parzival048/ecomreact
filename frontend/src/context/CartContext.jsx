import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [itemsPrice, setItemsPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const cartFromStorage = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];
    const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {};
    const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : '';

    setCartItems(cartFromStorage);
    setShippingAddress(shippingAddressFromStorage);
    setPaymentMethod(paymentMethodFromStorage);
  }, []);

  // Calculate prices
  useEffect(() => {
    // Calculate items price
    const itemsPrice = cartItems.reduce(
      (acc, item) => {
        // Use discounted price if available
        const price = item.discountedPrice || item.price;
        return acc + price * item.qty;
      },
      0
    );
    setItemsPrice(itemsPrice);

    // Calculate shipping price (free shipping for orders over $100)
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    setShippingPrice(shippingPrice);

    // Calculate tax price (15% tax)
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    setTaxPrice(taxPrice);

    // Calculate total price
    const totalPrice = (
      Number(itemsPrice) +
      Number(shippingPrice) +
      Number(taxPrice)
    ).toFixed(2);
    setTotalPrice(totalPrice);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }

    // Save to localStorage
    localStorage.setItem(
      'cartItems',
      JSON.stringify(
        existItem
          ? cartItems.map((x) =>
              x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
            )
          : [...cartItems, { ...product, qty }]
      )
    );
  };

  // Update cart item quantity
  const updateCartItemQty = (id, qty) => {
    setCartItems(
      cartItems.map((item) => (item._id === id ? { ...item, qty } : item))
    );

    localStorage.setItem(
      'cartItems',
      JSON.stringify(
        cartItems.map((item) => (item._id === id ? { ...item, qty } : item))
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
    localStorage.setItem(
      'cartItems',
      JSON.stringify(cartItems.filter((item) => item._id !== id))
    );
  };

  // Save shipping address
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  // Save payment method
  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
