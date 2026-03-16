import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const faqData = [
  {
    question: "Do you ship internationally?",
    answer: "Yes. Diamond Design accepts orders from customers around the world. We can ship your order internationally so you can enjoy our traditional clothing wherever you are."
  },
  {
    question: "Are your outfits made to order?",
    answer: "Yes. Most of our outfits are prepared after the order is confirmed. This allows us to carefully craft each piece and ensure the best quality and fit."
  },
  {
    question: "How long does it take to prepare an order?",
    answer: "Preparation time may vary depending on the outfit and customization. Most orders are completed within a few days before shipping."
  },
  {
    question: "What types of clothing do you offer?",
    answer: "Diamond Design specializes in traditional Ethiopian and Eritrean clothing, including elegant Habesha Kemis, men's traditional outfits, and chiffon styles suitable for weddings, cultural events, and special occasions."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-medium text-gray-900 mb-8 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {item.question}
                </span>
                <HiChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {/* Fade Up Animation Wrapper */}
              <div 
                className={`grid transition-all duration-700 ease-out overflow-hidden ${
                  openIndex === index 
                    ? 'grid-rows-[1fr] opacity-100 translate-y-0' 
                    : 'grid-rows-[0fr] opacity-0 -translate-y-2'
                }`}
              >
                <div className="min-h-0 border-t border-gray-200">
                  <div className="p-5 text-sm text-gray-700 leading-loose tracking-wide" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '400' }}>
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}