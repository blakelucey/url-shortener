// models/urlMapping.js
import mongoose from 'mongoose';

// Create a schema with no defined structure and disable strict mode
const urlMappingSchema = new mongoose.Schema({}, { strict: false });

// Use the existing model if it exists, otherwise create a new one
export default mongoose.models.UrlMapping ||
  mongoose.model('UrlMapping', urlMappingSchema, 'url_mappings');