'use client';

import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function ExamListClient({ initialTests, batches }) {
  const [tests, setTests] = useState(initialTests);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    testName: '',
    date: '',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    subject: 'Mathematics',
    batchId: '',
    maxMarks: 100
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      testName: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      subject: 'Mathematics',
      batchId: batches.length > 0 ? batches[0]._id : '',
      maxMarks: 100
    });
    setShowForm(true);
  };

  const openEditModal = (test) => {
    setIsEditing(true);
    setCurrentTest(test);
    setFormData({
      testName: test.testName,
      date: test.date,
      startTime: test.startTime || '10:00 AM',
      endTime: test.endTime || '01:00 PM',
      subject: test.subject || 'Mathematics',
      batchId: test.batchId,
      maxMarks: test.maxMarks
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/tests/${currentTest._id}` : '/api/tests';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const savedTest = await res.json();
        if (isEditing) {
          setTests(tests.map(t => t._id === savedTest._id ? {
            ...savedTest,
            date: new Date(savedTest.date).toISOString().split('T')[0]
          } : t));
        } else {
          setTests([{
            ...savedTest,
            date: new Date(savedTest.date).toISOString().split('T')[0]
          }, ...tests]);
        }
        setShowForm(false);
      } else {
        alert('Failed to save exam');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving exam');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this exam? All results will be lost.')) return;
    try {
      const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTests(tests.filter(t => t._id !== id));
      } else {
        alert('Failed to delete exam');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting exam');
    }
  };

  const filteredTests = tests.filter(t => 
    t.testName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam List</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and view all examinations</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#1b9af7] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Add Exam</span>
        </button>
      </div>

      {/* Controls section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search exams..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Exam Name</th>
                <th className="px-6 py-4">Exam Date</th>
                <th className="px-6 py-4">Start Time</th>
                <th className="px-6 py-4">End Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No exams found
                  </td>
                </tr>
              ) : (
                filteredTests.map((test, index) => (
                  <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4">{test.testName}</td>
                    <td className="px-6 py-4">{test.date}</td>
                    <td className="px-6 py-4">{test.startTime || '10:00 AM'}</td>
                    <td className="px-6 py-4">{test.endTime || '01:00 PM'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.marksEntryStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-blue-600'
                      }`}>
                        {test.marksEntryStatus === 'Completed' ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(test)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(test._id)} className="p-1.5 text-red-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isEditing ? 'Edit Exam' : 'Add New Exam'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                <input 
                  type="text" 
                  name="testName"
                  required
                  value={formData.testName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  placeholder="e.g. Mid Term Exam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Batch</label>
                  <select
                    name="batchId"
                    required
                    value={formData.batchId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.batchName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input 
                    type="text" 
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                    placeholder="e.g. 10:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input 
                    type="text" 
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                    placeholder="e.g. 01:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                <input 
                  type="number" 
                  name="maxMarks"
                  required
                  min="1"
                  value={formData.maxMarks}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-[#1b9af7] text-white font-medium hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                >
                  {isEditing ? 'Save Changes' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
