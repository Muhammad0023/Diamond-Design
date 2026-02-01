import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

export default function Footer() {
  // Current Year for Copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Social Media */}
          <div>
            <h3 className="font-roboto text-2xl font-bold mb-4 cursor-pointer group transition-all duration-300">
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
                { icon: <FaFacebookF />, link: "#" },
                { icon: <FaInstagram />, link: "#" },
                { icon: <FaTiktok />, link: "#" },
                { icon: <FaPinterestP />, link: "#" },
                { icon: <FaYoutube />, link: "#" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link} 
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
                { name: "Latest Design", path: "/latest" },
                { name: "Wedding Dresses", path: "/dresses/wedding" },
                { name: "Events & Holidays", path: "/events-holidays" },
                { name: "Simple Dress", path: "/dresses/simple" }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.path} 
                    className="text-gray-400 hover:text-brand hover:translate-x-1 inline-block transition-all duration-200" 
                    style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
                  >
                    {item.name}
                  </a>
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
                  <a 
                    href={item.path} 
                    className="text-gray-400 hover:text-brand hover:translate-x-1 inline-block transition-all duration-200" 
                    style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}
                  >
                    {item.name}
                  </a>
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
                <a href="mailto:info@diamonddesign.et" className="hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                  info@diamonddesign.et
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 group">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand transition-colors duration-300">
                  <IoCallOutline className="w-5 h-5 text-brand group-hover:text-white" />
                </div>
                <a href="tel:+251911234567" className="hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                  +251 911 234 567
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 py-6">
        <p className="text-center text-gray-400 text-sm" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
          © {currentYear} Diamond Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
