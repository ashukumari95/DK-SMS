'use client';

import { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ExamScheduleClient({ schedules }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSchedules = schedules.filter(s => 
    s.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage exam timings across classes</p>
        </div>
        <Link 
          href="/exams"
          className="bg-[#1b9af7] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Add Schedule</span>
        </Link>
      </div>

      {/* Controls section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">November 2026</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">&lt;</button>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">&gt;</button>
          </div>
        </div>
        <div className="relative max-w-md w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search schedule..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Calendar section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50 text-center text-xs font-semibold text-gray-500 uppercase py-3">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="grid grid-cols-7 auto-rows-[120px] bg-gray-200 gap-[1px]">
          {/* Fill with empty blocks and days (mocked for Nov 2026) */}
          {Array.from({ length: 35 }).map((_, i) => {
            const dateStr = `2026-11-${String(i - 0 + 1).padStart(2, '0')}`;
            const daySchedules = filteredSchedules.filter(s => s.date === dateStr);
            
            return (
              <div key={i} className="bg-white p-2 flex flex-col hover:bg-gray-50 transition-colors overflow-y-auto">
                <span className="text-sm font-medium text-gray-500 mb-1">{i < 30 ? i + 1 : ''}</span>
                {daySchedules.map(s => (
                  <div key={s._id} className="text-xs bg-blue-50 border border-blue-100 text-blue-700 rounded p-1 mb-1 truncate cursor-pointer hover:bg-blue-100" title={`${s.subject} (${s.batchName})`}>
                    <div className="font-semibold">{s.subject}</div>
                    <div>{s.startTime}</div>
                  </div>
                ))}
                {i < 30 && i === 14 && daySchedules.length === 0 && (
                   <div className="text-xs bg-blue-50 border border-blue-100 text-blue-700 rounded p-1 mb-1 truncate cursor-pointer hover:bg-blue-100">
                     <div className="font-semibold">Mock Test</div>
                     <div>10:00 AM</div>
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
