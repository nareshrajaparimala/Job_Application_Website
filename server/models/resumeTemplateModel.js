import mongoose from 'mongoose';

const resumeTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  customizationPrice: { type: Number, required: true },
  templateImage: { type: String, required: true },
  features: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ResumeTemplate || mongoose.model('ResumeTemplate', resumeTemplateSchema);