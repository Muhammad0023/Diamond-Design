import { useCart } from '../context/CartContext';
import { IoClose } from 'react-icons/io5';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

export default function CartSidebar() {
  const { 
    cartItems, 
    isCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    toggleCart 
  } = useCart();

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const phoneNumber = '251911234567'; // UPDATE WITH YOUR NUMBER
    
    // Build order message
    let message = 'Hi Diamond Design!\n\nI want to order:\n\n';
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Size: ${item.size}\n`;
      message += `   Qty: ${item.quantity}\n`;
      message += `   Price: $${item.price * item.quantity}\n\n`;
    });
    
    message += `Total: $${getCartTotal()}\n\n`;
    message += 'Please confirm availability and delivery details.';
    
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    // Clear cart after sending
    setTimeout(() => {
      clearCart();
    }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      ></div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Shopping Cart
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <IoClose className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                Add some beautiful items to get started!
              </p>
              <button
                onClick={toggleCart}
                className="bg-brand text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Cart Items List
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 
                      className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                      Size: {item.size}
                    </p>
                    <p className="text-brand font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      ${item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <HiMinus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-4 font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <HiPlus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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

        {/* Footer - Only show if cart has items */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Subtotal
              </span>
              <span className="text-2xl font-bold text-brand" style={{ fontFamily: 'Roboto, sans-serif' }}>
                ${getCartTotal()}
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-[#25D366] text-white py-4 rounded-full font-bold hover:bg-[#20ba59] transition-colors shadow-lg flex items-center justify-center gap-2"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <FaWhatsapp className="w-5 h-5" />
                Checkout via WhatsApp
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
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
