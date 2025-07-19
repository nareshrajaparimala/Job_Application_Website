// // filepath: /Users/nareshraja/Desktop/job(project)/job-application-project/server/models/userModel.js
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   // Add more fields as needed (name, etc.)
// });

// const User = mongoose.model('User', userSchema);

// export default User;

// filepath: /Users/nareshraja/Desktop/job(project)/job-application-project/server/models/userModel.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  phone: { type: String, required: true },

  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },

  password: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;