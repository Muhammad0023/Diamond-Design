import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar'; 
import logo from '../assets/logo.png'; 

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDressesOpen, setIsDressesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { getCartCount, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- NEW LOGIC FOR HOME CLICK ---
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If already on home, scroll up and reset animation
      window.scrollTo({ top: 0, behavior: 'smooth' });
      sessionStorage.removeItem('heroAnimated');
      // Small timeout to allow scroll to start before refresh
      setTimeout(() => window.location.reload(), 100); 
    } else {
      // If on another page, go home
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const dressCategories = [
    { name: 'Simple Dresses', url: '/dresses/simple' },
    { name: 'Wedding Dresses', url: '/dresses/wedding' },
    { name: 'Chiffon', url: '/dresses/chiffon' },
    { name: 'Holidays', url: '/dresses/holiday' },
    { name: 'Group Outfits', url: '/dresses/group' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/40 backdrop-blur-sm h-16 shadow-sm border-b border-white/20' 
          : 'bg-transparent h-24'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full relative">
            
            <div className="flex items-center space-x-8">
              <button onClick={toggleMobileMenu} className="md:hidden p-2 z-50">
                <div className="space-y-1.5">
                  <span className={`block h-0.5 w-6 bg-gray-900 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-gray-900 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-gray-900 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>

              {/* Desktop Logo with handleHomeClick */}
              <a href="/" onClick={handleHomeClick} className="hidden md:block">
                <motion.img 
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ 
                    scale: scrolled ? 0.8 : 1, 
                    opacity: 1 
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src={logo} 
                  alt="Diamond Design" 
                  className="w-auto h-16 object-contain origin-left" 
                />
              </a>

              <nav className="hidden md:flex items-center space-x-8">
                {/* Home Nav Link with handleHomeClick */}
                <a href="/" onClick={handleHomeClick} className="relative group text-sm font-medium text-gray-700 py-2">
                  Home
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
                
                <div 
                  className="relative group py-2"
                  onMouseEnter={() => setIsDressesOpen(true)}
                  onMouseLeave={() => setIsDressesOpen(false)}
                >
                  <button className="flex items-center text-sm font-medium text-gray-700 group-hover:text-brand transition-colors">
                    Dresses <span className="ml-1 text-[10px]">▼</span>
                  </button>
                  
                  <AnimatePresence>
                    {isDressesOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-52 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden"
                      >
                        {dressCategories.map((cat) => (
                          <Link key={cat.url} to={cat.url} className="block px-5 py-3 text-sm text-gray-600 hover:bg-brand/10 hover:text-brand transition-all border-b border-white/20 last:border-0">
                            {cat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/mens" className="relative group text-sm font-medium text-gray-700 py-2">
                  Men's
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <Link to="/couples" className="relative group text-sm font-medium text-gray-700 py-2">
                  Couples
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </nav>
            </div>

            {/* Mobile Logo with handleHomeClick */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2">
              <a href="/" onClick={handleHomeClick}>
                <motion.img 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: scrolled ? 0.8 : 1 }}
                  src={logo} 
                  alt="Diamond Design" 
                  className="w-auto h-12 object-contain" 
                />
              </a>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <div className="md:hidden">
                <SearchBar isMobile={true} />
              </div>

              <button 
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-brand transition-all hover:scale-110"
              >
                <HiOutlineShoppingBag className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute top-1 right-1 bg-brand text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={toggleMobileMenu} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-[300px] bg-white/90 backdrop-blur-md shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <img src={logo} alt="Diamond Design" className="h-10 w-auto" />
                <button onClick={toggleMobileMenu} className="p-2">
                  <IoClose className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <nav className="p-8">
                <ul className="space-y-8">
                  <li><a href="/" className="text-xl font-medium text-gray-900 block" onClick={handleHomeClick}>Home</a></li>
                  <li>
                    <button onClick={() => setIsDressesOpen(!isDressesOpen)} className="w-full flex justify-between items-center text-xl font-medium text-gray-900">
                      Dresses <span className={isDressesOpen ? 'rotate-90' : ''}>›</span>
                    </button>
                    {isDressesOpen && (
                      <ul className="ml-4 mt-4 space-y-4">
                        {dressCategories.map(cat => (
                          <li key={cat.url}><Link to={cat.url} className="text-gray-500 text-lg block" onClick={toggleMobileMenu}>{cat.name}</Link></li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li><Link to="/mens" className="text-xl font-medium text-gray-900 block" onClick={toggleMobileMenu}>Men's</Link></li>
                  <li><Link to="/couples" className="text-xl font-medium text-gray-900 block" onClick={toggleMobileMenu}>Couples</Link></li>
                  
                  {/* --- SEPARATOR AND LIGHTER LINKS --- */}
                  <li className="pt-4 border-t border-gray-100 space-y-6">
                    <Link 
                      to="/about" 
                      className="text-lg font-light text-gray-400 block" 
                      onClick={toggleMobileMenu}
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/contact" 
                      className="text-lg font-light text-gray-400 block" 
                      onClick={toggleMobileMenu}
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
