import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Job application fields
  jobId: { type: String },
  jobTitle: { type: String },
  company: { type: String },
  location: { type: String },
  salary: { type: String },
  
  // College application fields
  collegeName: { type: String },
  collegeData: { type: Object },
  
  // Common fields
  applicationType: { type: String, enum: ['job', 'college'], default: 'job' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'interview'], default: 'pending' },
  adminNote: { type: String, default: '' },
  interviewDate: { type: Date },
  appliedDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Application', applicationSchema);