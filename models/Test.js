import mongoose from 'mongoose';

const TestResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0
  },
  rank: {
    type: Number,
    min: 1
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  }
}, { _id: false });

const TestSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Test date is required'],
    default: Date.now
  },
  subject: {
    type: String,
    default: 'Mathematics'
  },
  startTime: {
    type: String,
    default: '10:00 AM'
  },
  endTime: {
    type: String,
    default: '01:00 PM'
  },
  room: {
    type: String,
    default: 'Hall 1'
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: [true, 'Batch reference is required'],
    index: true
  },
  maxMarks: {
    type: Number,
    required: [true, 'Maximum marks is required'],
    min: [1, 'Maximum marks must be greater than 0']
  },
  marksEntryStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  results: [TestResultSchema]
}, {
  timestamps: true
});

TestSchema.methods.calculateAndApplyRanks = function() {
  if (!this.results || this.results.length === 0) return;

  // Sort descending by marksObtained
  this.results.sort((a, b) => b.marksObtained - a.marksObtained);

  let currentRank = 1;
  for (let i = 0; i < this.results.length; i++) {
    if (i > 0 && this.results[i].marksObtained < this.results[i - 1].marksObtained) {
      currentRank = i + 1;
    }
    this.results[i].rank = currentRank;
    this.results[i].percentage = parseFloat(
      ((this.results[i].marksObtained / this.maxMarks) * 100).toFixed(1)
    );
  }

  this.marksEntryStatus = 'Completed';
};

export default mongoose.models.Test || mongoose.model('Test', TestSchema);
