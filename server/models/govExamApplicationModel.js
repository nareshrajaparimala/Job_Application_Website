import mongoose from 'mongoose';

const govExamApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: String, required: true },
  examName: { type: String, required: true },
  userDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  examDetails: {
    postName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    examDate: { type: String, required: true },
    applicationFee: { type: String, required: true },
    ageLimit: { type: String, required: true },
    totalPosts: { type: String, required: true },
    applyLink: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: { type: String }
});

govExamApplicationSchema.index({ userId: 1, appliedAt: -1 });
govExamApplicationSchema.index({ status: 1 });

export default mongoose.models.GovExamApplication || mongoose.model('GovExamApplication', govExamApplicationSchema);