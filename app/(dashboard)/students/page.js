import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';
import Batch from '@/models/Batch';
import StudentsTable from './StudentsTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
  await connectToDatabase();
  const students = await Student.find({}).sort({ createdAt: -1 });
  const batches = await Batch.find({}).sort({ createdAt: -1 });
  
  // Serialize Mongoose docs to POJOs for Client Component
  const serializedStudents = students.map(s => ({
    _id: s._id.toString(),
    studentId: s.studentId,
    name: s.name,
    class: s.class,
    batchId: s.batchId ? s.batchId.toString() : null,
    phone: s.phone,
    fees: {
      totalFee: s.fees.totalFee,
      amountPaid: s.fees.amountPaid,
      amountDue: s.fees.amountDue,
    }
  }));

  const serializedBatches = batches.map(b => ({
    _id: b._id.toString(),
    batchName: b.batchName
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1b9af7]">Students Directory</h1>
          <p className="text-gray-500 mt-1">Manage all student enrollments and details</p>
        </div>
        <Link href="/students/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Student</span>
        </Link>
      </div>
      
      <StudentsTable initialStudents={serializedStudents} batches={serializedBatches} />
    </div>
  );
}
