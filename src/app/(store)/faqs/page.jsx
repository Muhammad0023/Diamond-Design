import FaqsClient from './FaqsClient'

export const metadata = {
  title: 'FAQs | Diamond Design – Orders, Shipping & Habesha Kemis',
  description: 'Find answers to common questions about Diamond Design Habesha dresses — sizing, shipping, custom orders, and more.',
  alternates: {
    canonical: 'https://www.diamonddesignstore.com/faqs',
  },
  openGraph: {
    title: 'FAQs | Diamond Design',
    description: 'Find answers to common questions about Diamond Design Habesha dresses.',
    url: 'https://www.diamonddesignstore.com/faqs',
    type: 'website',
  },
}

export default function FaqsPage() {
  return <FaqsClient />
}