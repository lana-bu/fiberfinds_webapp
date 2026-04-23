import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: { // may be used later for sending password reset emails
    type: Boolean,
    required: true,
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    required: true,
    default: 'member',
  }
});

// Hash and salt password before saving using bcrypt
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10); // 10 is the number of salt rounds used to generate salt for the password hash
});

export const User = mongoose.model('User', UserSchema);