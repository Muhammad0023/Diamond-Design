import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiX } from 'react-icons/hi';
import { useSearch } from '../context/SearchContext';

export default function SearchBar({ isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { performSearch, clearSearch } = useSearch();

  // Handle search as user types
  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);

    if (query.trim() === '') {
      setDropdownResults([]);
      return;
    }

    // Perform search
    const results = performSearch(query);
    setDropdownResults(results.slice(0, 5)); // Show top 5 in dropdown
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      goToSearchResults();
    }
  };

  // Go to full search results page
  const goToSearchResults = () => {
    if (inputValue.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(inputValue)}`);
      setIsOpen(false);
      setDropdownResults([]);
    }
  };

  // Go to product detail
  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
    setIsOpen(false);
    setInputValue('');
    setDropdownResults([]);
    clearSearch();
  };

  // Clear search
  const handleClear = () => {
    setInputValue('');
    setDropdownResults([]);
    clearSearch();
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setDropdownResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mobile modal version
  if (isMobile) {
    return (
      <>
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-700 hover:text-brand transition-transform hover:scale-110"
        >
          <HiOutlineSearch className="w-6 h-6" />
        </button>

        {/* Mobile Search Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-white z-[70] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleClear();
                }}
                className="p-2"
              >
                <HiX className="w-6 h-6 text-gray-900" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="flex-1 text-lg outline-none"
                style={{ fontFamily: 'Roboto, sans-serif' }}
                autoFocus
              />
              {inputValue && (
                <button onClick={handleClear} className="p-2">
                  <HiX className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {dropdownResults.length > 0 ? (
                <div className="space-y-3">
                  {dropdownResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => goToProduct(product.id)}
                      className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {product.name}
                        </h4>
                        <p className="text-brand font-semibold text-sm mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={goToSearchResults}
                    className="w-full py-3 text-brand font-semibold hover:bg-brand/10 rounded-lg transition-colors"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    View all results ({dropdownResults.length}+)
                  </button>
                </div>
              ) : inputValue ? (
                <div className="text-center py-12">
                  <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    No results found for "{inputValue}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <HiOutlineSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Start typing to search...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop version
  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-brand transition-colors"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <HiX className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {dropdownResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
        >
          <div className="p-2">
            {dropdownResults.map((product) => (
              <div
                key={product.id}
                onClick={() => goToProduct(product.id)}
                className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {product.name}
                  </h4>
                  <p className="text-brand font-semibold text-sm mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={goToSearchResults}
            className="w-full py-3 border-t border-gray-200 text-brand font-semibold hover:bg-brand/10 transition-colors"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            View all results →
          </button>
        </div>
      )}
    </div>
  );
}
