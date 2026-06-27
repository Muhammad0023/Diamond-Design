import Providers from './providers'
import { Roboto } from 'next/font/google'
import './globals.css'

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Habesha Kemis – Authentic Habesha Dresses | Diamond Design',
  description: 'Shop Diamond Design\'s online collection of Habesha Kemis. Elegant Habesha, Ethiopian, and Eritrean dresses designed for weddings, holidays, and special occasions.',
  keywords: 'Habesha Kemis, Habesha Dress, Ethiopian Dress, Eritrean Dress, Ethiopian Wedding Dress, Traditional Habesha Clothing, Diamond Design',
  robots: 'index, follow',
  openGraph: {
    title: 'Habesha Kemis | Authentic Ethiopian & Eritrean Dresses',
    description: 'Authentic Habesha Kemis and elegant Ethiopian and Eritrean dresses crafted for weddings, holidays, and unforgettable moments.',
    url: 'https://www.diamonddesignstore.com',
    siteName: 'Diamond Design',
    images: [
      {
        url: 'https://www.diamonddesignstore.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Elegant Habesha Kemis dress from Diamond Design collection',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habesha Kemis | Authentic Ethiopian & Eritrean Dresses',
    description: 'Authentic Habesha Kemis and elegant Ethiopian and Eritrean dresses crafted for weddings, holidays, and unforgettable moments.',
    images: ['https://www.diamonddesignstore.com/og-image.jpg'],
  },
  other: {
    'p:domain_verify': '83d6370c60a575dcaf2873ffbc4bb26e',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <head>
          <link rel="icon" media="(prefers-color-scheme: dark)" href="/favicon-light.png" />
          <link rel="icon" media="(prefers-color-scheme: light)" href="/favicon-dark.png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="preconnect" href="https://diamond-design-49de2.firebaseapp.com" />
          <link rel="preconnect" href="https://firestore.googleapis.com" />
          <link rel="preconnect" href="https://www.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
