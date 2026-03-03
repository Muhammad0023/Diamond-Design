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
    console.log('🔄 Updating all products with Name+ID slugs...\n');
    
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    let count = 0;
    
    for (const docSnap of snapshot.docs) {
      const product = docSnap.data();
      const productId = docSnap.id;
      const slug = generateSlug(product.name, productId);
      
      await updateDoc(doc(db, 'products', productId), {
        slug: slug
      });
      
      console.log(`✅ ${count + 1}. ${product.name}`);
      console.log(`   → ${slug}\n`);
      count++;
    }
    
    console.log(`🎉 SUCCESS! Updated ${count} products with Name+ID slugs!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addSlugsToAllProducts();