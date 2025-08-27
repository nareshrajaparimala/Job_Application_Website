import mongoose from 'mongoose';

const webinarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  speaker: { type: String, required: true },
  organization: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  mode: { type: String, enum: ['Online', 'Offline'], required: true },
  platform: { type: String, required: true },
  venue: { type: String },
  price: { type: String, required: true },
  category: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  agenda: [String],
  requirements: [String],
  benefits: [String],
  datePosted: { type: Date, default: Date.now }
});

export default mongoose.models.Webinar || mongoose.model('Webinar', webinarSchema);