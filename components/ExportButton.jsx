'use client';

import { Download } from 'lucide-react';

export default function ExportButton({ data, filename = 'export.csv' }) {
  const downloadCSV = () => {
    if (!data || !data.length) {
      alert('No data available to export');
      return;
    }

    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV string
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let cell = row[header] === null || row[header] === undefined ? '' : row[header];
          // Escape quotes and wrap in quotes if contains comma
          cell = String(cell).replace(/"/g, '""');
          return `"${cell}"`;
        }).join(',')
      )
    ].join('\n');

    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button 
      onClick={downloadCSV}
      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
    >
      <Download size={16} />
      Export CSV
    </button>
  );
}
