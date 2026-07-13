export function toProxyImageUrl(firebaseUrl) {
  if (!firebaseUrl) return firebaseUrl
  const encoded = Buffer.from(firebaseUrl, 'utf-8').toString('base64url')
  return `https://www.diamonddesignstore.com/product-image/${encoded}`
}
