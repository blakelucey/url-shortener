import 'dotenv/config';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_API_KEY)

// Create a new customer
export async function POST(request) {
    try {
        const email = await request.json()
        if (!email) {
            return new Response(JSON.stringify({ error: 'email required' }), { status: 401 });
        }

        const customer = await stripe.customers.create({
            email: email,
        });
        console.log('customer created', customer.id)


        return new Response(JSON.stringify({ message: 'customer created', customer }), { status: 201 });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

// Check if a user has started their free trial
export async function GET(request) {
    try {
        // Parse the query parameter from the URL.
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // List customers with this email.
        const customers = await stripe.customers.list({ email });
        if (customers.data.length === 0) {
            return NextResponse.json({ error: "No customer found" }, { status: 404 });
        }

        // Use the first customer found.
        const customer = customers.data[0];

        // List all subscriptions for the customer.
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all'
        });

        // Find a subscription that is trialing (has a trial_end and status 'trialing').
        const trialSubscription = subscriptions.data.find(
            (sub) => sub.status === "trialing" && sub.trial_end
        );

        if (trialSubscription) {
            return NextResponse.json({
                trialing: true,
                subscriptionId: trialSubscription.id,
                trialEnd: trialSubscription.trial_end,
            });
        } else {
            return NextResponse.json({ trialing: false });
        }
    } catch (error) {
        console.error("Error checking trial status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}