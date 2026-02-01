import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  // 1. INITIALIZE FROM LOCAL STORAGE
  // Instead of starting with [], we check if there's a saved cart first
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('diamond_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. SAVE TO LOCAL STORAGE ON EVERY CHANGE
  // This "Watcher" saves the cart every time you add, remove, or update items
  useEffect(() => {
    localStorage.setItem('diamond_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, size) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.size === size
    );

    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // New item, add to cart
      const newItem = {
        ...product,
        size,
        quantity: 1,
        cartItemId: `${product.id}-${size}-${Date.now()}` 
      };
      setCartItems([...cartItems, newItem]);
    }

    // Open cart sidebar
    setIsCartOpen(true);
  };

  // Update quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.cartItemId === cartItemId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
    localStorage.removeItem('diamond_cart'); // Clean up storage too
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Toggle cart sidebar
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
