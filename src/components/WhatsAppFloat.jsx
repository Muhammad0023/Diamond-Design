/* import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number (format: country code + number, no + or spaces)
    const phoneNumber = '251911234567'; // Example: Ethiopia +251 911 234 567
    const message = encodeURIComponent('Hello Diamond Design! I\'m interested in your products.');
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappURL, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce-slow"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" />
      
      //  Pulse rings effect 
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
    </button>
  );
}

// Add custom animation for subtle bounce
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }
`;
document.head.appendChild(style);
*/
