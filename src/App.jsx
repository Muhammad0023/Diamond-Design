import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';
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
import Faqs from './pages/Faqs' // ✅ We imported your new FAQs page here!
import ScrollToTopButton from './components/ScrollToTop'

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Diamond Design | Traditional Ethiopian Habesha Dresses</title>
        <meta name="description" content="Shop authentic handcrafted Ethiopian Habesha dresses. Premium traditional designs delivered across Ethiopia." />
        <meta name="keywords" content="Habesha dress, Ethiopian traditional dress, Diamond Design" />
        <meta property="og:site_name" content="Diamond Design" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.diamonddesignstore.com/" />
      </Helmet>

      {/* ✅ FIX: BrowserRouter wraps everything so useLocation works everywhere */}
      <BrowserRouter>
        <AuthProvider>
          <ProductsProvider>
            {/* ✅ FIX: SearchProvider is inside ProductsProvider AND BrowserRouter
                so it always has access to latest products AND router context */}
            <SearchProvider>
              <CartProvider>
                <ScrollToTopOnNavigate />
                <Routes>

                  {/* ADMIN ROUTES */}
                  <Route path="/abulhabesh" element={<AdminLogin />} />
                  <Route path="/abulhabesh/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/abulhabesh/add-product" element={<ProtectedRoute><AddEditProduct /></ProtectedRoute>} />
                  <Route path="/abulhabesh/edit-product/:id" element={<ProtectedRoute><AddEditProduct /></ProtectedRoute>} />

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
                            <Route path="/product/:slug" element={<ProductDetail />} />
                            <Route path="/search" element={<SearchResults />} />

                            {/* ✅ SEO-friendly /collections/:slug routes */}
                            <Route path="/collections/:slug" element={<CategoryPage />} />

                            {/* ✅ Legacy routes — auto-redirects to /collections/ */}
                            <Route path="/dresses/:category" element={<CategoryPage legacyMode />} />
                            <Route path="/mens" element={<CategoryPage legacyMode manualCategory="mens" />} />
                            <Route path="/couples" element={<CategoryPage legacyMode manualCategory="couples" />} />

                            {/* Support Pages */}
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />

                            {/* ✅ Cleaned up FAQs Route */}
                            <Route path="/faqs" element={<Faqs />} />
                            
                            {/* Size Guide Placeholder */}
                            <Route path="/size-guide" element={
                              <>
                                <Helmet>
                                  <title>Size Guide | Diamond Design – Find Your Perfect Habesha Dress Fit</title>
                                  <meta name="description" content="Use Diamond Design's size guide to find your perfect Habesha Kemis fit. Measurements for women's, men's, and couples collections." />
                                  <link rel="canonical" href="https://www.diamonddesignstore.com/size-guide" />
                                </Helmet>
                                <div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Size Guide Page (Coming Soon)</div>
                              </>
                            } />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
                    }
                  />
                </Routes>
              </CartProvider>
            </SearchProvider>
          </ProductsProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App