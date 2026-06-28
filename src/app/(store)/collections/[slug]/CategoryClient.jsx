'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiHome, HiChevronRight, HiChevronLeft } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useProducts } from '../../../../context/ProductsContext';


// ✅ URL slug → category key  (used when route is /collections/:slug)
const slugToCategory = {
  'habesha-kemis-simple':              'simple',
  'habesha-wedding-dresses':           'wedding',
  'habesha-chiffon-dresses':           'chiffon',
  'event-holiday-habesha-dresses':     'holiday',
  'habesha-family-group-outfits':      'group',
  'habesha-mens-traditional-clothing': 'mens',
  'matching-habesha-couples':          'couples',
};

// ✅ Category key → URL slug  (used to build links & canonical URLs)
const categoryToSlug = {
  simple:  'habesha-kemis-simple',
  wedding: 'habesha-wedding-dresses',
  chiffon: 'habesha-chiffon-dresses',
  holiday: 'event-holiday-habesha-dresses',
  group:   'habesha-family-group-outfits',
  mens:    'habesha-mens-traditional-clothing',
  couples: 'matching-habesha-couples',
};

const categoryConfig = {
  simple: {
    title: 'Simple Habesha Kemis',
    description: 'Simple Habesha Kemis designed for weddings, holidays, shimglina, graduation and special occasions, blending elegant Ethiopian and Eritrean tradition with modern style.',
    seoTitle: 'Habesha Kemis for Weddings, Special Occasions | Diamond Design',
    seoDescription: 'Discover simple Habesha Kemis designed for weddings, holidays, shimglina, graduation and special Events. Elegant Ethiopian and Eritrean styles with a modern touch. Shop Diamond Design.',
    h1: 'Simple Habesha Kemis',
    body: 'Discover simple Habesha Kemis designed for weddings, holidays, shimglina, graduation and special events. These elegant Ethiopian and Eritrean dresses blend traditional craftsmanship with modern style, perfect for those who appreciate timeless beauty with a refined touch.',
  },
  wedding: {
    title: 'Habesha Wedding Dresses',
    description: 'Habesha wedding dresses designed for Ethiopian and Eritrean brides, combining traditional elegance with modern bridal style.',
    seoTitle: 'Habesha Wedding Dresses – Ethiopian & Eritrean Bridal Styles | Diamond Design',
    seoDescription: 'Discover elegant Habesha wedding dresses crafted for Ethiopian and Eritrean brides. Perfect for weddings, engagements, shimglina and cultural celebrations. Shop your dream bridal look at Diamond Design.',
    h1: 'Habesha Wedding Dresses',
    body: 'Explore our collection of Habesha wedding dresses crafted for Ethiopian and Eritrean brides. Perfect for weddings, engagements, and cultural events, each design combines traditional elegance with modern sophistication to make your special day unforgettable.',
  },
  chiffon: {
    title: 'Chiffon Habesha Dresses',
    description: 'Chiffon Habesha dresses with light, flowing Ethiopian and Eritrean designs, perfect for elegant and comfortable wear.',
    seoTitle: 'Chiffon Habesha Dresses – Elegant Ethiopian & Eritrean Styles | Diamond Design',
    seoDescription: 'Explore chiffon Habesha dresses with light, flowing Ethiopian and Eritrean designs. Perfect for weddings, holidays, and elegant events. Shop Diamond Design.',
    h1: 'Chiffon Habesha Dresses',
    body: 'Discover chiffon Habesha dresses designed for weddings, holidays, and special events. Light, flowing, and elegant, these Ethiopian and Eritrean styles offer comfort and beauty with a modern and graceful finish.',
  },
  holiday: {
    title: 'Events & Holiday Habesha Dresses',
    description: 'Habesha holiday dresses for Ethiopian and Eritrean celebrations like Timkat, Enkutatash, and Meskel, blending festive traditional elegance with modern style for special occasions.',
    seoTitle: 'Habesha Holiday Dresses for Timket & Enkutatash | Diamond Design',
    seoDescription: 'Shop Habesha holiday dresses for Ethiopian and Eritrean celebrations like Timkat, Enkutatash, and Meskel. Elegant traditional styles for your special moments at Diamond Design.',
    h1: 'Events and Holiday Habesha Dresses',
    body: 'Celebrate in style with Habesha holiday and graduation dresses designed for Ethiopian and Eritrean events like Enkutatash, Meskel, birthday and graduation ceremonies. These traditional designs blend festive elegance with modern fashion for unforgettable cultural moments.',
  },
  group: {
    title: 'Habesha Group Outfits',
    description: 'Habesha group outfits for families and friends, with matching Ethiopian and Eritrean traditional designs for special events.',
    seoTitle: 'Habesha Family Group Outfits – Matching Ethiopian Styles | Diamond Design',
    seoDescription: 'Shop matching Habesha group outfits for families and friends. Coordinated Ethiopian and Eritrean designs perfect for weddings, holidays, graduation and special events.',
    h1: 'Habesha Group Outfits for Families & Special Events',
    body: 'Shop matching Habesha group outfits for families and friends, perfect for weddings, holidays, and special events. These Ethiopian and Eritrean designs create a coordinated and elegant look for memorable occasions.',
  },
  mens: {
    title: "Habesha Men's Traditional Clothing",
    description: 'Habesha menswear featuring traditional Ethiopian and Eritrean clothing with modern style and premium craftsmanship.',
    seoTitle: 'Habesha Menswear – Traditional Ethiopian & Eritrean Clothing | Diamond Design',
    seoDescription: 'Explore Habesha menswear featuring traditional Ethiopian and Eritrean clothing with modern style. Perfect for weddings, holidays, and cultural events.',
    h1: "Habesha Men's Traditional Clothing",
    body: 'Explore traditional Habesha menswear designed for Ethiopian and Eritrean weddings, holidays, and special events. Each piece combines authentic craftsmanship with modern style for a refined and confident look.',
  },
  couples: {
    title: 'Matching Habesha Couples Outfits',
    description: 'Matching Habesha couples outfits with coordinated Ethiopian and Eritrean designs, perfect for weddings, shimgilina and celebrations.',
    seoTitle: 'Matching Habesha Couples Outfits for Weddings & Holidays | Diamond Design',
    seoDescription: 'Discover matching Habesha couples outfits with elegant Ethiopian and Eritrean designs. Perfect for weddings, holidays, and special celebrations.',
    h1: 'Matching Habesha Couples Outfits',
    body: 'Discover matching Habesha couples outfits designed for Ethiopian and Eritrean weddings, holidays, and special events. These coordinated designs offer elegance, unity, and a modern touch for unforgettable moments together.',
  },
};

const BASE_URL = 'https://www.diamonddesignstore.com';

export default function CategoryClient({ slug }) {
  const router = useRouter()
  const { getProductsByCategory, loading } = useProducts();

  // ✅ Resolve which category key we're dealing with
const category = slugToCategory[slug]
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const productsPerPage = 20;

  const categoryData = categoryConfig[category];
  const canonicalUrl = `${BASE_URL}/collections/${categoryToSlug[category] || ''}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const savedScroll = sessionStorage.getItem(`scroll-${slug}`);
    if (savedScroll) {
      setSkipAnimation(true);
      sessionStorage.removeItem(`scroll-${slug}`);
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!categoryData) {
      if (!loading) router.push('/');
      return;
    }
    setProducts(getProductsByCategory(category));
    setCurrentPage(1);
  }, [category, categoryData, router.push, getProductsByCategory, loading]);

  useEffect(() => {
    if (!categoryData) return;
    let sorted = [...getProductsByCategory(category)];
    if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    setProducts(sorted);
    setCurrentPage(1);
  }, [sortBy, category, categoryData, getProductsByCategory]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
  // Use setTimeout to ensure scroll happens after state update
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};

  if (!categoryData) return null;

 if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 bg-gray-200 animate-pulse rounded-full w-16" />
            <div className="h-4 bg-gray-200 animate-pulse rounded-full w-4" />
            <div className="h-4 bg-gray-200 animate-pulse rounded-full w-28" />
          </div>

          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-12 bg-gray-200 animate-pulse rounded-full w-64 mb-4" />
            <div className="h-4 bg-gray-200 animate-pulse rounded-full w-full max-w-xl mb-2" />
            <div className="h-4 bg-gray-200 animate-pulse rounded-full w-4/5 max-w-lg" />
          </div>

          {/* Filters bar skeleton */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div className="h-4 bg-gray-200 animate-pulse rounded-full w-48" />
            <div className="h-9 bg-gray-200 animate-pulse rounded-lg w-44" />
          </div>

          {/* Products grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-sm mb-3" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-1/3" />
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm mb-6"
        >
          <a href="/" className="text-gray-500 hover:text-brand transition-colors flex items-center gap-1">
            <HiHome className="w-4 h-4" /> Home
          </a>
          <HiChevronRight className="w-4 h-4 text-gray-400" />
          {category !== 'mens' && category !== 'couples' && (
            <>
              {/* ✅ "Dresses" is a clickable link */}
             <a href="/collections/habesha-kemis-simple" className="text-gray-500 hover:text-brand transition-colors">
                Dresses
              </a>
              <HiChevronRight className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className="text-gray-900 font-medium">{categoryData.title}</span>
        </motion.nav>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {categoryData.h1}
        </h1>
        <p className="text-medium text-gray-600 max-w-3xl leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
          {categoryData.body}
        </p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200"
        >
          <div className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Showing <span className="font-semibold text-gray-900">{products.length > 0 ? indexOfFirstProduct + 1 : 0}-{Math.min(indexOfLastProduct, products.length)}</span> of <span className="font-semibold text-gray-900">{products.length}</span> products
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-brand transition-colors"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            <option value="default">Sort by: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </motion.div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <motion.div
              variants={skipAnimation ? {} : containerVariants}
              initial={skipAnimation ? false : "hidden"}
              animate={skipAnimation ? false : "visible"}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {currentProducts.map((product) => (
                <ProductGridItem key={product.id} product={product} navigate={router.push} variants={itemVariants} />
              ))}
            </motion.div>

{/* Reference-based Numbered Pagination */}
{totalPages > 1 && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-16 flex justify-center items-center gap-1 sm:gap-2"
  >
    {/* Previous Arrow */}
    <button 
      onClick={() => handlePageChange(currentPage - 1)} 
      disabled={currentPage === 1} 
      className="w-10 h-10 flex items-center justify-center text-gray-900 hover:text-brand disabled:opacity-20 transition-colors"
    >
      <HiChevronLeft className="w-5 h-5" />
    </button>

    {/* Page Numbers */}
    <div className="flex items-center gap-1">
      {[...Array(totalPages)].map((_, i) => {
        const pageNum = i + 1;
        
        // This logic shows: First Page, Last Page, and pages around the Current Page
        if (
          pageNum === 1 || 
          pageNum === totalPages || 
          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
        ) {
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                currentPage === pageNum 
                ? 'bg-brand/20 text-brand font-bold border border-brand/30' // The circle from your image
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          );
        }

        // Show dots if there is a gap
        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
          return <span key={pageNum} className="text-gray-400">...</span>;
        }

        return null;
      })}
    </div>

    {/* Next Arrow */}
    <button 
      onClick={() => handlePageChange(currentPage + 1)} 
      disabled={currentPage === totalPages} 
      className="w-10 h-10 flex items-center justify-center text-gray-900 hover:text-brand disabled:opacity-20 transition-colors"
    >
      <HiChevronRight className="w-5 h-5" />
    </button>
  </motion.div>
)}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>No products yet</h3>
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>Check back soon!</p>
            <button onClick={() => router.push('/')} className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors">Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductGridItem({ product, navigate, variants }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={variants}
      onClick={() => {
        sessionStorage.setItem(`scroll-${window.location.pathname.split('/').pop()}`, window.scrollY);
        navigate(`/product/${product.slug}`);
      }}      onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setIsHovered(true); }}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group"
    >
      <div className="bg-white overflow-hidden shadow-sm mb-3 group-hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {product.hoverImage && product.hoverImage !== product.image ? (
  <>
    <Image src={product.image} alt={`${product.name} – Ethiopian Habesha Dress`}
      fill sizes="(max-width: 768px) 50vw, 25vw"
      className={`object-cover transition-all duration-500 absolute inset-0 ${isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
    />
    <Image src={product.hoverImage} alt={`${product.name} – alternate view`}
      fill sizes="(max-width: 768px) 50vw, 25vw"
      className={`object-cover transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
    />
  </>
) : (
  <Image src={product.image} alt={`${product.name} – Ethiopian Habesha Dress`}
    fill sizes="(max-width: 768px) 50vw, 25vw"
    className={`object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
  />
)}
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-3 py-1 z-10">NEW</span>
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