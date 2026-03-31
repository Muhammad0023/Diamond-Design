'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion';
import { useState } from 'react';

function ProductGridSkeleton() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-gray-200 animate-pulse rounded-full w-48" />
          <div className="h-5 bg-gray-200 animate-pulse rounded-full w-16" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
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

export default function ProductGrid({ title, products, viewAllLink }) {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  if (!products) return <ProductGridSkeleton />;
  if (products.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {title}
          </h2>
          <Link href={viewAllLink} 
            className="group flex items-center gap-1 text-brand font-semibold hover:text-brand-dark transition-colors"
          >
            View All 
            <span className="transform group-hover:translate-x-1 transition-transform"></span>
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products.slice(0, 8).map((product) => (
            <ProductCardItem key={product.id} product={product} navigate={router.push} itemVariants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProductCardItem({ product, navigate, itemVariants }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const mainImage = product.images?.[0] || product.image;
  const hoverImage = product.images?.[1] || product.hoverImage || mainImage;

  // Detect touch devices (mobile) — they don't support real hover
  const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

  return (
    <motion.div
      variants={itemVariants}
      onClick={() => router.push(`/product/${product.slug}`)}
      onMouseEnter={() => { if (!isTouchDevice()) setIsHovered(true); }}
      onMouseLeave={() => { if (!isTouchDevice()) setIsHovered(false); }}
      className="cursor-pointer group"
    >
      <div className="bg-white overflow-hidden shadow-sm mb-3 group-hover:shadow-xl transition-all duration-300">
        
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                {hoverImage !== mainImage ? (
  <>
    <img src={mainImage} alt={`${product.name} – Ethiopian Habesha Dress | Diamond Design`}
  className={`w-full h-full object-cover transition-all duration-500 absolute inset-0 ${isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
/>
<img src={hoverImage} alt={`${product.name} – hover`}
  className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
/>
  </>
) : (
  <img src={mainImage} alt={`${product.name} – Ethiopian Habesha Dress | Diamond Design`}
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
      <h3 className="text-gray-700 text-sm mb-0.5 line-clamp-2 leading-tight" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
        {product.name}
      </h3>
     <p className="text-gray-900 font-semibold text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
        ${product.price}
      </p>
      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-white text-[10px] font-semibold" style={{ backgroundColor: '#D4AF37' }}>
         Free Shipping
      </span>
    </motion.div>
  );
}