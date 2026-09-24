import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';
import Batch from '@/models/Batch';
import AttendanceClient from './AttendanceClient';

export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
  await connectToDatabase();
  
  // We need batches for the dropdown
  const batches = await Batch.find({}).sort({ batchName: 1 });
  
  // We need students to populate the attendance list for a selected batch
  const students = await Student.find({ isActive: true }).sort({ name: 1 });
  
  const serializedBatches = batches.map(b => ({
    _id: b._id.toString(),
    batchName: b.batchName,
    timing: {
      startTime: b.timing?.startTime,
      endTime: b.timing?.endTime
    }
  }));
  
  const serializedStudents = students.map(s => ({
    _id: s._id.toString(),
    studentId: s.studentId,
    name: s.name,
    batchId: s.batchId?.toString() || null
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Dashboard / Student Attendance</p>
      </div>

      <AttendanceClient batches={serializedBatches} students={serializedStudents} />
    </div>
  );
}
