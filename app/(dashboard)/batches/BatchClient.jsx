'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Clock, Users, CalendarDays, Edit2, Trash2, Layers } from 'lucide-react';

export default function BatchClient({ initialBatches }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState(null);
  
  const [formData, setFormData] = useState({
    batchName: '',
    startTime: '',
    endTime: '',
    capacity: 50,
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingBatchId(null);
    setFormData({
      batchName: '',
      startTime: '',
      endTime: '',
      capacity: 50,
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    });
  };

  const handleEditClick = (batch) => {
    setEditingBatchId(batch._id);
    setFormData({
      batchName: batch.batchName,
      startTime: batch.timing.startTime,
      endTime: batch.timing.endTime,
      capacity: batch.capacity,
      daysOfWeek: batch.daysOfWeek
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (batchId) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    
    try {
      const res = await fetch(`/api/batches/${batchId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (e) {
      alert('Failed to delete batch.');
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      if (prev.daysOfWeek.includes(day)) {
        return { ...prev, daysOfWeek: prev.daysOfWeek.filter(d => d !== day) };
      } else {
        return { ...prev, daysOfWeek: [...prev.daysOfWeek, day] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEditing = !!editingBatchId;
      const url = isEditing ? `/api/batches/${editingBatchId}` : '/api/batches';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName: formData.batchName,
          capacity: Number(formData.capacity),
          daysOfWeek: formData.daysOfWeek,
          timing: {
            startTime: formData.startTime,
            endTime: formData.endTime
          }
        }),
      });

      if (res.ok) {
        alert(`Batch ${isEditing ? 'updated' : 'created'} successfully!`);
        resetForm();
        router.refresh();
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert(`Failed to ${editingBatchId ? 'update' : 'create'} batch`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end">
        <button 
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>{showForm ? 'Cancel' : 'Create New Batch'}</span>
        </button>
      </div>

      {/* Create / Edit Batch Form */}
      {showForm && (
        <div className="card border-t-4 border-t-[var(--color-brand-blue)]">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            {editingBatchId ? 'Edit Batch Details' : 'New Batch Details'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Batch Name</label>
                <input 
                  required 
                  value={formData.batchName} 
                  onChange={(e) => setFormData({...formData, batchName: e.target.value})}
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. 12th Board Target Morning" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Student Capacity</label>
                <input 
                  required 
                  value={formData.capacity} 
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  type="number" 
                  className="input-field" 
                  placeholder="e.g. 50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <input 
                  required 
                  value={formData.startTime} 
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  type="time" 
                  className="input-field" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <input 
                  required 
                  value={formData.endTime} 
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  type="time" 
                  className="input-field" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Operating Days</label>
              <div className="flex gap-2 flex-wrap">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      formData.daysOfWeek.includes(day)
                        ? 'bg-blue-50 text-[var(--color-brand-blue)] border-blue-200'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : (editingBatchId ? 'Update Batch' : 'Create Batch')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialBatches.map(batch => (
          <div key={batch._id} className="card group hover:shadow-md transition-shadow relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => handleEditClick(batch)}
                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDeleteClick(batch._id)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 pr-16">{batch.batchName}</h3>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-gray-600 gap-3 text-sm">
                <Clock size={16} className="text-[var(--color-brand-accent)]" />
                <span>{batch.timing.startTime} - {batch.timing.endTime}</span>
              </div>
              <div className="flex items-center text-gray-600 gap-3 text-sm">
                <CalendarDays size={16} className="text-green-500" />
                <span>{batch.daysOfWeek.join(', ')}</span>
              </div>
              <div className="flex items-center text-gray-600 gap-3 text-sm">
                <Users size={16} className="text-[var(--color-brand-blue)]" />
                <span>{batch.enrolledCount} / {batch.capacity} Students Enrolled</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${batch.enrolledCount >= batch.capacity ? 'bg-blue-500' : 'bg-[var(--color-brand-blue)]'}`} 
                  style={{ width: `${Math.min((batch.enrolledCount / batch.capacity) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-gray-500">
                {batch.capacity - batch.enrolledCount} seats available
              </p>
            </div>
          </div>
        ))}

        {initialBatches.length === 0 && !showForm && (
          <div className="col-span-full card py-12 text-center flex flex-col items-center">
            <Layers size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Batches Created</h3>
            <p className="text-gray-500 mt-1">Click the button above to create your first batch.</p>
          </div>
        )}
      </div>
    </div>
  );
}
