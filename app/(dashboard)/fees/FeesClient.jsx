'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, IndianRupee } from 'lucide-react';
import ExportButton from '@/components/ExportButton';

export default function FeesClient({ students, defaulters }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('defaulters');
  
  // Payment Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('January');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !amount) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudent, amount, month }),
      });
      
      if (res.ok) {
        alert('Payment recorded successfully!');
        setSelectedStudent('');
        setAmount('');
        router.refresh();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (error) {
      alert('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (phone, name, due) => {
    const text = `Dear ${name} ji, this is a reminder from D.K.Mishra that your fee of ₹${due} is pending. Please clear it at the earliest.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Format data for export
  const exportData = defaulters.map(s => ({
    'Student ID': s.studentId,
    'Name': s.name,
    'Phone': s.phone,
    'Total Fee': s.fees.totalFee,
    'Amount Due': s.fees.amountDue
  }));

  return (
    <div className="card !p-0 overflow-hidden">
      <div className="flex border-b border-gray-100 items-center justify-between">
        <div className="flex flex-1">
          <button 
            onClick={() => setActiveTab('defaulters')}
            className={`flex-1 py-4 font-medium text-sm transition-colors ${activeTab === 'defaulters' ? 'text-[var(--color-brand-blue)] border-b-2 border-[var(--color-brand-blue)] bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Defaulters List
          </button>
          <button 
            onClick={() => setActiveTab('collect')}
            className={`flex-1 py-4 font-medium text-sm transition-colors ${activeTab === 'collect' ? 'text-[var(--color-brand-blue)] border-b-2 border-[var(--color-brand-blue)] bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Collect Payment
          </button>
        </div>
        {activeTab === 'defaulters' && defaulters.length > 0 && (
          <div className="pr-4 hidden sm:block">
            <ExportButton data={exportData} filename="defaulters_list.csv" />
          </div>
        )}
      </div>

      <div className="p-6">
        {activeTab === 'defaulters' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Student ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Total Fee</th>
                  <th className="px-4 py-3 font-medium">Amount Due</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {defaulters.map(student => (
                  <tr key={student._id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{student.studentId}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3 text-gray-600">₹{student.fees.totalFee}</td>
                    <td className="px-4 py-3 font-bold text-red-600">₹{student.fees.amountDue}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openWhatsApp(student.phone, student.name, student.fees.amountDue)}
                          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </button>
                        <button 
                          onClick={async () => {
                            const btn = document.getElementById(`sms-${student._id}`);
                            btn.innerText = "Sending...";
                            try {
                              const text = `Dear ${student.name}, reminder from D.K.Mishra: Fee of ₹${student.fees.amountDue} is pending. Please clear.`;
                              await fetch('/api/communications/send', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  studentId: student._id,
                                  recipientPhone: student.phone,
                                  message: text,
                                  purpose: 'FeeReminder'
                                })
                              });
                              btn.innerText = "SMS Sent";
                              btn.classList.add('bg-gray-400');
                              btn.disabled = true;
                            } catch (e) {
                              btn.innerText = "Failed";
                            }
                          }}
                          id={`sms-${student._id}`}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          Send SMS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {defaulters.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No defaulters currently.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="max-w-md mx-auto space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Student</label>
              <select 
                required 
                value={selectedStudent} 
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="input-field"
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s._id} value={s.studentId}>
                    {s.name} ({s.studentId}) - Due: ₹{s.fees.amountDue}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Amount (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee size={16} className="text-gray-400" />
                </div>
                <input 
                  required 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-9" 
                  placeholder="e.g. 2000" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">For Month</label>
              <select 
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input-field"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Processing...' : 'Record Payment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
