import { createContext, useContext, useState } from 'react';
import { sampleProducts } from '../pages/HomePage';

const SearchContext = createContext();

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}

// Get all products in a single array
const getAllProducts = () => {
  return [
    ...sampleProducts.latest,
    ...sampleProducts.simple,
    ...sampleProducts.wedding,
    ...sampleProducts.chiffon,
    ...sampleProducts.holidays,
    ...sampleProducts.group,
    ...sampleProducts.mens,
    ...sampleProducts.couples,
  ];
};

export function SearchProvider({ children }) {
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

    const allProducts = getAllProducts();
    const searchTerm = query.toLowerCase().trim();

    // Search in product name and category
    const results = allProducts.filter(product => {
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
