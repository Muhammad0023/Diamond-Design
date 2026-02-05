import { db } from './config';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const PRODUCTS_COLLECTION = 'products';

// ─── CREATE ─────────────────────────────────────────
// Add a new product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: new Date()
    });
    console.log('Product added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// ─── READ ───────────────────────────────────────────
// Get ALL products
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get ONE product by ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('Product not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get products by CATEGORY
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category)
    );
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Get latest products (sorted by createdAt)
export const getLatestProducts = async (limit = 12) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const products = snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return products;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    throw error;
  }
};

// Search products by name or category
export const searchProducts = async (searchTerm) => {
  try {
    const allProducts = await getAllProducts();
    const term = searchTerm.toLowerCase();
    
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// ─── UPDATE ─────────────────────────────────────────
// Update an existing product
export const updateProduct = async (productId, updatedData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: new Date()
    });
    console.log('Product updated:', productId);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// ─── DELETE ─────────────────────────────────────────
// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
    console.log('Product deleted:', productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ─── REAL-TIME LISTENER ─────────────────────────────
// Listen for product changes in real-time
export const listenToProducts = (callback) => {
  const unsubscribe = onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(products);
    },
    (error) => {
      console.error('Error listening to products:', error);
    }
  );

  return unsubscribe; // Call this to stop listening
};
