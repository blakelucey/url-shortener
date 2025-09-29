"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Rendering } from "@/components/rendering"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { createUserAsync } from "@/store/slices/userSlice"
import { useAppDispatch } from "@/store/hooks"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import image from '../../../public/image.png'
import image_white from '../../../public/image_white.png'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod"
import Image from "next/image"
import { ModeToggle } from "@/components/themeToggle"
import { useAccount } from "wagmi"
import { logFn } from "../../../logging/logging"
import { useCurrentUser } from "@/hooks/use-current-user";
const log = logFn("src.app.onboarding.page.tsx.")

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
})

export default function Onboarding() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { caipAddress, embeddedWalletInfo } = useAppKitAccount()
    const { isConnected } = useAccount();
    const { open } = useAppKit()
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id') ?? ''
    const router = useRouter();
    const { user, exists, loading, wallet } = useCurrentUser();

    const userId = (wallet ?? caipAddress) ?? ''
    const authType = embeddedWalletInfo?.authProvider

    useEffect(() => {
        if (!isConnected) {
            open().catch((error) => {
                console.error("Error connecting to AppKit:", error);
            });
        }
    }, [isConnected, open])

    useEffect(() => {
        if (exists && user?.isBasic) {
            router.replace('/dashboard');
        }
    }, [exists, user?.isBasic, router])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!userId) {
            log('Missing userId while submitting onboarding form', 'error', userId);
            return;
        }

        setIsSubmitting(true)
        try {
            const userData = { userId, ...values, sessionId, authType }
            await dispatch(createUserAsync(userData)).unwrap()
            router.replace("/dashboard")
        } catch (error) {
            log("Error submitting onboarding:", 'error', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading || isSubmitting) {
        return <Rendering />
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="fixed top-5 right-5">
                <ModeToggle />
            </div>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <div className="relative">
                            <Image
                                src={image}
                                width={40}
                                height={40}
                                alt="Light mode illustration"
                                className="hidden dark:block object-contain" />
                            <Image
                                src={image_white}
                                width={40}
                                height={40}
                                alt="Dark mode illustration"
                                className="dark:hidden object-contain" />
                        </div>
                    </div>
                    kliqly.link
                </div>
                <Form {...form}>
                    <div className="bg-secondary p-4 rounded-md border border-neutral-300 dark:border-neutral-600 shadow-md dark:shadow-[0_4px_8px_rgba(255,255,255,0.1)]">
                        <div className="flex flex-col text-center space-y-2 underline">
                            <h2 className="text-2xl font-semibold text-center">Complete Your Profile</h2>
                            <FormDescription>
                                Please provide your first name, last name, and email to complete your profile.
                            </FormDescription>
                        </div>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem className="items-center gap-4">
                                        <FormLabel htmlFor="firstName" className="text-right">
                                            First Name
                                        </FormLabel>
                                        <FormControl className="border border-neutral-300 dark:border-neutral-600">
                                            <Input
                                                id="firstName"
                                                placeholder="John"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem className="items-center gap-4">
                                        <FormLabel htmlFor="lastName" className="text-right">
                                            Last Name
                                        </FormLabel>
                                        <FormControl className="border border-neutral-300 dark:border-neutral-600">
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="items-center gap-4">
                                        <FormLabel htmlFor="email" className="text-right">
                                            Email
                                        </FormLabel>
                                        <FormControl className="border border-neutral-300 dark:border-neutral-600">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Complete onboarding"}
                            </Button>
                        </form>
                    </div>
                </Form>
            </div>
        </div>
    );
}
