import { Schema, model } from 'mongoose';

const linkSchema = new Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortHash: {
    type: String,
    unique: true,
    required: true,
  },
  channels: {
    type: [String],
    unique: false,
    required: false
  },
  campaigns: {
    type: [String],
    unique: false,
    required: false
  }
}, { timestamps: true });

export default model('Link', linkSchema);