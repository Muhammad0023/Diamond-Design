import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiLockClosed, HiMail } from 'react-icons/hi';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/abulhabesh/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Diamond Design
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
            Admin Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Admin Login
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-brand transition-colors"
                  placeholder="admin@diamonddesign.et"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-brand transition-colors"
                  placeholder="••••••••"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-4 rounded-lg font-bold hover:bg-brand-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>

          {/* Back to Store */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-brand transition-colors" style={{ fontFamily: 'Roboto, sans-serif' }}>
              ← Back to Store
            </a>
          </div>
        </div>

        {/* First Time Setup Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <strong>First time?</strong> Create your admin account in Firebase Console → Authentication → Add user manually.
          </p>
        </div>
      </div>
    </div>
  );
}
