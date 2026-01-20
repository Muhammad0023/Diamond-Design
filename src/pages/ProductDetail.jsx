import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiZoomIn } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { sampleProducts } from './HomePage';

// Get all products in a single array
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
  
  // Find product by ID
  const product = allProducts.find(p => p.id === parseInt(id));
  
  // If product not found, redirect to homepage
  if (!product) {
    navigate('/');
    return null;
  }

  // Enhance product with detail data
  const productDetail = {
    ...product,
    availability: "In Stock",
    description: "Beautiful handcrafted Ethiopian traditional dress featuring intricate embroidery and premium fabric. Perfect for special occasions and cultural celebrations. Each piece is carefully crafted by skilled artisans.",
    material: "Premium cotton blend with silk embroidery",
    care: "Hand wash only, dry in shade, iron on low heat",
    images: [
      product.image,
      product.hoverImage || product.image,
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800",
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800"
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  };

  // Get related products from same category
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);

  const handleWhatsAppOrder = () => {
    const phoneNumber = '251911234567'; // UPDATE WITH YOUR NUMBER
    const message = encodeURIComponent(
      `Hi Diamond Design!\n\nI want to order:\nProduct: ${productDetail.name}\nSize: ${selectedSize || 'Not selected'}\nPrice: $${productDetail.price}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first!');
      return;
    }
    
    // Add to cart using context
    addToCart(productDetail, selectedSize);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-brand transition-colors"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          <HiArrowLeft className="w-5 h-5" />
          Back to Shop
        </button>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image with Zoom */}
            <div 
              className="relative bg-gray-100 overflow-hidden mb-4 cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={productDetail.images[selectedImage]}
                alt={productDetail.name}
                className={`w-full aspect-[3/4] object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              />
              {isZoomed && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <HiZoomIn className="w-4 h-4" />
                  Zoomed
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {productDetail.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-brand' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              {productDetail.name}
            </h1>

            {/* Price */}
            <p className="text-4xl font-bold text-brand mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
              ${productDetail.price}
            </p>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-green-600 font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {productDetail.availability}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Description</h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                {productDetail.description}
              </p>
            </div>

            {/* Material */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>Material</h3>
              <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                {productDetail.material}
              </p>
            </div>

            {/* Care Instructions */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>Care Instructions</h3>
              <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                {productDetail.care}
              </p>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>Select Size</h3>
              <div className="flex gap-3">
                {productDetail.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-brand bg-brand text-white'
                        : 'border-gray-300 text-gray-700 hover:border-brand'
                    }`}
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-brand text-white py-4 font-bold hover:bg-brand-dark transition-colors shadow-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Add to Cart
              </button>
              
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] text-white py-4 font-bold hover:bg-[#20ba59] transition-colors shadow-lg flex items-center justify-center gap-2"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <FaWhatsapp className="w-6 h-6" />
                Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Roboto, sans-serif' }}>
            You May Also Like
          </h2>
          
          {/* 2 Rows × 4 Columns Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <div 
                key={relProduct.id} 
                className="cursor-pointer group"
                onClick={() => navigate(`/product/${relProduct.id}`)}
              >
                <div className="bg-white overflow-hidden shadow-sm mb-3">
                  <img
                    src={relProduct.image}
                    alt={relProduct.name}
                    className="w-full aspect-[3/4] object-cover group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <h3 
                  className="text-gray-700 text-sm mb-1 line-clamp-2"
                  style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
                >
                  {relProduct.name}
                </h3>
                <p 
                  className="text-gray-900 font-semibold"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  ${relProduct.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
