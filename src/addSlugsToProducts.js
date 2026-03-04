import { db } from './firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const generateSlug = (name, id) => {
  const namePart = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${namePart}-${id}`;
};

async function addSlugsToAllProducts() {
  try {
    console.log('🔄 Starting slug update...');
    console.log('📡 Firebase DB:', db ? 'Connected ✅' : 'Not connected ❌');
    
    const productsRef = collection(db, 'products');
    console.log('📦 Products collection reference:', productsRef);
    
    const snapshot = await getDocs(productsRef);
    console.log('📊 Snapshot size:', snapshot.size);
    console.log('📊 Snapshot empty?', snapshot.empty);
    
    if (snapshot.empty) {
      console.error('❌ NO PRODUCTS FOUND IN FIREBASE!');
      console.error('🔍 Check:');
      console.error('   1. Is your Firebase project correct?');
      console.error('   2. Does the "products" collection exist?');
      console.error('   3. Are there products in Firestore?');
      return;
    }
    
    console.log(`✅ Found ${snapshot.size} products!\n`);
    
    let count = 0;
    
    for (const docSnap of snapshot.docs) {
      const product = docSnap.data();
      const productId = docSnap.id;
      
      console.log(`Product ${count + 1}:`, {
        id: productId,
        name: product.name,
        currentSlug: product.slug
      });
      
      const newSlug = generateSlug(product.name, productId);
      
      await updateDoc(doc(db, 'products', productId), {
        slug: newSlug
      });
      
      console.log(`✅ Updated to: ${newSlug}\n`);
      count++;
    }
    
    console.log(`🎉 SUCCESS! Updated ${count} products with Name+ID slugs!`);
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    console.error('Error details:', error.message);
  }
}

addSlugsToAllProducts();