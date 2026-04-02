export const dynamic = 'force-dynamic'
import CategoryClient from './CategoryClient'
import JsonLd from '../../../../components/JsonLd'

const slugMetadata = {
  'habesha-kemis-simple': {
    title: 'Habesha Kemis for Weddings & Special Occasions | Diamond Design',
    description: 'Discover simple Habesha Kemis designed for weddings, holidays, shimglina, graduation and special events.',
  },
  'habesha-wedding-dresses': {
    title: 'Habesha Wedding Dresses – Ethiopian & Eritrean Bridal Styles | Diamond Design',
    description: 'Discover elegant Habesha wedding dresses crafted for Ethiopian and Eritrean brides.',
  },
  'habesha-chiffon-dresses': {
    title: 'Chiffon Habesha Dresses – Elegant Ethiopian & Eritrean Styles | Diamond Design',
    description: 'Explore chiffon Habesha dresses with light, flowing Ethiopian and Eritrean designs.',
  },
  'event-holiday-habesha-dresses': {
    title: 'Habesha Holiday Dresses for Timket & Enkutatash | Diamond Design',
    description: 'Shop Habesha holiday dresses for Ethiopian and Eritrean celebrations.',
  },
  'habesha-family-group-outfits': {
    title: 'Habesha Family Group Outfits – Matching Ethiopian Styles | Diamond Design',
    description: 'Shop matching Habesha group outfits for families and friends.',
  },
  'habesha-mens-traditional-clothing': {
    title: 'Habesha Menswear – Traditional Ethiopian & Eritrean Clothing | Diamond Design',
    description: 'Explore Habesha menswear featuring traditional Ethiopian and Eritrean clothing.',
  },
  'matching-habesha-couples': {
    title: 'Matching Habesha Couples Outfits for Weddings & Holidays | Diamond Design',
    description: 'Discover matching Habesha couples outfits with elegant Ethiopian and Eritrean designs.',
  },
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const meta = slugMetadata[slug]
  return {
    title: meta?.title || `${slug.replace(/-/g, ' ')} | Diamond Design`,
    description: meta?.description || `Shop our ${slug.replace(/-/g, ' ')} collection at Diamond Design.`,
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: slugMetadata[slug]?.title || slug,
    description: slugMetadata[slug]?.description || '',
    url: `https://www.diamonddesignstore.com/collections/${slug}`,
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <CategoryClient slug={slug} />
    </>
  )
}