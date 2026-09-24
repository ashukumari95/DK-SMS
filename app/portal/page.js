import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';
import Test from '@/models/Test';
import Attendance from '@/models/Attendance';
import { IndianRupee, BookOpen, Calendar, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PortalDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'Student') {
    redirect('/portal/login');
  }

  await connectToDatabase();
  
  const student = await Student.findById(session.studentId).populate('batchId').lean();

  if (!student) {
    redirect('/portal/login');
  }

  // Fetch real scores
  const tests = await Test.find({ 'results.studentId': session.studentId }).sort({ date: -1 }).limit(5).lean();
  const recentScores = tests.map(test => {
    const result = test.results.find(r => r.studentId.toString() === session.studentId.toString());
    return {
      subject: test.testName || test.subject || 'Test',
      score: result?.marksObtained || 0,
      outOf: test.maxMarks || 100,
      date: test.date
    };
  });

  // Fetch attendance
  const attendances = await Attendance.find({ batchId: student.batchId?._id }).lean();
  let totalClasses = 0;
  let presentClasses = 0;
  
  attendances.forEach(att => {
    const record = att.records.find(r => r.studentId.toString() === session.studentId.toString());
    if (record) {
      totalClasses++;
      if (record.status === 'Present' || record.status === 'Late') {
        presentClasses++;
      }
    }
  });
  
  const attendancePercentage = totalClasses === 0 ? 100 : Math.round((presentClasses / totalClasses) * 100);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {student.name}!</h1>
        <p className="text-gray-500 text-sm mt-1">Here is your academic overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Attendance</h3>
              <p className="text-2xl font-bold text-gray-900">{attendancePercentage}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${attendancePercentage}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Overall attendance for this session</p>
        </div>

        {/* Fees Card */}
        <div className="card border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <IndianRupee size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Fee Due</h3>
                <p className="text-2xl font-bold text-gray-900">₹{student.fees?.amountDue || 0}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">Total Paid: <span className="text-gray-900 font-medium">₹{student.fees?.amountPaid || 0}</span></span>
            <span className="text-gray-500">Total Fee: <span className="text-gray-900 font-medium">₹{student.fees?.totalFee || 0}</span></span>
          </div>
        </div>

        {/* Batch Info */}
        <div className="card border-l-4 border-green-500">
           <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Current Class</h3>
              <p className="text-2xl font-bold text-gray-900">{student.class}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">{student.batchId?.batchName || 'Not Assigned'}</p>
          <p className="text-xs text-gray-500 mt-1">
            {student.batchId?.timing?.startTime || '00:00'} - {student.batchId?.timing?.endTime || '00:00'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scores */}
        <div className="card !p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Award size={20} className="text-[#1b9af7]" />
              Recent Test Scores
            </h2>
            <button className="text-sm font-medium text-[var(--color-brand-blue)] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentScores.map((score, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-medium text-gray-900">{score.subject}</h4>
                  <p className="text-xs text-gray-500">{new Date(score.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#1b9af7]">
                    {score.score} <span className="text-sm text-gray-400 font-normal">/ {score.outOf}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {Math.round((score.score / score.outOf) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice Board */}
        <div className="card">
           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
              Notice Board
           </h2>
           <div className="space-y-4">
             <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2">Important</span>
                <h4 className="font-semibold text-gray-900">Upcoming Parent-Teacher Meeting</h4>
                <p className="text-sm text-gray-600 mt-1">The next PTM is scheduled for the 15th of this month. Please inform your parents.</p>
             </div>
             <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded mb-2">General</span>
                <h4 className="font-semibold text-gray-900">Diwali Holidays</h4>
                <p className="text-sm text-gray-600 mt-1">Classes will remain closed for Diwali from 10th to 14th November.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
