import 'dotenv/config';
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_API_KEY);


export async function POST(req) {
    try {
        const { customerId, deleteAt } = await req.json();

        console.log('customerId', customerId, 'deleteAt', deleteAt)

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,                         // re-use the SAME customer
            line_items: [{ price: process.env.NEXT_FLAT_FEE_PRICE, quantity: 1, }, { price: process.env.NEXT_PER_CLICK_PRICE }, { price: process.env.NEXT_PER_LINK_PRICE }],
            subscription_data: {
                description: 'kliqly.link Basic Plan',   // <- new line
            },
            // Optionally auto-expire the link the day you nuke the data
            success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/account`,
        });

        return new Response(JSON.stringify({ url: session.url })); // send this link to the user
    } catch (err) {
        console.error("Stripe error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}