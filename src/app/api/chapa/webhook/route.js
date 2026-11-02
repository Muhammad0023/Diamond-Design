import { NextResponse } from 'next/server';
import { verifyAndMarkOrderPaid } from '../../../../firebase/paymentVerification';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const txRef = searchParams.get('trx_ref') || searchParams.get('tx_ref');

  if (!txRef) {
    return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 });
  }

  try {
    const result = await verifyAndMarkOrderPaid(txRef);

    if (!result.verified) {
      console.log('Payment not verified as successful for', txRef);
      return NextResponse.json({ received: true, verified: false });
    }

    return NextResponse.json({ received: true, verified: true, alreadyProcessed: result.alreadyProcessed });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
