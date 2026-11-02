'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';

// Top 10 kept first (per business preference), rest alphabetical-ish after.
const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Sweden', 'Australia',
  'Norway', 'Germany', 'Switzerland', 'Denmark', 'France',
  'Ethiopia', 'Italy', 'Netherlands', 'Belgium', 'Finland', 'Greece',
  'Austria', 'Luxembourg', 'Malta',
  'New Zealand', 'South Africa', 'Kenya', 'Uganda',
  'Saudi Arabia', 'Israel', 'United Arab Emirates', 'Lebanon', 'Kuwait',
  'Bahrain', 'Jordan', 'Other'
];

const STATE_REQUIRED_COUNTRIES = ['United States', 'Canada', 'Australia', 'United Arab Emirates'];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const { cartItems } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ETB estimate shown when country === 'Ethiopia'. This is DISPLAY ONLY —
  // the authoritative rate is fetched again server-side in
  // /api/chapa/initialize at the moment of payment, since rates can move
  // between now and when the customer actually submits.
  const [etbEstimate, setEtbEstimate] = useState(null); // { rate, etbAmount } | null
  const [etbLoading, setEtbLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    country: '', customCountry: '', state: '', city: '', postalCode: '',
    addressLine1: '', addressLine2: '', deliveryNotes: '',
  });

  useEffect(() => {
    if (mode === 'buynow') {
      const stored = sessionStorage.getItem('buyNowItem');
      if (stored) {
        setItems([JSON.parse(stored)]);
      }
    } else {
      setItems(cartItems);
    }
  }, [mode, cartItems]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const total = items.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity || 1)), 0);

  useEffect(() => {
    if (form.country !== 'Ethiopia' || total <= 0) {
      setEtbEstimate(null);
      return;
    }

    let cancelled = false;
    setEtbLoading(true);

    fetch('/api/chapa/rates')
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        if (data.error || !data.rate) {
          setEtbEstimate(null);
          return;
        }
        setEtbEstimate({
          rate: data.rate,
          etbAmount: Math.round(total * data.rate),
        });
      })
      .catch(() => {
        if (!cancelled) setEtbEstimate(null);
      })
      .finally(() => {
        if (!cancelled) setEtbLoading(false);
      });

    return () => { cancelled = true; };
  }, [form.country, total]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.country || !form.city || !form.addressLine1) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.country === 'Other' && !form.customCountry) {
      setError('Please enter your country.');
      return;
    }

    if (STATE_REQUIRED_COUNTRIES.includes(form.country) && !form.state) {
      setError('Please enter your state/province.');
      return;
    }

    if (form.country !== 'Ethiopia' && !form.postalCode) {
      setError('Please enter your postal/zip code.');
      return;
    }

    if (items.length === 0) {
      setError('Your order is empty.');
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.productId || item.id,
        size: item.size,
        customMeasurements: item.customMeasurements || null,
        qty: item.qty || item.quantity || 1,
      }));

      const finalCustomer = {
        ...form,
        country: form.country === 'Other' ? form.customCountry : form.country,
      };

      const createRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems, customer: finalCustomer }),
      });
      const createData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(createData.error || 'Could not create order');
      }

      const initRes = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: createData.orderId }),
      });
      const initData = await initRes.json();

      if (!initRes.ok) {
        throw new Error(initData.error || 'Could not start payment');
      }

      if (mode === 'buynow') {
        sessionStorage.removeItem('buyNowItem');
      }

      window.location.href = initData.checkoutUrl;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white mt-20 lg:mt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-8" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Delivery & Contact
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">First name *</label>
                <input required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Last name *</label>
                <input required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Email *</label>
              <input required type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                value={form.email} onChange={e => handleChange('email', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone *</label>
              <input required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Country *</label>
              <select required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                value={form.country} onChange={e => handleChange('country', e.target.value)}>
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {form.country === 'Other' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Please specify your country *</label>
                <input required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  value={form.customCountry} onChange={e => handleChange('customCountry', e.target.value)} />
              </div>
            )}

            {STATE_REQUIRED_COUNTRIES.includes(form.country) && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">State / Province *</label>
                <input required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  value={form.state} onChange={e => handleChange('state', e.target.value)} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">City *</label>
                <input required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  value={form.city} onChange={e => handleChange('city', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Postal/Zip {form.country !== 'Ethiopia' ? '*' : '(optional)'}
                </label>
                <input required={form.country !== 'Ethiopia'} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  value={form.postalCode} onChange={e => handleChange('postalCode', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Street address *</label>
              <input required className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                value={form.addressLine1} onChange={e => handleChange('addressLine1', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Apartment / house no. (optional)</label>
              <input className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                value={form.addressLine2} onChange={e => handleChange('addressLine2', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Delivery notes (optional)</label>
              <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none h-20"
                value={form.deliveryNotes} onChange={e => handleChange('deliveryNotes', e.target.value)} />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-4 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? 'Processing…' : 'Continue to payment'}
            </button>
          </form>

          <div className="bg-gray-50 rounded-lg p-6 h-fit">
            <h2 className="font-semibold text-sm text-gray-700 mb-4 uppercase tracking-wide">Order summary</h2>
            {items.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm mb-3">
                <div className="w-14 h-14 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="text-gray-900">{item.name}</p>
                    <p className="text-gray-500 text-xs">
                      Size: {item.size}{item.customMeasurements ? ' (custom)' : ''}
                      {item.qty || item.quantity > 1 ? ` × ${item.qty || item.quantity}` : ''}
                    </p>
                  </div>
                  <p className="text-gray-900">${(item.price * (item.qty || item.quantity || 1)).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {form.country === 'Ethiopia' && (
              <div className="text-xs text-gray-500 mt-2 text-right">
                {etbLoading && <span>Checking ETB rate…</span>}
                {!etbLoading && etbEstimate && (
                  <span>
                    ≈ {etbEstimate.etbAmount.toLocaleString()} ETB — final amount confirmed at payment
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
