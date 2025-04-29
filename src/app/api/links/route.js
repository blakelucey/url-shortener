import dbConnect from '../../../lib/dbConnect';
import Link from '../../../models/link';
import { verifyToken } from '../../../lib/auth';
import Clicks from '@/models/click';
import UrlMapping from '@/models/urlMapping';
import Stripe from 'stripe';
import User from '@/models/users';
const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_API_KEY);

export async function POST(request) {
    try {
        await dbConnect();
        console.log('request', request)
        const token = request.headers.get('Authorization')?.split(' ')[1];
        console.log('token', token)
        if (!token) {
            return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
        }
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        const user = await User.findOne({ userId: userId });
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        const { originalUrl,
            shortUrl,
            shortHash,
            channels,
            campaigns, utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content, } = await request.json();

        if (!originalUrl) {
            return new Response(JSON.stringify({ error: 'originalUrl is required' }), { status: 400 });
        }

        const link = new Link({
            userId, originalUrl, shortUrl, shortHash, channels, campaigns, utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
        });
        await link.save();

        const meterEvent = stripe.billing.meterEvents.create({
            event_name: "per_link",
            timestamp: Math.floor(Date.now() / 1000),
            payload: {
                value: 1,
                stripe_customer_id: user?.stripeCustomerId,
            }
        })

        console.log('meterEvent', meterEvent)

        if (!meterEvent) {
            return new Response(JSON.stringify({ error: 'Failed to create meter event' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Link created', link, meterEvent }), { status: 201 });
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


export async function DELETE(request) {
    try {
        await dbConnect();
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return new Response(
                JSON.stringify({ error: "Authentication required" }),
                { status: 401 }
            );
        }
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        // Get the shortUrl and linkId from the query parameters
        const { searchParams } = new URL(request.url);
        const shortUrl = searchParams.get("shortUrl");
        const linkId = searchParams.get("linkId");
        const originalUrl = searchParams.get("originalUrl");

        if (!shortUrl || !linkId || !originalUrl) {
            return new Response(
                JSON.stringify({ error: "shortUrl and linkId and originalUrl are required" }),
                { status: 400 }
            );
        }

        // Delete the link for the authenticated user and given shortUrl
        await Link.deleteOne({ userId, shortUrl });

        // Delete all clicks associated with the given linkId and userId
        await Clicks.deleteMany({ linkId });

        await UrlMapping.deleteOne({ originalUrl: originalUrl })

        return new Response(
            JSON.stringify({ message: "Link and its clicks deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}