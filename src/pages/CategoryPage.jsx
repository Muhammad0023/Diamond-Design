import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi';
import { motion } from 'framer-motion'; // Added Framer Motion
import { useProducts } from '../context/ProductsContext';

// Category configurations
const categoryConfig = {
  simple: { title: 'Simple Dresses', description: 'Timeless elegance for everyday wear' },
  wedding: { title: 'Wedding Dresses', description: 'Exquisite bridal collections for your special day' },
  chiffon: { title: 'Chiffon', description: 'Light and flowing designs for any occasion' },
  holiday: { title: 'Holidays', description: 'Festive attire for special celebrations' },
  group: { title: 'Group Outfits', description: 'Coordinated sets for family and friends' },
  mens: { title: "Men's Collection", description: 'Traditional Ethiopian menswear with modern style' },
  couples: { title: 'Couples Collection', description: 'Matching collections for the perfect pair' },
};

export default function CategoryPage({ manualCategory }) {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();
  const { getProductsByCategory, loading } = useProducts();
  
  const category = manualCategory || urlCategory; 
  
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const categoryData = categoryConfig[category];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
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
    const categoryProducts = getProductsByCategory(category);
    setProducts(categoryProducts);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs - Simple Fade In */}
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
              <span className="text-gray-500">Dresses</span>
              <HiChevronRight className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className="text-gray-900 font-medium">{categoryData.title}</span>
        </motion.nav>

        {/* Page Header - Animated Slide Up */}
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

        {/* Staggered Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {currentProducts.map((product) => (
                <ProductGridItem 
                  key={product.id} 
                  product={product} 
                  navigate={navigate} 
                  variants={itemVariants} 
                />
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 flex justify-center items-center gap-2"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-md border transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-brand text-white border-brand' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
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
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group"
    >
      <div className="bg-white overflow-hidden shadow-sm mb-3 group-hover:shadow-xl transition-all duration-500">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 ${
              isHovered && product.hoverImage ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-3 py-1 z-10">
              NEW
            </span>
          )}
        </div>
      </div>
      {/* Space fixed: Removed min-h and mb-1, replaced with leading-tight */}
      <h3 
        className="text-gray-700 text-sm mb-0.5 line-clamp-2 leading-tight" 
        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
      >
        {product.name}
      </h3>
      <p className="text-gray-900 font-semibold text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
        ${product.price}
      </p>
    </motion.div>
  );
}
