import { Schema, model, models } from 'mongoose';
import { isEmail } from 'validator';

const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  authType: {
    type: String,
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

const User = models.User || model('User', userSchema)

export default User