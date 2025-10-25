import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const webinarSchema = new mongoose.Schema({
  webinarId: { type: String, unique: true, default: () => `WEB-${uuidv4().slice(0, 8).toUpperCase()}` },
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
  datePosted: { type: Date, default: Date.now },
  shareCount: { type: Number, default: 0 },
  sharedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedAt: { type: Date, default: Date.now },
    platform: String
  }]
});

webinarSchema.index({ datePosted: -1 });
webinarSchema.index({ title: 'text', speaker: 'text' });
webinarSchema.index({ webinarId: 1 });

export default mongoose.models.Webinar || mongoose.model('Webinar', webinarSchema);