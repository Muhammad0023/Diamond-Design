import ProductDetailClient from './ProductDetailClient'

export async function generateMetadata({ params }) {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ')} | Diamond Design`,
    description: `Shop this beautiful Habesha dress at Diamond Design.`,
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  return <ProductDetailClient slug={slug} />
}