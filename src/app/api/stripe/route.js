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
    // helper to JSON‑encode and set headers/status
    const respond = (payload, status = 200) =>
        new Response(JSON.stringify(payload), {
            status,
            headers: { 'Content-Type': 'application/json' },
        })

    try {
        const url = new URL(request.url)
        const email = url.searchParams.get('email')
        if (!email) {
            return respond({ error: 'Email is required' }, 400)
        }

        // get first customer with that email
        const customersRes = await stripe.customers.list({ email })
        const customer = customersRes.data[0]
        if (!customer) {
            return respond({ error: 'No customer found' }, 404)
        }

        // get all subscriptions & find an active trial
        const subsRes = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
        })

        console.log('customer', customer)
        console.log('subsRes', subsRes)

        return respond({
            subsRes,
            customer
        })
    } catch (err) {
        console.error('Error checking trial status:', err)
        return respond({ error: err.message }, 500)
    }
}