import React from 'react'
import image from '../../public/image.png'
import image_white from '../../public/image_white.png'
import Image from 'next/image'
import { Button } from './ui/button'
import { Icons } from './icons'
import { HoverCardPricing } from './landing-page-hover-card'
import { logFn } from "../../logging/logging";
const log = logFn("src.components.landing-page-pricing.tsx.")

const LandingPagePricing = () => {
    interface PaymentLinkResponse {
        url: string
    }

    const handlePayment = async () => {
        try {
            const res = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
            const { url } = (await res.json()) as PaymentLinkResponse;
            window.open(url, "_blank", "noopener noreferrer");
        } catch (e) {
            log("error", 'error', e)
        }
    }
    return (
        <div className='p-4 bg-primary'>
            <div className='text-right'>
                <h1 className="text-secondary font-bold tracking-tight lg:text-5xl my-8">
                    Simple, User-friendly Pricing
                </h1>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="relative justify-center items-left">
                    <Image
                        src={image}
                        width={800}
                        height={800}
                        alt="Light mode illustration"
                        className="hidden dark:block object-contain"
                    />
                    <Image
                        src={image_white}
                        width={800}
                        height={800}
                        alt="Dark mode illustration"
                        className="dark:hidden object-contain"
                    />
                </div>
                <div>
                    <div className='flex flex-col'>
                        <h3 className='text-secondary font-bold tracking-tight lg:text-5xl my-8'>14‑day free trial, $1/month—plus $0.005/click and $0.01/link.</h3>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-row gap-4'>
                                <Icons.LucideBadgeCheck className='text-secondary' />
                                <HoverCardPricing />
                            </div>
                            <div className='flex flex-row gap-4'>
                                <Icons.LucideBadgeCheck className='text-secondary' />
                                <p className='text-secondary'>Unlimited short links</p>
                            </div>
                            <div className='flex flex-row gap-4'>
                                <Icons.LucideBadgeCheck className='text-secondary' />
                                <p className='text-secondary'>Advanced Analytics</p>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handlePayment} className='w-full my-8' variant={"secondary"} style={{ cursor: "pointer" }}>
                        Subscribe
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LandingPagePricing