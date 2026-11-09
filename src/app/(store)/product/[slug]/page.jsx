export const dynamic = 'force-dynamic'
import ProductDetailClient from './ProductDetailClient'
import JsonLd from '../../../../components/JsonLd'
import { cache } from 'react'
import { getProductById as fetchProductById } from '../../../../firebase/productService'
import { notFound } from 'next/navigation'
import { toProxyImageUrl } from '../../../../utils/proxyImage'

// One fetch per request, shared by generateMetadata and the page
const getProductById = cache(fetchProductById)

export async function generateMetadata({ params }) {
  const { slug } = await params
  const productId = slug.split('-').at(-1)
  const product = await getProductById(productId)
  if (!product) {
    return { title: "Product Not Found | Diamond Design", robots: { index: false, follow: false } }
  }
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
      url: `https://www.diamonddesignstore.com/product/${slug}`,
      siteName: 'Diamond Design',
      images: product?.image ? [{ url: toProxyImageUrl(product.image, productName) }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | Diamond Design`,
      images: product?.image ? [toProxyImageUrl(product.image, productName)] : [],
    },
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const productId = slug.split('-').at(-1)
  const product = await getProductById(productId)
  if (!product) {
    notFound()
  }

  const productName = product?.name ?? slug.replace(/-[^-]*$/, '').replace(/-/g, ' ')
  const productPrice = product?.price ?? null
  const rawImages = [
    product?.image,
    ...(product?.hoverImage && product.hoverImage !== product.image ? [product.hoverImage] : []),
    ...(product?.images || []).filter((img) => img !== product?.image && img !== product?.hoverImage),
  ].filter(Boolean)
  const productImages = rawImages.map((src, i) =>
    toProxyImageUrl(src, i === 0 ? productName : `${productName} ${i + 1}`)
  )
  const productDescription = product?.description ?? 'Authentic handcrafted Habesha dress from Diamond Design.'
  const productUrl = `https://www.diamonddesignstore.com/product/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    url: productUrl,
    ...(productImages.length > 0 && { image: productImages }),
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
      <ProductDetailClient slug={slug} initialProduct={JSON.parse(JSON.stringify(product))} />
    </>
  )
}