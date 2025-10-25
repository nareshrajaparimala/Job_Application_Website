import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const admissionCardSchema = new mongoose.Schema({
  cardId: { type: String, unique: true, default: () => `ADM-${uuidv4().slice(0, 8).toUpperCase()}` },
  examName: { type: String, required: true },
  candidateName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  examDate: { type: Date, required: true },
  examTime: { type: String, required: true },
  examCenter: { type: String, required: true },
  centerAddress: { type: String, required: true },
  instructions: [String],
  documentsRequired: [String],
  reportingTime: { type: String, required: true },
  examDuration: { type: String, required: true },
  subjectCode: { type: String },
  seatNumber: { type: String },
  candidatePhoto: { type: String },
  candidateSignature: { type: String },
  issuedDate: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  shareCount: { type: Number, default: 0 },
  sharedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedAt: { type: Date, default: Date.now },
    platform: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

admissionCardSchema.index({ cardId: 1 });
admissionCardSchema.index({ rollNumber: 1 });
admissionCardSchema.index({ examDate: 1 });

export default mongoose.models.AdmissionCard || mongoose.model('AdmissionCard', admissionCardSchema);