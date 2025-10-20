import mongoose from 'mongoose';

const govExamSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  postName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  examDate: {
    type: String,
    required: true
  },
  admitCardDate: {
    type: String,
    default: 'To be announced'
  },
  resultDate: {
    type: String,
    default: 'To be announced'
  },
  applicationFee: {
    type: String,
    required: true
  },
  ageLimit: {
    type: String,
    required: true
  },
  totalPosts: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  applyLink: {
    type: String,
    required: true
  },
  selectionMode: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const GovExam = mongoose.model('GovExam', govExamSchema);

export default GovExam;