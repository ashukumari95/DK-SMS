import connectToDatabase from '@/lib/mongodb';
import Test from '@/models/Test';
import Student from '@/models/Student';
import Batch from '@/models/Batch';
import ExamResultClient from './ExamResultClient';

export const dynamic = 'force-dynamic';

export default async function ExamResultPage() {
  await connectToDatabase();
  
  // Fetch tests, populate batch, and populate students inside results
  const tests = await Test.find({})
    .populate('batchId')
    .populate({
      path: 'results.studentId',
      model: 'Student',
      select: 'studentId name'
    })
    .sort({ date: -1 });

  // Flatten the results into a single array for the table
  const allResults = [];
  
  tests.forEach(test => {
    if (test.results && test.results.length > 0) {
      test.results.forEach(res => {
        if (res.studentId) {
          allResults.push({
            id: `${test._id}-${res.studentId._id}`,
            admissionNo: res.studentId.studentId, // We use studentId as Admission No
            name: res.studentId.name,
            rollNo: res.studentId.studentId, // Fallback
            className: test.batchId ? test.batchId.batchName : 'N/A',
            examName: test.testName,
            testId: test._id.toString(),
            grandTotal: `${res.marksObtained}/${test.maxMarks}`,
            percentage: res.percentage || 0,
            // Simple Grade calculation
            grade: res.percentage >= 90 ? 'A+' : res.percentage >= 80 ? 'A' : res.percentage >= 70 ? 'B' : res.percentage >= 60 ? 'C' : res.percentage >= 40 ? 'D' : 'F',
            resultStatus: res.percentage >= 40 ? 'Pass' : 'Fail'
          });
        }
      });
    }
  });

  // Also pass tests so we can upload new results easily from this page
  const serializedTests = tests.map(t => ({
    _id: t._id.toString(),
    testName: t.testName,
    maxMarks: t.maxMarks
  }));

  const allStudents = await Student.find({ isActive: true }).select('_id studentId name batchId').lean();
  const serializedStudents = allStudents.map(s => ({
    _id: s._id.toString(),
    studentId: s.studentId,
    name: s.name,
    batchId: s.batchId.toString()
  }));

  return (
    <ExamResultClient 
      results={allResults} 
      tests={serializedTests}
      students={serializedStudents}
    />
  );
}
