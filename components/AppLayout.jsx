'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Home, Users, Layers, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

export default function AppLayout({ children, session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const renderAvatar = (className) => {
    if (session?.profilePicture) {
      return (
        <Link href="/profile" className={`${className} overflow-hidden hover:opacity-80 transition-opacity`}>
          <img src={session.profilePicture} alt="Profile" className="w-full h-full object-cover" />
        </Link>
      );
    }
    return (
      <Link href="/profile" className={`${className} bg-[var(--color-brand-blue)] flex items-center justify-center text-white font-bold text-xs hover:bg-blue-700 transition-colors`}>
        {session?.name ? session.name.substring(0, 2).toUpperCase() : 'DK'}
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-main)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed on mobile, static on desktop */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col w-full pb-16 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[var(--bg-card)] border-b border-[var(--border-color)] shadow-sm shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[var(--color-brand-blue)]">D.K.Mishra</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell />
            {renderAvatar("h-8 w-8 rounded-full shadow-sm")}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:pt-6 md:px-8 md:pb-12 w-full max-w-[100vw]">
          <header className="hidden md:flex mb-8 justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-brand-blue)]">D.K.Mishra</h1>
              <p className="text-slate-600 dark:text-gray-400 text-sm mt-1">Student Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <NotificationBell />
              {renderAvatar("h-10 w-10 rounded-full shadow-md")}
            </div>
          </header>
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 flex justify-around items-center p-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <Link href="/" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${pathname === '/' ? 'text-[#1b9af7]' : 'text-gray-500'}`}>
          <Home size={22} className={pathname === '/' ? 'fill-blue-50 text-[#1b9af7]' : ''} />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="/students" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${pathname.startsWith('/students') ? 'text-[#1b9af7]' : 'text-gray-500'}`}>
          <Users size={22} className={pathname.startsWith('/students') ? 'fill-blue-50 text-[#1b9af7]' : ''} />
          <span className="text-[10px] font-medium mt-1">Students</span>
        </Link>
        <Link href="/batches" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${pathname.startsWith('/batches') ? 'text-[#1b9af7]' : 'text-gray-500'}`}>
          <Layers size={22} className={pathname.startsWith('/batches') ? 'fill-blue-50 text-[#1b9af7]' : ''} />
          <span className="text-[10px] font-medium mt-1">Batches</span>
        </Link>
        <Link href="/exams" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${pathname.startsWith('/exams') ? 'text-[#1b9af7]' : 'text-gray-500'}`}>
          <FileText size={22} className={pathname.startsWith('/exams') ? 'fill-blue-50 text-[#1b9af7]' : ''} />
          <span className="text-[10px] font-medium mt-1">Tests</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${pathname === '/profile' ? 'text-[#1b9af7]' : 'text-gray-500'}`}>
          <User size={22} className={pathname === '/profile' ? 'fill-blue-50 text-[#1b9af7]' : ''} />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}
