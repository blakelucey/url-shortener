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
    const database = client.db("test") // one DB 
    const collection = database.collection('users')
    const user = await collection.findOne({ userId });
    console.log('user', user)
    if (user) {
      const isComplete = user.firstName && user.lastName && user.email;
      console.log('isComplete', isComplete)
      return new Response(JSON.stringify({ exists: true, isComplete, user }), { status: 200 });
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

    await dbConnect();
    console.log("Database connected");

    const data = await request.json();
    console.log("Received data:", data);

    // Destructure all necessary fields
    const { userId, firstName, lastName, email, authType, type, newEmail, stripeCustomerId } = data;
    console.log("Extracted fields:", { userId, firstName, lastName, email, authType, type, newEmail, stripeCustomerId });

    if (type === 'update') {
      const existingUser = await User.findOne({ userId });
      if (!existingUser) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }
      if (newEmail) {
        try {
          await User.updateOne({ userId }, { $set: { email: newEmail } });
          return new Response(JSON.stringify({ message: "User email updated successfully", userId, newEmail }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error(e);
          return new Response(JSON.stringify({ error: "Update failed" }), { status: 500 });
        }
      }
      if (stripeCustomerId) {
        try {
          await User.updateOne({ userId }, { $set: { stripeCustomerId: stripeCustomerId } });
          return new Response(JSON.stringify({ message: "User stripe customer id updated successfully", userId, stripeCustomerId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error(e);
          return new Response(JSON.stringify({ error: "Update failed" }), { status: 500 });
        }
      }
    } else {
      // Creation branch if not updating
      const existingUser = await User.findOne({ userId });
      if (existingUser) {
        console.log("User already exists");
        return new Response(JSON.stringify({ message: "User already exists" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      console.log("Creating new user");
      const user = new User({ userId, firstName, lastName, email, authType });
      await user.save();
      console.log("User saved:", user);
      return new Response(JSON.stringify({ message: "User created successfully", user }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}