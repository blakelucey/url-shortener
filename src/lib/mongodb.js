import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const clientPromise = client.connect();

export default clientPromise;