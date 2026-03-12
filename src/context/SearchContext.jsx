import { createContext, useContext, useState, useCallback } from 'react';
import { useProducts } from './ProductsContext';

const SearchContext = createContext();

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}

export function SearchProvider({ children }) {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // ✅ FIX: performSearch is now a pure function — NO setState inside
  // It just filters and returns results. State updates are separate.
  const performSearch = useCallback((query) => {
    if (!query || query.trim() === '') return [];

    const searchTerm = query.toLowerCase().trim();

    return products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      return nameMatch || categoryMatch;
    });
  }, [products]);

  // Separate function to update query state — only called from event handlers
  const setQuery = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  const getSuggestion = useCallback((query) => {
    const commonTerms = [
      'wedding', 'simple', 'chiffon', 'holiday', 'group', 'mens', 'couples',
      'dress', 'kemis', 'habesha', 'white', 'golden', 'blue', 'red', 'green'
    ];
    const searchTerm = query.toLowerCase().trim();
    return commonTerms.find(term =>
      term.includes(searchTerm) || searchTerm.includes(term)
    ) || null;
  }, []);

  const value = {
    searchQuery,
    isSearching,
    performSearch,
    setQuery,
    clearSearch,
    getSuggestion,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}