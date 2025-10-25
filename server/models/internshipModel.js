import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const internshipSchema = new mongoose.Schema({
  internshipId: { type: String, unique: true, default: () => `INT-${uuidv4().slice(0, 8).toUpperCase()}` },
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
  applicationLink: { type: String, required: false },
  datePosted: { type: Date, default: Date.now },
  deadline: { type: Date, default: () => new Date(Date.now() + 30*24*60*60*1000) },
  shareCount: { type: Number, default: 0 },
  sharedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedAt: { type: Date, default: Date.now },
    platform: String
  }]
});

internshipSchema.index({ datePosted: -1 });
internshipSchema.index({ title: 'text', company: 'text' });
internshipSchema.index({ internshipId: 1 });

export default mongoose.models.Internship || mongoose.model('Internship', internshipSchema);