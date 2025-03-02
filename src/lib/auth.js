import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.NEXT_AUTH_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}