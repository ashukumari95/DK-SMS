'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CalendarCheck, 
  Settings, 
  AlertCircle, 
  Layers,
  ChevronDown,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState('Examinations');

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Classes', path: '/batches', icon: <Layers size={20} /> },
    { 
      name: 'Examinations', 
      icon: <FileText size={20} />, 
      isDropdown: true,
      subItems: [
        { name: 'Exam List', path: '/exams' },
        { name: 'Exam Schedule', path: '/exams/schedule' },
        { name: 'Exam Result', path: '/exams/result' },
      ]
    },
    { name: 'Fees Collection', path: '/fees', icon: <AlertCircle size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <CalendarCheck size={20} /> },
  ];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? '' : name);
  };

  return (
    <aside className="w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col h-full shadow-sm shrink-0">
      <div className="p-6 border-b border-[var(--border-color)]">
        <h2 className="text-xl font-heading text-[#1b9af7] font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="text-orange-500" />
          D.K.Mishra
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.isDropdown) {
            const isExpanded = openDropdown === item.name;
            // Check if any subitem is active
            const isChildActive = item.subItems.some(sub => pathname === sub.path.split('?')[0].split('#')[0]);
            
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isChildActive || isExpanded
                      ? 'bg-[#1b9af7] text-white shadow-md shadow-blue-900/20'
                      : 'text-slate-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-[#1b9af7]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${isChildActive || isExpanded ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {/* Sub Menu */}
                {isExpanded && (
                  <div className="pl-11 pr-4 py-2 space-y-2">
                    {item.subItems.map((sub, idx) => (
                      <div key={idx} className="relative">
                        {/* Connecting line visual */}
                        <div className="absolute left-[-16px] top-1/2 w-3 h-[1px] bg-slate-300 dark:bg-gray-700"></div>
                        <div className="absolute left-[-16px] top-[-10px] w-[1px] h-[22px] bg-slate-300 dark:bg-gray-700"></div>
                        
                        <Link
                          href={sub.path}
                          onClick={() => onClose?.()}
                          className={`block text-sm py-1.5 transition-colors ${
                            pathname === sub.path.split('#')[0] 
                              ? 'text-[#1b9af7] font-medium' 
                              : 'text-slate-600 dark:text-gray-400 hover:text-[#1b9af7]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${pathname === sub.path.split('#')[0] ? 'bg-[#1b9af7]' : 'bg-slate-300 dark:bg-gray-700'}`}></span>
                            {sub.name}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#1b9af7] text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-[#1b9af7]'
              }`}
            >
              <div className={`${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`}>
                {item.icon}
              </div>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border-color)]">
        <Link href="/profile" onClick={() => onClose?.()} className="flex items-center gap-3 px-4 py-2 mb-2 rounded-xl transition-all duration-200 text-slate-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-[#1b9af7]">
          <div className="text-slate-600 dark:text-gray-400">
            <Users size={20} />
          </div>
          <span className="font-medium text-sm">Profile</span>
        </Link>
        <button 
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
          }} 
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 text-red-600 hover:bg-blue-50 dark:hover:bg-gray-800"
        >
          <div className="text-red-400">
            <AlertCircle size={20} />
          </div>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
