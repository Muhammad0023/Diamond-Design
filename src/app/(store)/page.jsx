import HomeClient from './HomeClient'
import JsonLd from '../../components/JsonLd'
import { getAllProducts } from '../../firebase/productService'

export const metadata = {
  title: 'Habesha Kemis – Authentic Habesha Dresses | Diamond Design',
  description: 'Shop Diamond Design\'s online collection of Habesha Kemis.',
  alternates: {
    canonical: 'https://www.diamonddesignstore.com',
  },
}

// Keep the homepage product lists in server memory for 5 minutes, so visitors share one Firestore load
const CACHE_MS = 5 * 60 * 1000
let homeCache = { time: 0, data: null }

async function getInitialHome() {
  if (homeCache.data && Date.now() - homeCache.time < CACHE_MS) return homeCache.data
  try {
    const all = await getAllProducts()
    const slim = all.map((p) => ({
      id: p.id,
      slug: p.slug ?? null,
      name: p.name ?? '',
      price: p.price ?? null,
      image: p.image ?? null,
      hoverImage: p.hoverImage ?? null,
      images: (p.images || []).slice(0, 2),
      isNew: p.isNew ?? false,
      category: p.category ?? null,
    }))
    const pick = (cat) => slim.filter((p) => p.category === cat).slice(0, 8)
    const data = {
      latest: slim.filter((p) => p.isNew === true).slice(0, 13),
      simple: pick('simple'),
      wedding: pick('wedding'),
      chiffon: pick('chiffon'),
      holiday: pick('holiday'),
      group: pick('group'),
      mens: pick('mens'),
      couples: pick('couples'),
    }
    homeCache = { time: Date.now(), data }
    return data
  } catch (err) {
    console.error('Error loading homepage products:', err)
    return homeCache.data
  }
}

export default async function HomePage() {
  const initialHome = await getInitialHome()
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
    email: 'diamonddesign.habesha@gmail.com',
    sameAs: [
      'https://www.instagram.com/diamond__design_',
      'https://web.facebook.com/profile.php?id=61583397116912',
      'https://www.tiktok.com/@diamonddesign1_1',
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeClient initialHome={initialHome} />
    </>
  )
}