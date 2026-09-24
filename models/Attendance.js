import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  records: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' }
  }]
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
