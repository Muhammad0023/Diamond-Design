import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact Diamond Design | Habesha Kemis & Traditional Clothing',
  description: 'Contact Diamond Design for custom orders, sizing, or shipping information. Based in Haya Hulet, Addis Ababa. Reach us easily via WhatsApp, phone, or email.',
  alternates: {
    canonical: 'https://www.diamonddesignstore.com/contact',
  },
  openGraph: {
    title: 'Contact Diamond Design | Get In Touch',
    description: 'Contact Diamond Design for custom orders, sizing, or shipping information.',
    url: 'https://www.diamonddesignstore.com/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactClient />
}