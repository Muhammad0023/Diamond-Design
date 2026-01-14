import { useState, useRef, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function ProductCarousel({ title, products, viewAllLink = "#" }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });

    const cards = document.querySelectorAll(".carousel-reveal");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [products]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {title}
          </h2>
          <a href={viewAllLink} className="text-brand font-semibold hover:text-brand-dark transition-colors flex items-center gap-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            View All <span>→</span>
          </a>
        </div>

        <div className="relative group">
          <button onClick={() => scroll('left')} className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <HiChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pr-12 lg:pr-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                scrollContainerRef.current.scrollLeft += e.deltaY;
              }
            }}
          >
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="reveal carousel-reveal flex-none w-[40%] sm:w-[calc(40%-0.5rem)] lg:w-[calc(20%-1.2rem)] snap-start"
                style={{ transitionDelay: `${(index % 5) * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button onClick={() => scroll('right')} className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <HiChevronRight className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="w-full cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="bg-white overflow-hidden shadow-sm">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {product.isNew && <span className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-3 py-1">NEW</span>}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-gray-700 text-sm mb-1 line-clamp-2 leading-relaxed h-10" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
          {product.name}
        </h3>
        <p className="text-gray-900 text-base" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '400' }}>
          ${product.price}
        </p>
      </div>
    </div>
  );
}