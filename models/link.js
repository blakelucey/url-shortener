import { Schema, model } from 'mongoose';

const linkSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
}, { timestamps: true });

export default model('Link', linkSchema);