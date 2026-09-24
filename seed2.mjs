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

// Models
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

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  records: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' }
  }]
});
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

const INITIAL_BATCHES = [
  { _id: 'batch_01', batchName: '12th Board Booster (Calculus & Vectors)', timing: { startTime: '06:00', endTime: '07:30' }, capacity: 45, enrolledCount: 38, daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  { _id: 'batch_02', batchName: '11th Foundation (Functions & Coordinate)', timing: { startTime: '07:45', endTime: '09:15' }, capacity: 50, enrolledCount: 42, daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  { _id: 'batch_03', batchName: 'Target JEE Advanced (Integral & Algebra)', timing: { startTime: '09:30', endTime: '11:30' }, capacity: 35, enrolledCount: 32, daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  { _id: 'batch_04', batchName: 'Doubt Clinic & Practice Workshop', timing: { startTime: '14:00', endTime: '15:30' }, capacity: 30, enrolledCount: 24, daysOfWeek: ['Mon', 'Wed', 'Fri'] },
  { _id: 'batch_05', batchName: '12th Super 40 (Bihar Board BSEB Special)', timing: { startTime: '16:00', endTime: '17:30' }, capacity: 40, enrolledCount: 37, daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  { _id: 'batch_06', batchName: 'Target JEE Main Speed & Accuracy', timing: { startTime: '17:45', endTime: '19:15' }, capacity: 45, enrolledCount: 40, daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }
];

const INITIAL_STUDENTS = [
  { _id: 'stu_01', studentId: 'DKM-2026-001', name: 'Alok Kumar Verma', phone: '9835124011', parentPhone: '9431872110', class: '12th', board: 'BSEB', batchId: 'batch_01', fees: { totalFee: 22000, amountPaid: 15000, amountDue: 7000, installments: [ { amount: 8000, paidDate: new Date('2026-06-12'), status: 'Paid', month: 'June' }, { amount: 7000, paidDate: new Date('2026-08-14'), status: 'Paid', month: 'August' }, { amount: 7000, status: 'Overdue', month: 'September' } ] } },
  { _id: 'stu_02', studentId: 'DKM-2026-002', name: 'Priyanshu Ranjan', phone: '9934812044', parentPhone: '9470231980', class: 'Target JEE', board: 'CBSE', batchId: 'batch_03', fees: { totalFee: 28000, amountPaid: 28000, amountDue: 0, installments: [ { amount: 10000, paidDate: new Date('2026-04-10'), status: 'Paid', month: 'April' }, { amount: 10000, paidDate: new Date('2026-06-09'), status: 'Paid', month: 'June' }, { amount: 8000, paidDate: new Date('2026-08-08'), status: 'Paid', month: 'August' } ] } },
  { _id: 'stu_03', studentId: 'DKM-2026-003', name: 'Shweta Kumari', phone: '9122340918', parentPhone: '9835612300', class: '11th', board: 'CBSE', batchId: 'batch_02', fees: { totalFee: 18000, amountPaid: 6000, amountDue: 12000, installments: [ { amount: 6000, paidDate: new Date('2026-06-18'), status: 'Paid', month: 'June' }, { amount: 6000, status: 'Overdue', month: 'August' } ] } },
  { _id: 'stu_04', studentId: 'DKM-2026-004', name: 'Rituraj Mishra', phone: '9708912345', parentPhone: '9430129871', class: 'Target JEE', board: 'BSEB', batchId: 'batch_03', fees: { totalFee: 28000, amountPaid: 18000, amountDue: 10000, installments: [ { amount: 10000, paidDate: new Date('2026-05-01'), status: 'Paid', month: 'May' }, { amount: 8000, paidDate: new Date('2026-07-01'), status: 'Paid', month: 'July' }, { amount: 10000, status: 'Overdue', month: 'September' } ] } },
  { _id: 'stu_05', studentId: 'DKM-2026-005', name: 'Aditya Narayan Pandey', phone: '9955410982', parentPhone: '9835019821', class: '12th', board: 'CBSE', batchId: 'batch_01', fees: { totalFee: 22000, amountPaid: 22000, amountDue: 0, installments: [ { amount: 11000, paidDate: new Date('2026-05-14'), status: 'Paid', month: 'May' }, { amount: 11000, paidDate: new Date('2026-08-12'), status: 'Paid', month: 'August' } ] } },
  { _id: 'stu_06', studentId: 'DKM-2026-006', name: 'Divya Kumari Singh', phone: '9835771209', parentPhone: '9431445610', class: '12th', board: 'BSEB', batchId: 'batch_05', fees: { totalFee: 20000, amountPaid: 10000, amountDue: 10000, installments: [ { amount: 10000, paidDate: new Date('2026-05-30'), status: 'Paid', month: 'June' }, { amount: 10000, status: 'Overdue', month: 'August' } ] } },
  { _id: 'stu_07', studentId: 'DKM-2026-007', name: 'Manish Kumar Yadav', phone: '9661209845', parentPhone: '9934120876', class: '11th', board: 'BSEB', batchId: 'batch_02', fees: { totalFee: 18000, amountPaid: 18000, amountDue: 0, installments: [ { amount: 9000, paidDate: new Date('2026-06-24'), status: 'Paid', month: 'June' }, { amount: 9000, paidDate: new Date('2026-08-30'), status: 'Paid', month: 'September' } ] } },
  { _id: 'stu_08', studentId: 'DKM-2026-008', name: 'Anjali Prakash', phone: '9128091142', parentPhone: '9471092834', class: 'Target JEE', board: 'CBSE', batchId: 'batch_06', fees: { totalFee: 26000, amountPaid: 16000, amountDue: 10000, installments: [ { amount: 9000, paidDate: new Date('2026-05-15'), status: 'Paid', month: 'May' }, { amount: 7000, paidDate: new Date('2026-07-15'), status: 'Paid', month: 'July' }, { amount: 10000, status: 'Overdue', month: 'September' } ] } },
  { _id: 'stu_09', studentId: 'DKM-2026-009', name: 'Chandan Kumar Gupta', phone: '9771098231', parentPhone: '9835441908', class: '12th', board: 'BSEB', batchId: 'batch_05', fees: { totalFee: 20000, amountPaid: 14000, amountDue: 6000, installments: [ { amount: 7000, paidDate: new Date('2026-06-08'), status: 'Paid', month: 'June' }, { amount: 7000, paidDate: new Date('2026-08-10'), status: 'Paid', month: 'August' } ] } },
  { _id: 'stu_10', studentId: 'DKM-2026-010', name: 'Saurabh Kumar Jha', phone: '9939108234', parentPhone: '9431809211', class: 'Target JEE', board: 'CBSE', batchId: 'batch_03', fees: { totalFee: 28000, amountPaid: 28000, amountDue: 0, installments: [ { amount: 14000, paidDate: new Date('2026-04-29'), status: 'Paid', month: 'May' }, { amount: 14000, paidDate: new Date('2026-07-28'), status: 'Paid', month: 'August' } ] } },
  { _id: 'stu_11', studentId: 'DKM-2026-011', name: 'Neha Kumari', phone: '9123891045', parentPhone: '9470912381', class: '11th', board: 'CBSE', batchId: 'batch_02', fees: { totalFee: 18000, amountPaid: 6000, amountDue: 12000, installments: [ { amount: 6000, paidDate: new Date('2026-06-29'), status: 'Paid', month: 'July' }, { amount: 6000, status: 'Overdue', month: 'September' } ] } },
  { _id: 'stu_12', studentId: 'DKM-2026-012', name: 'Kundan Kumar Tiwary', phone: '9835901243', parentPhone: '9431209841', class: '12th', board: 'BSEB', batchId: 'batch_01', fees: { totalFee: 22000, amountPaid: 15000, amountDue: 7000, installments: [ { amount: 8000, paidDate: new Date('2026-05-19'), status: 'Paid', month: 'May' }, { amount: 7000, paidDate: new Date('2026-07-20'), status: 'Paid', month: 'July' }, { amount: 7000, status: 'Overdue', month: 'September' } ] } }
];

const INITIAL_TESTS = [
  { _id: 'test_01', testName: 'Calculus Major Test 04 (Integrals & Area)', date: new Date('2026-09-18'), batchId: 'batch_01', maxMarks: 100, marksEntryStatus: 'Completed', results: [ { studentId: 'DKM-2026-005', marksObtained: 96, rank: 1 }, { studentId: 'DKM-2026-001', marksObtained: 88, rank: 2 }, { studentId: 'DKM-2026-012', marksObtained: 82, rank: 3 } ] },
  { _id: 'test_02', testName: 'Target JEE Advanced Mock Test 06', date: new Date('2026-09-15'), batchId: 'batch_03', maxMarks: 120, marksEntryStatus: 'Completed', results: [ { studentId: 'DKM-2026-002', marksObtained: 114, rank: 1 }, { studentId: 'DKM-2026-010', marksObtained: 106, rank: 2 }, { studentId: 'DKM-2026-004', marksObtained: 98, rank: 3 } ] },
  { _id: 'test_03', testName: '11th Foundation Coordinate Geometry Test 02', date: new Date('2026-09-12'), batchId: 'batch_02', maxMarks: 75, marksEntryStatus: 'Completed', results: [ { studentId: 'DKM-2026-007', marksObtained: 72, rank: 1 }, { studentId: 'DKM-2026-003', marksObtained: 64, rank: 2 }, { studentId: 'DKM-2026-011', marksObtained: 58, rank: 3 } ] },
  { _id: 'test_04', testName: '12th BSEB Super 40 Formula & Objective Mock', date: new Date('2026-09-19'), batchId: 'batch_05', maxMarks: 100, marksEntryStatus: 'Completed', results: [ { studentId: 'DKM-2026-006', marksObtained: 94, rank: 1 }, { studentId: 'DKM-2026-009', marksObtained: 89, rank: 2 } ] },
  { _id: 'test_05', testName: 'JEE Main Speed Sprint Series 03', date: new Date('2026-09-20'), batchId: 'batch_06', maxMarks: 100, marksEntryStatus: 'Completed', results: [ { studentId: 'DKM-2026-008', marksObtained: 92, rank: 1 } ] },
  { _id: 'test_06', testName: 'Upcoming: 12th Board Determinants & Matrices Sprint', date: new Date('2026-09-27'), batchId: 'batch_01', maxMarks: 100, marksEntryStatus: 'Pending', results: [] }
];

const INITIAL_ATTENDANCE = [
  { _id: 'att_01', date: new Date('2026-09-23'), batchId: 'batch_01', records: [ { studentId: 'DKM-2026-001', status: 'Present' }, { studentId: 'DKM-2026-005', status: 'Present' }, { studentId: 'DKM-2026-012', status: 'Absent' } ] },
  { _id: 'att_02', date: new Date('2026-09-23'), batchId: 'batch_02', records: [ { studentId: 'DKM-2026-003', status: 'Absent' }, { studentId: 'DKM-2026-007', status: 'Present' }, { studentId: 'DKM-2026-011', status: 'Present' } ] },
  { _id: 'att_03', date: new Date('2026-09-23'), batchId: 'batch_03', records: [ { studentId: 'DKM-2026-002', status: 'Present' }, { studentId: 'DKM-2026-004', status: 'Absent' }, { studentId: 'DKM-2026-010', status: 'Present' } ] },
  { _id: 'att_04', date: new Date('2026-09-22'), batchId: 'batch_01', records: [ { studentId: 'DKM-2026-001', status: 'Present' }, { studentId: 'DKM-2026-005', status: 'Present' }, { studentId: 'DKM-2026-012', status: 'Present' } ] }
];

async function seed() {
  await mongoose.connect(uri);
  console.log('Connected to DB. Clearing old data...');
  
  await Batch.deleteMany({});
  await Student.deleteMany({});
  await Test.deleteMany({});
  await Attendance.deleteMany({});

  console.log('Seeding Batches...');
  const batchMap = {};
  for (const b of INITIAL_BATCHES) {
    const newBatch = await Batch.create({
      batchName: b.batchName,
      timing: b.timing,
      capacity: b.capacity,
      enrolledCount: b.enrolledCount,
      daysOfWeek: b.daysOfWeek
    });
    batchMap[b._id] = newBatch._id;
  }

  console.log('Seeding Students...');
  const studentMap = {}; // mapping by original studentId string
  for (const s of INITIAL_STUDENTS) {
    const newStudent = await Student.create({
      studentId: s.studentId,
      name: s.name,
      phone: s.phone,
      parentPhone: s.parentPhone,
      class: s.class,
      board: s.board,
      batchId: batchMap[s.batchId],
      fees: s.fees,
      isActive: true,
      createdAt: new Date('2026-09-01')
    });
    studentMap[s.studentId] = newStudent._id;
  }

  console.log('Seeding Tests...');
  for (const t of INITIAL_TESTS) {
    const results = t.results.map(r => ({
      studentId: studentMap[r.studentId],
      marksObtained: r.marksObtained,
      rank: r.rank
    }));
    await Test.create({
      testName: t.testName,
      date: t.date,
      batchId: batchMap[t.batchId],
      maxMarks: t.maxMarks,
      marksEntryStatus: t.marksEntryStatus,
      results
    });
  }

  console.log('Seeding Attendance...');
  for (const a of INITIAL_ATTENDANCE) {
    const records = a.records.map(r => ({
      studentId: studentMap[r.studentId],
      status: r.status
    }));
    await Attendance.create({
      date: a.date,
      batchId: batchMap[a.batchId],
      records
    });
  }

  console.log('Database Re-seeded Successfully with full realistic dataset!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
