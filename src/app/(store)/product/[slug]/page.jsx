export const dynamic = 'force-dynamic'
import ProductDetailClient from './ProductDetailClient'
import JsonLd from '../../../../components/JsonLd'
import { getProductById } from '../../../../firebase/productService'
import { toProxyImageUrl } from '../../../../utils/proxyImage'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const productId = slug.split('-').at(-1)
  const product = await getProductById(productId)
  const productName = product?.name ?? slug.replace(/-[^-]*$/, '').replace(/-/g, ' ')

  return {
    title: `${productName} | Diamond Design`,
    description: `Shop ${productName} at Diamond Design. Premium handcrafted Habesha fashion with worldwide shipping.`,
    alternates: {
      canonical: `https://www.diamonddesignstore.com/product/${slug}`,
    },
    openGraph: {
      title: `${productName} | Diamond Design`,
      type: 'website',
      images: product?.image ? [{ url: toProxyImageUrl(product.image) }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const productId = slug.split('-').at(-1)
  const product = await getProductById(productId)

  const productName = product?.name ?? slug.replace(/-[^-]*$/, '').replace(/-/g, ' ')
  const productPrice = product?.price ?? null
  const productImage = toProxyImageUrl(product?.image) ?? null
  const productDescription = product?.description ?? 'Authentic handcrafted Habesha dress from Diamond Design.'
  const productUrl = `https://www.diamonddesignstore.com/product/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    url: productUrl,
    ...(productImage && { image: [productImage] }),
    brand: {
      '@type': 'Brand',
      name: 'Diamond Design',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      ...(productPrice !== null && {
        price: String(productPrice),
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .split('T')[0],
      }),
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'Diamond Design',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 7,
            maxValue: 21,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  )
}