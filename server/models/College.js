import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  courses: [{ type: String }],
  admissionStatus: { type: String, enum: ['Open', 'Closed'], default: 'Closed' },
  fee: { type: Number },
  type: { type: String, enum: ['Government', 'Private'] },
  studyMode: { type: String, enum: ['Full-Time', 'Part-Time'] },
  details: { type: String },
}, { timestamps: true });

const College = mongoose.model('College', collegeSchema);

export default College;
