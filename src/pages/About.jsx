import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; 

export default function About() {
  // Animation variants for the parent container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between each element
        delayChildren: 0.2
      }
    }
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white overflow-hidden">
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }} // Only animate once
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.img 
            src={logo} 
            alt="Diamond Design" 
            className="h-24 w-auto mx-auto mb-8"
            whileHover={{ scale: 1.05 }}
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Our Heritage, Your Elegance
          </h1>
          <motion.div 
            className="w-24 h-1 bg-brand mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          ></motion.div>
        </motion.div>

        {/* Content Section */}
        <div className="prose prose-lg mx-auto text-gray-600 space-y-8" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
          <motion.p variants={itemVariants} className="text-xl leading-relaxed text-center md:text-left">
            Welcome to <strong className="text-gray-900 font-bold">Diamond Design</strong>, the premier destination for authentic Habesha Kemis. 
            Born in the heart of Addis Ababa, our mission is to preserve the rich weaving traditions 
            of Ethiopia while introducing them to the modern global fashion stage.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10">
            <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Craftsmanship</h3>
              <p>Every dress in our collection is handcrafted by skilled artisans. We use the finest cotton and intricate "Tilf" embroidery to ensure that every Diamond Design piece is a unique work of art.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-50 p-8 rounded-2xl border-l-4 border-brand">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p>We believe that Habesha clothing is more than just a garment—it is a symbol of pride, identity, and celebration. We strive to make these timeless designs accessible to everyone, everywhere.</p>
            </motion.div>
          </div>

          <motion.p 
            variants={itemVariants}
            className="text-center italic text-gray-500 pt-10 text-2xl"
          >
            Elegance and beauty for a queen!
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
