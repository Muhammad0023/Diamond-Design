import app from './firebase/config';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";

const db = getFirestore(app);

// ─── ALL YOUR PRODUCT DATA ──────────────────────────────────────────
const allProducts = [
  // LATEST
  { name: "Elegant White Kemis Traditional Design", price: 2999, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: true, category: "simple" },
  { name: "Golden Evening Dress", price: 3499, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "wedding" },
  { name: "Royal Blue Habesha", price: 2799, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: true, category: "simple" },
  { name: "Traditional Red Kemis", price: 2599, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "chiffon" },
  { name: "Emerald Green Dress", price: 3199, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", isNew: false, category: "holiday" },
  { name: "Pearl White Habesha", price: 2899, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: false, category: "wedding" },

  // SIMPLE
  { name: "Classic Simple Kemis Everyday Wear", price: 1999, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "simple" },
  { name: "Everyday Elegance", price: 1799, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "simple" },
  { name: "Minimalist White", price: 1899, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "simple" },
  { name: "Simple Beige Dress", price: 1699, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", isNew: false, category: "simple" },
  { name: "Casual Habesha", price: 1599, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: false, category: "simple" },
  { name: "Daily Wear Kemis", price: 1799, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "simple" },
  { name: "Light Cotton Dress", price: 1899, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "simple" },
  { name: "Basic White Habesha", price: 1699, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "simple" },

  // WEDDING
  { name: "Bridal White Kemis Luxury Collection", price: 4999, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "wedding" },
  { name: "Luxe Wedding Dress", price: 5499, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "wedding" },
  { name: "Royal Wedding Habesha", price: 5999, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", isNew: false, category: "wedding" },
  { name: "Pearl Embroidered", price: 4799, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: false, category: "wedding" },
  { name: "Diamond Wedding Kemis", price: 6499, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "wedding" },
  { name: "Luxury Bridal Habesha", price: 5799, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "wedding" },
  { name: "Golden Bride Dress", price: 5299, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "wedding" },
  { name: "Elegant Bridal Kemis", price: 4999, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", isNew: false, category: "wedding" },

  // CHIFFON
  { name: "Flowy Chiffon Dress Summer Collection", price: 2499, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: false, category: "chiffon" },
  { name: "Light Chiffon Kemis", price: 2299, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "chiffon" },
  { name: "Soft Pink Chiffon", price: 2599, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "chiffon" },
  { name: "Blue Chiffon Habesha", price: 2399, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "chiffon" },
  { name: "Lavender Chiffon", price: 2499, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", isNew: false, category: "chiffon" },
  { name: "Ivory Chiffon Dress", price: 2699, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: false, category: "chiffon" },
  { name: "Mint Chiffon Kemis", price: 2399, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "chiffon" },
  { name: "Peach Chiffon Habesha", price: 2499, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "chiffon" },

  // HOLIDAYS
  { name: "Christmas Red Kemis Special Edition", price: 3299, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "holiday" },
  { name: "New Year Golden", price: 3499, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", isNew: false, category: "holiday" },
  { name: "Festive White Dress", price: 3199, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: false, category: "holiday" },
  { name: "Holiday Blue Habesha", price: 3399, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "holiday" },
  { name: "Celebration Kemis", price: 3299, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "holiday" },
  { name: "Special Occasion Dress", price: 3499, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "holiday" },
  { name: "Party Habesha", price: 3599, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", isNew: false, category: "holiday" },
  { name: "Festive Golden Kemis", price: 3699, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: false, category: "holiday" },

  // GROUP
  { name: "Family Matching Set Traditional Design", price: 8999, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "group" },
  { name: "Group White Kemis", price: 7999, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "group" },
  { name: "Team Habesha Set", price: 9499, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "group" },
  { name: "Friends Matching", price: 8499, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", hoverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", isNew: false, category: "group" },
  { name: "Group Golden Set", price: 9999, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", isNew: false, category: "group" },
  { name: "Family Party Dress", price: 8799, image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400", hoverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", isNew: false, category: "group" },
  { name: "Unity Kemis Set", price: 9199, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", hoverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", isNew: false, category: "group" },
  { name: "Collective Habesha", price: 8999, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", hoverImage: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400", isNew: false, category: "group" },

  // MENS
  { name: "Classic Men's Kemis Formal Wear", price: 2499, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", hoverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", isNew: false, category: "mens" },
  { name: "Traditional White", price: 2299, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", hoverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", isNew: false, category: "mens" },
  { name: "Men's Formal Habesha", price: 2799, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", hoverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", isNew: false, category: "mens" },
  { name: "Groom Special", price: 3499, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", hoverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", isNew: false, category: "mens" },
  { name: "Elegant Men's Wear", price: 2599, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", hoverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", isNew: false, category: "mens" },
  { name: "Casual Men's Kemis", price: 2199, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", hoverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", isNew: false, category: "mens" },
  { name: "Premium Habesha", price: 2899, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", hoverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", isNew: false, category: "mens" },
  { name: "Men's Party Wear", price: 2699, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", hoverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", isNew: false, category: "mens" },

  // COUPLES
  { name: "Couple White Set Matching Collection", price: 5999, image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", hoverImage: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", isNew: false, category: "couples" },
  { name: "Matching Habesha", price: 6499, image: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", hoverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400", isNew: false, category: "couples" },
  { name: "Wedding Couple Set", price: 7999, image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400", hoverImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", isNew: false, category: "couples" },
  { name: "Anniversary Special", price: 6999, image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", hoverImage: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", isNew: false, category: "couples" },
  { name: "Love Birds Kemis", price: 6499, image: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", hoverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400", isNew: false, category: "couples" },
  { name: "Golden Couple Set", price: 7499, image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400", hoverImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", isNew: false, category: "couples" },
  { name: "Royal Couple Habesha", price: 7999, image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", hoverImage: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", isNew: false, category: "couples" },
  { name: "Elegant Couple Dress", price: 6799, image: "https://images.unsplash.com/photo-1529067382168-ed0a4d0ec42c?w=400", hoverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400", isNew: false, category: "couples" },
];

// ─── SEED FUNCTION ───────────────────────────────────────────────────
// This runs ONCE and uploads everything to Firestore
const seedProducts = async () => {
  console.log('🔥 Starting seed... uploading products to Firebase...\n');

  // Optional: Clear existing products first
  const existingDocs = await getDocs(collection(db, 'products'));
  if (existingDocs.size > 0) {
    console.log(`🗑️  Found ${existingDocs.size} existing products. Deleting them first...`);
    for (const docSnap of existingDocs.docs) {
      await deleteDoc(docSnap.ref);
    }
    console.log('✅ Old products deleted.\n');
  }

  // Upload all products
  let count = 0;
  for (const product of allProducts) {
    await addDoc(collection(db, 'products'), {
      ...product,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: "Beautiful handcrafted Ethiopian traditional dress featuring intricate embroidery and premium fabric. Perfect for special occasions and cultural celebrations. Each piece is carefully crafted by skilled artisans.",
      createdAt: new Date(),
    });
    count++;
    console.log(`✅ [${count}/${allProducts.length}] Uploaded: ${product.name}`);
  }

  console.log(`\n🎉 DONE! ${count} products uploaded to Firebase successfully!`);
  console.log('You can now safely delete this seedData.js file.');
};

// ─── RUN IT ──────────────────────────────────────────────────────────
seedProducts().catch(console.error);
