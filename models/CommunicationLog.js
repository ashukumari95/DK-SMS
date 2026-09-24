import mongoose from 'mongoose';

const CommunicationLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['SMS', 'WhatsApp', 'Email'], required: true, default: 'SMS' },
  recipientPhone: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  message: { type: String, required: true },
  purpose: { type: String, enum: ['FeeReminder', 'AttendanceAlert', 'TestResult', 'General'], required: true },
  status: { type: String, enum: ['Sent', 'Failed', 'Pending'], default: 'Sent' },
  sentAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  metadata: { type: Object } // To store any provider specific IDs like Twilio message SID
});

export default mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', CommunicationLogSchema);
