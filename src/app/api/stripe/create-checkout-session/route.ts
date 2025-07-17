// app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { logFn } from '../../../../../logging/logging';
const stripe = new Stripe(process.env.NEXT_SECRET_STRIPE_API_KEY!);
const log = logFn('src.app.api.create-checkout-session.route.ts.')

export async function POST() {
    log('endpoint hit', 'info')
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/`,
            automatic_tax: { enabled: true },
            line_items: [
                {
                    price: process.env.NEXT_PUBLIC_FLAT_FEE_PRICE!,
                    quantity: 1,
                    adjustable_quantity: { enabled: false },
                },
                {
                    price: process.env.NEXT_PUBLIC_PER_CLICK_PRICE!,  // meter
                    // no quantity here
                },
                {
                    price: process.env.NEXT_PUBLIC_PER_LINK_PRICE!, //meter
                    // no quantity here
                }
            ],
            subscription_data: {
                description: 'kliqly.link Basic Plan',
                trial_period_days: 14,
            },
        });
        log('session', 'info', session)
        return NextResponse.json({ url: session.url });
    } catch (err) {
        log('❌ Failed to create Checkout Session:', 'error', err);
        return NextResponse.json({ err }, { status: 500 });
    }
}