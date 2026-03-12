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
  const { products } = useProducts();

  const performSearch = useCallback((query) => {
    if (!query || query.trim() === '') return [];
    
    const searchTerm = query.toLowerCase().trim();
    
    // ✅ IMPROVED LOGIC: Simple synonym/plural mapping
    let modifiedSearch = searchTerm;
    if (searchTerm === 'mice') modifiedSearch = 'mouse';
    if (searchTerm === 'dresses') modifiedSearch = 'dress';

    return products.filter(product => {
      const name = product.name?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || ''; // Added description check

      // Check if the name includes the term OR the term includes the name
      const nameMatch = name.includes(modifiedSearch) || modifiedSearch.includes(name);
      const categoryMatch = category.includes(modifiedSearch);
      const descriptionMatch = description.includes(modifiedSearch);

      return nameMatch || categoryMatch || descriptionMatch;
    });
  }, [products]);

  const getSuggestion = useCallback((query) => {
    const commonTerms = [
      'wedding', 'simple', 'chiffon', 'holiday', 'group', 'mens', 'couples',
      'dress', 'kemis', 'habesha', 'white', 'golden', 'blue', 'red', 'green', 'mouse'
    ];
    const searchTerm = query.toLowerCase().trim();
    return commonTerms.find(term =>
      term.includes(searchTerm) || searchTerm.includes(term)
    ) || null;
  }, []);

  const clearSearch = useCallback(() => {}, []);

  return (
    <SearchContext.Provider value={{ performSearch, getSuggestion, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}