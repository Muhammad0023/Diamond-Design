'use client'

import { AuthProvider } from '../context/AuthContext'
import { ProductsProvider } from '../context/ProductsContext'
import { CartProvider } from '../context/CartContext'
import { SearchProvider } from '../context/SearchContext'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ProductsProvider>
        <SearchProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </SearchProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}