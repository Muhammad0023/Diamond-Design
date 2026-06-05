import HomeClient from './HomeClient'
import JsonLd from '../../components/JsonLd'

export const metadata = {
  title: 'Habesha Kemis – Authentic Habesha Dresses | Diamond Design',
  description: 'Shop Diamond Design\'s online collection of Habesha Kemis.',
  alternates: {
    canonical: 'https://www.diamonddesignstore.com',
  },
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Diamond Design',
    url: 'https://www.diamonddesignstore.com',
    logo: 'https://www.diamonddesignstore.com/logo.png',
    description: 'Authentic Habesha Kemis and traditional Ethiopian and Eritrean clothing.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Haya Hulet',
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET',
    },
    telephone: '+251988503333',
    email: 'diamonddesign907@gmail.com',
    sameAs: [
      'https://www.instagram.com/diamond__design_',
      'https://web.facebook.com/profile.php?id=61583397116912',
      'https://www.tiktok.com/@diamonddesign1_1',
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeClient />
    </>
  )
}