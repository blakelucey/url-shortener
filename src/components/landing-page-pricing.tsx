import React from 'react'
import image from '../../public/image.png'
import image_white from '../../public/image_white.png'
import Image from 'next/image'
import { Button } from './ui/button'
import { Icons } from './icons'
import { logFn } from "../../logging/logging";
const log = logFn("src.components.landing-page-pricing.tsx.")

const LandingPagePricing = () => {
    interface PaymentLinkResponse {
        url: string
    }

    const handlePayment = async () => {
        try {
            const res = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
            if (!res.ok) {
                throw new Error(`Checkout request failed: ${res.status}`);
            }
            const data = (await res.json()) as PaymentLinkResponse;
            if (!data?.url) {
                throw new Error("Missing checkout URL in response");
            }
            window.open(data.url, "_blank", "noopener noreferrer");
        } catch (e) {
            log("error", 'error', e)
            alert("We couldn't open the checkout. Please refresh and try again.");
        }
    }
    return (
        <section className='bg-primary px-4 py-16 text-secondary'>
            <div className='mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-start'>
                <div className='flex w-full flex-1 flex-col gap-6'>
                    <p className='text-sm uppercase tracking-wide text-secondary/70'>pricing made transparent</p>
                    <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                        Start at $1/month and only pay for the traffic you win.
                    </h1>
                    <p className='text-lg text-secondary/90'>
                        Kliqly.link keeps billing predictable: $1/month platform fee, $0.005 per tracked click, and $0.01 per active link. No feature gates or inflated bundles.
                    </p>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <div className='rounded-3xl bg-secondary text-primary p-6 shadow-lg'>
                            <p className='text-xs font-semibold uppercase tracking-wide text-primary/70'>Your plan</p>
                            <div className='mt-3 flex items-end gap-2'>
                                <span className='text-5xl font-black'>$1</span>
                                <span className='text-lg font-semibold'>/month</span>
                            </div>
                            <p className='mt-3 text-sm font-medium'>+ $0.005 per click · $0.01 per link</p>
                            <ul className='mt-6 space-y-3 text-sm'>
                                <li className='flex items-start gap-2'>
                                    <Icons.LucideCheckCircle className='h-5 w-5 text-primary' />
                                    14-day free trial with full analytics access
                                </li>
                                <li className='flex items-start gap-2'>
                                    <Icons.LucideCheckCircle className='h-5 w-5 text-primary' />
                                    Device, geo, and campaign routing (coming soon)
                                </li>
                                <li className='flex items-start gap-2'>
                                    <Icons.LucideCheckCircle className='h-5 w-5 text-primary' />
                                    Detailed click, referrer, and location analytics in the dashboard
                                </li>
                            </ul>
                        </div>
                        <div className='rounded-3xl border border-secondary/40 bg-secondary/10 p-6 text-secondary'>
                            <p className='text-xs font-semibold uppercase tracking-wide text-secondary/60'>Compare</p>
                            <div className='mt-3 flex items-end gap-2'>
                                <span className='text-4xl font-bold'>$35</span>
                                <span className='text-base font-semibold'>/month</span>
                            </div>
                            <p className='mt-3 text-sm'>What legacy platform users pay every single month—whether your audience clicks or not.</p>
                            <p className='mt-6 text-sm font-semibold'>Switch and keep 97% of your budget.</p>
                        </div>
                    </div>
                    <div className='grid gap-3 text-sm text-secondary/80 md:grid-cols-2'>
                        <div className='flex gap-3 rounded-2xl border border-secondary/40 bg-secondary/5 p-4'>
                            <Icons.LucideSparkles className='h-5 w-5 text-secondary' />
                            <p>Only pay for the clicks and active links you use in a given month.</p>
                        </div>
                        <div className='flex gap-3 rounded-2xl border border-secondary/40 bg-secondary/5 p-4'>
                            <Icons.LucideShieldCheck className='h-5 w-5 text-secondary' />
                            <p>Stripe-hosted checkout encrypts and stores your billing info, keeping it off Kliqly.link.</p>
                        </div>
                    </div>
                    <Button
                        onClick={handlePayment}
                        className='mt-6 w-full sm:w-fit px-8 py-6 text-base font-semibold'
                        variant={'secondary'}
                        style={{ cursor: "pointer" }}
                    >
                        Start for $1/month
                    </Button>
                </div>
                <div className='flex w-full max-w-xl justify-center'>
                    <Image
                        src={image}
                        width={760}
                        height={760}
                        alt="Light mode illustration"
                        className="hidden dark:block object-contain"
                    />
                    <Image
                        src={image_white}
                        width={760}
                        height={760}
                        alt="Dark mode illustration"
                        className="dark:hidden object-contain"
                    />
                </div>
            </div>
        </section>
    )
}

export default LandingPagePricing
