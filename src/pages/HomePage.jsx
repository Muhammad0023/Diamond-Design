import { motion } from 'framer-motion';
import Hero from '../components/Hero'
import ProductCarousel from '../components/ProductCarousel'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../context/ProductsContext'

export default function HomePage() {
  const { loading, error, getProductsByCategoryGroups } = useProducts();
  const productGroups = getProductsByCategoryGroups();

  return (
    <div className="overflow-hidden bg-white">
      {/* FIX: The Hero is now outside of any "if" statements. 
         The key="constant-hero" tells React: "This is the same component, 
         do not re-animate it when loading finishes."
      */}
      <Hero key="constant-hero" />
      
      {/* 1. LOADING STATE (Below Hero) */}
      {loading && (
        <div className="min-h-[50vh] flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        </div>
      )}

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
      {!loading && !error && (
        <>
          <motion.div 
            id="shop-now"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {productGroups.latest.length > 0 && (
              <ProductCarousel 
                title="Latest Designs" 
                products={productGroups.latest} 
                viewAllLink="/latest-designs"
              />
            )}
          </motion.div>
          
          <div className="space-y-4">
            {[
              { title: "Simple Dresses", products: productGroups.simple, link: "/dresses/simple" },
              { title: "Wedding Dresses", products: productGroups.wedding, link: "/dresses/wedding" },
              { title: "Chiffon", products: productGroups.chiffon, link: "/dresses/chiffon" },
              { title: "Holidays", products: productGroups.holiday, link: "/dresses/holiday" },
              { title: "Group Outfits", products: productGroups.group, link: "/dresses/group" },
              { title: "Men's", products: productGroups.mens, link: "/mens" },
              { title: "Couples", products: productGroups.couples, link: "/couples" },
            ].map((group) => (
              group.products.length > 0 && (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                >
                  <ProductGrid 
                    title={group.title} 
                    products={group.products} 
                    viewAllLink={group.link} 
                  />
                </motion.div>
              )
            ))}
          </div>
        </>
      )}
    </div>
  );
}
