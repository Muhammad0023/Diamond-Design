import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; // Added useState

export default function ProductGrid({ title, products, viewAllLink }) {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {title}
          </h2>
          <Link 
            to={viewAllLink} 
            className="group flex items-center gap-1 text-brand font-semibold hover:text-brand-dark transition-colors"
          >
            View All 
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
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
            <ProductCardItem key={product.id} product={product} navigate={navigate} itemVariants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Sub-component to handle local hover state for each card
function ProductCardItem({ product, navigate, itemVariants }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const mainImage = product.images?.[0] || product.image;
  const hoverImage = product.images?.[1] || product.hoverImage || mainImage;

  return (
    <motion.div
      variants={itemVariants}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group"
    >
      <div className="bg-white overflow-hidden shadow-sm mb-3 group-hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={isHovered ? hoverImage : mainImage} // Hover logic restored
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-brand text-white text-[10px] font-bold px-3 py-1">
              NEW
            </span>
          )}
        </div>
      </div>
      {/* Space fixed by removing min-h and using leading-tight */}
      <h3 className="text-gray-700 text-sm mb-0.5 line-clamp-2 leading-tight" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
        {product.name}
      </h3>
      <p className="text-gray-900 font-semibold text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
        ${product.price}
      </p>
    </motion.div>
  );
}
