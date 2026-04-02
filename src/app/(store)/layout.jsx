export const dynamic = 'force-dynamic'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CartSidebar from '../../components/CartSidebar'
import ScrollToTopButton from '../../components/ScrollToTop'

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