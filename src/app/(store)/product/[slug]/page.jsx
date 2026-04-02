export const dynamic = 'force-dynamic'
import ProductDetailClient from './ProductDetailClient'
import JsonLd from '../../../../components/JsonLd'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const productName = slug.replace(/-[^-]*$/, '').replace(/-/g, ' ')
  return {
    title: `${productName} | Diamond Design`,
    description: `Shop ${productName} at Diamond Design. Premium handcrafted Habesha fashion with worldwide shipping.`,
    openGraph: {
      title: `${productName} | Diamond Design`,
      type: 'og:product',
    },
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const productName = slug.replace(/-[^-]*$/, '').replace(/-/g, ' ')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    brand: {
      '@type': 'Brand',
      name: 'Diamond Design',
    },
    description: 'Authentic handcrafted Habesha dress from Diamond Design.',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      seller: {
        '@type': 'Organization',
        name: 'Diamond Design',
      },
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetailClient slug={slug} />
    </>
  )
}