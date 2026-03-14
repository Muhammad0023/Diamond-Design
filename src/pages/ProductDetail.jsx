import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiZoomIn, HiX, HiPlus, HiMinus, HiShare } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { Helmet } from 'react-helmet-async';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, getProductsByCategory, loading } = useProducts();
  
  const getIdFromSlug = (slug) => {
    const parts = slug.split('-');
    return parts[parts.length - 1];
  };

  const productId = getIdFromSlug(slug);
  const product = products?.find(p => p.id === productId || p.slug === slug);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('S');
  const [showModal, setShowModal] = useState(false); 
  const [modalZoom, setModalZoom] = useState(1);
  const [shareCopied, setShareCopied] = useState(false);

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

 const handleWhatsAppOrder = () => {
    const phoneNumber = '+251988503333';
    const productUrl = window.location.href;
    const message = encodeURIComponent(
      `Hi Diamond Design! 👋\n` +
      `I'd like to order this design:\n\n` +
      `${productDetail.name} | Size: ${selectedSize} | Price: $${productDetail.price}\n\n` +
      `🔗 ${productUrl}\n\n` +
      `Is this available? 💎`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
              
  const handleAddToCart = () => {
    addToCart(productDetail, selectedSize);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${productDetail.name} | Diamond Design`,
      text: `Check out this beautiful Habesha style from Diamond Design! \u{1F1EA}\u{1F1F9}\u{200B} \u{1F1EA}\u{1F1F7}\u{200B} ✨`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      } catch (err) {}
    }
  };

 if (loading) {
    return (
      <div className="min-h-screen bg-white mt-20 lg:mt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* LEFT: Image skeleton */}
            <div className="lg:col-span-5 w-full">
              <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-sm mb-4" />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
                ))}
              </div>
            </div>

            {/* RIGHT: Info skeleton */}
            <div className="lg:col-span-7 space-y-6">
              {/* Title */}
              <div className="h-10 bg-gray-200 animate-pulse rounded-full w-3/4" />
              {/* Price */}
              <div className="h-8 bg-gray-200 animate-pulse rounded-full w-1/4" />
              {/* Description label */}
              <div className="h-5 bg-gray-200 animate-pulse rounded-full w-1/5" />
              {/* Description lines */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-full" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-5/6" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-4/6" />
              </div>
              {/* Size label */}
              <div className="h-5 bg-gray-200 animate-pulse rounded-full w-1/5" />
              {/* Size circles */}
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-11 h-11 bg-gray-200 animate-pulse rounded-full" />
                ))}
              </div>
              {/* Buttons */}
              <div className="space-y-4 pt-2">
                <div className="h-16 bg-gray-200 animate-pulse rounded-full w-full" />
                <div className="h-16 bg-gray-200 animate-pulse rounded-full w-full" />
                <div className="h-10 bg-gray-200 animate-pulse rounded-full w-1/3 mx-auto" />
              </div>
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
      product.image,
      ...(product.hoverImage && product.hoverImage !== product.image ? [product.hoverImage] : []),
      ...(product.images || []).filter(img => img !== product.image && img !== product.hoverImage)
    ].filter(Boolean),
    sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL']
  };

  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 8);

  return (
    <>
      <Helmet>
        <title>{productDetail.name} | Diamond Design</title>
        <meta name="description" content={`Shop ${productDetail.name} at Diamond Design. Premium handcrafted Habesha fashion.`} />
        <meta property="og:title" content={`${productDetail.name} - Diamond Design`} />
        <meta property="og:image" content={productDetail.image} />
        <meta property="og:type" content="product" />
      </Helmet>

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
                  alt={`${productDetail.name} - Full Screen View`}
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
                    alt={`${productDetail.name} - Featured Image`}
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
                    <img src={img} alt={`${productDetail.name} – view ${index + 1}`} className="w-full h-full object-cover" />
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
                  {productDetail.description || "Beautiful handcrafted Habes traditional dress featuring intricate embroidery and premium fabric."}
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

              {/* ✅ UI — Minimal Luxury */}
              <motion.div variants={fadeUp} className="space-y-4 w-full max-w-2xl">

                                          {/* ROW 1: Add to Cart — full width solid */}
                          <button 
                            onClick={handleAddToCart}
                            className="w-full bg-brand text-white py-5 rounded-full font-bold border border-white/60 hover:brightness-90 shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_0_rgba(37,211,102,0.5)] transition-all flex items-center justify-center uppercase tracking-widest active:scale-[0.98] backdrop-blur-sm drop-shadow-sm bg-gradient-to-b from-brand/80 to-brand"
                          >
                            Add to Cart
                          </button>

                {/* ROW 2: Order with WhatsApp — full width outlined green */}
                                      <button 
                        onClick={handleWhatsAppOrder} 
                       className="w-full bg-[#25D366] text-white py-5 rounded-full font-bold border border-white/60 hover:brightness-90 shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_0_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] active:scale-[0.98] backdrop-blur-sm drop-shadow-sm bg-gradient-to-b from-[#2edf6e] to-[#25D366]"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <FaWhatsapp className="w-6 h-6" /> Order with WhatsApp
                      </button>

                {/* ROW 3: Share This Style — subtle text link, no heavy button */}
                <div className="flex justify-center pt-1">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-400 hover:text-brand transition-all text-sm font-bold tracking-widest uppercase group px-6 py-3 rounded-full border border-white/60 bg-white/50 hover:bg-white/70 shadow-sm drop-shadow-sm backdrop-blur-sm active:scale-[0.98]"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <HiShare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {shareCopied ? 'Link Copied! ✓' : '↗ Share This Style'}
                  </button>
                </div>

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
                    onClick={() => { navigate(`/product/${relProduct.slug}`); window.scrollTo(0, 0); }}
                  >
                    <div className="bg-white overflow-hidden shadow-sm mb-4 relative">

                                {relProduct.hoverImage && relProduct.hoverImage !== relProduct.image ? (
  <>
    <img src={relProduct.image} alt={`${relProduct.name} - Related Product`}
      className="w-full aspect-[3/4] object-cover transition-all duration-500 absolute inset-0 group-hover:opacity-0 group-hover:scale-105"
    />
    <img src={relProduct.hoverImage} alt={`${relProduct.name} – hover`}
      className="w-full aspect-[3/4] object-cover transition-all duration-500 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100"
    />
  </>
) : (
  <img src={relProduct.image} alt={`${relProduct.name} - Related Product`}
    className="w-full aspect-[3/4] object-cover transition-all duration-500 group-hover:scale-110"
  />
)}
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
    </>
  );
}