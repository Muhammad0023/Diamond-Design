import { NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase/admin';

// Fetches the CURRENT, authoritative USD -> ETB rate directly from Chapa.
// This is the rate actually used to charge the customer — never trust
// whatever estimate the client displayed earlier on /checkout, since a
// few minutes (or more) may have passed since that page loaded.
async function getAuthoritativeChapaRate() {
  const res = await fetch('https://api.chapa.co/v1/rates?from=USD&to=ETB', {
    headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
    cache: 'no-store',
  });

  const json = await res.json();

  if (json.status !== 'success' || !json.data?.rate) {
    throw new Error('RATE_FETCH_FAILED');
  }

  return {
    rate: json.data.rate,
    charge: json.data.charge ?? 0,
  };
}

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Re-fetch the order server-side — never trust amount/customer
    // info from the request body itself, only the orderId.
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderSnap.data();

    if (order.paymentStatus !== 'pending') {
      return NextResponse.json(
        { error: 'This order has already been processed' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Default: charge in USD as before.
    let chapaAmount = order.pricing.total;
    let chapaCurrency = order.pricing.currency;
    let chapaRateUsed = null;
    let chapaChargeUsed = null;

    if (order.customer.country === 'Ethiopia') {
      let rateData;
      try {
        rateData = await getAuthoritativeChapaRate();
      } catch (err) {
        // No hardcoded fallback rate — fail gracefully and ask the
        // customer to retry rather than risk a stale/wrong conversion.
        console.error('Chapa rate fetch failed at initialize time:', err);
        return NextResponse.json(
          { error: 'We could not confirm the current exchange rate. Please try again in a moment.' },
          { status: 503 }
        );
      }

      chapaRateUsed = rateData.rate;
      chapaChargeUsed = rateData.charge;
      chapaCurrency = 'ETB';
      // charge (if ever nonzero) is in the base currency (USD) per Chapa
      // support, so it's added to the USD total before converting.
      chapaAmount = Number(
        ((order.pricing.total + chapaChargeUsed) * chapaRateUsed).toFixed(2)
      );
    }

    const chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: String(chapaAmount),
        currency: chapaCurrency,
        email: order.customer.email,
        first_name: order.customer.firstName,
        last_name: order.customer.lastName,
        phone_number: order.customer.phone || undefined,
        tx_ref: order.tx_ref,
        callback_url: `${baseUrl}/api/chapa/webhook`,
        return_url: `${baseUrl}/order-confirmation/${orderId}`,
        customization: {
          title: 'Diamond Design',
          description: 'Habesha dress order',
        },
      }),
    });

    const chapaData = await chapaResponse.json();

    if (chapaData.status !== 'success') {
      console.error('Chapa initialize failed:', chapaData);
      return NextResponse.json(
        { error: 'Payment initialization failed' },
        { status: 502 }
      );
    }

    // Audit trail — so a "why does this amount look different" question
    // later can always be answered from the order doc itself.
    await orderRef.update({
      chapaCurrency,
      chapaAmount,
      chapaRateUsed,
      chapaChargeUsed,
    });

    return NextResponse.json({
      checkoutUrl: chapaData.data.checkout_url,
    });
  } catch (error) {
    console.error('Error initializing Chapa payment:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
