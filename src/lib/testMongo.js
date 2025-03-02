import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

// const uri = process.env.NEXT_MONGODB_URI;
const uri = "mongodb+srv://blucey7:ao1rMXhVlNdpvF9w@cluster0.mzapy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

console.log('uri', uri);

if (!uri) {
  throw new Error('NEXT_MONGODB_URI is not defined in the environment variables');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    await client.close();
  }
}
run().catch(console.dir);