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
                
                {/* Category Pages (for future) */}
                <Route path="/dresses/simple" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Simple Dresses Page (Coming Soon)</div>} />
                <Route path="/dresses/wedding" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Wedding Dresses Page (Coming Soon)</div>} />
                <Route path="/dresses/chiffon" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Chiffon Page (Coming Soon)</div>} />
                <Route path="/dresses/holiday" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Holiday Page (Coming Soon)</div>} />
                <Route path="/dresses/group" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Group Outfits Page (Coming Soon)</div>} />
                <Route path="/mens" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Men's Page (Coming Soon)</div>} />
                <Route path="/couples" element={<div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">Couples Page (Coming Soon)</div>} />
                
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
