import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';
import { hash } from 'bcrypt';
import { nanoid } from 'nanoid'

const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return 'usr_' + nanoid(9);
    },
  },
  authType: {
    type: String,
    enum: ['wallet', 'sso', 'email'],
    required: true,
  },
  walletHash: {
    type: String,
    required: function () {
      return this.authType === 'wallet';
    },
  },
  ssoInfo: {
    type: Object,
    required: function () {
      return this.authType === 'sso';
    },
  },
  email: {
    type: String,
    required: function () {
      return this.authType === 'email';
    },
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Invalid email'],
  },
  password: {
    type: String,
    required: function () {
      return this.authType === 'email';
    },
    minlength: 8,
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

export default model('User', userSchema);