'use client'
import { usePathname } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'

const WHATSAPP_NUMBER = '251988503333'
const MESSAGE = 'Hi Diamond Design! 👋'

// Pages where the button must not appear
const HIDDEN_PREFIXES = ['/checkout', '/payment', '/order-confirmation', '/abulhabesh']

export default function WhatsAppFloat() {
  const pathname = usePathname() || '/'

  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return null
  }

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Diamond Design on WhatsApp"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      className="fixed right-4 sm:right-6 z-40 flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 w-14 sm:w-auto sm:px-5 motion-safe:transition-transform motion-safe:duration-200 hover:bg-[#20ba59] motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
      <span className="hidden sm:inline text-sm font-medium">Chat with us</span>
    </a>
  )
}
