import { Schema, model, models } from 'mongoose';

const linkSchema = new Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    index: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true
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

const Link = models.Link || model('Link', linkSchema);

export default Link;