import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local for MONGODB_URI
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const match = envFile.match(/MONGODB_URI="(.*)"/);
const uri = match[1];

// Inline models to avoid Next.js specific path alias issues in raw Node execution
const BatchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  timing: { startTime: String, endTime: String },
  capacity: Number,
  enrolledCount: { type: Number, default: 0 },
  daysOfWeek: [String]
});
const Batch = mongoose.models.Batch || mongoose.model('Batch', BatchSchema);

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: String, parentPhone: String, class: String, board: String,
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  fees: {
    totalFee: { type: Number, default: 0 }, amountPaid: { type: Number, default: 0 }, amountDue: { type: Number, default: 0 },
    installments: [{ amount: Number, paidDate: Date, status: String, month: String }]
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

const TestSchema = new mongoose.Schema({
  testName: String, date: Date, batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }, maxMarks: Number,
  marksEntryStatus: String, results: [{ studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, marksObtained: Number, rank: Number }]
});
const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['SuperAdmin', 'Staff'], default: 'Staff' },
  profilePicture: { type: String, default: '' },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
import bcrypt from 'bcrypt';
AdminSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);


async function seed() {
  await mongoose.connect(uri);
  console.log('Connected to DB. Clearing old data...');
  
  await Batch.deleteMany({});
  await Student.deleteMany({});
  await Test.deleteMany({});
  await Admin.deleteMany({});

  console.log('Creating Admin User...');
  await Admin.create({
    name: 'DK Mishra',
    mobile: '9999999999',
    password: 'password123',
    role: 'SuperAdmin'
  });

  console.log('Creating Batches...');
  const batch1 = await Batch.create({
    batchName: '11th Foundation Morning', timing: { startTime: '06:00', endTime: '08:00' }, capacity: 50, enrolledCount: 3, daysOfWeek: ['Mon', 'Wed', 'Fri']
  });
  
  const batch2 = await Batch.create({
    batchName: '12th Target Evening', timing: { startTime: '16:00', endTime: '18:00' }, capacity: 40, enrolledCount: 3, daysOfWeek: ['Tue', 'Thu', 'Sat']
  });

  const batch3 = await Batch.create({
    batchName: 'IIT-JEE Advance (Weekend)', timing: { startTime: '09:00', endTime: '13:00' }, capacity: 30, enrolledCount: 2, daysOfWeek: ['Sat', 'Sun']
  });

  console.log('Creating Students and Fee Records...');
  const students = [
    { studentId: 'DKM-2026-001', name: 'Ravi Kumar', phone: '9876543210', parentPhone: '9876543211', class: '11th', board: 'BSEB', batchId: batch1._id, fees: { totalFee: 15000, amountPaid: 5000, amountDue: 10000, installments: [{ amount: 5000, paidDate: new Date(), status: 'Paid', month: 'January' }] } },
    { studentId: 'DKM-2026-002', name: 'Neha Sharma', phone: '9876543212', parentPhone: '9876543213', class: '11th', board: 'CBSE', batchId: batch1._id, fees: { totalFee: 15000, amountPaid: 15000, amountDue: 0, installments: [{ amount: 15000, paidDate: new Date(), status: 'Paid', month: 'January' }] } },
    { studentId: 'DKM-2026-003', name: 'Amit Singh', phone: '9876543214', parentPhone: '9876543215', class: '11th', board: 'BSEB', batchId: batch1._id, fees: { totalFee: 15000, amountPaid: 0, amountDue: 15000, installments: [] } },
    { studentId: 'DKM-2026-004', name: 'Priya Verma', phone: '9876543216', parentPhone: '9876543217', class: '12th', board: 'BSEB', batchId: batch2._id, fees: { totalFee: 18000, amountPaid: 10000, amountDue: 8000, installments: [{ amount: 10000, paidDate: new Date(), status: 'Paid', month: 'February' }] } },
    { studentId: 'DKM-2026-005', name: 'Rahul Yadav', phone: '9876543218', parentPhone: '9876543219', class: '12th', board: 'CBSE', batchId: batch2._id, fees: { totalFee: 18000, amountPaid: 0, amountDue: 18000, installments: [] } },
    { studentId: 'DKM-2026-006', name: 'Aashu Kumari', phone: '9000000000', parentPhone: '9000000001', class: '12th', board: 'BSEB', batchId: batch2._id, fees: { totalFee: 18000, amountPaid: 18000, amountDue: 0, installments: [{ amount: 18000, paidDate: new Date(), status: 'Paid', month: 'January' }] } },
    { studentId: 'DKM-2026-007', name: 'Vikas Patel', phone: '8000000000', parentPhone: '8000000001', class: 'Target JEE', board: 'CBSE', batchId: batch3._id, fees: { totalFee: 25000, amountPaid: 10000, amountDue: 15000, installments: [{ amount: 10000, paidDate: new Date(), status: 'Paid', month: 'March' }] } },
    { studentId: 'DKM-2026-008', name: 'Sneha Gupta', phone: '7000000000', parentPhone: '7000000001', class: 'Target JEE', board: 'CBSE', batchId: batch3._id, fees: { totalFee: 25000, amountPaid: 25000, amountDue: 0, installments: [{ amount: 25000, paidDate: new Date(), status: 'Paid', month: 'March' }] } },
  ];

  await Student.insertMany(students);
  
  console.log('Creating Test Records...');
  const allStudents = await Student.find({});
  
  await Test.create({
    testName: 'Calculus & Algebra - Mega Mock Test', date: new Date(), batchId: batch2._id, maxMarks: 100, marksEntryStatus: 'Completed',
    results: [
      { studentId: allStudents.find(s => s.name === 'Aashu Kumari')._id, marksObtained: 95, rank: 1 },
      { studentId: allStudents.find(s => s.name === 'Priya Verma')._id, marksObtained: 82, rank: 2 },
      { studentId: allStudents.find(s => s.name === 'Rahul Yadav')._id, marksObtained: 65, rank: 3 }
    ]
  });

  await Test.create({
    testName: 'Trigonometry Weekly Test', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), batchId: batch1._id, maxMarks: 50, marksEntryStatus: 'Pending',
    results: []
  });

  console.log('Database Seeded Successfully! You can now check the UI.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
