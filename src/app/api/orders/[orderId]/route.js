import { NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase/admin';

export async function GET(request, { params }) {
  try {
    const { orderId } = await params;
    const snap = await adminDb.collection('orders').doc(orderId).get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = snap.data();

    // Only return what's safe/needed to show the customer —
    // not the full internal document.
    return NextResponse.json({
      txRef: order.tx_ref,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      items: order.items,
      total: order.pricing.total,
      currency: order.pricing.currency,
      customerFirstName: order.customer.firstName,
      chapaReference: order.chapaReference || null,
      // Populated only for Ethiopia orders (set in /api/chapa/initialize).
      chapaCurrency: order.chapaCurrency || null,
      chapaAmount: order.chapaAmount || null,
      chapaRateUsed: order.chapaRateUsed || null,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
