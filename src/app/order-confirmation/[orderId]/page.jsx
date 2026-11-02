'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let interval;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
          if (data.paymentStatus === 'paid') {
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error(err);
      }
      setAttempts(prev => prev + 1);
    };

    fetchOrder();
    // Poll every 2s for up to ~20s while waiting for the webhook
    interval = setInterval(fetchOrder, 2000);

    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (attempts >= 10) {
      // stop polling after ~20s either way
    }
  }, [attempts]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Loading your order…</p>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid';
  const stillWaiting = !isPaid && attempts < 10;
  const isEtb = order.chapaCurrency === 'ETB' && order.chapaAmount;

  return (
    <div className="min-h-screen bg-white mt-20 lg:mt-32 pb-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {isPaid ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Thank you, {order.customerFirstName}!
            </h1>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              Your order <strong>{order.txRef}</strong> is confirmed and will now go into production.
              A confirmation email is on its way.
            </p>
          </>
        ) : stillWaiting ? (
          <>
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Confirming your payment…
            </h1>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              This usually takes just a few seconds. Please don't close this page.
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              We couldn't confirm your payment yet
            </h1>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              Your order reference is <strong>{order.txRef}</strong>. If you completed the payment,
              this can take a little longer to reflect — contact us on WhatsApp with this reference
              and we'll confirm it manually.
            </p>
          </>
        )}

        <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 text-sm mb-3">
              <div className="w-14 h-14 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex justify-between">
                <span>{item.name} — {item.size}{item.customMeasurements ? ' (custom)' : ''} × {item.qty}</span>
                <span>${item.lineTotal}</span>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${order.total}</span>
          </div>
          {isEtb && (
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Charged (ETB)</span>
              <span>{Number(order.chapaAmount).toLocaleString()} ETB</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isPaid && order.chapaReference && (
            <a

              href={`https://chapa.link/payment-receipt/${order.chapaReference}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-brand border-2 border-brand px-8 py-3 rounded-xl font-semibold"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              View Payment Receipt
            </a>
          )}
          <Link href="/" className="inline-block bg-brand text-white px-8 py-3 rounded-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
