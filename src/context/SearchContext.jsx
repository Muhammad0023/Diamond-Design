import { createContext, useContext, useCallback } from 'react';
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
  // ✅ FIX: We read products directly from ProductsContext here
  // This means performSearch ALWAYS uses the latest products array
  // even after Firebase finishes loading on page 2, 3, or any route
  const { products } = useProducts();

  // Pure search function — no setState, safe to call inside useMemo
  // Re-created whenever products array updates (Firebase load complete)
  const performSearch = useCallback((query) => {
    if (!query || query.trim() === '') return [];
    const searchTerm = query.toLowerCase().trim();
    return products.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
      return nameMatch || categoryMatch;
    });
  }, [products]); // ✅ re-runs when products load from Firebase

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

  const clearSearch = useCallback(() => {}, []); // kept for backward compat

  return (
    <SearchContext.Provider value={{ performSearch, getSuggestion, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}