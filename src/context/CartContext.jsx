'use client'
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
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    const savedCart = localStorage.getItem('diamond_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('diamond_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart. customMeasurements is optional — when present,
  // this item is always added as a new line (never merged with an
  // existing one), since two custom-measurement orders of the same
  // size can still be genuinely different garments.
  const addToCart = (product, size, customMeasurements = null) => {
    if (!customMeasurements) {
      const existingItemIndex = cartItems.findIndex(
        item => item.id === product.id && item.size === size && !item.customMeasurements
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += 1;
        setCartItems(updatedCart);
        setIsCartOpen(true);
        return;
      }
    }

    const newItem = {
      ...product,
      size,
      customMeasurements,
      quantity: 1,
      cartItemId: `${product.id}-${size}-${Date.now()}`
    };
    setCartItems([...cartItems, newItem]);
    setIsCartOpen(true);
  };

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

  const removeFromCart = (cartItemId) => {
    setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
    localStorage.removeItem('diamond_cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

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
