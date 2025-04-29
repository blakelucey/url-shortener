import nodemailer from "nodemailer";
import "dotenv/config";
import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/users";

export const runtime = 'nodejs';
export const preferredRegion = 'home';

const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_API_KEY);

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "Zoho",
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: `${process.env.NEXT_ZOHO_MAIL_ADDRESS}`,
        pass: `${process.env.NEXT_ZOHO_MAIL_THIRD_PARTY_PASSWORD}`,
    },
});

// Named export for POST method
export async function POST(request) {

    await dbConnect();

    // 1) Grab the raw body & Stripe signature header
    const buf = await request.text(); // Use req.text() for raw body in App Router
    const sig = request.headers.get("stripe-signature");

    let event;
    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.NEXT_STRIPE_WEBHOOK_SECRET_2);
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err);
        return new Response(JSON.stringify({ error: `Webhook Error: ${err}` }), { status: 400 });
    }

    // 2) Pull out the subscription object for convenience
    const sub = event.data.object;
    if (event.type === "customer.subscription.deleted") {
        try {
            // Parse the JSON body from the request
            const user = await User.findOne({ stripeSubscriptionId: sub.id }).lean()

            if (!user) {
                console.warn('User not found for sub', sub.id);
                return new Response(JSON.stringify({ message: "User not found for subscription id" }, { ok: true })); // still 200
            }

            const deletionDate = user?.deletionScheduledAt
                ? new Date(user?.deletionScheduledAt).toLocaleDateString('en-US')
                : '30 days from today';

            const html = `
            <p>Hi ${user.firstName || 'there'},</p>
            <p>Your kliqly.link subscription has been <strong>canceled</strong>.</p>
            <p>Your data is scheduled for deletion on <strong>${deletionDate}</strong>.</p>
            <p>If you’d like to reactivate before that date, just sign in and follow the prompts.</p>
            <p>Questions? Reply to this email any time.</p>
            <p>— kliqly support</p>
          `;

            // Define email options
            const mailOptions = {
                from: `${process.env.NEXT_ZOHO_MAIL_ADDRESS}`, // Your Zoho email address
                to: `${user?.email}`,
                subject: `kliqly.link Subscription canceled`,
                html: html
            };

            // Send email and handle the callback with a promise
            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log("Email sent:", info.response);
                        resolve(info);
                    }
                });
            });

            // Return success response
            return new Response(JSON.stringify({ message: "Success!" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error in POST stripe/deletion-notification-webhook:", error);
            // Return error response
            return new Response(JSON.stringify({ message: "Error sending email" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    } else {
        return new Response(JSON.stringify({ message: `${event.type} not processed` }, { ok: true }))
    }
}