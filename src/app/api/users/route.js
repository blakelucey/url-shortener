import dbConnect from '../../../lib/dbConnect';
import User from '@/models/users'
import { MongoClient } from 'mongodb';
import 'dotenv/config';


const uri = process.env.NEXT_MONGODB_URI;
console.log('uri', uri)

if (!uri) {
  throw new Error('MONGODB_URI is not defined in your environment variables.');
}

const client = new MongoClient(uri);


export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log('userId', userId)

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
  }

  try {
    await client.connect();
    const database = client.db("urlShortener")
    const collection = database.collection('users')
    const user = await collection.findOne({ userId });
    console.log('user', user)
    if (user) {
      const isComplete = user.firstName && user.lastName && user.email;
      console.log('isComplete', isComplete)
      return new Response(JSON.stringify({ exists: true, isComplete }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ exists: false }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("Starting POST /api/users");

    // Connect to the database (adjust based on your setup)
    await dbConnect();
    console.log("Database connected");

    // Parse the incoming data
    const data = await request.json();
    console.log("Received data:", data);

    const { userId, firstName, lastName, email, authType } = data;
    console.log("Extracted fields:", { userId, firstName, lastName, email, authType });

    // Check for an existing user (if applicable)
    const existingUser = await User.findOne({ userId });
    console.log("Existing user check:", existingUser);

    if (existingUser) {
      console.log("User already exists");
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Save the new user
    console.log("Creating new user");
    const user = new User({ userId, firstName, lastName, email, authType });
    await user.save();
    console.log("User saved:", user);

    return new Response(JSON.stringify({ message: "User created successfully", user }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}