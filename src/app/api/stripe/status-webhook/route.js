import "dotenv/config";
import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/users";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_API_KEY);

export async function POST(req) {
    await dbConnect();

    // 1) Grab the raw body & Stripe signature header
    const buf = await req.text(); // Use req.text() for raw body in App Router
    const sig = req.headers.get("stripe-signature");

    let event;
    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.NEXT_STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // 2) Pull out the subscription object for convenience
    const sub = event.data.object;

    console.log("✅ Webhook event received:", event.type);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    // 3) Route on type
    try {
        switch (event.type) {
            case "customer.subscription.created":
                await User.updateOne(
                    { stripeCustomerId: sub.customer },
                    {
                        subscriptionStatus: sub.status,
                    }
                );
                break;

            case "customer.subscription.updated":
                await User.updateOne(
                    { stripeCustomerId: sub.customer },
                    {
                        subscriptionStatus: sub.status,
                        isTrial: sub.status != "trialing" ? false : true,
                        subscriptionEndsAt: (sub.status === "canceled" || sub.status === "deleted") ? sub.cancel_at : null,
                        deletionScheduledAt: (sub.status === "canceled" || sub.status === "deleted") ? futureDate : null,
                    }
                );
                break;

            case "customer.subscription.paused":
                await User.updateOne(
                    { stripeCustomerId: sub.customer },
                    {
                        subscriptionStatus: sub.status,
                    }
                );
                break;

            case "customer.subscription.resumed":
                await User.updateOne(
                    { stripeCustomerId: sub.customer },
                    {
                        subscriptionStatus: sub.status,
                    }
                );
                break;

            case "customer.subscription.deleted":
                await User.updateOne(
                    { stripeCustomerId: sub.customer },
                    {
                        subscriptionStatus: sub.status,
                        subscriptionEndsAt: sub.cancel_at,
                        deletionScheduledAt: futureDate,
                    }
                );
                break;

            default:
                console.debug(`Unhandled event type ${event.type}`);
                break;
        }
    } catch (err) {
        console.error("❌ Error handling webhook event:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

    // Acknowledge receipt
    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}