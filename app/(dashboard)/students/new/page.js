'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    parentPhone: '',
    class: '11th',
    board: 'BSEB',
    totalFee: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fees: {
            totalFee: Number(formData.totalFee),
            amountPaid: 0,
            amountDue: Number(formData.totalFee),
            installments: []
          }
        }),
      });

      if (response.ok) {
        router.push('/students');
        router.refresh();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert('Failed to save student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
          <p className="text-gray-500">Register a new student for the current session</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Student Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} type="text" className="input-field" placeholder="Full Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Student Phone</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} type="text" className="input-field" placeholder="10-digit mobile" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Parent/Guardian Phone</label>
              <input required name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="text" className="input-field" placeholder="10-digit mobile" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Class/Batch Type</label>
              <select name="class" value={formData.class} onChange={handleChange} className="input-field">
                <option value="11th">11th</option>
                <option value="12th">12th</option>
                <option value="Target JEE">Target JEE</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Board</label>
              <select name="board" value={formData.board} onChange={handleChange} className="input-field">
                <option value="BSEB">Bihar Board (BSEB)</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Total Course Fee (₹)</label>
              <input required name="totalFee" value={formData.totalFee} onChange={handleChange} type="number" className="input-field" placeholder="e.g. 15000" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Link href="/students" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Save size={18} />
              <span>{loading ? 'Saving...' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
