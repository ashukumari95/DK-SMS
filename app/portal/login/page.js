'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PortalLogin() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!studentId || !phone) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/portal-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, phone })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/portal');
        router.refresh(); // Ensure layout respects new auth state
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[var(--color-brand-blue)] rounded-xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
              DK
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Portal</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to view your attendance, fees, and results</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center justify-center font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Student ID</label>
              <input
                type="text"
                placeholder="e.g. DKM-2026-001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all placeholder-gray-400 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Registered Mobile Number</label>
              <input
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all placeholder-gray-400 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[var(--color-brand-blue)] hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-[0_4px_14px_0_rgba(27,154,247,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(27,154,247,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                'Access Portal'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Having trouble logging in? <a href="#" className="text-[var(--color-brand-blue)] hover:underline font-medium">Contact Office</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
