import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  stipend: { type: String, required: true },
  workMode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], required: true },
  type: { type: String, enum: ['Full-time', 'Part-time'], default: 'Full-time' },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  skills: [String],
  benefits: [String],
  datePosted: { type: Date, default: Date.now },
  deadline: { type: Date, default: () => new Date(Date.now() + 30*24*60*60*1000) }
});

export default mongoose.models.Internship || mongoose.model('Internship', internshipSchema);