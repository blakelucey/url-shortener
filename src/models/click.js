import { Schema, model } from 'mongoose';

const clickSchema = new Schema({
  linkId: {
    type: Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  referrer: {
    type: String,
  },
  ip: {
    type: String,
  },
});

// Index for efficient analytics queries
clickSchema.index({ linkId: 1, timestamp: -1 });

export default model('Click', clickSchema);