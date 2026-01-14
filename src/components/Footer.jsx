import { FaFacebookF, FaInstagram, FaTiktok, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800 reveal">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Social Media */}
          <div>
            <h3 className="font-roboto text-2xl font-bold mb-4">
              Diamond<span className="text-white">Design</span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              Habesha Kemis designs inspired by Habesha culture, elegance, and timeless beauty.
            </p>
            
            {/* Social Icons: Dark Circle + White Icon */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                <FaFacebookF className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                <FaInstagram className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                <FaTiktok className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                <FaPinterestP className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                <FaYoutube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop (New 4-Row Balanced Structure) */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>SHOP</h4>
            <ul className="space-y-2">
              <li><a href="/latest" className="text-gray-400 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>Latest Design</a></li>
              <li><a href="/dresses/wedding" className="text-gray-400 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>Wedding Dresses</a></li>
              <li><a href="/events-holidays" className="text-gray-400 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>Events & Holidays</a></li>
              <li><a href="/dresses/simple" className="text-gray-400 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>Simple Dress</a></li>
            </ul>
          </div>

          {/* Column 3: Support (Restored) */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>SUPPORT</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>Contact Us</a></li>
              <li><a href="/faqs" className="text-gray-400 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>FAQs</a></li>
              <li><a href="/size-guide" className="text-gray-400 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>Size Guide</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info (Dark Circle + Brand Color Icon) */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>CONTACT INFO</h4>
            <ul className="space-y-4">
              {/* Location */}
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <IoLocationOutline className="w-5 h-5 text-brand" />
                </div>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>HayaHulet, Addis Ababa, Ethiopia</span>
              </li>

              {/* Email */}
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <MdOutlineEmail className="w-5 h-5 text-brand" />
                </div>
                <a href="mailto:info@diamonddesign.et" className="hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                  info@diamonddesign.et
                </a>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <IoCallOutline className="w-5 h-5 text-brand" />
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
          © 2026 Diamond Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}