import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'
import { SearchProvider } from './context/SearchContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'
import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'
import SearchResults from './pages/SearchResults'
import CategoryPage from './pages/CategoryPage'
import LatestDesignsPage from './pages/LatestDesignsPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AddEditProduct from './pages/admin/AddEditProduct'
import About from './pages/About'
import Contact from './pages/Contact'
import ScrollToTopButton from './components/ScrollToTop' 
import { HelmetProvider } from 'react-helmet-async'; // Added import

// --- SCROLL TO TOP ON ROUTE CHANGE ---
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <HelmetProvider> {/* Wrapped everything to fix the White Screen/Undefined error */}
      <AuthProvider>
        <ProductsProvider>
          <SearchProvider>
            <CartProvider>
              <BrowserRouter>
                <ScrollToTopOnNavigate />
                
                <Routes>
                  {/* ADMIN ROUTES - Using /abulhabesh */}
                  <Route path="/abulhabesh" element={<AdminLogin />} />
                  <Route 
                    path="/abulhabesh/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/abulhabesh/add-product" 
                    element={
                      <ProtectedRoute>
                        <AddEditProduct />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/abulhabesh/edit-product/:id" 
                    element={
                      <ProtectedRoute>
                        <AddEditProduct />
                      </ProtectedRoute>
                    } 
                  />

                  {/* STORE ROUTES */}
                  <Route 
                    path="/*" 
                    element={
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <CartSidebar />
                        <ScrollToTopButton />
                        
                        <main className="flex-grow">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/latest-designs" element={<LatestDesignsPage />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/search" element={<SearchResults />} />
                            
                            {/* Category Routes */}
                            <Route path="/dresses/:category" element={<CategoryPage />} />
                            <Route path="/mens" element={<CategoryPage manualCategory="mens" />} />
                            <Route path="/couples" element={<CategoryPage manualCategory="couples" />} />
                            
                            {/* Support Pages */}
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            
                            {/* Remaining Placeholders */}
                            <Route path="/faqs" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">FAQs Page (Coming Soon)</div>} />
                            <Route path="/size-guide" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Size Guide Page (Coming Soon)</div>} />
                          </Routes>
                        </main>
                        
                        <Footer />
                      </div>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </SearchProvider>
        </ProductsProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App