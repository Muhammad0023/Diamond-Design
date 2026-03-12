import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineSearch, HiX, HiClock } from 'react-icons/hi';
import { useSearch } from '../context/SearchContext';

const HISTORY_KEY = 'dd_search_history';
const MAX_HISTORY = 6;

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function saveToHistory(product) {
  try {
    const history = getHistory().filter(p => p.id !== product.id);
    history.unshift({ id: product.id, name: product.name, image: product.image, price: product.price, slug: product.slug });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {}
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export default function SearchBar({ isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { performSearch } = useSearch();

  // ✅ FIX: On route change, close modal but KEEP inputValue so history still shows
  useEffect(() => {
    setIsOpen(false);
    setDropdownResults([]);
    // NOTE: intentionally NOT clearing inputValue here
    // so when user comes back, input is empty and history shows
    setInputValue('');
    document.body.style.overflow = 'unset';
  }, [location.pathname, location.search]);

  // ✅ FIX: Only lock scroll on mobile modal, never on desktop
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobile, isOpen]);

  // Load history when opening
  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
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
    if (e.key === 'Enter' && inputValue.trim() !== '') goToSearchResults();
    if (e.key === 'Escape') closeAll();
  };

  const goToSearchResults = () => {
    if (inputValue.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(inputValue)}`);
    }
  };

  const goToProduct = (product) => {
    saveToHistory(product);
    navigate(`/product/${product.slug}`);
  };

  const closeAll = () => {
    setIsOpen(false);
    setInputValue('');
    setDropdownResults([]);
  };

  const handleClear = () => {
    setInputValue('');
    setDropdownResults([]);
    inputRef.current?.focus();
  };

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setDropdownResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showHistory = inputValue === '' && history.length > 0;
  const showResults = inputValue !== '' && dropdownResults.length > 0;
  const showNoResults = inputValue !== '' && dropdownResults.length === 0;

  // --- MOBILE VERSION ---
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-700 hover:text-brand transition-transform hover:scale-110"
        >
          <HiOutlineSearch className="w-6 h-6" />
        </button>

        {/* ✅ FIX: z-[200] — highest z-index, above everything including header (z-50) and mobile menu (z-60) */}
        {isOpen && (
          <div
            className="fixed inset-0 z-[200] flex flex-col bg-white"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Solid white background — nothing can bleed through */}
            

            {/* STICKY SEARCH HEADER */}
            <div className="flex-shrink-0 w-full bg-white pb-3 pt-4 border-b border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 px-3">
                <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-3 border border-gray-200 min-w-0">
                  <HiOutlineSearch className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search..."
                    className="flex-1 bg-transparent text-gray-800 outline-none text-base min-w-0"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                    autoFocus
                  />
                  {inputValue && (
                    <button onClick={handleClear} className="ml-2 flex-shrink-0">
                      <HiX className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
                {/* ✅ FIX: Cancel always fully visible */}
                <button
                  onClick={closeAll}
                  className="flex-shrink-0 text-gray-600 font-medium text-sm px-2 py-1"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* ✅ FIX: Scrollable results — overscroll-contain keeps it free */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="px-4 pb-20 pt-2">

                {/* Recent History */}
                {showHistory && (
                  <div>
                    <div className="flex items-center justify-between py-3">
                      <span
                        className="text-xs font-semibold text-gray-400 uppercase tracking-widest"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Recent
                      </span>
                      <button
                        onClick={() => { clearHistory(); setHistory([]); }}
                        className="text-xs text-gray-400 hover:text-brand"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {history.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => goToProduct(product)}
                          className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <img
                            src={product.image}
                            className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                            alt={product.name}
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              className="text-sm font-medium text-gray-800 line-clamp-1"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {product.name}
                            </h4>
                            <p
                              className="text-sm text-brand font-bold"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              ${product.price}
                            </p>
                          </div>
                          <HiClock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ FIX: Search Results — NO border, NO shadow, NO rectangle */}
                {showResults && (
                  <div>
                    <div className="space-y-1 pt-2">
                      {dropdownResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => goToProduct(product)}
                          className="flex gap-3 px-2 py-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <img
                            src={product.image}
                            className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                            alt={product.name}
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              className="text-sm font-medium text-gray-800 line-clamp-2"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {product.name}
                            </h4>
                            <p
                              className="text-sm text-brand font-bold mt-0.5"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={goToSearchResults}
                      className="w-full py-4 mt-3 text-brand font-semibold bg-brand/5 hover:bg-brand/10 rounded-xl transition-colors border border-brand/10 text-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      View all results for "{inputValue}"
                    </button>
                  </div>
                )}

                {/* No Results */}
                {showNoResults && (
                  <div className="text-center py-16">
                    <p
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      No results for "{inputValue}"
                    </p>
                  </div>
                )}

              </div>
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
          onFocus={() => setHistory(getHistory())}
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

      {/* Desktop Dropdown */}
      {(showResults || showHistory) && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[480px] overflow-y-auto z-[200]"
        >
          {/* History */}
          {showHistory && (
            <div className="p-3">
              <div className="flex items-center justify-between px-2 pb-2">
                <span
                  className="text-xs font-semibold text-gray-400 uppercase tracking-widest"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Recent
                </span>
                <button
                  onClick={() => { clearHistory(); setHistory([]); }}
                  className="text-xs text-gray-400 hover:text-brand"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Clear
                </button>
              </div>
              {history.map((product) => (
                <div
                  key={product.id}
                  onClick={() => goToProduct(product)}
                  className="flex gap-3 px-2 py-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-medium text-gray-800 text-sm line-clamp-1"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {product.name}
                    </h4>
                    <p
                      className="text-brand font-bold text-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      ${product.price}
                    </p>
                  </div>
                  <HiClock className="w-4 h-4 text-gray-300 self-center flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* ✅ FIX: Results — NO border, NO shadow rectangle */}
          {showResults && (
            <>
              <div className="p-2">
                {dropdownResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => goToProduct(product)}
                    className="flex gap-3 px-2 py-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-medium text-gray-800 text-sm line-clamp-2"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        {product.name}
                      </h4>
                      <p
                        className="text-brand font-bold text-sm mt-0.5"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={goToSearchResults}
                className="w-full py-3 border-t border-gray-100 text-brand font-semibold hover:bg-brand/5 transition-colors text-sm rounded-b-2xl"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                View all results for "{inputValue}" →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}