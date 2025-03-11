// pages/api/signToken.ts
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest ) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  console.log('userId', userId)
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId', status: 400 });
  }

  const secret = process.env.NEXT_AUTH_SECRET!; // This secret is never exposed to the client
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfiguration', status: 500 });
  }

  const payload = { userId };
  // Sign the token with an expiration time
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return NextResponse.json({ data: token, status: 200 });
}