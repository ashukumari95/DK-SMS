'use client';

import { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentsTable({ initialStudents, batches }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  
  // Edit State
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', class: '', batchId: '' });
  const [loading, setLoading] = useState(false);

  const filteredStudents = initialStudents.filter(student => 
    (selectedBatch === '' || student.batchId === selectedBatch) &&
    (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm)
    )
  );

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      phone: student.phone,
      class: student.class,
      batchId: student.batchId || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setEditingStudent(null);
        router.refresh();
      } else {
        const error = await res.json();
        alert('Failed to update: ' + error.error);
      }
    } catch (err) {
      alert('Error updating student.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student and all associated records?')) return;
    
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert('Failed to delete: ' + error.error);
      }
    } catch (err) {
      alert('Error deleting student.');
    }
  };

  return (
    <>
      <div className="card !p-0 overflow-hidden relative">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, ID, or phone..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-64 shrink-0">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="input-field appearance-none bg-white cursor-pointer"
            >
              <option value="">All Batches</option>
              {batches?.map(b => (
                <option key={b._id} value={b._id}>{b.batchName}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Student ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Batch / Class</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Fee Due</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map(student => {
                const batchName = batches?.find(b => b._id === student.batchId)?.batchName || student.class;
                return (
                <tr key={student._id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-brand-blue)]">{student.studentId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600 border border-gray-200">
                      {batchName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                  <td className="px-6 py-4 font-medium">
                    {student.fees.amountDue > 0 
                      ? <span className="text-red-600">₹{student.fees.amountDue.toLocaleString()}</span>
                      : <span className="text-green-600">Cleared</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/students/${student._id}`} className="p-1.5 text-gray-400 hover:text-[var(--color-brand-blue)] rounded-md hover:bg-blue-50 transition-colors">
                        <Eye size={16} />
                      </Link>
                      <button 
                        onClick={() => handleEditClick(student)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-gray-300 mb-2" />
                      <p>No students found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Edit Student</h3>
              <button 
                onClick={() => setEditingStudent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="input-field w-full" 
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                <input 
                  type="text" 
                  required
                  className="input-field w-full" 
                  value={editForm.phone}
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Class/Grade</label>
                <select
                  required
                  className="input-field w-full"
                  value={editForm.class}
                  onChange={e => setEditForm({...editForm, class: e.target.value})}
                >
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                  <option value="Dropper">Dropper</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary py-2 px-4 text-sm"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
