import mongoose from 'mongoose';

const portfolioRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  templateType: {
    type: String,
    required: true,
    enum: ['predefined', 'customized']
  },
  theme: {
    type: String,
    required: true,
    enum: ['developer', 'designer', 'business', 'freelancer', 'student', 'other']
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in-progress', 'completed', 'cancelled']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userDetails: {
    type: Object,
    default: {}
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

portfolioRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('PortfolioRequest', portfolioRequestSchema);