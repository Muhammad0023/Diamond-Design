import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { IoLocationOutline, IoCallOutline, IoChevronUpOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { motion } from 'framer-motion';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      sessionStorage.removeItem('heroAnimated');
      setTimeout(() => window.location.reload(), 100);
    } else {
      navigate('/');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-900 text-white border-t border-gray-800">
      
      {/* --- SMALL & SLEEK TOP ICON --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          // "w-10 h-10" makes it small and "hover:bg-[#B88A0D]" is the dark yellow
          className="w-10 h-10 bg-[#D29E0E] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-[#B88A0D] active:scale-90"
        >
          <IoChevronUpOutline className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Social Media */}
          <div>
            <h3 
              onClick={handleHomeClick}
              className="font-roboto text-2xl font-bold mb-4 cursor-pointer group transition-all duration-300"
            >
              Diamond
              <span className="text-white group-hover:text-brand transition-colors duration-300 ml-1">
                Design
              </span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              Habesha Kemis designs inspired by Habesha culture, elegance, and timeless beauty.
            </p>
            
            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, link: "https://web.facebook.com/profile.php?id=61583397116912" },
                { icon: <FaInstagram />, link: "https://www.instagram.com/diamond__design_" },
                { icon: <FaTiktok />, link: "https://www.tiktok.com/@diamonddesign1_1" },
                { icon: <FaPinterestP />, link: "https://www.pinterest.com/diamond__design/" },
                { icon: <FaYoutube />, link: "https://www.youtube.com/@DiamondDesign1" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand hover:scale-110 transition-all duration-300"
                >
                  <span className="text-white text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>SHOP</h4>
            <ul className="space-y-2">
              {[
                { name: "Wedding Dresses", path: "/dresses/wedding" },
                { name: "Holidays", path: "/dresses/holiday" },
                { name: "Simple Dress", path: "/dresses/simple" },
                { name: "Men's Collection", path: "/mens" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-brand hover:translate-x-1 inline-block transition-all duration-200" 
                    style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>SUPPORT</h4>
            <ul className="space-y-2">
              {[
                { name: "About Us", path: "/about" },
                { name: "Contact Us", path: "/contact" },
                { name: "FAQs", path: "/faqs" },
                { name: "Size Guide", path: "/size-guide" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-brand hover:translate-x-1 inline-block transition-all duration-200" 
                    style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>CONTACT INFO</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 group cursor-default">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand transition-colors duration-300">
                  <IoLocationOutline className="w-5 h-5 text-brand group-hover:text-white" />
                </div>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>HayaHulet, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand transition-colors duration-300">
                  <MdOutlineEmail className="w-5 h-5 text-brand group-hover:text-white" />
                </div>
                <a href="mailto:diamonddesign907@gmail.com" className="hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                  diamonddesign907@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand transition-colors duration-300">
                  <IoCallOutline className="w-5 h-5 text-brand group-hover:text-white" />
                </div>
                <a href="tel:+251988503333" className="hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                  +251 988 503 333 | +447534785665 (UK) 
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6">
        <p className="text-center text-gray-400 text-sm" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
          © {currentYear} Diamond Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
