import { NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase/admin';
import { verifyAdminRequest } from '../../../../firebase/adminAuth';

export async function GET(request) {
  const decoded = await verifyAdminRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .get();

    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        txRef: data.tx_ref,
        customerName: `${data.customer.firstName} ${data.customer.lastName}`,
        customerEmail: data.customer.email,
        total: data.pricing.total,
        currency: data.pricing.currency,
        paymentStatus: data.paymentStatus,
        orderStatus: data.orderStatus,
        adminViewed: data.adminViewed ?? true,
        itemCount: data.items.length,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      };
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
