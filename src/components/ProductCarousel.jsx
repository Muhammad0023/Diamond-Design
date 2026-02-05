import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function ProductCarousel({ title, products, viewAllLink = "#" }) {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {title}
          </h2>
          <button
            onClick={() => navigate(viewAllLink)}
            className="text-brand font-semibold hover:text-brand-dark transition-colors flex items-center gap-1 cursor-pointer group"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            View All <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="hidden lg:block absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <HiChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="hidden lg:block absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <HiChevronRight className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const mainImage = product.images?.[0] || product.image;
  const hoverImage = product.images?.[1] || product.hoverImage || mainImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex-none w-[38%] sm:w-[calc(40%-0.5rem)] lg:w-[calc(20%-1.2rem)] snap-start cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* 1. FIXED HOVER IMAGE SWAP */}
      <div className="bg-white overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={isHovered ? hoverImage : mainImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-brand text-white text-[10px] font-bold px-3 py-1">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* 2. FIXED SPACING & FONTS */}
      <div className="mt-3">
        <h3 
          className="text-gray-700 text-sm line-clamp-2 leading-tight" 
          style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
        >
          {product.name}
        </h3>
        <p 
          className="text-gray-900 text-base mt-1" 
          style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '400' }}
        >
          ${product.price}
        </p>
      </div>
    </motion.div>
  );
}
