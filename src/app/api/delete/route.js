import dbConnect from '../../../lib/dbConnect';
import User from '@/models/users'
import 'dotenv/config';
import Clicks from '@/models/click';
import { verifyToken } from "../../../lib/auth";
import Link from '../../../models/link';
import UrlMapping from '@/models/urlMapping';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_API_KEY);

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

        const user = await User.findOne({ userId: userId });
        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        // Delete the customer from Stripe
        const subs = await stripe.subscriptions.list({ customer: user.stripeCustomerId });

        if (user && subs.data.length > 0) {
            try {
                for (const sub of subs.data) {
                    await stripe.subscriptions.cancel(sub.id);
                }

            } catch (e) {
                console.error("Error deleting subscriptions:", e);
                return new Response(
                    JSON.stringify({ error: "Failed to delete subscriptions" }),
                    { status: 500 }
                );
            }
        }

        // Delete all clicks associated with the given userId
        await Clicks.deleteMany({ userId });

        // Delete all links for the authenticated user
        await Link.deleteMany({ userId });

        // Delete all url mappings for the authenticated user
        await UrlMapping.deleteMany({ userId });

        // Delete the user
        await User.deleteOne({ userId });

        return new Response(
            JSON.stringify({ message: "User and all associated data deleted successfully" }), { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}