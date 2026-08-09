import PrivacyPolicyClient from './PrivacyPolicyClient'

export const metadata = {
  title: 'Privacy Policy | Diamond Design',
  description: 'Learn how Diamond Design collects, uses, and protects your information when you visit our website for Habesha Kemis and traditional Ethiopian and Eritrean clothing.',
  alternates: {
    canonical: 'https://www.diamonddesignstore.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Diamond Design',
    description: 'Learn how Diamond Design collects, uses, and protects your information.',
    url: 'https://www.diamonddesignstore.com/privacy-policy',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />
}
