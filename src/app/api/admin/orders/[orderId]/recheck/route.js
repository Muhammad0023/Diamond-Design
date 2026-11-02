import { NextResponse } from 'next/server';
import { adminDb } from '../../../../../../firebase/admin';
import { verifyAdminRequest } from '../../../../../../firebase/adminAuth';
import { verifyAndMarkOrderPaid } from '../../../../../../firebase/paymentVerification';

export async function POST(request, { params }) {
  const decoded = await verifyAdminRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await params;
    const snap = await adminDb.collection('orders').doc(orderId).get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const txRef = snap.data().tx_ref;
    const result = await verifyAndMarkOrderPaid(txRef);

    return NextResponse.json({
      verified: result.verified,
      alreadyProcessed: result.alreadyProcessed,
      paymentStatus: result.order?.paymentStatus || 'pending',
    });
  } catch (error) {
    console.error('Error rechecking order:', error);
    return NextResponse.json({ error: 'Failed to recheck order' }, { status: 500 });
  }
}
