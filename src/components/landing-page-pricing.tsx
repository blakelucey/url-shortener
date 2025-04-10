import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import image from '../../public/image.png'
import image_white from '../../public/image_white.png'
import Image from 'next/image'
import { Button } from './ui/button'
import { Icons } from './icons'


const LandingPagePricing = () => {
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
                        <h3 className='text-secondary font-bold tracking-tight lg:text-5xl my-8'>14‑day free trial, $1/month—plus usage fees based on clicks and short link creations.</h3>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-row gap-4'>
                                <Icons.LucideCheckCircle2 className='text-secondary' />
                                <p className='text-secondary'>14-day free trial</p>
                            </div>
                            <div className='flex flex-row gap-4'>
                                <Icons.LucideCheckCircle2 className='text-secondary' />
                                <p className='text-secondary'>Unlimited short links</p>
                            </div>
                            <div className='flex flex-row gap-4'>
                                <Icons.LucideCheckCircle2 className='text-secondary' />
                                <p className='text-secondary'>Advanced Analytics</p>
                            </div>
                            <div className='flex flex-row gap-4'>
                                <Icons.LucideCheckCircle2 className='text-secondary' />
                                <p className='text-secondary'>Usage based billing, $0.0005/click, $0.01/link</p>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => window.open(process.env.NEXT_PUBLIC_PAYMENT_LINK, '_blank', 'noopener noreferrer')
                    } className='w-full my-8' variant={"secondary"} style={{ cursor: "pointer" }}>
                        Subscribe
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LandingPagePricing