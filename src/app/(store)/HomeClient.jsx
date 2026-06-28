'use client'
import { motion } from 'framer-motion';
import Hero from '../../components/Hero'
import ProductCarousel from '../../components/ProductCarousel'
import ProductGrid from '../../components/ProductGrid'
import { useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext'

export default function HomeClient() {  
  const { loading, error, homeProducts } = useProducts();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const savedScroll = sessionStorage.getItem('scroll-home');
    if (savedScroll) {
      sessionStorage.removeItem('scroll-home');
      document.documentElement.style.visibility = 'hidden';
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
        document.documentElement.style.visibility = 'visible';
      }, 500);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);
  const productGroups = homeProducts;

  return (
    <div className="overflow-hidden bg-white">
      {/* FIX: The Hero is now outside of any "if" statements. 
          The key="constant-hero" tells React: "This is the same component, 
          do not re-animate it when loading finishes."
      */}
      <Hero key="constant-hero" />
      

      {/* 2. ERROR STATE (Below Hero) */}
      {error && !loading && (
        <div className="min-h-[50vh] flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT (Only shows when loading is done) */}
      {!error && (
        <>
          <motion.div 
            id="shop-now"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
                     <ProductCarousel
                  title="Latest Styles"
                  products={loading || !productGroups ? null : productGroups.latest}
                  viewAllLink="/latest-habesha-styles"
                />
          </motion.div>
          
          <div className="space-y-4">
                      {[
            { title: "Simple Dresses", products: loading || !productGroups ? null : productGroups.simple, link: "/collections/habesha-kemis-simple" },
            { title: "Wedding Dresses", products: loading || !productGroups ? null : productGroups.wedding, link: "/collections/habesha-wedding-dresses" },
            { title: "Chiffon", products: loading || !productGroups ? null : productGroups.chiffon, link: "/collections/habesha-chiffon-dresses" },
            { title: "Holidays", products: loading || !productGroups ? null : productGroups.holiday, link: "/collections/event-holiday-habesha-dresses" },
            { title: "Group Outfits", products: loading || !productGroups ? null : productGroups.group, link: "/collections/habesha-family-group-outfits" },
            { title: "Men's", products: loading || !productGroups ? null : productGroups.mens, link: "/collections/habesha-mens-traditional-clothing" },
            { title: "Couples", products: loading || !productGroups ? null : productGroups.couples, link: "/collections/matching-habesha-couples" },
          ].map((group) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <ProductGrid 
                title={group.title} 
                products={loading ? null : group.products} 
                viewAllLink={group.link} 
              />
            </motion.div>
          ))}
          
          </div>
        </>
      )}
    </div>
  );
}