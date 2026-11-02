import { adminDb } from './admin';
import admin from 'firebase-admin';

// Shared by both the automatic Chapa webhook and the manual
// "Recheck with Chapa" admin button — one trusted code path for
// verifying a payment and marking an order paid, so the two never
// drift apart or handle idempotency differently.
export async function verifyAndMarkOrderPaid(txRef) {
  const verifyResponse = await fetch(
    `https://api.chapa.co/v1/transaction/verify/${txRef}`,
    { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
  );
  const verifyData = await verifyResponse.json();

  if (verifyData.status !== 'success' || verifyData.data?.status !== 'success') {
    return { verified: false, alreadyProcessed: false, order: null };
  }

  const chapaReference = verifyData.data?.reference || null;

  const ordersSnap = await adminDb
    .collection('orders')
    .where('tx_ref', '==', txRef)
    .limit(1)
    .get();

  if (ordersSnap.empty) {
    throw new Error(`No order found for tx_ref: ${txRef}`);
  }

  const orderDoc = ordersSnap.docs[0];
  const orderRef = orderDoc.ref;
  const orderForCheck = orderDoc.data();

  // Confirm Chapa actually charged the amount/currency this order
  // expected — defense in depth against a mismatch anywhere upstream
  // (e.g. a future bug in /api/chapa/initialize) silently marking an
  // order paid for the wrong amount.
  const expectedAmount = orderForCheck.chapaAmount ?? orderForCheck.pricing.total;
  const expectedCurrency = orderForCheck.chapaCurrency ?? orderForCheck.pricing.currency;

  if (
    Number(verifyData.data.amount) !== Number(expectedAmount) ||
    verifyData.data.currency !== expectedCurrency
  ) {
    console.error(
      `Amount/currency mismatch for ${txRef}: expected ${expectedAmount} ${expectedCurrency}, Chapa reported ${verifyData.data.amount} ${verifyData.data.currency}`
    );
    return { verified: false, alreadyProcessed: false, order: null };
  }

  const alreadyProcessed = await adminDb.runTransaction(async (t) => {
    const freshSnap = await t.get(orderRef);
    const freshOrder = freshSnap.data();

    if (freshOrder.paymentProcessedAt) {
      return true;
    }

    t.update(orderRef, {
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      chapaReference: chapaReference || null,
      paymentProcessedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return false;
  });

  if (alreadyProcessed) {
    return { verified: true, alreadyProcessed: true, order: orderDoc.data() };
  }

  const order = orderDoc.data();
  if (!order.confirmationEmailSent && order.customer.email) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Diamond Design <onboarding@resend.dev>',
          to: order.customer.email,
          reply_to: 'diamonddesign.habesha@gmail.com',
          subject: `Order confirmed — ${txRef}`,
          html: `<p>Hi ${order.customer.firstName},</p>
                 <p>Your order <strong>${txRef}</strong> is confirmed and your Habesha dress will now go into production.</p>
                 <p>Total paid: ${order.chapaCurrency === 'ETB' ? `${order.chapaAmount.toLocaleString()} ETB` : `$${order.pricing.total}`}</p>
                 ${chapaReference ? `<p><a href="https://chapa.link/payment-receipt/${chapaReference}">View your payment receipt</a></p>` : ''}
                 <p>Thank you for choosing Diamond Design!</p>`,
        }),
      });
      await orderRef.update({ confirmationEmailSent: true });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }
  }

  return { verified: true, alreadyProcessed: false, order: { ...order, paymentStatus: 'paid', orderStatus: 'confirmed' } };
}
