'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // Mock notifications for UI demonstration
  const notifications = [
    { id: 1, title: 'Fee Reminder', message: '5 students have dues crossing ₹5000.', time: '1h ago', unread: true },
    { id: 2, title: 'Test Scheduled', message: 'Physics Unit Test for Class 12th is tomorrow.', time: '3h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-100"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
            <button className="text-[var(--color-brand-blue)] text-xs font-medium hover:underline">Mark all as read</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${n.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h4>
                      <span className="text-xs text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No new notifications
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-100 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <span className="text-[var(--color-brand-blue)] text-sm font-medium">View All</span>
          </div>
        </div>
      )}
    </div>
  );
}
