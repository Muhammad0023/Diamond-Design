import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi';
import { sampleProducts } from './HomePage';

// Category configurations
const categoryConfig = {
  simple: {
    title: 'Simple Dresses',
    description: 'Timeless elegance for everyday wear',
    products: sampleProducts.simple,
  },
  wedding: {
    title: 'Wedding Dresses',
    description: 'Exquisite bridal collections for your special day',
    products: sampleProducts.wedding,
  },
  chiffon: {
    title: 'Chiffon',
    description: 'Light and flowing designs for any occasion',
    products: sampleProducts.chiffon,
  },
  holiday: {
    title: 'Holidays',
    description: 'Festive attire for special celebrations',
    products: sampleProducts.holidays,
  },
  group: {
    title: 'Group Outfits',
    description: 'Coordinated sets for family and friends',
    products: sampleProducts.group,
  },
  mens: {
    title: "Men's Collection",
    description: 'Traditional Ethiopian menswear with modern style',
    products: sampleProducts.mens,
  },
  couples: {
    title: 'Couples Collection',
    description: 'Matching collections for the perfect pair',
    products: sampleProducts.couples,
  },
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);

  // Get category data
  const categoryData = categoryConfig[category];

  // Redirect if category doesn't exist
  useEffect(() => {
    if (!categoryData) {
      navigate('/');
    } else {
      setProducts(categoryData.products);
    }
  }, [category, categoryData, navigate]);

  // Sort products
  useEffect(() => {
    if (!categoryData) return;

    let sorted = [...categoryData.products];

    if (sortBy === 'price-low') {
      sorted = sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted = sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    setProducts(sorted);
  }, [sortBy, categoryData]);

  if (!categoryData) {
    return null;
  }

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
  };

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
          {category !== 'mens' && category !== 'couples' && (
            <>
              <span className="text-gray-500">Dresses</span>
              <HiChevronRight className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className="text-gray-900 font-medium">{categoryData.title}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {categoryData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
            {categoryData.description}
          </p>
        </div>

        {/* Filters & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          {/* Product Count */}
          <div className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Found <span className="font-semibold text-gray-900">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
          </div>

          {/* Sort Dropdown */}
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
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => goToProduct(product.id)}
                className="cursor-pointer group"
              >
                {/* Product Card */}
                <div className="bg-white overflow-hidden shadow-sm mb-3 hover:shadow-xl transition-shadow duration-300">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
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
              We're working on adding products to this category. Check back soon!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Category Description (Bottom) */}
        {products.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
              About {categoryData.title}
            </h2>
            <p className="text-gray-600 max-w-3xl leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              Discover our collection of {categoryData.title.toLowerCase()} featuring authentic Ethiopian craftsmanship. 
              Each piece is carefully selected to bring you the finest quality and traditional designs with a modern touch. 
              Perfect for any occasion, our {categoryData.title.toLowerCase()} combine elegance, comfort, and cultural heritage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
