'use client'
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
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

export default function SearchBar({ isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dropdownResults, setDropdownResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  
  const router = useRouter()
  const pathname = usePathname()
  const { performSearch } = useSearch();

 useEffect(() => {
  setIsOpen(false);
  setInputValue('');
  setDropdownResults([]);
  document.body.style.overflow = 'unset';
}, [pathname]);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const updateDropdownPos = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left });
    }
  }, []);

  const handleInputChange = (e) => {
  const query = e.target.value;
  setInputValue(query);
  if (query.trim() === '') {
    setDropdownResults([]);
    return;
  }
  clearTimeout(window._searchTimeout);
  window._searchTimeout = setTimeout(() => {
    const results = performSearch(query);
    setDropdownResults(results.slice(0, 5));
  }, 200);
};

  const clearHistory = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  const goToSearchResults = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (inputValue.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };
const goToProduct = (product) => {
  saveToHistory(product);
  setDropdownResults([]);
  setInputValue('');
  router.push(`/product/${product.slug}`);
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') goToSearchResults();
    if (e.key === 'Escape') setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showHistory = inputValue === '' && history.length > 0;
  const showResults = inputValue !== '' && dropdownResults.length > 0;
  const showNoResults = inputValue !== '' && dropdownResults.length === 0;

  if (isMobile) {
    return (
      <div ref={containerRef}>
        <button onClick={() => setIsOpen(true)} className="p-2 text-gray-700">
          <HiOutlineSearch className="w-6 h-6" />
        </button>

        {isOpen && createPortal(
          /* ✅ FIX 1: Softer, more attractive background blur (gray-900/20 with blur-lg) */
          /* ✅ Added onClick to close when clicking the background */
          <div 
            className="fixed inset-0 z-[9999] flex flex-col bg-gray-900/20 backdrop-blur-lg"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            
            {/* ✅ FIX 2: Slightly refined header with shadow to separate from the blur */}
            <div className="flex-shrink-0 w-full bg-white/95 backdrop-blur-md pb-3 pt-4 shadow-sm border-b border-gray-100">
              <div className="flex items-center gap-3 px-4">
                
                {/* Search Input Area */}
                <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 border border-transparent focus-within:bg-white focus-within:border-gray-300 transition-all duration-300">
                  <HiOutlineSearch className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search..."
                    className="flex-1 bg-transparent outline-none text-base text-gray-800 w-full"
                    autoFocus
                  />
                  {inputValue && (
                    <button onClick={() => setInputValue('')}>
                      <HiX className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    </button>
                  )}
                </div>
        
                {/* ✅ FIX 3: Responsive perfect cancel button (whitespace-nowrap prevents breaking, active:scale makes it feel tactile) */}
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-sm font-semibold text-gray-600 active:text-gray-900 active:scale-95 transition-all whitespace-nowrap px-1 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* ✅ Added onClick to close when clicking the empty scrolling area */}
            <div 
              className="flex-1 overflow-y-auto"
              onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
            >
              <div 
                className="pb-20"
                onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
              >
                {showHistory && (
                  <div className="bg-white p-4 shadow-xl rounded-b-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-gray-400 uppercase">Recent</p>
                      <button onMouseDown={clearHistory} className="text-xs font-bold text-gray-400 hover:text-gray-600">
                        Clear All
                      </button>
                    </div>
                    {history.map((product) => (
                      <div key={product.id} onMouseDown={() => goToProduct(product)} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                        <Image src={product.image} width={48} height={48} className="object-cover rounded-lg" alt="" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                          <p className="text-brand font-bold">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showResults && (
                  <div className="bg-white p-4 shadow-xl rounded-b-2xl">
                    {dropdownResults.map((product) => (
                      <div key={product.id} onMouseDown={() => goToProduct(product)} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <Image src={product.image} width={48} height={48} className="object-cover rounded-lg" alt="" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                          <p className="text-brand font-bold">${product.price}</p>
                        </div>
                      </div>
                    ))}
                    <button 
                      onMouseDown={(e) => goToSearchResults(e)} 
                      className="w-full py-4 mt-2 text-brand font-bold bg-brand/5 rounded-xl border border-brand/10 active:bg-brand/20"
                    >
                      View all results for "{inputValue}"
                    </button>
                  </div>
                )}

                {showNoResults && (
                  <div className="text-center py-16 bg-white shadow-xl rounded-b-2xl">
                    <p className="text-gray-400">No results found for "{inputValue}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { setHistory(getHistory()); updateDropdownPos(); }}
          placeholder="Search..."
          className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-brand"
        />
      </div>

      {(showResults || showHistory) && (
        <div
          className="fixed w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {showHistory && (
            <div className="p-3">
              <div className="flex justify-between items-center px-2 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Recent Searches</p>
                <button 
                  onMouseDown={clearHistory} 
                  className="text-[10px] font-bold text-gray-400 hover:text-brand cursor-pointer uppercase"
                >
                  Clear All
                </button>
              </div>
              {history.map((product) => (
                <div key={product.id} onMouseDown={() => goToProduct(product)} className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Image src={product.image} width={40} height={40} className="object-cover rounded-md" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate text-gray-800">{product.name}</h4>
                    <p className="text-brand font-bold text-xs">${product.price}</p>
                  </div>
                  <HiClock className="w-4 h-4 text-gray-300 self-center" />
                </div>
              ))}
            </div>
          )}

          {showResults && (
            <div className="p-2 border-t border-gray-50">
              {dropdownResults.map((product) => (
                <div key={product.id} onMouseDown={() => goToProduct(product)} className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Image src={product.image} width={40} height={40} className="object-cover rounded-md" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate text-gray-800">{product.name}</h4>
                    <p className="text-brand font-bold text-xs">${product.price}</p>
                  </div>
                </div>
              ))}
              <button 
                onMouseDown={(e) => goToSearchResults(e)} 
                className="w-full py-3 mt-2 text-brand font-bold hover:bg-brand/5 text-sm border-t border-gray-100 rounded-b-xl"
              >
                View all results →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}