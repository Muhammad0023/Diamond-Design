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

    const phoneNumber = '+251988503333';
    const baseUrl = window.location.origin; // Gets your website domain
    
    // Build order message
    let message = 'Hi Diamond Design! 👋\n' +
      'I\'d like to order these designs:\n\n';

    cartItems.forEach((item, index) => {
      const productLink = `${baseUrl}/product/${item.slug}`;
      message += `💎 Item ${index + 1}: ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | Price: $${item.price * item.quantity} 🔗 ${productLink}\n`;
    });

    message += `\n— Total: $${getCartTotal()} —\n\n`;
    message += 'Is this available?';

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Optional: Clear cart after a delay
    setTimeout(() => { 
      clearCart(); 
      toggleCart();
    }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      ></div>

      {/* Cart Sidebar Wrapper - Glassmorphism Base */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white/40 backdrop-blur-2xl border-l border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] z-50 transform transition-transform duration-300 flex flex-col overflow-hidden ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header - Glassmorphism */}
        <div className="flex-none flex items-center justify-between p-6 border-b border-white/40 bg-white/30 sticky top-0 z-50">
          <h2 className="text-2xl font-bold text-gray-900 drop-shadow-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Shopping Cart
          </h2>
          <button onClick={toggleCart} className="p-2 rounded-full hover:bg-white/50 bg-white/20 border border-white/40 shadow-sm transition-colors">
            <IoClose className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4 drop-shadow-md">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 drop-shadow-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Your cart is empty
              </h3>
              <p className="text-gray-700 mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '400' }}>
                Add some beautiful styles to get started!
              </p>
              <button
                onClick={toggleCart}
                className="bg-brand text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors shadow-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Cart Items List
            <div className="space-y-4">
              {cartItems.map((item) => (
                // Glassmorphism Individual Item Card
                <div key={item.cartItemId} className="flex gap-4 bg-white/50 backdrop-blur-md border border-white/50 shadow-sm p-4 rounded-2xl">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-white/60 rounded-xl overflow-hidden border border-white/40 shadow-inner">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 
                      className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 drop-shadow-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Size: {item.size}
                    </p>
                    <p className="text-brand font-bold drop-shadow-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      ${item.price}
                    </p>

                    {/* Quantity Controls - Glassy */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-white/40 border border-white/60 rounded-lg shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-2 hover:bg-white/60 rounded-l-lg transition-colors"
                        >
                          <HiMinus className="w-4 h-4 text-gray-800" />
                        </button>
                        <span className="px-4 font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-2 hover:bg-white/60 rounded-r-lg transition-colors"
                        >
                          <HiPlus className="w-4 h-4 text-gray-800" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-white/60 rounded-lg border border-transparent hover:border-white/50 shadow-sm transition-all"
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

        {/* Footer - Glassmorphism */}
        {cartItems.length > 0 && (
          <div className="flex-none border-t border-white/40 p-6 bg-white/30 backdrop-blur-md sticky bottom-0 z-10">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900 drop-shadow-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Subtotal
              </span>
              <span className="text-2xl font-bold text-brand drop-shadow-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                ${getCartTotal()}
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppCheckout}
className="w-full bg-[#25D366] text-white py-4 rounded-full font-bold border border-white/60 hover:bg-[#20ba59] shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_0_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-2 backdrop-blur-sm drop-shadow-sm active:scale-[0.98]"
                style={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '1px' }}
              >
                <FaWhatsapp className="w-5 h-5" />
                Order With WhatsApp
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-white/50 text-gray-800 py-3 rounded-full font-semibold border border-white/60 hover:bg-white/70 shadow-sm transition-colors drop-shadow-sm"
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