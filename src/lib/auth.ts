import 'dotenv/config';
import jwt from 'jsonwebtoken';
const secret =  process.env.NEXT_AUTH_SECRET!

export function verifyToken(token: any) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}