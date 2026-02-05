import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHome, HiChevronRight, HiChevronLeft } from 'react-icons/hi';
import { useProducts } from '../context/ProductsContext';

export default function LatestDesignsPage() {
  const navigate = useNavigate();
  const { getLatestProducts, loading } = useProducts();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  
  const productsPerPage = 20; // 5 rows x 4 columns

  useEffect(() => {
    // Get latest products (sorted by createdAt)
    const latest = getLatestProducts();
    setAllProducts(latest);
  }, [getLatestProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Loading products...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <a href="/" className="text-gray-500 hover:text-brand transition-colors flex items-center gap-1">
            <HiHome className="w-4 h-4" />
            Home
          </a>
          <HiChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Latest Designs</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Latest Designs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
            Discover our newest arrivals and trending styles
          </p>
        </div>

        {/* Product Count & Page Info */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Showing <span className="font-semibold text-gray-900">{indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, allProducts.length)}</span> of <span className="font-semibold text-gray-900">{allProducts.length}</span> products
          </div>
          
          {totalPages > 1 && (
            <div className="text-gray-600 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Products Grid - 5 ROWS x 4 COLUMNS */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              No products yet
            </h3>
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              Check back soon for new arrivals!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                
                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-brand text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, navigate }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const mainImage = product.images?.[0] || product.image;
  const hoverImage = product.images?.[1] || product.hoverImage || mainImage;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group"
    >
      {/* Product Card */}
      <div className="bg-white overflow-hidden shadow-sm mb-3 hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={isHovered ? hoverImage : mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-3 py-1">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <h3
        className="text-gray-700 text-sm mb-1 line-clamp-2 min-h-[2.5rem]"
        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
      >
        {product.name}
      </h3>
      <p
        className="text-gray-900 font-semibold text-base"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        ${product.price}
      </p>
    </div>
  );
}
