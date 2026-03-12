import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineSearch, HiX } from 'react-icons/hi';
import { useSearch } from '../context/SearchContext';

export default function SearchBar({ isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ FIX 3 — detect route changes
  const { performSearch, clearSearch } = useSearch();

  // ✅ FIX 3 — close modal and reset everything when route changes
  useEffect(() => {
    setIsOpen(false);
    setInputValue('');
    setDropdownResults([]);
    document.body.style.overflow = 'unset'; // always restore scroll
  }, [location.pathname, location.search]);

  // ✅ FIX 3 — restore body scroll when modal closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset'; // cleanup on unmount
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    if (query.trim() === '') {
      setDropdownResults([]);
      return;
    }
    const results = performSearch(query);
    setDropdownResults(results.slice(0, 5));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      goToSearchResults();
    }
    if (e.key === 'Escape') {
      closeAll();
    }
  };

  const goToSearchResults = () => {
    if (inputValue.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(inputValue)}`);
      // location change useEffect will handle cleanup
    }
  };

  // ✅ FIX 1 & 2 — pass full product object, use slug, delay clearSearch
  const goToProduct = (product) => {
    navigate(`/product/${product.slug}`);
    // location change useEffect will handle cleanup automatically
  };

  const closeAll = () => {
    setIsOpen(false);
    setInputValue('');
    setDropdownResults([]);
    clearSearch();
  };

  const handleClear = () => {
    setInputValue('');
    setDropdownResults([]);
    clearSearch();
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside (Desktop)
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

  // --- MOBILE VERSION ---
  if (isMobile) {
    return (
      <>
        {/* Mobile Search Icon in Header */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-700 hover:text-brand transition-transform hover:scale-110"
        >
          <HiOutlineSearch className="w-6 h-6" />
        </button>

        {/* Mobile Search Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex flex-col">
            {/* BACKGROUND MASK */}
            <div 
              className={`absolute inset-0 transition-colors duration-300 ${
                inputValue ? 'bg-white' : 'bg-white/40 backdrop-blur-sm'
              }`}
              onClick={closeAll}
            />
            
            {/* STICKY SEARCH HEADER */}
            <div className="relative z-[80] w-full bg-white/95 backdrop-blur-md pb-4 pt-4 border-b border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 px-4">
                <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-3 border border-gray-200">
                  <HiOutlineSearch className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search..."
                    className="flex-1 bg-transparent text-gray-800 outline-none"
                    autoFocus
                  />
                  {inputValue && (
                    <button onClick={handleClear} className="ml-2">
                      <HiX className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
                <button 
                  onClick={closeAll}
                  className="text-gray-600 font-medium whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* SCROLLABLE RESULTS AREA */}
            <div className="relative z-[80] flex-1 overflow-y-auto px-4 mt-2">
              {inputValue && (
                <div className="pb-20">
                  {dropdownResults.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      {dropdownResults.map((product) => (
                        <div 
                          key={product.id} 
                          onClick={() => goToProduct(product)}  // ✅ pass full product
                          className="flex gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100 shadow-sm"
                        >
                          <img src={product.image} className="w-16 h-16 object-cover rounded" alt={product.name} />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>
                            <p className="text-sm text-brand font-bold mt-1">${product.price}</p>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={goToSearchResults}
                        className="w-full py-4 mt-4 text-brand font-semibold bg-brand/5 hover:bg-brand/10 rounded-xl transition-colors border border-brand/10"
                      >
                        View all results ({dropdownResults.length}+)
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-2xl">
                      <p className="text-gray-500">No products found for "{inputValue}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // --- DESKTOP VERSION ---
  return (
    <div className="relative">
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

      {/* Dropdown Results (Desktop) */}
      {dropdownResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
        >
          <div className="p-2">
            {dropdownResults.map((product) => (
              <div
                key={product.id}
                onClick={() => goToProduct(product)}  // ✅ pass full product
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