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

export default async function sitemap() {
  const baseUrl = 'https://www.diamonddesignstore.com'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/latest-habesha-styles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-kemis-simple`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-wedding-dresses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-chiffon-dresses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/event-holiday-habesha-dresses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-family-group-outfits`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/habesha-mens-traditional-clothing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/matching-habesha-couples`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faqs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/size-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  try {
    const app = getFirebaseApp()
    const db = getFirestore(app)
    const q = query(collection(db, 'products'), orderBy('updatedAt', 'desc'))
    const snapshot = await getDocs(q)

    const productPages = snapshot.docs.map(doc => {
      const data = doc.data()
      const slug = generateSlug(data.name, doc.id)
      return {
        url: `${baseUrl}/product/${slug}`,
        lastModified: data.updatedAt?.toDate?.() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }
    })

    return [...staticPages, ...productPages]
  } catch (error) {
    console.error('Sitemap: failed to fetch products', error)
    return staticPages
  }
}
