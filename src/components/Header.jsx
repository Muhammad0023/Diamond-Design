import { useState, useEffect } from 'react';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar'; // 🔍 Imported SearchBar
import logo from '../assets/logo.png'; 

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDressesOpen, setIsDressesOpen] = useState(false);
  
  // 🛒 Functional Cart Context
  const { getCartCount, toggleCart } = useCart();
  
  // ✨ Modern Scroll State (Design from updated code)
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Using the 20px threshold from your design code for a smoother feel
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const dressCategories = [
    'Simple Dresses',
    'Wedding Dresses',
    'Chiffon',
    'Holidays',
    'Group Outfits'
  ];

  return (
    <>
      {/* --- HEADER (Visual Design: Transparent to White/Blur) --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md h-16 shadow-sm' 
          : 'bg-transparent h-20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full relative">
            
            {/* 1. LEFT SIDE: Hamburger & Nav */}
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 group relative z-50"
                aria-label="Toggle Menu"
              >
                <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-900 my-1.5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>

              <div className="hidden md:block flex-shrink-0">
                <a href="/">
                  {/* Dynamic Logo Sizing from Design Code */}
                  <img 
                    src={logo} 
                    alt="Diamond Design" 
                    className={`w-auto py-2 object-contain drop-shadow-sm transition-all duration-300 hover:scale-105 ${scrolled ? 'h-14' : 'h-20'}`} 
                  />
                </a>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-sm font-medium text-gray-700 hover:text-brand transition-colors">Home</a>
                
                <div 
                  className="relative group py-2"
                  onMouseEnter={() => setIsDressesOpen(true)}
                  onMouseLeave={() => setIsDressesOpen(false)}
                >
                  <button className="flex items-center text-sm font-medium text-gray-700 group-hover:text-brand transition-colors">
                    Dresses <span className={`ml-1 text-[10px] transition-transform ${isDressesOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  
                  <div className={`absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-md transition-all duration-200 ${isDressesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    {dressCategories.map((cat) => (
                      <a key={cat} href="#" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand transition-colors">
                        {cat}
                      </a>
                    ))}
                  </div>
                </div>

                <a href="/mens" className="text-sm font-medium text-gray-700 hover:text-brand">Men's</a>
                <a href="/couples" className="text-sm font-medium text-gray-700 hover:text-brand">Couples</a>
              </nav>
            </div>

            {/* 2. CENTER: Mobile Logo */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2">
              <a href="/">
                <img src={logo} alt="Diamond Design" className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-12' : 'h-14'}`} />
              </a>
            </div>

            {/* 3. RIGHT SIDE: Integrated Search Functionality & Cart */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Search Bar (Merged from Search Logic) */}
              <div className="hidden md:block">
                <SearchBar />
              </div>

              {/* Mobile Search Icon (Merged from Search Logic) */}
              <div className="md:hidden">
                <SearchBar isMobile={true} />
              </div>

              {/* Functional Cart Button */}
              <button 
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-brand transition-transform hover:scale-110"
              >
                <HiOutlineShoppingBag className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute top-1 right-1 bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE SIDEBAR (Standard Layout) --- */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={toggleMobileMenu}></div>

        <div className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-400 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
             <span className="font-sans font-semibold text-base tracking-widest text-gray-900 uppercase">Menu</span>
             <button onClick={toggleMobileMenu} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
               <IoClose className="w-6 h-6 text-gray-400" />
             </button>
          </div>

          <nav className="p-6">
            <ul className="space-y-6">
              <li><a href="/" className="text-lg font-medium text-gray-900 block font-sans" onClick={toggleMobileMenu}>Home</a></li>
             
              <li className="space-y-4">
                <button
                  onClick={() => setIsDressesOpen(!isDressesOpen)}
                  className="w-full flex justify-between items-center text-lg font-medium text-gray-900 font-sans"
                >
                  Dresses
                  <span className={`text-gray-400 transition-transform ${isDressesOpen ? 'rotate-90' : ''}`}>›</span>
                </button>
               
                <div className={`overflow-hidden transition-all duration-300 ${isDressesOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <ul className="ml-4 space-y-4 border-l border-gray-100 pl-4 mt-2">
                    {dressCategories.map(cat => (
                      <li key={cat}>
                        <a href="#" className="text-gray-500 hover:text-brand block text-base font-sans" onClick={toggleMobileMenu}>{cat}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              <li><a href="/mens" className="text-lg font-medium text-gray-900 block font-sans" onClick={toggleMobileMenu}>Men's</a></li>
              <li><a href="/couples" className="text-lg font-medium text-gray-900 block font-sans" onClick={toggleMobileMenu}>Couples</a></li>

              <div className="pt-6 mt-6 border-t border-gray-100 space-y-4 font-light">
                <li><a href="/about" className="text-gray-600 hover:text-brand block text-sm font-sans" onClick={toggleMobileMenu}>About Us</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-brand block text-sm font-sans" onClick={toggleMobileMenu}>Contact Us</a></li>
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
