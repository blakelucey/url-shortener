import dbConnect from '../../../lib/dbConnect';
import Link from '../../../models/link';
import { nanoid } from 'nanoid';
import { verifyToken } from '../../../lib/auth';

export async function POST(request) {
    try {
        await dbConnect();
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
        }
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        const { originalUrl } = await request.json();
        if (!originalUrl) {
            return new Response(JSON.stringify({ error: 'originalUrl is required' }), { status: 400 });
        }

        const shortHash = nanoid(7); // Unique short code
        const link = new Link({ userId, originalUrl, shortHash });
        await link.save();

        return new Response(JSON.stringify({ message: 'Link created', link }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function GET(request) {
    try {
        await dbConnect();
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
        }
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        const links = await Link.find({ userId });
        return new Response(JSON.stringify(links), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}