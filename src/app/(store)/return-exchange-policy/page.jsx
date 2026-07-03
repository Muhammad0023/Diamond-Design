import ReturnExchangeClient from './ReturnExchangeClient'

export const metadata = {
  title: 'Return & Exchange Policy | Diamond Design',
  description: 'Learn about Diamond Design\'s return and exchange policy for Habesha Kemis and traditional Ethiopian and Eritrean clothing orders.',
  alternates: {
    canonical: 'https://www.diamonddesignstore.com/return-exchange-policy',
  },
  openGraph: {
    title: 'Return & Exchange Policy | Diamond Design',
    description: 'Everything you need to know about returns, exchanges, and refunds at Diamond Design.',
    url: 'https://www.diamonddesignstore.com/return-exchange-policy',
    type: 'website',
  },
}

export default function ReturnExchangePolicyPage() {
  return <ReturnExchangeClient />
}
