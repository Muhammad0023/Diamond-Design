'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts, getProductsByCategoryLimited, getLatestProductsLimited } from '../firebase/productService';

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
  const [homeProducts, setHomeProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Check cache first
        const cached = sessionStorage.getItem('dd_products');
        const cachedTime = sessionStorage.getItem('dd_products_time');
        const cacheAge = Date.now() - parseInt(cachedTime || '0');
        const cacheValid = cached && cacheAge < 5 * 60 * 1000; // 5 minutes

        let fetchedProducts;
        if (cacheValid) {
          fetchedProducts = JSON.parse(cached);
        } else {
          fetchedProducts = await getAllProducts();
          sessionStorage.setItem('dd_products', JSON.stringify(fetchedProducts));
          sessionStorage.setItem('dd_products_time', Date.now().toString());
        }

        const sanitizedProducts = fetchedProducts.map(product => ({
          ...product,
          image2: product.image2 || product.image
        }));
        setProducts(sanitizedProducts);
        setError(null);

        // Fetch limited products for homepage
        const [latest, simple, wedding, chiffon, holiday, group, mens, couples] = await Promise.all([
          getLatestProductsLimited(13),
          getProductsByCategoryLimited('simple', 8),
          getProductsByCategoryLimited('wedding', 8),
          getProductsByCategoryLimited('chiffon', 8),
          getProductsByCategoryLimited('holiday', 8),
          getProductsByCategoryLimited('group', 8),
          getProductsByCategoryLimited('mens', 8),
          getProductsByCategoryLimited('couples', 8),
        ]);
        setHomeProducts({ latest, simple, wedding, chiffon, holiday, group, mens, couples });
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

  // Get latest products of unlimited on the latest page
  const getLatestProducts = () => {
    return products
      .filter(p => p.isNew === true || p.category === 'latest')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    homeProducts,
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
