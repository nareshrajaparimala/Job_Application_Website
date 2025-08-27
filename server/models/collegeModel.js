import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  courses: [String],
  details: { type: String, required: true },
  overview: { type: String, required: true },
  averagePackage: { type: String },
  highestPackage: { type: String },
  topRecruiters: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.College || mongoose.model('College', collegeSchema);