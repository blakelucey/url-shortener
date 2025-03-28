import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
// dotenv.config({ path: '../../.env' });
const MONGODB_URI = process.env.NEXT_MONGODB_URI;
console.log('MONGODB_URI:', MONGODB_URI); // Add this line

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Cache to reuse the connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;