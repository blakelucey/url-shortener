import { Schema, model, models } from 'mongoose';
import { isEmail } from 'validator';
import { hash } from 'bcryptjs';

const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  authType: {
    type: String,
    enum: ['wallet', 'sso', 'email'],
    required: false,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Invalid email'],
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  isPro: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Hash password before saving if authType is 'email'
userSchema.pre('save', async function (next) {
  if (this.authType === 'email' && this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

const User = models.User || model('User', userSchema)

export default User