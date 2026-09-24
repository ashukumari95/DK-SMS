import connectToDatabase from '@/lib/mongodb';
import Test from '@/models/Test';
import Batch from '@/models/Batch';
import ExamListClient from './ExamListClient';

export const dynamic = 'force-dynamic';

export default async function ExamsPage() {
  await connectToDatabase();
  
  // Fetch tests and batches
  const tests = await Test.find({}).sort({ date: -1 });
  const batches = await Batch.find({});

  const serializedTests = tests.map(t => ({
    _id: t._id.toString(),
    testName: t.testName,
    date: new Date(t.date).toISOString().split('T')[0],
    subject: t.subject || 'Mathematics',
    startTime: t.startTime || '10:00 AM',
    endTime: t.endTime || '01:00 PM',
    batchId: t.batchId.toString(),
    maxMarks: t.maxMarks,
    marksEntryStatus: t.marksEntryStatus,
  }));

  const serializedBatches = batches.map(b => ({
    _id: b._id.toString(),
    batchName: b.batchName,
  }));

  return (
    <ExamListClient 
      initialTests={serializedTests} 
      batches={serializedBatches} 
    />
  );
}
