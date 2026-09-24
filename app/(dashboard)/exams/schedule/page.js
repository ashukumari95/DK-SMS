import connectToDatabase from '@/lib/mongodb';
import Test from '@/models/Test';
import Batch from '@/models/Batch';
import ExamScheduleClient from './ExamScheduleClient';

export const dynamic = 'force-dynamic';

export default async function ExamSchedulePage() {
  await connectToDatabase();
  
  // Fetch tests and populate batch details
  const tests = await Test.find({}).populate('batchId').sort({ date: -1 });

  const serializedSchedules = tests.map(t => ({
    _id: t._id.toString(),
    batchName: t.batchId ? t.batchId.batchName : 'Unknown Batch',
    subject: t.subject || 'Mathematics',
    date: new Date(t.date).toISOString().split('T')[0],
    startTime: t.startTime || '10:00 AM',
    endTime: t.endTime || '01:00 PM',
    room: t.room || 'Hall 1',
    duration: '3 Hrs', // Placeholder or calculated based on start/end
  }));

  return <ExamScheduleClient schedules={serializedSchedules} />;
}
