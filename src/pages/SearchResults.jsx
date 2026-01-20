import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { HiOutlineSearch } from 'react-icons/hi';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { performSearch, getSuggestion } = useSearch();
  
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [suggestion, setSuggestion] = useState(null);

  // Perform search when query changes
  useEffect(() => {
    if (query) {
      const searchResults = performSearch(query);
      setResults(searchResults);
      setFilteredResults(searchResults);
      
      // Get suggestion if no results
      if (searchResults.length === 0) {
        const suggested = getSuggestion(query);
        setSuggestion(suggested);
      } else {
        setSuggestion(null);
      }
    }
  }, [query]);

  // Get unique categories from results
  const categories = ['all', ...new Set(results.map(p => p.category))];

  // Filter by category
  useEffect(() => {
    let filtered = results;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sort results
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredResults(filtered);
  }, [selectedCategory, sortBy, results]);

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const searchSuggestion = () => {
    if (suggestion) {
      navigate(`/search?q=${suggestion}`);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Search Results
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found for "{query}"
          </p>
        </div>

        {/* Suggestion for typos */}
        {results.length === 0 && suggestion && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Did you mean{' '}
              <button
                onClick={searchSuggestion}
                className="text-brand font-semibold hover:underline"
              >
                "{suggestion}"
              </button>
              ?
            </p>
          </div>
        )}

        {/* Filters & Sort */}
        {results.length > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-brand"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        )}

        {/* Results Grid */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResults.map((product) => (
              <div
                key={product.id}
                onClick={() => goToProduct(product.id)}
                className="cursor-pointer group"
              >
                <div className="bg-white overflow-hidden shadow-sm mb-3 hover:shadow-xl transition-shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3
                  className="text-gray-700 text-sm mb-1 line-clamp-2"
                  style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-gray-900 font-semibold"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  ${product.price}
                </p>
                <p
                  className="text-xs text-gray-500 mt-1 capitalize"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {product.category}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // No Results State
          <div className="text-center py-16">
            <HiOutlineSearch className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              No products found
            </h3>
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              We couldn't find any products matching "{query}"
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
      </div>
    </div>
  );
}
