import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom'; // Import Link
import FaqSection from '../components/FaqSection';

export default function Faqs() {
  return (
    <>
      <Helmet>
        <title>FAQs | Diamond Design – Habesha Dress Questions Answered</title>
        <meta name="description" content="Find answers to common questions about Diamond Design's Habesha dresses — sizing, shipping, custom orders, and more." />
        <link rel="canonical" href="https://www.diamonddesignstore.com/faqs" />
      </Helmet>
      
      <div className="pt-24 pb-16">
        <FaqSection />

        {/* The Contact Nudge */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Still have questions? We're here to help!
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </>
  );
}