export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/abulhabesh/',
    },
    sitemap: 'https://www.diamonddesignstore.com/sitemap.xml',
  }
}