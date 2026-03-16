import React, { useState, useEffect } from 'react';
import { IoChevronUpOutline } from "react-icons/io5"; // Consistency with footer icon
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show when user scrolls down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, x: 20 }} // Pops out from the right
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 20 }}
          onClick={scrollToTop}
          whileHover={{ y: -5 }} // Subtle "lift" on hover
          whileTap={{ scale: 0.9 }}
          // Matches your footer gold: #D29E0E
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#D29E0E] text-white rounded-full shadow-[0_10px_25px_rgba(210,158,14,0.3)] flex items-center justify-center transition-colors duration-300 hover:bg-[#B88A0D]"
          aria-label="Scroll to top"
        >
          {/* Using IoChevronUpOutline to match the top of your footer */}
          <IoChevronUpOutline className="w-6 h-6 stroke-2" />
          
          {/* Subtle Label - optional, but looks premium */}
          <span className="absolute -top-8 text-[10px] font-bold text-[#D29E0E] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
