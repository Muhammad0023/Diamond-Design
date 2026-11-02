'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { HiHome, HiLogout, HiCube, HiSearch, HiDownload, HiExclamation } from 'react-icons/hi';

const STATUS_STYLES = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
  refunded: 'bg-orange-100 text-orange-800',
};

const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  confirmed: 'Confirmed',
  in_production: 'In Production',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const PAGE_SIZE = 20;
const STUCK_THRESHOLD_HOURS = 3;

// Formats a Date as YYYY-MM-DD to match the <input type="date"> value format.
const toDateInputValue = (date) => date.toISOString().slice(0, 10);

export default function OrdersPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentUser) fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/abulhabesh');
  };

  const unreadCount = orders.filter(o => o.adminViewed === false).length;

  const isStuck = (order) => {
    if (order.paymentStatus !== 'pending' || !order.createdAt) return false;
    const hoursSince = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSince > STUCK_THRESHOLD_HOURS;
  };

  // Applies a quick date range by populating the existing dateFrom/dateTo
  // inputs — the actual filtering logic below is untouched.
  const applyQuickRange = (option) => {
    const today = new Date();
    const todayStr = toDateInputValue(today);

    if (option === 'today') {
      setDateFrom(todayStr);
      setDateTo(todayStr);
    } else if (option === 'yesterday') {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      const yStr = toDateInputValue(y);
      setDateFrom(yStr);
      setDateTo(yStr);
    } else if (option === '7days') {
      const from = new Date(today);
      from.setDate(from.getDate() - 6); // inclusive of today = 7 days total
      setDateFrom(toDateInputValue(from));
      setDateTo(todayStr);
    } else if (option === '30days') {
      const from = new Date(today);
      from.setDate(from.getDate() - 29); // inclusive of today = 30 days total
      setDateFrom(toDateInputValue(from));
      setDateTo(todayStr);
    } else if (option === 'clear') {
      setDateFrom('');
      setDateTo('');
    }
    setCurrentPage(1);
  };

  const filteredOrders = orders
    .filter(o => filter === 'all' || o.orderStatus === filter)
    .filter(o => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.txRef?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q)
      );
    })
    .filter(o => {
      if (!dateFrom && !dateTo) return true;
      if (!o.createdAt) return false;
      const orderDate = new Date(o.createdAt);
      if (dateFrom && orderDate < new Date(dateFrom)) return false;
      if (dateTo && orderDate > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleExportCsv = () => {
    const headers = ['Order Ref', 'Customer', 'Email', 'Total', 'Currency', 'Payment Status', 'Order Status', 'Items', 'Date'];
    const rows = filteredOrders.map(o => [
      o.txRef,
      o.customerName,
      o.customerEmail || '',
      o.total,
      o.currency,
      o.paymentStatus,
      o.orderStatus,
      o.itemCount,
      o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diamond-design-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Orders
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold bg-brand text-white px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                Logged in as: {currentUser?.email}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/abulhabesh/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <HiCube className="w-5 h-5" />
                Products
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <HiHome className="w-5 h-5" />
                View Store
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <HiLogout className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {['all', 'pending_payment', 'confirmed', 'in_production', 'shipped', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => { setFilter(status); setCurrentPage(1); }}
              className={`p-3 rounded-xl shadow-sm text-left transition-colors ${
                filter === status ? 'bg-brand text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <p className="text-xs mb-1 opacity-80" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {status === 'all' ? 'All Orders' : STATUS_LABELS[status]}
              </p>
              <p className="text-xl font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {status === 'all' ? orders.length : orders.filter(o => o.orderStatus === status).length}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 flex-wrap">
            <div className="relative max-w-xs">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search ref, name, or email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand focus:outline-none bg-white"
              />
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand focus:outline-none bg-white"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand focus:outline-none bg-white"
            />
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => applyQuickRange('today')} className="px-3 py-2 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Today
              </button>
              <button onClick={() => applyQuickRange('yesterday')} className="px-3 py-2 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Yesterday
              </button>
              <button onClick={() => applyQuickRange('7days')} className="px-3 py-2 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Last 7 days
              </button>
              <button onClick={() => applyQuickRange('30days')} className="px-3 py-2 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Last 30 days
              </button>
              {(dateFrom || dateTo) && (
                <button onClick={() => applyQuickRange('clear')} className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
                  Clear dates
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"
          >
            <HiDownload className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                No orders match
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/abulhabesh/orders/${order.id}`)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {isStuck(order) && (
                          <span title={`Pending for over ${STUCK_THRESHOLD_HOURS}h — may need a recheck`}>
                            <HiExclamation className="w-4 h-4 text-orange-500" />
                          </span>
                        )}
                        {order.txRef}
                        {order.adminViewed === false && (
                          <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        ${order.total}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${STATUS_STYLES[order.orderStatus]}`}>
                          {STATUS_LABELS[order.orderStatus]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && filteredOrders.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
