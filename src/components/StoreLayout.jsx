'use client'
import Header from './Header'
import Footer from './Footer'
import CartSidebar from './CartSidebar'
import ScrollToTopButton from './ScrollToTop'

export default function StoreLayout({ children }) {
  return (
    <>
      <Header />
      <CartSidebar />
      <ScrollToTopButton />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  )
}