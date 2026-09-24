import mongoose from 'mongoose';

const BatchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  timing: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  capacity: { type: Number, required: true },
  enrolledCount: { type: Number, default: 0 },
  daysOfWeek: [{ type: String }] // e.g., ['Mon', 'Wed', 'Fri']
});

export default mongoose.models.Batch || mongoose.model('Batch', BatchSchema);
