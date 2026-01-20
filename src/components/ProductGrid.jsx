import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductGrid({ title, products, viewAllLink = "#" }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold text-gray-900"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {title}
          </h2>
          <a 
            href={viewAllLink}
            className="text-brand font-semibold hover:text-brand-dark transition-colors flex items-center gap-1"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            View All <span>→</span>
          </a>
        </div>

        {/* Product Grid - Perfect alignment with same height cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Image Card - No animations, just image swap on desktop hover */}
      <div className="bg-white overflow-hidden shadow-sm">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {/* New Badge */}
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-3 py-1">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Product Info - Outside Card, Minimal */}
      <div className="mt-3">
        <h3 
          className="text-gray-700 text-sm mb-1 line-clamp-3 leading-relaxed min-h-[3.6rem]"
          style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
        >
          {product.name}
        </h3>
        <p 
          className="text-gray-900 text-base"
          style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '400' }}
        >
          ${product.price}
        </p>
      </div>
    </div>
  );
}
