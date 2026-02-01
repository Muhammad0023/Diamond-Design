import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { SearchProvider } from './context/SearchContext'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import CartSidebar from './components/CartSidebar'
import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'
import SearchResults from './pages/SearchResults'
import CategoryPage from './pages/CategoryPage'

function App() {
  return (
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <CartSidebar />
            
            <main className="flex-grow">
              <Routes>
                {/* Homepage */}
                <Route path="/" element={<HomePage />} />
                
                {/* Product Detail Page */}
                <Route path="/product/:id" element={<ProductDetail />} />
                
                {/* Search Results Page */}
                <Route path="/search" element={<SearchResults />} />
                
                {/* Category Pages - Dresses */}
                <Route path="/dresses/simple" element={<CategoryPage />} />
                <Route path="/dresses/wedding" element={<CategoryPage />} />
                <Route path="/dresses/chiffon" element={<CategoryPage />} />
                <Route path="/dresses/holiday" element={<CategoryPage />} />
                <Route path="/dresses/group" element={<CategoryPage />} />
                
                {/* Category Pages - Other */}
                <Route path="/mens" element={<CategoryPage />} />
                <Route path="/couples" element={<CategoryPage />} />
                
                {/* Dynamic category route (catches all) */}
                <Route path="/dresses/:category" element={<CategoryPage />} />
                
                {/* Support Pages (for future) */}
                <Route path="/about" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">About Us Page (Coming Soon)</div>} />
                <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Contact Us Page (Coming Soon)</div>} />
                <Route path="/faqs" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">FAQs Page (Coming Soon)</div>} />
                <Route path="/size-guide" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Size Guide Page (Coming Soon)</div>} />
              </Routes>
            </main>
            
            <Footer />
            <WhatsAppFloat />
          </div>
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  )
}

export default App
