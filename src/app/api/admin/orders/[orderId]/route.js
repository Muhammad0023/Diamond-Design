import { NextResponse } from 'next/server';
import { adminDb } from '../../../../../firebase/admin';
import { verifyAdminRequest } from '../../../../../firebase/adminAuth';
import admin from 'firebase-admin';

const VALID_STATUSES = ['pending_payment', 'confirmed', 'in_production', 'shipped', 'completed', 'cancelled', 'refunded'];

export async function GET(request, { params }) {
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

    const data = snap.data();
    return NextResponse.json({
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || null,
      updatedAt: data.updatedAt?.toDate?.() || null,
      paymentProcessedAt: data.paymentProcessedAt?.toDate?.() || null,
      // Orders created before this feature shipped have no adminViewed
      // field at all — treat those as already-viewed rather than
      // surfacing old orders as unread.
      adminViewed: data.adminViewed ?? true,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const decoded = await verifyAdminRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await params;
    const body = await request.json();

    const updates = {};

    // orderStatus stays optional-but-validated, exactly as before —
    // this preserves the existing status-dropdown behavior untouched.
    if (body.orderStatus !== undefined) {
      if (!VALID_STATUSES.includes(body.orderStatus)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updates.orderStatus = body.orderStatus;
    }

    // New: adminViewed can be updated independently of status, so
    // opening an order's detail page can mark it read without
    // touching orderStatus at all.
    if (body.adminViewed !== undefined) {
      updates.adminViewed = Boolean(body.adminViewed);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await adminDb.collection('orders').doc(orderId).update(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
