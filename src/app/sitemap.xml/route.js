import { toProxyImageUrl } from '../../utils/proxyImage'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore'

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

function escapeXml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const baseUrl = 'https://www.diamonddesignstore.com'

  const staticPages = [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}/latest-habesha-styles`, priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-kemis-simple`, priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-wedding-dresses`, priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-chiffon-dresses`, priority: 0.8 },
    { url: `${baseUrl}/collections/event-holiday-habesha-dresses`, priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-family-group-outfits`, priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-mens-traditional-clothing`, priority: 0.8 },
    { url: `${baseUrl}/collections/matching-habesha-couples`, priority: 0.8 },
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/contact`, priority: 0.5 },
    { url: `${baseUrl}/faqs`, priority: 0.4 },
    { url: `${baseUrl}/size-guide`, priority: 0.4 },
  ]

  let productEntries = []

  try {
    const app = getFirebaseApp()
    const db = getFirestore(app)
    const q = query(collection(db, 'products'), orderBy('updatedAt', 'desc'))
    const snapshot = await getDocs(q)

    productEntries = snapshot.docs.map(doc => {
      const data = doc.data()
      const slug = generateSlug(data.name, doc.id)
      const lastMod = data.updatedAt?.toDate?.() || new Date()

      const images = []
      if (data.image) images.push(toProxyImageUrl(data.image))
      if (data.hoverImage && data.hoverImage !== data.image) images.push(toProxyImageUrl(data.hoverImage))

      return {
        url: `${baseUrl}/product/${slug}`,
        lastModified: lastMod.toISOString(),
        images,
      }
    })
  } catch (error) {
    console.error('Sitemap: failed to fetch products', error)
  }

  const staticXml = staticPages
    .map(
      page => `  <url>
    <loc>${escapeXml(page.url)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n')

  const productXml = productEntries
    .map(entry => {
      const imageTags = entry.images
        .map(
          img => `
    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
    </image:image>`
        )
        .join('')

      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imageTags}
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticXml}
${productXml}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
