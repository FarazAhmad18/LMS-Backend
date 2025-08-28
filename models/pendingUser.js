const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: String,
  password: String, // hashed!  
  verificationToken: String,
  verificationTokenExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('PendingUser', pendingUserSchema);
