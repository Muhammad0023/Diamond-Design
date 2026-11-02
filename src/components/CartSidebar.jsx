'use client'
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { IoClose } from 'react-icons/io5';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import { FaCreditCard } from 'react-icons/fa';

export default function CartSidebar() {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    toggleCart
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    toggleCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      ></div>

      {/* Cart Sidebar — full width on all screen sizes, plain white background */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col overflow-hidden ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-50">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Shopping Cart
          </h2>
          <button onClick={toggleCart} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close cart">
            <IoClose className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full scrollbar-hide">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '400' }}>
                Add some beautiful styles to get started!
              </p>
              <button
                onClick={toggleCart}
                className="bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                  <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3
                      className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Size: {item.size}{item.customMeasurements ? ' (custom fit)' : ''}
                    </p>
                    <p className="text-brand font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      ${item.price}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <HiMinus className="w-4 h-4 text-gray-800" />
                        </button>
                        <span className="px-4 font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <HiPlus className="w-4 h-4 text-gray-800" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 text-gray-500 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="flex-none border-t border-gray-200 p-6 bg-white sticky bottom-0 z-10 max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Subtotal
              </span>
              <span className="text-2xl font-semibold text-brand" style={{ fontFamily: 'Roboto, sans-serif' }}>
                ${getCartTotal()}
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-brand text-white py-4 rounded-xl font-bold hover:brightness-90 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '1px' }}
              >
                <FaCreditCard className="w-5 h-5" />
                Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-white text-gray-800 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
