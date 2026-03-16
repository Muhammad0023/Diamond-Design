import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductsContext';
import { Helmet } from 'react-helmet-async';

// ✅ URL slug → category key  (used when route is /collections/:slug)
const slugToCategory = {
  'simple-dresses':     'simple',
  'wedding-dresses':    'wedding',
  'chiffon':            'chiffon',
  'holidays':           'holiday',
  'group-outfits':      'group',
  'mens-collection':    'mens',
  'couples-collection': 'couples',
};

// ✅ Category key → URL slug  (used to build links & canonical URLs)
const categoryToSlug = {
  simple:  'simple-dresses',
  wedding: 'wedding-dresses',
  chiffon: 'chiffon',
  holiday: 'holidays',
  group:   'group-outfits',
  mens:    'mens-collection',
  couples: 'couples-collection',
};

const categoryConfig = {
  simple: {
    title: 'Simple Dresses',
    description: 'Timeless elegance for everyday wear',
    seoTitle: 'Simple Dresses | Diamond Design – Everyday Ethiopian Elegance',
    seoDescription: "Shop Diamond Design's simple Habesha dress collection. Timeless Ethiopian styles crafted for everyday wear, made with authentic traditional fabrics.",
  },
  wedding: {
    title: 'Wedding Dresses',
    description: 'Exquisite bridal collections for your special day',
    seoTitle: 'Wedding Dresses | Diamond Design – Ethiopian Bridal Collection',
    seoDescription: 'Find your perfect Habesha wedding dress at Diamond Design. Handcrafted Ethiopian bridal gowns for your unforgettable special day.',
  },
  chiffon: {
    title: 'Chiffon',
    description: 'Light and flowing designs for any occasion',
    seoTitle: 'Chiffon | Diamond Design – Light & Flowing Ethiopian Style',
    seoDescription: "Explore Diamond Design's chiffon Habesha dress collection. Light, elegant, and flowing Ethiopian dresses perfect for any occasion.",
  },
  holiday: {
    title: 'Holidays',
    description: 'Festive attire for special celebrations',
    seoTitle: 'Holidays | Diamond Design – Ethiopian Festive Attire',
    seoDescription: "Celebrate in style with Diamond Design's holiday Habesha collection. Traditional Ethiopian festive dresses for Timkat, Enkutatash, and every celebration.",
  },
  group: {
    title: 'Group Outfits',
    description: 'Coordinated sets for family and friends',
    seoTitle: 'Group Outfits | Diamond Design – Matching Ethiopian Family Sets',
    seoDescription: 'Shop coordinated Habesha group outfits at Diamond Design. Matching Ethiopian traditional dress sets for families, bridal parties, and special events.',
  },
  mens: {
    title: "Men's Collection",
    description: 'Traditional Ethiopian menswear with modern style',
    seoTitle: "Men's Collection | Diamond Design – Traditional Ethiopian Menswear",
    seoDescription: "Shop Diamond Design's men's Habesha collection. Authentic traditional Ethiopian menswear crafted with quality fabrics and modern style.",
  },
  couples: {
    title: 'Couples Collection',
    description: 'Matching collections for the perfect pair',
    seoTitle: 'Couples Collection | Diamond Design – Matching Ethiopian Dress Sets',
    seoDescription: 'Find matching Habesha couples outfits at Diamond Design. Coordinated Ethiopian traditional dress sets for weddings, holidays, and special occasions.',
  },
};

const BASE_URL = 'https://www.diamonddesignstore.com';

export default function CategoryPage({ manualCategory, legacyMode = false }) {
  // slug comes from /collections/:slug
  // urlCategory comes from legacy /dresses/:category
  const { slug, category: urlCategory } = useParams();
  const navigate = useNavigate();
  const { getProductsByCategory, loading } = useProducts();

  // ✅ Resolve which category key we're dealing with
  let category;
  if (manualCategory) {
    category = manualCategory;             // prop from /mens or /couples legacy routes
  } else if (slug) {
    category = slugToCategory[slug];       // /collections/simple-dresses → 'simple'
  } else if (urlCategory) {
    category = urlCategory;               // legacy /dresses/simple → 'simple'
  }

  // ✅ Auto-redirect legacy URLs to new /collections/ URLs
  useEffect(() => {
    if (legacyMode && category && categoryToSlug[category]) {
      navigate(`/collections/${categoryToSlug[category]}`, { replace: true });
    }
  }, [legacyMode, category, navigate]);

  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    if (!categoryData) {
      if (!loading) navigate('/');
      return;
    }
    setProducts(getProductsByCategory(category));
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [category, categoryData, navigate, getProductsByCategory, loading]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!categoryData) return null;

 if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <Helmet>
          <title>{categoryData.seoTitle}</title>
          <meta name="description" content={categoryData.seoDescription} />
        </Helmet>
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

      {/* ✅ Dynamic Helmet — unique title & description per category */}
      <Helmet>
        <title>{categoryData.seoTitle}</title>
        <meta name="description" content={categoryData.seoDescription} />
        <meta property="og:title" content={categoryData.seoTitle} />
        <meta property="og:description" content={categoryData.seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

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
              <a href="/collections/simple-dresses" className="text-gray-500 hover:text-brand transition-colors">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {categoryData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
            Discover our collection of {categoryData.title.toLowerCase()} featuring authentic Ethiopian craftsmanship.
            Each piece is carefully selected to bring you the finest quality and traditional designs with a modern touch.
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
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {currentProducts.map((product) => (
                <ProductGridItem key={product.id} product={product} navigate={navigate} variants={itemVariants} />
              ))}
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 flex justify-center items-center gap-2"
              >
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Previous</button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`w-10 h-10 rounded-md border transition-colors ${currentPage === i + 1 ? 'bg-brand text-white border-brand' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">Next</button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>No products yet</h3>
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>Check back soon!</p>
            <button onClick={() => navigate('/')} className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors">Continue Shopping</button>
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
      onClick={() => navigate(`/product/${product.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group"
    >
      <div className="bg-white overflow-hidden shadow-sm mb-3 group-hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {product.hoverImage && product.hoverImage !== product.image ? (
  <>
    <img src={product.image} alt={`${product.name} – Ethiopian Habesha Dress`}
      className={`w-full h-full object-cover transition-all duration-500 absolute inset-0 ${isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
    />
    <img src={product.hoverImage} alt={`${product.name} – alternate view`}
      className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
    />
  </>
) : (
  <img src={product.image} alt={`${product.name} – Ethiopian Habesha Dress`}
    className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
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
    </motion.div>
  );
}