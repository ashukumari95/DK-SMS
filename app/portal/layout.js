'use client';

import { LogOut, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBell from '@/components/NotificationBell';

export default function PortalLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/portal/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const isLoginPage = pathname === '/portal/login';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      {/* Portal Header - Only show if NOT on login page */}
      {!isLoginPage && (
        <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-brand-blue)] rounded-lg flex items-center justify-center text-white text-lg font-black shadow-md">
                DK
              </div>
              <span className="font-bold text-[var(--color-brand-blue)] tracking-tight text-lg hidden sm:block">
                Student Portal
              </span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <NotificationBell />
              <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <User size={18} />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500 mt-auto">
        <p>&copy; {new Date().getFullYear()} D.K.Mishra Coaching. All rights reserved.</p>
      </footer>
    </div>
  );
}
