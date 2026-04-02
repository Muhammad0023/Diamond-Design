'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HiOutlineMagnifyingGlassPlus } from 'react-icons/hi2';
import { HiZoomIn, HiX, HiShare } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../../context/CartContext'
import { useProducts } from '../../../../context/ProductsContext'


export default function ProductDetailClient({ slug }) {
  const router = useRouter()
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

  // Thumbnail carousel scroll ref
  const thumbsRef = useRef(null);

  // Ref for main image div — needed for non-passive wheel listener
  const mainImageRef = useRef(null);

  // Ref for modal scroll container — needed for non-passive wheel listener
  const modalScrollRef = useRef(null);

  // Keep a ref to total images count so the wheel handler can always read the latest value
  const totalImagesRef = useRef(1);

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
      setModalZoom(1);
      setPanPos({ x: 0, y: 0 });
      panOffset.current = { x: 0, y: 0 };
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Non-passive wheel listener on main image
  // Scroll down = next image, scroll up = prev image
  useEffect(() => {
    const el = mainImageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const total = totalImagesRef.current;
      if (e.deltaY > 0) {
        setSelectedImage(prev => (prev + 1) % total);
      } else {
        setSelectedImage(prev => (prev - 1 + total) % total);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Desktop mouse wheel zoom inside modal — non-passive to prevent page scroll
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => {
      const el = modalScrollRef.current;
      if (!el) return;
      
      const onWheel = (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          const zoomDelta = e.deltaY * -0.01; 
          setModalZoom(prev => Math.min(Math.max(prev + zoomDelta, 1), 4));
        }
      };
      
      el.addEventListener('wheel', onWheel, { passive: false });
      el._onWheel = onWheel;
    }, 50);
    
    return () => {
      clearTimeout(timer);
      const el = modalScrollRef.current;
      if (el && el._onWheel) {
        el.removeEventListener('wheel', el._onWheel);
        el._onWheel = null;
      }
    };
  }, [showModal]);

  // Touch swipe handlers for main image (mobile only)
  const touchStartX = useRef(null);
    // Mobile pinch-zoom refs
  const pinchStartDist = useRef(null);
  const pinchStartZoom = useRef(1);
  const panOffset = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const modalTouchStartX = useRef(null);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e, totalImages) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setSelectedImage(prev => (prev + 1) % totalImages);
      } else {
        setSelectedImage(prev => (prev - 1 + totalImages) % totalImages);
      }
    }
    touchStartX.current = null;
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = '+251988503333';
    const rawUrl = window.location.href;
    const brokenUrl = rawUrl.replace('https://', 'https://\u200B');
    const message = encodeURIComponent(
      `Hi Diamond Design! 👋\n` +
      `I'd like to order this design:\n\n` +
      `${productDetail.name} | Size: ${selectedSize} | Price: $${productDetail.price}\n\n` +
      `🔗 ${brokenUrl}\n\n` +
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
            <div className="lg:col-span-5 w-full">
              <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-sm mb-4" />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="h-10 bg-gray-200 animate-pulse rounded-full w-3/4" />
              <div className="h-8 bg-gray-200 animate-pulse rounded-full w-1/4" />
              <div className="h-5 bg-gray-200 animate-pulse rounded-full w-1/5" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-full" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-5/6" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-4/6" />
              </div>
              <div className="h-5 bg-gray-200 animate-pulse rounded-full w-1/5" />
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-11 h-11 bg-gray-200 animate-pulse rounded-full" />
                ))}
              </div>
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
              onClick={() => router.push('/')}
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

  // Keep totalImagesRef in sync so the wheel handler always has the latest count
  totalImagesRef.current = productDetail.images.length;

  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 8);

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* FULL SCREEN MODAL */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ zIndex: 99999, position: 'fixed', inset: 0, background: 'black' }}
            >
              {/* Close button */}
              <button
                onClick={() => { setShowModal(false); setModalZoom(1); }}
                className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md"
                style={{ zIndex: 100000 }}
              >
                <HiX className="w-6 h-6" />
              </button>

              {/* FIX 2: Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                 setSelectedImage(prev => (prev - 1 + productDetail.images.length) % productDetail.images.length);
                  setModalZoom(1);
                  setPanPos({ x: 0, y: 0 });
                  panOffset.current = { x: 0, y: 0 };
                }}
                className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md"
                style={{ zIndex: 100000 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* FIX 2: Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(prev => (prev + 1) % productDetail.images.length);
                  setModalZoom(1);
                  setPanPos({ x: 0, y: 0 });
                  panOffset.current = { x: 0, y: 0 };
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md"
                style={{ zIndex: 100000 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>

       {/* MOBILE: pinch-zoom + pan + swipe nav */}
<div
  ref={modalScrollRef}
  className={`w-full h-full overflow-auto flex ${modalZoom > 1 ? 'items-start justify-start' : 'items-center justify-center'}`}
  style={{ touchAction: 'none' }}
  onTouchStart={(e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist.current = Math.sqrt(dx * dx + dy * dy);
      pinchStartZoom.current = modalZoom;
    } else if (e.touches.length === 1) {
      if (modalZoom > 1) {
        panStart.current = {
          x: e.touches[0].clientX - panOffset.current.x,
          y: e.touches[0].clientY - panOffset.current.y,
        };
      } else {
        modalTouchStartX.current = e.touches[0].clientX;
      }
    }
  }}
  onTouchMove={(e) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchStartDist.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const newZoom = Math.min(Math.max((dist / pinchStartDist.current) * pinchStartZoom.current, 1), 4);
      setModalZoom(newZoom);
      if (newZoom <= 1) {
        panOffset.current = { x: 0, y: 0 };
        setPanPos({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && modalZoom > 1) {
      const newX = e.touches[0].clientX - panStart.current.x;
      const newY = e.touches[0].clientY - panStart.current.y;
      panOffset.current = { x: newX, y: newY };
      setPanPos({ x: newX, y: newY });
    }
  }}
  onTouchEnd={(e) => {
    if (e.changedTouches.length === 1 && modalZoom <= 1 && modalTouchStartX.current !== null) {
      const diff = modalTouchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          setSelectedImage(prev => (prev + 1) % productDetail.images.length);
        } else {
          setSelectedImage(prev => (prev - 1 + productDetail.images.length) % productDetail.images.length);
        }
        setPanPos({ x: 0, y: 0 });
        panOffset.current = { x: 0, y: 0 };
      }
    }
    pinchStartDist.current = null;
    modalTouchStartX.current = null;
  }}
>
  {/* ✅ ORIGINAL DESKTOP IMG — UNCHANGED */}
  <img
    src={productDetail.images[selectedImage]}
    alt="Zoomed View"
    style={{
      width: `${modalZoom * 100}%`,
      maxWidth: 'none',
      height: 'auto',
      display: 'block',
      cursor: modalZoom > 1 ? 'grab' : 'zoom-in',
    }}
    onClick={() => setModalZoom(prev => prev >= 3 ? 1 : prev + 1)}
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
              {/* Main image */}
              <div
                ref={mainImageRef}
                className="relative bg-gray-100 overflow-hidden mb-4 cursor-pointer group aspect-[3/4]"
                onClick={() => {
                  setModalZoom(1);
                  setShowModal(true);
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={(e) => handleTouchEnd(e, productDetail.images.length)}
              >
                <AnimatePresence initial={false}>
                  <motion.img 
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    src={productDetail.images[selectedImage]} 
                    alt={`${productDetail.name} - Featured`}
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                </AnimatePresence>
                <div className="absolute top-4 left-4 pointer-events-none z-10">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-sm">
                    <HiOutlineMagnifyingGlassPlus className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div> 

              {/* FIX 3: Added 'snap-x snap-mandatory' to parent and 'snap-start' to items for flawless mobile snapping */}
              <div
                ref={thumbsRef}
                className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {productDetail.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`snap-start flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all rounded-sm ${
                      selectedImage === index ? 'border-brand' : 'border-gray-200 hover:border-brand'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${productDetail.name} – view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
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
              <motion.h1 variants={fadeUp} className="text-3xl md:text-3xl font-medium text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>{productDetail.name}</motion.h1>
             <motion.p variants={fadeUp} className="text-2xl font-bold text-brand mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>${productDetail.price}</motion.p>
              <motion.div variants={fadeUp} className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold" style={{ backgroundColor: '#D4AF37' }}>
                  Free Shipping
                </span>
              </motion.div>
              
              <motion.div variants={fadeUp} className="mb-10 max-w-2xl">
                <h3 className="font-bold text-sm mb-2 text-gray-500 tracking-wider" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  ABOUT THIS STYLE
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                  {productDetail.description || "Beautiful handcrafted Habes traditional dress featuring intricate embroidery and premium fabric."}
                </p>
              </motion.div>

              {/* SIZE CIRCLES */}
             <motion.div variants={fadeUp} className="mb-12">
                <h3 
                  className="font-bold text-sm mb-4 text-gray-500 uppercase tracking-wider" 
                  style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Select Size
                </h3>
                        
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

                <Link href="/size-guide"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 rounded-sm hover:opacity-80"
                  style={{
                    color: '#b4b4b4',
                    backgroundColor: 'transparent',
                    fontFamily: 'Roboto, sans-serif',
                    letterSpacing: '0.1em',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D4AF3715'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="8" width="20" height="8" rx="1" />
                    <line x1="6" y1="8" x2="6" y2="12" />
                    <line x1="10" y1="8" x2="10" y2="11" />
                    <line x1="14" y1="8" x2="14" y2="11" />
                    <line x1="18" y1="8" x2="18" y2="12" />
                  </svg>
                  Size Chart
                </Link>
              </motion.div>

              {/* BUTTONS */}
              <motion.div variants={fadeUp} className="space-y-4 w-full max-w-2xl">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-brand text-white py-5 rounded-full font-bold border border-white/60 hover:brightness-90 shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_0_rgba(37,211,102,0.5)] transition-all flex items-center justify-center uppercase tracking-widest active:scale-[0.98] backdrop-blur-sm drop-shadow-sm bg-gradient-to-b from-brand/80 to-brand"
                >
                  Add to Cart
                </button>

                <button 
                  onClick={handleWhatsAppOrder} 
                  className="w-full bg-[#25D366] text-white py-5 rounded-full font-bold border border-white/60 hover:brightness-90 shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_0_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] active:scale-[0.98] backdrop-blur-sm drop-shadow-sm bg-gradient-to-b from-[#2edf6e] to-[#25D366]"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <FaWhatsapp className="w-6 h-6" /> Order with WhatsApp
                </button>

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
                className="text-2xl md:text-3xl font-medium text-gray-900 mb-10" 
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
                    onClick={() => { router.push(`/product/${relProduct.slug}`); window.scrollTo(0, 0); }}
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
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-white text-[10px] font-semibold" style={{ backgroundColor: '#D4AF37' }}>
                      Free Shipping
                    </span>
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