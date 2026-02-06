import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiZoomIn, HiX, HiPlus, HiMinus } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; //motion
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getProductById, getProductsByCategory, loading } = useProducts();
  
  const product = getProductById(id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('S');
  const [showModal, setShowModal] = useState(false); 
  const [modalZoom, setModalZoom] = useState(1);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Loading product...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Product not found
            </h2>
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              The product you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const productDetail = {
  ...product,
  images: [
    // 1. Start with the main image
    product.image,
    // 2. Add the hover image ONLY if it exists and is different from the main image
    ...(product.hoverImage && product.hoverImage !== product.image ? [product.hoverImage] : []),
    // 3. Add any other images from the array, but filter out the main one so it doesn't repeat
    ...(product.images || []).filter(img => img !== product.image && img !== product.hoverImage)
  ].filter(Boolean), // 4. Final safety check: removes any "null" or "undefined" entries
  
  sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL']
};

  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 8);

  const handleWhatsAppOrder = () => {
    const phoneNumber = '+251988503333'; 
    const message = encodeURIComponent(
      `Hi Diamond Design!\n\nI want to order:\nProduct: ${productDetail.name}\nSize: ${selectedSize}\nPrice: $${productDetail.price}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(productDetail, selectedSize);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* FULL SCREEN MODAL SECTION */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"
          >
            <div className="absolute top-6 right-6 flex gap-4 z-[110]">
              <button onClick={() => setModalZoom(prev => Math.min(prev + 0.5, 3))} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"><HiPlus className="w-6 h-6" /></button>
              <button onClick={() => setModalZoom(prev => Math.max(prev - 0.5, 1))} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"><HiMinus className="w-6 h-6" /></button>
              <button onClick={() => { setShowModal(false); setModalZoom(1); }} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"><HiX className="w-6 h-6" /></button>
            </div>
            <div className="w-full h-full overflow-auto flex items-center justify-center cursor-grab active:cursor-grabbing">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: modalZoom }}
                src={productDetail.images[selectedImage]}
                alt="Zoomed"
                className="transition-transform duration-300 ease-out"
                style={{ 
                  maxHeight: modalZoom > 1 ? 'none' : '90vh',
                  maxWidth: modalZoom > 1 ? 'none' : '90vw'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: IMAGE GALLERY (5/12 SIZE) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 w-full"
          >
            <div className="relative bg-gray-100 overflow-hidden mb-4 cursor-pointer group" onClick={() => setShowModal(true)}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={productDetail.images[selectedImage]} 
                  alt={productDetail.name} 
                  className="w-full aspect-[3/4] object-cover" 
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 flex items-start justify-start p-4">
                <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <HiZoomIn className="w-6 h-6 text-brand" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {productDetail.images.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(index)} className={`aspect-square overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-brand' : 'border-gray-200 hover:border-brand'}`}>
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: INFO SECTION (7/12 SIZE) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7"
          >
            <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>{productDetail.name}</motion.h1>
            <motion.p variants={fadeUp} className="text-4xl font-bold text-brand mb-8" style={{ fontFamily: 'Roboto, sans-serif' }}>${productDetail.price}</motion.p>
            
            <motion.div variants={fadeUp} className="mb-10 max-w-2xl">
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                {productDetail.description || "Beautiful handcrafted Ethiopian traditional dress featuring intricate embroidery and premium fabric. Perfect for special occasions and cultural celebrations. Each piece is carefully crafted by skilled artisans."}
              </p>
            </motion.div>

            {/* SIZE CIRCLES */}
            <motion.div variants={fadeUp} className="mb-12">
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {productDetail.sizes.map((size) => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)} 
                    className={`w-11 h-11 rounded-full border-2 font-semibold transition-all flex items-center justify-center text-sm ${selectedSize === size ? 'border-brand bg-brand text-white shadow-md' : 'border-gray-300 text-gray-700 hover:border-brand'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* PILL BUTTONS */}
            <motion.div variants={fadeUp} className="space-y-4 w-full max-w-2xl">
              <button onClick={handleAddToCart} className="w-full bg-brand text-white py-5 rounded-full font-bold hover:bg-brand-dark transition-all shadow-xl uppercase tracking-widest active:scale-[0.98]">Add to Cart</button>
              <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] text-white py-5 rounded-full font-bold hover:bg-[#20ba59] transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest active:scale-[0.98]">
                <FaWhatsapp className="w-6 h-6" /> Order via WhatsApp
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="bg-gray-50 py-20 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-10" 
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              You May Also Like
            </motion.h2>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {relatedProducts.map((relProduct) => (
                <motion.div 
                  key={relProduct.id} 
                  variants={fadeUp}
                  className="cursor-pointer group" 
                  onClick={() => { navigate(`/product/${relProduct.id}`); window.scrollTo(0, 0); }}
                >
                  <div className="bg-white overflow-hidden shadow-sm mb-4">
                    <img src={relProduct.image} alt={relProduct.name} className="w-full aspect-[3/4] object-cover group-hover:opacity-80 transition-opacity" />
                  </div>
                  <h3 className="text-gray-700 text-sm mb-1 line-clamp-2" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>{relProduct.name}</h3>
                  <p className="text-gray-900 font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>${relProduct.price}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
