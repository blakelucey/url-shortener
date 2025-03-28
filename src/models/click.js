import { Schema, model, models } from 'mongoose';

const clickSchema = new Schema({
  linkId: {
    type: Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',  // Assumes you have a User model defined elsewhere
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
  userAgent: {
    type: String,
  },
  deviceType: {
    type: String, // e.g., "mobile", "desktop", "tablet"
  },
  browser: {
    type: String, // e.g., "Chrome", "Firefox", etc.
  },
  operatingSystem: {
    type: String, // e.g., "Windows", "macOS", "Linux", "iOS", "Android"
  },
  country: {
    type: String,
  },
  region: {
    type: String,
  },
  city: {
    type: String,
  },
  postal: {
    type: String,
  },
  // Additional marketing parameters
  utm_source: {
    type: String,
  },
  utm_medium: {
    type: String,
  },
  utm_campaign: {
    type: String,
  },
  utm_term: {
    type: String,
  },
  utm_content: {
    type: String,
  },
});

// Indexes for efficient analytics queries
clickSchema.index({ linkId: 1, timestamp: -1 });
clickSchema.index({ userId: 1 });
clickSchema.index({ ip: 1 });
clickSchema.index({ country: 1, region: 1, city: 1, postal: 1, });
clickSchema.index({ utm_source: 1 });
clickSchema.index({ utm_medium: 1 });
clickSchema.index({ utm_campaign: 1 });

const Clicks =  models.Click || model('Click', clickSchema);

export default Clicks