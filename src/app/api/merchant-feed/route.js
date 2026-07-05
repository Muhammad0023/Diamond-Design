



import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getFirebaseApp() {
  if (getApps().length) return getApps()[0]
  return initializeApp(firebaseConfig)
}

// Same slug logic as sitemap.js, used as a fallback for products
// that don't already have a stored `slug` field.
function generateSlug(name, id) {
  if (!name || typeof name !== 'string') return id || 'product'
  if (!id) return name.toLowerCase().replace(/[^\w-]/g, '-')
  const namePart = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${namePart}-${id}`
}

// Maps your internal category values to Google product categories.
// Adjust these if you want more specific Google taxonomy IDs later.
const CATEGORY_MAP = {
  latest: 'Apparel & Accessories > Clothing > Dresses',
  simple: 'Apparel & Accessories > Clothing > Dresses',
  wedding: 'Apparel & Accessories > Clothing > Dresses',
  chiffon: 'Apparel & Accessories > Clothing > Dresses',
  holiday: 'Apparel & Accessories > Clothing > Dresses',
  group: 'Apparel & Accessories > Clothing',
  mens: 'Apparel & Accessories > Clothing',
  couples: 'Apparel & Accessories > Clothing',
}

function escapeXml(str) {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const baseUrl = 'https://www.diamonddesignstore.com'

  let products = []
  try {
    const app = getFirebaseApp()
    const db = getFirestore(app)
    const snapshot = await getDocs(collection(db, 'products'))
    products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Merchant feed: failed to fetch products', error)
    return new Response('Failed to generate feed', { status: 500 })
  }

  const skipped = []

  const items = products
    .filter(product => {
      // Merchant Center requires a price. Skip products missing one
      // rather than submitting a broken entry.
      if (product.price === null || product.price === undefined || product.price === '') {
        skipped.push({ id: product.id, name: product.name, reason: 'missing price' })
        return false
      }
      if (!product.name) {
        skipped.push({ id: product.id, reason: 'missing name' })
        return false
      }
      const mainImage = product.image || (product.images && product.images[0])
      if (!mainImage) {
        skipped.push({ id: product.id, name: product.name, reason: 'missing image' })
        return false
      }
      return true
    })
    .map(product => {
      const slug = product.slug || generateSlug(product.name, product.id)
      const link = `${baseUrl}/product/${slug}`
      const mainImage = product.image || product.images[0]
      const extraImages = (product.images || [])
        .filter(url => url && url !== mainImage)
        .slice(0, 10) // Google allows up to 10 additional images

      const googleCategory = CATEGORY_MAP[product.category] || 'Apparel & Accessories > Clothing'

      return `
  <item>
    <g:id>${escapeXml(product.id)}</g:id>
    <title>${escapeXml(product.name)}</title>
    <description>${escapeXml(product.description || `Authentic handcrafted Habesha dress from Diamond Design.`)}</description>
    <link>${escapeXml(link)}</link>
    <g:image_link>${escapeXml(mainImage)}</g:image_link>${extraImages.map(url => `
    <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`).join('')}
    <g:availability>in_stock</g:availability>
    <g:price>${Number(product.price).toFixed(2)} USD</g:price>
    <g:brand>Diamond Design</g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>no</g:identifier_exists>
    <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>
    <g:product_type>${escapeXml(product.category || '')}</g:product_type>
  </item>`
    })
    .join('')

  if (skipped.length > 0) {
    console.warn(`Merchant feed: skipped ${skipped.length} product(s)`, skipped)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>Diamond Design Product Feed</title>
  <link>${baseUrl}</link>
  <description>Diamond Design product feed for Google Merchant Center</description>${items}
</channel>
</rss>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
