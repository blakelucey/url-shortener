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
  isTrial: {
    type: Boolean,
    default: true,
  },
  isBasic: {
    type: Boolean,
    default: true,
  },
  stripeCustomerId: {
    type: String,
    unique: true,
    required: false
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    required: false
  },
  subscriptionStatus: {
    type: String,
  },
  subscriptionEndsAt: {
    type: Date,     // when their current paid period actually ends
  },
  deletionScheduledAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const User = models.User || model('User', userSchema)

export default User