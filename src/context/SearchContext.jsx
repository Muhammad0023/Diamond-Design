import { createContext, useContext, useState } from 'react';
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
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search function
  const performSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (!query || query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return [];
    }

    const searchTerm = query.toLowerCase().trim();

    // Search in product name and category
    const results = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      return nameMatch || categoryMatch;
    });

    setSearchResults(results);
    setIsSearching(false);
    return results;
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Get suggestions for typos (simple implementation)
  const getSuggestion = (query) => {
    const commonTerms = [
      'wedding', 'simple', 'chiffon', 'holiday', 'group', 'mens', 'couples',
      'dress', 'kemis', 'habesha', 'white', 'golden', 'blue', 'red', 'green'
    ];

    const searchTerm = query.toLowerCase().trim();
    
    // Find closest match
    const suggestion = commonTerms.find(term => 
      term.includes(searchTerm) || searchTerm.includes(term)
    );

    return suggestion || null;
  };

  const value = {
    searchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    getSuggestion,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}
