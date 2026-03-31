import Providers from './providers'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartSidebar from '../components/CartSidebar'
import ScrollToTopButton from '../components/ScrollToTop'
import './globals.css'

export const metadata = {
  title: 'Diamond Design | Traditional Ethiopian Habesha Dresses',
  description: 'Shop authentic handcrafted Ethiopian Habesha dresses.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <CartSidebar />
          <ScrollToTopButton />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}