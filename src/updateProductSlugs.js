import { db } from './firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const generateSlug = (name) => {
  return name.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-+|-+$/g, '');
};

async function updateAllProductSlugs() {
  console.log('🔄 Updating slugs...');
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  
  for (const docSnap of snapshot.docs) {
    const product = docSnap.data();
    const slug = generateSlug(product.name);
    await updateDoc(doc(db, 'products', docSnap.id), { slug });
    console.log(`✅ ${product.name} → ${slug}`);
  }
  
  console.log('🎉 DONE!');
}

updateAllProductSlugs();