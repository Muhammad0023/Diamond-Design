'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

function ProductCarouselSkeleton() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Title & View All skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-9 bg-gray-200 animate-pulse rounded-full w-56" />
          <div className="h-5 bg-gray-200 animate-pulse rounded-full w-20" />
        </div>
        {/* Cards skeleton */}
        <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-hidden pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-none w-[38%] sm:w-[calc(40%-0.5rem)] lg:w-[calc(20%-1.2rem)]">
              <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-sm mb-3" />
              <div className="h-4 bg-gray-200 animate-pulse rounded-full w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 animate-pulse rounded-full w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductCarousel({ title, products, viewAllLink = "#" }) {
  const scrollContainerRef = useRef(null);
  const router = useRouter()

  if (!products) return <ProductCarouselSkeleton />;

  const displayedProducts = products.slice(0, 13);
  const hasMoreProducts = products.length > 13;

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
            <h2 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {title}
              </h2>
          <button
            onClick={() => router.push(viewAllLink)}
            className="text-brand font-semibold hover:text-brand-dark transition-colors flex items-center gap-1 cursor-pointer group"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            View All {hasMoreProducts && `(${products.length})`} <span className="transform group-hover:translate-x-1 transition-transform"></span>
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="hidden lg:block absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <HiChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            
            {hasMoreProducts && (
              <div 
                className="flex-none w-[38%] sm:w-[calc(40%-0.5rem)] lg:w-[calc(20%-1.2rem)] snap-start cursor-pointer"
                onClick={() => router.push(viewAllLink)}
              >
                <div className="bg-brand h-full flex flex-col items-center justify-center p-8 hover:bg-brand-dark transition-colors">
                  <span className="text-white text-4xl mb-2">+{products.length - 13}</span>
                  <p className="text-white font-semibold text-center">More Products</p>
                  <p className="text-white text-sm mt-2">View All →</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => scroll('right')}
            className="hidden lg:block absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            aria-label="Scroll right"
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
  const router = useRouter()

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
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      <div className="bg-white overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

          {hoverImage !== mainImage ? (
  <>
    <img src={mainImage} alt={`${product.name} – Ethiopian Habesha Dress`}
      className={`w-full h-full object-cover transition-all duration-500 absolute inset-0 ${isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
    />
    <img src={hoverImage} alt={`${product.name} – hover`}
      className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
    />
  </>
) : (
  <img src={mainImage} alt={`${product.name} – Ethiopian Habesha Dress`}
    className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
  />
)}
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-brand text-white text-[10px] font-bold px-3 py-1">
              NEW
            </span>
          )}
        </div>
      </div>

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
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-white text-[10px] font-semibold" style={{ backgroundColor: '#D4AF37' }}>
           Free Shipping
        </span>
      </div>
    </motion.div>
  );
}