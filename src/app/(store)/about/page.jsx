import AboutClient from './AboutClient'

export const metadata = {
  title: 'About Diamond Design | Habesha Kemis & Traditional Clothing',
  description: 'Learn about Diamond Design, a brand inspired by Ethiopian and Eritrean tradition We create elegant Habesha Kemis and traditional outfits for women, men, and couples.',
  alternates: {
    canonical: 'https://www.diamonddesignstore.com/about',
  },
  openGraph: {
    title: 'About Diamond Design | Celebrate in Habesha Style',
    description: 'Every dress tells a story. Handwoven Habesha Kemis made with love, bringing Ethiopian and Eritrean heritage to your wardrobe.',
    url: 'https://www.diamonddesignstore.com/about',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutClient />
}