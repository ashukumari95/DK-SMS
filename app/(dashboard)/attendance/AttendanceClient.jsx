'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Save, Settings, Calendar as CalendarIcon } from 'lucide-react';

export default function AttendanceClient({ batches, students }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('mark');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [notesData, setNotesData] = useState({});
  const [loading, setLoading] = useState(false);

  // Filter students based on selected batch.
  const batchStudents = selectedBatch 
    ? students.filter(s => s.batchId === selectedBatch) 
    : [];

  const filteredStudents = batchStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleNoteChange = (studentId, note) => {
    setNotesData(prev => ({
      ...prev,
      [studentId]: note
    }));
  };

  const handleSubmit = async () => {
    if (!selectedBatch) return alert('Select a batch.');
    
    setLoading(true);
    try {
      // Mock API call delay
      await new Promise(r => setTimeout(r, 800));
      alert('Attendance saved successfully!');
      router.refresh();
    } catch (e) {
      alert('Error saving attendance');
    } finally {
      setLoading(false);
    }
  };

  const attendanceOptions = ['Present', 'Late', 'Absent', 'Halfday', 'Holiday'];

  // Generate 30 days for mock heatmap
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const randomPercent = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // 60-100%
    return { date: d.getDate(), percent: randomPercent };
  });

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'overview' ? 'text-[var(--color-brand-blue)] border-b-2 border-[var(--color-brand-blue)] bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          Attendance Overview
        </button>
        <button 
          onClick={() => setActiveTab('mark')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'mark' ? 'text-[var(--color-brand-blue)] border-b-2 border-[var(--color-brand-blue)] bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          Mark Attendance
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarIcon size={20} className="text-[#1b9af7]" />
            30-Day Attendance Heatmap (All Batches)
          </h2>
          <div className="flex flex-wrap gap-2">
            {heatmapDays.map((day, idx) => {
              let colorClass = 'bg-green-100 border-green-200 text-green-700'; // > 90%
              if (day.percent < 75) colorClass = 'bg-red-100 border-red-200 text-red-700';
              else if (day.percent < 90) colorClass = 'bg-yellow-100 border-yellow-200 text-yellow-700';

              return (
                <div key={idx} className={`w-12 h-12 flex flex-col items-center justify-center border rounded-md ${colorClass} cursor-help`} title={`${day.percent}% attendance`}>
                  <span className="text-xs font-bold">{day.date}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"></div> &gt;90%</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-sm"></div> 75%-90%</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm"></div> &lt;75%</div>
          </div>
        </div>
      )}

      {activeTab === 'mark' && (
        <>
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
              <button className="px-4 py-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm flex items-center gap-2">
                Export <ChevronDown size={14} />
              </button>
              
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b9af7]/20 focus:border-[#1b9af7] transition-all text-sm"
                />
              </div>

              <div className="relative w-full max-w-xs">
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full pl-4 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b9af7]/20 focus:border-[#1b9af7] transition-all text-sm appearance-none"
                >
                  <option value="">Filter by Class...</option>
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>{b.batchName}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
              <span>Rows per page:</span>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <button onClick={handleSubmit} disabled={loading || !selectedBatch} className="ml-4 bg-[#1b9af7] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-gray-300 text-[#1b9af7] focus:ring-[#1b9af7]" /></th>
                <th className="px-6 py-4 whitespace-nowrap">S.L</th>
                <th className="px-6 py-4 whitespace-nowrap">Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Class</th>
                <th className="px-6 py-4 whitespace-nowrap">Attendance</th>
                <th className="px-6 py-4 whitespace-nowrap">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!selectedBatch ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Please select a Class (Batch) to mark attendance.
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No students found in this class.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const batchName = batches.find(b => b._id === student.batchId)?.batchName || 'Unknown';
                  const currentStatus = attendanceData[student._id] || 'Present';

                  return (
                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300 text-[#1b9af7] focus:ring-[#1b9af7]" /></td>
                      <td className="px-6 py-4 font-medium text-[#1b9af7]">{String(index + 1).padStart(2, '0')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-500">Roll No: {student.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{batchName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {attendanceOptions.map(option => (
                            <label key={option} className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`attendance-${student._id}`}
                                value={option}
                                checked={currentStatus === option}
                                onChange={() => handleStatusChange(student._id, option)}
                                className="w-4 h-4 text-[#1b9af7] border-gray-300 focus:ring-[#1b9af7]"
                              />
                              <span className={`text-sm ${currentStatus === option ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          placeholder="Write note..."
                          value={notesData[student._id] || ''}
                          onChange={(e) => handleNoteChange(student._id, e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Floating Settings Icon (from UI) */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-[#1b9af7] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-colors z-50">
        <Settings size={20} />
      </button>
        </>
      )}
    </div>
  );
}
