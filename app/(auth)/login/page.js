'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Phone, Lock, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaData, setCaptchaData] = useState({ id: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCaptcha = async () => {
    try {
      const res = await fetch('/api/auth/captcha');
      const data = await res.json();
      setCaptchaData(data);
      setCaptchaInput('');
    } catch (err) {
      console.error('Failed to load captcha', err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          password,
          captcha: captchaInput,
          captchaId: captchaData.id
        })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/');
        router.refresh(); // Refresh to update session state across the app
      } else {
        setError(data.message || 'Login failed');
        fetchCaptcha(); // Refresh captcha on failure
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-blue)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute w-full h-full">
          <polygon fill="white" points="0,100 100,0 100,100"/>
        </svg>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-brand-blue)] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">D.K.Mishra</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-blue-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--color-brand-blue)] focus:border-[var(--color-brand-blue)] outline-none"
                placeholder="Enter 10 digit number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="/forgot-password" className="text-sm font-medium text-[var(--color-brand-blue)] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--color-brand-blue)] focus:border-[var(--color-brand-blue)] outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Check</label>
            <div className="flex items-center space-x-3">
              {captchaData.image ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white flex items-center justify-center h-[50px] w-[150px]">
                  <img src={captchaData.image} alt="captcha" className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="h-[50px] w-[150px] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                  <span className="text-gray-400 text-sm">Loading...</span>
                </div>
              )}
              <button 
                type="button" 
                onClick={fetchCaptcha}
                className="p-2 text-gray-500 hover:text-[var(--color-brand-blue)] bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200"
                title="Refresh Captcha"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--color-brand-blue)] focus:border-[var(--color-brand-blue)] outline-none"
              placeholder="Enter the code shown above"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--color-brand-blue)] hover:bg-[#153460] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E4A8A] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
