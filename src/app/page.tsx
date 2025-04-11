"use client";

import { useAccount } from "wagmi";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import { ModeToggle } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { User, selectUser } from '@/store/slices/userSlice'
import { useAppSelector } from "@/store/hooks";
import { Rendering } from "@/components/rendering";
import { OnboardingDialog } from "../components/finish-onboarding";
import image from '../../public/image.png'
import image_white from '../../public/image_white.png'
import { NavigationMenuUI } from "@/components/navigation-menu";
import TypingText from '../components/textAnimation'
import LandingPageHero from "@/components/landing-page-hero";
import AnalyticsPreview from "@/components/landing-page-analytics-preview";
import LandingPagePricing from "@/components/landing-page-pricing";
import Footer from "@/components/footer";
import FAQ from "@/components/faq/page";
import axios from 'axios'
import Link from "next/link";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false); // Use isMounted instead of isClient
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { theme } = useTheme();
  const router = useRouter();
  const user: any = useAppSelector(selectUser)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  //============================================================================================== 
  // TODO: Use stripe api to fetch successful trial customer and then complete onboarding process. 
  //============================================================================================== 
  //============================================================================================== 
  //============================================================================================== 


  useEffect(() => {
    setIsMounted(true); // Set after client-side mount

    if (isConnected) {
      if (user?.user?._id && user?.user?.isPro) {
        router.push('/dashboard');
        setLoading(true)
      }
    }
  }, [isConnected, router, user]);

  // Show a loading screen if data is still being fetched.
  if (loading) {
    return <Rendering />;
  }

  // const handleDisconnect = () => {
  //   console.log("Disconnecting wallet...");
  //   disconnect();
  // };
  const handlePayment = () => {
    window.open(process.env.NEXT_PUBLIC_PAYMENT_LINK, '_blank', 'noopener noreferrer')
  }

  // Render skeleton or empty state on the server, full content on the client
  return (
    <div className={theme}>
      <div className="min-h-screen flex flex-col">
        <div className="justify-center flex flex-row">
          <div className="min-h-screen flex flex-col">
            <div className="fixed top-5 left-5">
              <NavigationMenuUI />
            </div>
            <main className="flex-1 flex items-center justify-center p-4" id="#">
              <div className="text-center space-y-8">
                <h1 className="scroll-m-40 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Shorten. Share. Scale.
                </h1>
                <h5 className="scroll-m-20 text-2xl tracking-tight">
                  <TypingText />
                </h5>
                <div className="flex items-center justify-center space-x-2 tracking-tight">
                  <Button onClick={handlePayment} className="inline-flex items-center w-full" style={{ cursor: "pointer" }}>
                    Try It Now
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
        <LandingPageHero />
        <div className="my-30" />
        <AnalyticsPreview />
        <div className="my-30" />
        <a id="pricing">
          <LandingPagePricing />
        </a>
        <div className="my-30" />
        <a id="faq">
        <FAQ />
        </a>
        <div className="my-30" />
        <div>
          <Footer />
        </div>
      </div>
      {isOnboardingOpen && <OnboardingDialog open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen} />}
    </div>
  );
}