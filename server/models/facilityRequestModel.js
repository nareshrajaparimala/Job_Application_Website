import mongoose from 'mongoose';

const facilityRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  eventName: { type: String, required: true },
  message: { type: String },
  serviceType: { type: String, required: true },
  serviceId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'in-progress', 'completed'], 
    default: 'pending' 
  },
  requestDate: { type: Date, default: Date.now },
  responseDate: { type: Date },
  adminNotes: { type: String }
});

facilityRequestSchema.index({ userId: 1 });
facilityRequestSchema.index({ status: 1 });
facilityRequestSchema.index({ requestDate: -1 });

export default mongoose.models.FacilityRequest || mongoose.model('FacilityRequest', facilityRequestSchema);