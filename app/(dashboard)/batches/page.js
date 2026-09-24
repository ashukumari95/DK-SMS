import connectToDatabase from '@/lib/mongodb';
import Batch from '@/models/Batch';
import BatchClient from './BatchClient';

export const dynamic = 'force-dynamic';

export default async function BatchesPage() {
  await connectToDatabase();
  
  const batches = await Batch.find({}).sort({ 'timing.startTime': 1 });
  
  const serializedBatches = batches.map(b => ({
    _id: b._id.toString(),
    batchName: b.batchName,
    capacity: b.capacity,
    enrolledCount: b.enrolledCount,
    daysOfWeek: b.daysOfWeek,
    timing: {
      startTime: b.timing?.startTime,
      endTime: b.timing?.endTime
    }
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
        <p className="text-gray-500">Create and monitor all classroom batches</p>
      </div>

      <BatchClient initialBatches={serializedBatches} />
    </div>
  );
}
