import { adminDb } from './admin';
import admin from 'firebase-admin';

const ORDERS_COLLECTION = 'orders';

// Generates a branded, human-readable transaction reference
// e.g. DD-20260915-8f3k
function generateTxRef() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 6);
  return `DD-${date}-${random}`;
}

// Creates a pending order in Firestore.
// items: [{ productId, size, customMeasurements, qty }]
// customer: { firstName, lastName, email, phone, country, city,
//             postalCode, addressLine1, addressLine2, deliveryNotes }
// This is server-side only — prices are always re-read from the
// real product documents here, never trusted from the client.
export const createOrder = async (items, customer) => {
  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Re-fetch real product data server-side for every item —
  // never trust price/name sent from the browser.
  const lineItems = [];
  let subtotal = 0;

  for (const item of items) {
    const productSnap = await adminDb
      .collection('products')
      .doc(item.productId)
      .get();

    if (!productSnap.exists) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const product = productSnap.data();
    const qty = item.qty || 1;
    const lineTotal = product.price * qty;
    subtotal += lineTotal;

    lineItems.push({
      productId: item.productId,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      size: item.size || null,
      customMeasurements: item.customMeasurements || null,
      qty,
      lineTotal,
    });
  }

  const shipping = 0; // TODO: replace with a real shipping calculation later
  const total = subtotal + shipping;
  const txRef = generateTxRef();

  const orderData = {
    items: lineItems,
    customer: {
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      country: customer.country || '',
      state: customer.state || '',
      city: customer.city || '',
      postalCode: customer.postalCode || '',
      addressLine1: customer.addressLine1 || '',
      addressLine2: customer.addressLine2 || '',
      deliveryNotes: customer.deliveryNotes || '',
    },
    pricing: {
      subtotal,
      shipping,
      total,
      currency: 'USD',
    },
    tx_ref: txRef,
    paymentStatus: 'pending',
    adminViewed: false,
    orderStatus: 'pending_payment',
    paymentProcessedAt: null,
    confirmationEmailSent: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await adminDb.collection(ORDERS_COLLECTION).add(orderData);

  return { orderId: docRef.id, txRef, total, currency: 'USD' };
};

// Looks up an order by its tx_ref — used by the Chapa webhook
// to find which order a payment confirmation belongs to.
export const getOrderByTxRef = async (txRef) => {
  const snapshot = await adminDb
    .collection(ORDERS_COLLECTION)
    .where('tx_ref', '==', txRef)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// Server-side product fetch for SSR pages (e.g. product detail page
// metadata/initial render). Uses the Admin SDK rather than the client
// SDK, since this runs in a Node.js server context, not a browser —
// the client SDK is not reliable there.
export const getProductByIdAdmin = async (productId) => {
  const snap = await adminDb.collection('products').doc(productId).get();
  if (!snap.exists) return null;

  const data = snap.data();

  // Firestore Admin Timestamps are class instances, not plain objects —
  // Next.js refuses to pass those from a Server Component to a Client
  // Component. Convert to plain ISO strings before returning.
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.().toISOString() || null,
    updatedAt: data.updatedAt?.toDate?.().toISOString() || null,
  };
};
