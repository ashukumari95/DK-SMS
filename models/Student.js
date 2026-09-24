import mongoose from 'mongoose';

const FeeInstallmentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paidDate: { type: Date },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  month: { type: String }
});

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, // Format: DKM-YYYY-001
  name: { type: String, required: true },
  phone: { type: String, required: true },
  parentPhone: { type: String, required: true },
  class: { type: String, required: true }, // 11th, 12th, Target JEE
  board: { type: String }, // BSEB, CBSE
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  fees: {
    totalFee: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
    installments: [FeeInstallmentSchema]
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
