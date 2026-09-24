'use client';

import { useState } from 'react';
import { Search, Upload, Download, Eye, FileText } from 'lucide-react';

export default function ExamResultClient({ results, tests, students }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload Marks Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [marksInput, setMarksInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadMarks = async (e) => {
    e.preventDefault();
    if (!selectedTestId || !marksInput.trim()) {
      alert("Please select a test and enter marks data.");
      return;
    }
    
    setIsUploading(true);
    try {
      // Basic parser: expects format "AdmissionNo, Marks" per line
      const lines = marksInput.trim().split('\n');
      const parsedResults = [];
      
      for (const line of lines) {
        const [admNo, marks] = line.split(',').map(s => s.trim());
        if (admNo && marks) {
          // Find student by admission no (studentId)
          const student = students.find(s => s.studentId === admNo);
          if (student) {
            parsedResults.push({
              studentId: student._id,
              marksObtained: Number(marks)
            });
          }
        }
      }

      if (parsedResults.length === 0) {
        alert("No valid student marks found. Please check format (AdmissionNo, Marks)");
        setIsUploading(false);
        return;
      }

      // We need to fetch the existing test data to update it properly
      const test = tests.find(t => t._id === selectedTestId);
      if (!test) throw new Error("Test not found");

      const payload = {
        testName: test.testName,
        maxMarks: test.maxMarks,
        results: parsedResults
      };

      const res = await fetch(`/api/tests/${selectedTestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Marks uploaded successfully!");
        setShowUploadModal(false);
        setMarksInput('');
        window.location.reload(); // Quick refresh to load new data
      } else {
        alert('Failed to upload marks');
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading marks");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Result</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage student exam performance</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-[#1b9af7] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload size={18} />
            <span>Upload Marks</span>
          </button>
        </div>
      </div>

      {/* Controls section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by student name, class or exam..." 
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
                <th className="px-6 py-4">Admission No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Exam</th>
                <th className="px-6 py-4">Grand Total</th>
                <th className="px-6 py-4">Percent(%)</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Result</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              ) : (
                filteredResults.map((result, index) => (
                  <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 font-mono text-xs">{result.admissionNo}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{result.name}</td>
                    <td className="px-6 py-4">{result.className}</td>
                    <td className="px-6 py-4">{result.examName}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{result.grandTotal}</td>
                    <td className="px-6 py-4">{result.percentage}%</td>
                    <td className="px-6 py-4 font-bold">{result.grade}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.resultStatus === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-blue-600'
                      }`}>
                        {result.resultStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-[#1b9af7] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye size={16} />
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl text-[#1b9af7]">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upload Exam Marks</h2>
                <p className="text-sm text-gray-500">Bulk upload marks for an exam.</p>
              </div>
            </div>

            <form onSubmit={handleUploadMarks} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam</label>
                <select
                  required
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                >
                  <option value="">-- Choose Exam --</option>
                  {tests.map(test => (
                    <option key={test._id} value={test._id}>
                      {test.testName} (Max: {test.maxMarks})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CSV Data (AdmissionNo, Marks)</label>
                <p className="text-xs text-gray-500 mb-2">Paste your data below. Example: <code>STU001, 85</code></p>
                <textarea
                  required
                  rows={8}
                  value={marksInput}
                  onChange={(e) => setMarksInput(e.target.value)}
                  placeholder="STU001, 85&#10;STU002, 92&#10;STU003, 76"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-[#1b9af7] text-white font-medium hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading ? 'Uploading...' : 'Save Results'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
