import { motion } from 'framer-motion';
import Hero from '../components/Hero'
import ProductCarousel from '../components/ProductCarousel'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../context/ProductsContext'
import { Helmet } from 'react-helmet-async';

export default function HomePage() {
  const { loading, error, getProductsByCategoryGroups } = useProducts();
  const productGroups = getProductsByCategoryGroups();

  return (
    <div className="overflow-hidden bg-white">
    <Helmet>
  <title>Habesha Kemis – Authentic Habesha Dresses | Diamond Design</title>
  
  <meta name="description" content="Shop Diamond Design's online collection of Habesha Kemis. Elegant Habesha, Ethiopian, and Eritrean dresses designed for weddings, holidays, and special occasions." />
  
  {/* Open Graph - For Telegram, Facebook, WhatsApp */}
  <meta property="og:title" content="Habesha Kemis | Authentic Ethiopian & Eritrean Dresses" />
  <meta property="og:description" content="Authentic Habesha Kemis and elegant Ethiopian and Eritrean dresses crafted for weddings, holidays, and unforgettable moments." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.diamonddesignstore.com/" />
  <meta property="og:image" content="https://www.diamonddesignstore.com/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  
  {/* Twitter Card - Some platforms use this */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Habesha Kemis | Diamond Design" />
  <meta name="twitter:description" content="Authentic Habesha Kemis and Ethiopian dresses." />
  <meta name="twitter:image" content="https://www.diamonddesignstore.com/og-image.jpg" />
  
  <link rel="canonical" href="https://www.diamonddesignstore.com/" />
</Helmet>
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
                  title="Latest Designs" 
                  products={loading ? null : productGroups.latest} 
                  viewAllLink="/latest-designs"
                />
          </motion.div>
          
          <div className="space-y-4">
                      {[
            { title: "Simple Dresses", products: productGroups.simple, link: "/collections/simple-dresses" },
            { title: "Wedding Dresses", products: productGroups.wedding, link: "/collections/wedding-dresses" },
            { title: "Chiffon", products: productGroups.chiffon, link: "/collections/chiffon" },
            { title: "Holidays", products: productGroups.holiday, link: "/collections/holidays" },
            { title: "Group Outfits", products: productGroups.group, link: "/collections/group-outfits" },
            { title: "Men's", products: productGroups.mens, link: "/collections/mens-collection" },
            { title: "Couples", products: productGroups.couples, link: "/collections/couples-collection" },
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