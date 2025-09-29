"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { Icons } from "@/components/icons";
import { NavigationAvatar } from "./navigation-avatar";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ContactDialog } from "./contact-dialog";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import image from '../../public/image.png'
import image_white from '../../public/image_white.png'
import { ModeToggle } from "./themeToggle";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { Rendering } from "./rendering";
import { useIsMobile } from "@/hooks/use-mobile";
import { logFn } from "../../logging/logging";
import { useCurrentUser } from "@/hooks/use-current-user";
const log = logFn("src.components.navigation-menu.tsx.")


const components: { title: string; href?: string; description: string, onClick?: any }[] = [
    {
        title: "About",
        href: "/about",
        description:
            "Learn more about kliqly.link and its features.",
    },
    {
        title: "Support",
        description:
            "Get help with your account or technical issues.",
    },
    {
        title: "Privacy Policy",
        description:
            "Learn about our privacy policy and how we handle user data.",
    },
    {
        title: "Terms of Service",
        description:
            "Review our terms of service and confirm your agreement to our policies.",
    },
    {
        title: "Contact Us",
        description:
            "Reach out to us with any questions or concerns.",
    },
    {
        title: "FAQ",
        href: "/#faq",
        description:
            "Find answers to common questions about staking and yields.",
    },
    {
        title: "Pricing",
        href: "/#pricing",
        description:
            "View our pricing.",
    },
    {
        title: "Roadmap",
        description:
            "View our product roadmap, and vote on new features"
    }
];

export function NavigationMenuUI() {
    const { disconnect } = useDisconnect();
    const { open } = useAppKit()
    const { isConnected } = useAccount();
    const router = useRouter();
    const [contact, setContact] = useState<boolean>(false)
    const [redirecting, setRedirecting] = useState(false);

    const isMobile = useIsMobile();
    const { user, exists, loading } = useCurrentUser();

    useEffect(() => {
        if (!isConnected || loading || redirecting) {
            return;
        }

        if (exists && user?.isBasic) {
            setRedirecting(true);
            router.push('/dashboard');
        }
    }, [exists, isConnected, loading, router, user, redirecting]);

    // Show a loading screen if data is still being fetched.
    if (loading || redirecting) {
        return <Rendering />;
    }

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


    const handleConnect = async () => {
        console.log("Opening AppKit modal...");
        open();
    };
    return (

        <><NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    {isConnected && <NavigationAvatar />}
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <Icons.LayoutDashboard className="h-6 w-6" />
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            kliqly.link Dashboard
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            View and create links, manage your billing information, and view your analytics.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/" title="Home">
                                Access your dashboard and connect your wallet.
                            </ListItem>
                            <ListItem href="/#faq" title="FAQ">
                                Find answers to common questions about staking and yields.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className={`grid w-full gap-3 p-4 overflow-y-auto ${isMobile ? "grid-cols-1 max-h-[80vh]" : "grid-cols-2"} md:w-[500px] lg:w-[600px]`}>
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => component.title === "Roadmap" ? window.open("https://kliqlylink.canny.io/", '_blank', 'noopener noreferrer') : component.title === "Contact Us" || component.title === "Support" ? setContact(true) : component.title === "Terms of Service" ? window.open("/terms", '_blank', 'noopener noreferrer') : component.title === "Privacy Policy" ? window.open("/privacy", '_blank', 'noopener noreferrer') : ""}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/#pricing">
                        Pricing
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            {contact && <ContactDialog open={contact} onOpenChange={setContact} />}
        </NavigationMenu>
            <div className="fixed top-5 right-5 flex flex-row items-center space-x-4">
                {!isMobile && (
                    <><div className="relative">
                        <Button onClick={handlePayment} variant={"link"} style={{ cursor: "pointer" }}>
                            Sign Up
                        </Button>
                        <Button onClick={handleConnect} variant={"link"} style={{ cursor: "pointer" }}>
                            Sign In
                        </Button>
                    </div><div className="relative">
                            <Image
                                src={image}
                                width={40}
                                height={40}
                                alt="Light mode illustration"
                                className="dark:hidden object-contain" />
                            <Image
                                src={image_white}
                                width={40}
                                height={40}
                                alt="Dark mode illustration"
                                className="hidden dark:block object-contain" />
                        </div></>
                )}
                <ModeToggle />
            </div>
        </>

    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
