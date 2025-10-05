import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: {type: String,enum: ['male', 'female', 'other', 'Male', 'Female', 'Other'],required: true},
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Profile fields
  profilePhoto: { type: String, default: '' },
  dateOfBirth: { type: Date },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  bio: { type: String, default: '' },
  
  // Professional fields
  skills: [{ type: String }],
  experience: { type: String, default: '' },
  education: { type: String, default: '' },
  
  // Social links
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
