'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { HiArrowLeft, HiRefresh } from 'react-icons/hi';

const STATUSES = ['pending_payment', 'confirmed', 'in_production', 'shipped', 'completed', 'cancelled', 'refunded'];
const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  confirmed: 'Confirmed',
  in_production: 'In Production',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function OrderDetailPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rechecking, setRechecking] = useState(false);
  const [recheckMessage, setRecheckMessage] = useState(null);

  useEffect(() => {
    if (currentUser) fetchOrder();
  }, [currentUser]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrder(data);

      // Opening this page is what marks the order as viewed — fire once,
      // only if it's currently unread, so this doesn't spam a write on
      // every re-fetch (e.g. after a status change or recheck).
      if (data.adminViewed === false) {
        fetch(`/api/admin/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adminViewed: true }),
        }).catch(err => console.error('Error marking order as viewed:', err));
        setOrder(prev => ({ ...prev, adminViewed: true }));
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      const token = await currentUser.getIdToken();
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      setOrder(prev => ({ ...prev, orderStatus: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleRecheck = async () => {
    try {
      setRechecking(true);
      setRecheckMessage(null);
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/admin/orders/${orderId}/recheck`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.verified) {
        await fetchOrder();
        setRecheckMessage({
          type: 'success',
          text: data.alreadyProcessed ? 'Already marked paid — nothing changed.' : 'Payment verified and order updated to paid!',
        });
      } else {
        setRecheckMessage({ type: 'warning', text: 'Chapa still shows this payment as not completed.' });
      }
    } catch (error) {
      console.error('Error rechecking:', error);
      setRecheckMessage({ type: 'error', text: 'Failed to recheck payment. Please try again.' });
    } finally {
      setRechecking(false);
      setTimeout(() => setRecheckMessage(null), 6000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/abulhabesh/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <HiArrowLeft className="w-5 h-5" /> Back to orders
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {recheckMessage && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            recheckMessage.type === 'success' ? 'bg-green-100 text-green-800' :
            recheckMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {recheckMessage.text}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {order.tx_ref}
          </h1>
          <div className="flex items-center gap-3">
            {order.paymentStatus !== 'paid' && (
              <button
                onClick={handleRecheck}
                disabled={rechecking}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-200 transition-colors disabled:opacity-50"
              >
                <HiRefresh className={`w-4 h-4 ${rechecking ? 'animate-spin' : ''}`} />
                {rechecking ? 'Checking...' : 'Recheck with Chapa'}
              </button>
            )}
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={saving}
              className="border border-gray-300 rounded-lg px-4 py-2 font-semibold text-gray-900 disabled:opacity-50"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>{item.name}</p>
                    <p className="text-sm text-gray-600">Size: {item.size} × {item.qty}</p>
                    {item.customMeasurements && (
                      <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1">
                        {Object.entries(item.customMeasurements).map(([key, val]) => (
                          val ? <span key={key}>{key}: {val}cm</span> : null
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">${item.lineTotal}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 mt-4 border-t border-gray-200 font-bold text-lg">
              <span>Total</span>
              <span>${order.pricing?.total}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>Customer</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>{order.customer?.firstName} {order.customer?.lastName}</strong></p>
              <p>{order.customer?.email}</p>
              <p>{order.customer?.phone}</p>
              <p className="pt-2 border-t border-gray-100 mt-2">
                {order.customer?.addressLine1}<br/>
                {order.customer?.addressLine2 && <>{order.customer.addressLine2}<br/></>}
                {order.customer?.city}, {order.customer?.country}<br/>
                {order.customer?.postalCode}
              </p>
              {order.customer?.deliveryNotes && (
                <p className="pt-2 border-t border-gray-100 mt-2 italic text-gray-500">
                  "{order.customer.deliveryNotes}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
