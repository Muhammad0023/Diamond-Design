import React from 'react';
import { motion } from 'framer-motion';
import { IoLocationOutline, IoCallOutline, IoTimeOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa"; // Added WhatsApp icon for a better look

export default function Contact() {
  const contactDetails = [
    {
      icon: <IoLocationOutline className="w-6 h-6" />,
      title: "Our Studio",
      content: "Haya Hulet, Addis Ababa, Ethiopia",
      link: "#"
    },
    {
      icon: <IoCallOutline className="w-6 h-6" />,
      title: "Phone & WhatsApp",
      content: "+251 988 503 333",
      link: "tel:+251988503333"
    },
    {
      icon: <MdOutlineEmail className="w-6 h-6" />,
      title: "Email Us",
      content: "diamonddesign907@gmail.com",
      link: "mailto:diamonddesign907@gmail.com"
    },
    {
      icon: <IoTimeOutline className="w-6 h-6" />,
      title: "Working Hours",
      content: "Mon - Sat: 8:00 AM - 7:00 PM",
      link: null
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Get In Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
            Have questions about sizing, custom orders, or shipping? Our team is here to help you find your perfect Habesha dress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactDetails.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {item.title}
              </h3>
              {item.link ? (
                <a href={item.link} className="text-gray-600 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                  {item.content}
                </a>
              ) : (
                <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                  {item.content}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* --- BRANDED WHATSAPP DIRECT BUTTON --- */}
        <div className="mt-16 text-center">
          <a 
            href="https://wa.me/251988503333" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand text-white px-8 py-4 rounded-full font-bold hover:bg-brand-dark hover:scale-105 transition-all shadow-lg"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            <FaWhatsapp className="w-6 h-6" />
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
