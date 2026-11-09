const BASE = 'https://www.diamonddesignstore.com'

function encodeBase64Url(str) {
  // Node uses Buffer; the browser uses btoa (these URLs are plain ASCII, so the output is identical)
  if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf-8').toString('base64url')
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function getExtension(firebaseUrl) {
  try {
    const objectName = decodeURIComponent(new URL(firebaseUrl).pathname.split('/o/')[1] || '')
    const match = objectName.match(/\.(webp|jpe?g|png|gif|avif)$/i)
    return match ? match[1].toLowerCase() : 'jpg'
  } catch {
    return 'jpg'
  }
}

// name is optional: pass a product name (with a number for extra images) to get a readable file name at the end
export function toProxyImageUrl(firebaseUrl, name) {
  if (!firebaseUrl) return firebaseUrl
  const encoded = encodeBase64Url(firebaseUrl)
  const file = name ? `/${slugify(name)}.${getExtension(firebaseUrl)}` : ''
  return `${BASE}/product-image/${encoded}${file}`
}
