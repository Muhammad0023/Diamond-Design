import { NextResponse } from 'next/server';
import { createOrder } from '../../../../firebase/orderService';

export async function POST(request) {
  try {
    const { items, customer } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    // createOrder() re-fetches real prices from Firestore server-side —
    // items here only need productId/size/qty/customMeasurements,
    // never price (that would be trusting the client).
    const result = await createOrder(items, customer);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
