import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiZoomIn, HiX, HiPlus, HiMinus } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { sampleProducts } from './HomePage';

// ALL CATEGORIES RESTORED
const allProducts = [
  ...sampleProducts.latest,
  ...sampleProducts.simple,
  ...sampleProducts.wedding,
  ...sampleProducts.chiffon,
  ...sampleProducts.holidays,
  ...sampleProducts.group,
  ...sampleProducts.mens,
  ...sampleProducts.couples,
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = allProducts.find(p => p.id === parseInt(id));
  
  const [selectedImage, setSelectedImage] = useState(0);
  
  // UPDATED: Default size set to 'S'
  const [selectedSize, setSelectedSize] = useState('S');
  
  const [showModal, setShowModal] = useState(false); 
  const [modalZoom, setModalZoom] = useState(1);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  if (!product) {
    navigate('/');
    return null;
  }

  const productDetail = {
    ...product,
    description: "Beautiful handcrafted Ethiopian traditional dress featuring intricate embroidery and premium fabric. Perfect for special occasions and cultural celebrations. Each piece is carefully crafted by skilled artisans.",
    images: [
      product.image,
      product.hoverImage || product.image,
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1200",
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=1200"
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  };

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  const handleWhatsAppOrder = () => {
    const phoneNumber = '251911234567'; 
    const message = encodeURIComponent(
      `Hi Diamond Design!\n\nI want to order:\nProduct: ${productDetail.name}\nSize: ${selectedSize}\nPrice: $${productDetail.price}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleAddToCart = () => {
    // No need for the "if(!selectedSize)" check anymore since it defaults to 'S'!
    addToCart(productDetail, selectedSize);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* FULL SCREEN MODAL SECTION */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="absolute top-6 right-6 flex gap-4 z-[110]">
            <button onClick={() => setModalZoom(prev => Math.min(prev + 0.5, 3))} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"><HiPlus className="w-6 h-6" /></button>
            <button onClick={() => setModalZoom(prev => Math.max(prev - 0.5, 1))} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"><HiMinus className="w-6 h-6" /></button>
            <button onClick={() => { setShowModal(false); setModalZoom(1); }} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"><HiX className="w-6 h-6" /></button>
          </div>
          <div className="w-full h-full overflow-auto flex items-center justify-center cursor-grab active:cursor-grabbing">
            <img
              src={productDetail.images[selectedImage]}
              alt="Zoomed"
              className="transition-transform duration-300 ease-out"
              style={{ 
                transform: `scale(${modalZoom})`,
                maxHeight: modalZoom > 1 ? 'none' : '90vh',
                maxWidth: modalZoom > 1 ? 'none' : '90vw'
              }}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: IMAGE GALLERY (5/12 SIZE) */}
          <div className="lg:col-span-5 w-full">
            <div className="relative bg-gray-100 overflow-hidden mb-4 cursor-pointer group" onClick={() => setShowModal(true)}>
              <img src={productDetail.images[selectedImage]} alt={productDetail.name} className="w-full aspect-[3/4] object-cover" />
              
              {/* ICON POSITIONED AT TOP LEFT */}
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
          </div>

          {/* RIGHT: INFO SECTION (7/12 SIZE) */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>{productDetail.name}</h1>
            <p className="text-4xl font-bold text-brand mb-8" style={{ fontFamily: 'Roboto, sans-serif' }}>${productDetail.price}</p>
            <div className="mb-10 max-w-2xl">
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>{productDetail.description}</p>
            </div>

            {/* SIZE CIRCLES */}
            <div className="mb-12">
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
            </div>

            {/* PILL BUTTONS */}
            <div className="space-y-4 w-full max-w-2xl">
              <button onClick={handleAddToCart} className="w-full bg-brand text-white py-5 rounded-full font-bold hover:bg-brand-dark transition-all shadow-xl uppercase tracking-widest">Add to Cart</button>
              <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] text-white py-5 rounded-full font-bold hover:bg-[#20ba59] transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest">
                <FaWhatsapp className="w-6 h-6" /> Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="bg-gray-50 py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10" style={{ fontFamily: 'Roboto, sans-serif' }}>You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relProduct) => (
              <div key={relProduct.id} className="cursor-pointer group" onClick={() => { navigate(`/product/${relProduct.id}`); window.scrollTo(0, 0); }}>
                <div className="bg-white overflow-hidden shadow-sm mb-4">
                  <img src={relProduct.image} alt={relProduct.name} className="w-full aspect-[3/4] object-cover group-hover:opacity-80 transition-opacity" />
                </div>
                <h3 className="text-gray-700 text-sm mb-1 line-clamp-2" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>{relProduct.name}</h3>
                <p className="text-gray-900 font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>${relProduct.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
