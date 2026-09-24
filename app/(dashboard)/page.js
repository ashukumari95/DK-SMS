import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';
import Batch from '@/models/Batch';
import { Users, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  await connectToDatabase();
  
  const totalStudents = await Student.countDocuments({ isActive: true });
  
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todaysBatches = await Batch.countDocuments({ daysOfWeek: todayStr });
  
  // Aggregate fees
  const feeStats = await Student.aggregate([
    { $match: { isActive: true } },
    { 
      $group: { 
        _id: null, 
        totalExpected: { $sum: "$fees.totalFee" },
        totalCollected: { $sum: "$fees.amountPaid" },
        totalDue: { $sum: "$fees.amountDue" }
      } 
    }
  ]);
  
  const stats = feeStats[0] || { totalExpected: 0, totalCollected: 0, totalDue: 0 };

  // Aggregate class distribution for pie chart
  const classDistributionAgg = await Student.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$class",
        value: { $sum: 1 }
      }
    },
    { $project: { name: "$_id", value: 1, _id: 0 } },
    { $sort: { value: -1 } }
  ]);
  
  // Recent students
  const recentStudents = await Student.find({ isActive: true }).sort({ createdAt: -1 }).limit(5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="card border-l-4 border-l-[var(--color-brand-blue)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Total Students</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalStudents}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[var(--color-brand-blue)]">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Fees Collected</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{stats.totalCollected.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-500">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Outstanding Dues</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{stats.totalDue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-500">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-[var(--color-brand-accent)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400">Today's Batches</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{todaysBatches}</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-[var(--color-brand-accent)]">
              <Calendar size={24} />
            </div>
          </div>
        </div>

      </div>

      <DashboardCharts classDistribution={classDistributionAgg} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recently Enrolled Students</h2>
            <Link href="/students" className="text-sm text-[var(--color-brand-blue)] font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg rounded-bl-lg">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg rounded-br-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {recentStudents.map(student => (
                  <tr key={student._id.toString()} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-[var(--color-brand-blue)]">{student.studentId}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-200">{student.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-gray-400">{student.class}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-gray-400">{student.phone}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full">Active</span>
                    </td>
                  </tr>
                ))}
                {recentStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500 dark:text-gray-400">No students enrolled yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/students/new" className="flex items-center p-3 rounded-lg border border-[var(--border-color)] hover:border-[var(--color-brand-blue)] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-[var(--color-brand-blue)] mr-3 group-hover:bg-[var(--color-brand-blue)] group-hover:text-white transition-colors">
                <Users size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-gray-200">Add New Student</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400">Register a new admission</p>
              </div>
            </Link>
            
            <Link href="/fees/collect" className="flex items-center p-3 rounded-lg border border-[var(--border-color)] hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group">
              <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-lg text-green-600 dark:text-green-500 mr-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-gray-200">Collect Fee</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400">Record a new payment</p>
              </div>
            </Link>

            <Link href="/attendance" className="flex items-center p-3 rounded-lg border border-[var(--border-color)] hover:border-[var(--color-brand-accent)] hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group">
              <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg text-[var(--color-brand-accent)] mr-3 group-hover:bg-[var(--color-brand-accent)] group-hover:text-white transition-colors">
                <Calendar size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-gray-200">Mark Attendance</h4>
                <p className="text-xs text-slate-500 dark:text-gray-400">Daily batch attendance</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
