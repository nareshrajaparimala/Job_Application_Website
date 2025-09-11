import mongoose from 'mongoose';

const resumeApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResumeTemplate', required: true },
  userDetails: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    experience: String,
    education: String,
    skills: String,
    customizations: String
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
  completedAt: Date,
  notes: String
});

export default mongoose.models.ResumeApplication || mongoose.model('ResumeApplication', resumeApplicationSchema);