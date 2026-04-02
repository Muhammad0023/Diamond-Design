import SizeGuideClient from './SizeGuideClient'

export const metadata = {
  title: 'Size Guide | Diamond Design – Habesha Dress Sizing',
  description: 'Find your perfect Habesha dress size with our sizing guide.',
  alternates: {
    canonical: 'https://www.diamonddesignstore.com/size-guide',
  },
  openGraph: {
    title: 'Size Guide | Diamond Design',
    description: 'Find your perfect Habesha dress size with our sizing guide.',
    url: 'https://www.diamonddesignstore.com/size-guide',
    type: 'website',
  },
}

export default function SizeGuidePage() {
  return <SizeGuideClient />
}