import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/Student';
import FeesClient from './FeesClient';

export const dynamic = 'force-dynamic';

export default async function FeesPage() {
  await connectToDatabase();
  
  // Fetch all students to pass to client for searching/payment
  const students = await Student.find({ isActive: true }).sort({ name: 1 });
  
  const serializedStudents = students.map(s => ({
    _id: s._id.toString(),
    studentId: s.studentId,
    name: s.name,
    class: s.class,
    phone: s.phone,
    fees: {
      totalFee: s.fees.totalFee,
      amountPaid: s.fees.amountPaid,
      amountDue: s.fees.amountDue,
    }
  }));

  // Defaulters (students with due > 0)
  const defaulters = serializedStudents.filter(s => s.fees.amountDue > 0);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-gray-500">Collect payments and track defaulters</p>
      </div>
      
      <FeesClient students={serializedStudents} defaulters={defaulters} />
    </div>
  );
}
