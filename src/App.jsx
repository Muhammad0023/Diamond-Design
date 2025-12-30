import Header from './components/Header'
import Hero from './components/Hero'
import ProductCarousel from './components/ProductCarousel'
import ProductGrid from './components/ProductGrid'

// Sample Product Data
const sampleProducts = {
  latest: [
    { id: 1, name: "Elegant White Kemis Traditional Design", price: 2999, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: true },
    { id: 2, name: "Golden Evening Dress", price: 3499, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 3, name: "Royal Blue Habesha", price: 2799, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: true },
    { id: 4, name: "Traditional Red Kemis", price: 2599, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 5, name: "Emerald Green Dress", price: 3199, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400" },
    { id: 6, name: "Pearl White Habesha", price: 2899, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400" },
  ],
  simple: [
    { id: 11, name: "Classic Simple Kemis Everyday Wear", price: 1999, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 12, name: "Everyday Elegance", price: 1799, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
    { id: 13, name: "Minimalist White", price: 1899, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 14, name: "Simple Beige Dress", price: 1699, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400" },
    { id: 15, name: "Casual Habesha", price: 1599, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400" },
    { id: 16, name: "Daily Wear Kemis", price: 1799, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 17, name: "Light Cotton Dress", price: 1899, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
    { id: 18, name: "Basic White Habesha", price: 1699, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
  ],
  wedding: [
    { id: 21, name: "Bridal White Kemis Luxury Collection", price: 4999, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
    { id: 22, name: "Luxe Wedding Dress", price: 5499, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 23, name: "Royal Wedding Habesha", price: 5999, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400" },
    { id: 24, name: "Pearl Embroidered", price: 4799, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400" },
    { id: 25, name: "Diamond Wedding Kemis", price: 6499, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 26, name: "Luxury Bridal Habesha", price: 5799, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
    { id: 27, name: "Golden Bride Dress", price: 5299, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 28, name: "Elegant Bridal Kemis", price: 4999, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400" },
  ],
  chiffon: [
    { id: 31, name: "Flowy Chiffon Dress Summer Collection", price: 2499, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400" },
    { id: 32, name: "Light Chiffon Kemis", price: 2299, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 33, name: "Soft Pink Chiffon", price: 2599, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
    { id: 34, name: "Blue Chiffon Habesha", price: 2399, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 35, name: "Lavender Chiffon", price: 2499, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400" },
    { id: 36, name: "Ivory Chiffon Dress", price: 2699, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400" },
    { id: 37, name: "Mint Chiffon Kemis", price: 2399, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 38, name: "Peach Chiffon Habesha", price: 2499, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
  ],
  holidays: [
    { id: 41, name: "Christmas Red Kemis Special Edition", price: 3299, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 42, name: "New Year Golden", price: 3499, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400" },
    { id: 43, name: "Festive White Dress", price: 3199, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400" },
    { id: 44, name: "Holiday Blue Habesha", price: 3399, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 45, name: "Celebration Kemis", price: 3299, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
    { id: 46, name: "Special Occasion Dress", price: 3499, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 47, name: "Party Habesha", price: 3599, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400" },
    { id: 48, name: "Festive Golden Kemis", price: 3699, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400" },
  ],
  group: [
    { id: 51, name: "Family Matching Set Traditional Design", price: 8999, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 52, name: "Group White Kemis", price: 7999, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
    { id: 53, name: "Team Habesha Set", price: 9499, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
    { id: 54, name: "Friends Matching", price: 8499, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400" },
    { id: 55, name: "Group Golden Set", price: 9999, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400" },
    { id: 56, name: "Family Party Dress", price: 8799, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
    { id: 57, name: "Unity Kemis Set", price: 9199, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" },
    { id: 58, name: "Collective Habesha", price: 8999, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400" },
  ],
  mens: [
    { id: 61, name: "Classic Men's Kemis Formal Wear", price: 2499, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", hoverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
    { id: 62, name: "Traditional White", price: 2299, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", hoverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { id: 63, name: "Men's Formal Habesha", price: 2799, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", hoverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400" },
    { id: 64, name: "Groom Special", price: 3499, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", hoverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
    { id: 65, name: "Elegant Men's Wear", price: 2599, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", hoverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { id: 66, name: "Casual Men's Kemis", price: 2199, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", hoverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400" },
    { id: 67, name: "Premium Habesha", price: 2899, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", hoverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
    { id: 68, name: "Men's Party Wear", price: 2699, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", hoverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
  ],
  couples: [
    { id: 71, name: "Couple White Set Matching Collection", price: 5999, image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", hoverImage: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400" },
    { id: 72, name: "Matching Habesha", price: 6499, image: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", hoverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400" },
    { id: 73, name: "Wedding Couple Set", price: 7999, image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400", hoverImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400" },
    { id: 74, name: "Anniversary Special", price: 6999, image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", hoverImage: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400" },
    { id: 75, name: "Love Birds Kemis", price: 6499, image: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", hoverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400" },
    { id: 76, name: "Golden Couple Set", price: 7499, image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400", hoverImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400" },
    { id: 77, name: "Royal Couple Habesha", price: 7999, image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", hoverImage: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400" },
    { id: 78, name: "Elegant Couple Dress", price: 6799, image: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", hoverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400" },
  ],
};

function App() {
  return (
    <>
      <Header />
      <Hero />
      
      {/* Latest Designs - Horizontal Scroll */}
      <ProductCarousel 
        title="Latest Designs" 
        products={sampleProducts.latest}
        viewAllLink="#"
      />
      
      {/* All Category Grids */}
      <ProductGrid title="Simple Dresses" products={sampleProducts.simple} viewAllLink="#" />
      <ProductGrid title="Wedding Dresses" products={sampleProducts.wedding} viewAllLink="#" />
      <ProductGrid title="Chiffon" products={sampleProducts.chiffon} viewAllLink="#" />
      <ProductGrid title="Holidays" products={sampleProducts.holidays} viewAllLink="#" />
      <ProductGrid title="Group Outfits" products={sampleProducts.group} viewAllLink="#" />
      <ProductGrid title="Men's" products={sampleProducts.mens} viewAllLink="#" />
      <ProductGrid title="Couples" products={sampleProducts.couples} viewAllLink="#" />
    </>
  )
}

export default App