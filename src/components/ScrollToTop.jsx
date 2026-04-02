'use client'
import React, { useState, useEffect } from 'react';
import { IoChevronUpOutline } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
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
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          onClick={scrollToTop}
          
          // HOVER: Tint the glass with your brand gold (20% opacity)
          whileHover={{ 
            y: -5, 
            backgroundColor: "rgba(210, 158, 14, 0.2)",
            borderColor: "rgba(210, 158, 14, 0.4)"
          }} 
          
          // CLICK: Deepen the gold (60% opacity) and shrink slightly
          whileTap={{ 
            scale: 0.9, 
            backgroundColor: "rgba(210, 158, 14, 0.6)" 
          }}

          className="fixed bottom-6 right-6 z-50 
                     w-10 h-10 
                     flex items-center justify-center 
                     rounded-full border border-white/20
                     bg-white/10 backdrop-blur-md 
                     text-[#D29E0E] 
                     shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]
                     transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <IoChevronUpOutline className="w-5 h-5 stroke-[3px]" />
          
          {/* Internal reflection - gives it that "glass" depth */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}