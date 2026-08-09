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

function getMimeType(url) {
  const clean = (url || '').split('?')[0].toLowerCase()
  if (clean.endsWith('.webp')) return 'image/webp'
  if (clean.endsWith('.png')) return 'image/png'
  if (clean.endsWith('.gif')) return 'image/gif'
  return 'image/jpeg'
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

export async function GET(request) {
  const baseUrl = 'https://www.diamonddesignstore.com'

  const { searchParams } = new URL(request.url)
  const categoryFilter = searchParams.get('category')

  let products = []
  try {
    const app = getFirebaseApp()
    const db = getFirestore(app)
    const snapshot = await getDocs(collection(db, 'products'))
    products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Pinterest feed: failed to fetch products', error)
    return new Response('Failed to generate feed', { status: 500 })
  }

  const skipped = []

  const items = products
    .filter(product => {
      if (categoryFilter && product.category !== categoryFilter) return false
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
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0
      return aTime - bTime
    })
    .map(product => {
      const slug = product.slug || generateSlug(product.name, product.id)
      const link = `${baseUrl}/product/${slug}`
      const mainImage = product.image || product.images[0]
      const pubDate = product.createdAt?.seconds
        ? new Date(product.createdAt.seconds * 1000).toUTCString()
        : new Date().toUTCString()

      return `
  <item>
    <title>${escapeXml(product.name)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <description>${escapeXml(product.description || `Authentic handcrafted Habesha dress from Diamond Design.`)}</description>
    <pubDate>${pubDate}</pubDate>
    <media:content url="${escapeXml(mainImage)}" medium="image" />
    <enclosure url="${escapeXml(mainImage)}" type="${getMimeType(mainImage)}" />
  </item>`
    })
    .join('')

  if (skipped.length > 0) {
    console.warn(`Pinterest feed: skipped ${skipped.length} product(s)`, skipped)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
<channel>
  <title>Diamond Design${categoryFilter ? ` - ${categoryFilter}` : ''}</title>
  <link>${baseUrl}</link>
  <description>Traditional Ethiopian &amp; Eritrean Habesha dresses from Diamond Design</description>${items}
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
