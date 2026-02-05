import { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts } from '../firebase/productService';

const ProductsContext = createContext();

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
  try {
    setLoading(true);
    const fetchedProducts = await getAllProducts();

    // INNOVATIVE FIX: Ensure every product has an image2
    const sanitizedProducts = fetchedProducts.map(product => ({
      ...product,
      // If image2 is missing in Firebase, we use the first image as a backup
      // This prevents the hover effect from showing a broken/blank space
      image2: product.image2 || product.image 
    }));

    setProducts(sanitizedProducts);
    setError(null);
  } catch (err) {
    console.error('Error fetching products:', err);
    setError('Failed to load products. Please refresh the page.');
  } finally {
    setLoading(false);
  }
};

    fetchProducts();
  }, []);

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter(p => p.category === category);
  };

  // Get latest products (first 12)
  const getLatestProducts = () => {
    return products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 12);
  };

  // Get single product by ID
  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  // Get all products organized by category
  const getProductsByCategoryGroups = () => {
    return {
      latest: getLatestProducts(),
      simple: getProductsByCategory('simple'),
      wedding: getProductsByCategory('wedding'),
      chiffon: getProductsByCategory('chiffon'),
      holiday: getProductsByCategory('holiday'),
      group: getProductsByCategory('group'),
      mens: getProductsByCategory('mens'),
      couples: getProductsByCategory('couples'),
    };
  };

  const value = {
    products,
    loading,
    error,
    getProductsByCategory,
    getLatestProducts,
    getProductById,
    getProductsByCategoryGroups,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
