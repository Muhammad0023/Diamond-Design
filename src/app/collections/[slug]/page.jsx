import CategoryClient from './CategoryClient'

export async function generateMetadata({ params }) {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ')} | Diamond Design`,
    description: `Shop our ${slug.replace(/-/g, ' ')} collection at Diamond Design.`,
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params
  return <CategoryClient slug={slug} />
}