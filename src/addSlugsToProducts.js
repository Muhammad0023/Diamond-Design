import { db } from './firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

async function addSlugsToAllProducts() {
  try {
    console.log('🔄 Starting to add slugs...');
    
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    let count = 0;
    
    for (const docSnap of snapshot.docs) {
      const product = docSnap.data();
      const slug = generateSlug(product.name);
      
      await updateDoc(doc(db, 'products', docSnap.id), {
        slug: slug
      });
      
      console.log(`✅ ${count + 1}. ${product.name}`);
      console.log(`   → Slug: ${slug}`);
      count++;
    }
    
    console.log(`\n🎉 SUCCESS! Added slugs to ${count} products!`);
    console.log('Now you can use URLs like:');
    console.log('/product/elegant-white-kemis-traditional-design');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// AUTO-RUN when file is imported
addSlugsToAllProducts();