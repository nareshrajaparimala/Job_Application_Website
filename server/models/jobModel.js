import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true },
  workMode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], required: true },
  category: { type: String, enum: ['private', 'government'], required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  skills: [String],
  deadline: { type: Date, required: true },
  applicationLink: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

jobSchema.index({ category: 1, createdAt: -1 });
jobSchema.index({ title: 'text', company: 'text' });

export default mongoose.models.Job || mongoose.model('Job', jobSchema);