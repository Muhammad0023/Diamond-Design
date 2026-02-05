import { motion } from 'framer-motion';
import heroImage from '../assets/Hero.webP';

export default function Hero() {
  // Animation variants for the text container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Time between each element appearing
        delayChildren: 0.5,   // Wait for background to fade in first
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#F7F5F2]">
      {/* 1. BACKGROUND IMAGE - Subtle Zoom Effect */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: '20% center' 
        }}
      >
        <div className="absolute inset-0 bg-white/20 md:hidden"></div>
      </motion.div>

      {/* 2. CONTENT */}
      <div className="relative z-10 w-full h-full">
        <div className="max-w-[1920px] mx-auto h-full px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 h-full items-center">
            
            <div className="hidden md:block md:col-span-6 lg:col-span-6"></div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="md:col-span-6 lg:col-span-6 flex flex-col items-center md:items-center md:-translate-x-20 space-y-8"
            >
              
              {/* TEXT SECTION */}
              <div className="flex flex-col items-center">
                <motion.h1 
                  variants={itemVariants}
                  className="font-roboto font-[750] text-[#333] text-4xl sm:text-5xl lg:text-6xl leading-tight mb-2 tracking-wide uppercase text-center"
                >
                  <span className="block">HABESHA KEMIS</span>
                  <span className="block">Designs</span>
                </motion.h1>
                
                <motion.p 
                  variants={itemVariants}
                  className="font-sans font-light text-gray-600 tracking-[0.2em] text-xs sm:text-sm uppercase mt-2"
                >
                  Elegance and Beauty for a Queen
                </motion.p>
              </div>

              {/* SHOP NOW BUTTON */}
              <motion.div variants={itemVariants}>
                <button 
                  onClick={() => document.getElementById('shop-now')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#D29E0E] text-white px-10 py-3.5 rounded-full text-sm font-bold tracking-[0.2em] shadow-2xl hover:bg-brand-dark hover:shadow-brand/50 transition-all duration-300 active:scale-95"
                >
                  VIEW COLLECTION
                </button>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* 3. VERTICAL SCROLL LINE - Floating Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-0 right-10 md:right-20 flex flex-col items-center"
      >
         <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-24 bg-gradient-to-b from-[#D29E0E] to-transparent"
         />
      </motion.div>
    </section>
  );
}
