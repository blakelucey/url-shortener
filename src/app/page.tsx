"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { NavigationMenuUI } from "@/components/navigation-menu";
import TypingText from '../components/textAnimation'
import LandingPageHero from "@/components/landing-page-hero";
import AnalyticsPreview from "@/components/landing-page-analytics-preview";
import LandingPagePricing from "@/components/landing-page-pricing";
import Footer from "@/components/footer";
import FAQ from "@/components/faq/page";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUser, selectUser } from "@/store/slices/userSlice";
import { useAccount } from "wagmi";
import { Rendering } from "@/components/rendering";
import { useRouter } from "next/navigation";
import { logFn } from "../../logging/logging";
const log = logFn("src.app.page.tsx.")

export default function HomePage() {
  const { theme } = useTheme();
  const { open } = useAppKit()
  const dispatch = useAppDispatch();
  const { embeddedWalletInfo, caipAddress } = useAppKitAccount();
  const { isConnected } = useAccount();
  const user: any = useAppSelector(selectUser)
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Use isMounted instead of isClient
  const [loading, setLoading] = useState<boolean>(false);



  const isMobile = useIsMobile();

  interface PaymentLinkResponse {
    url: string
  }

  useEffect(() => {
    setIsMounted(true); // Set after client-side mount
    if (caipAddress) {
      void dispatch(fetchUser(caipAddress));
    }
    if (isConnected) {
      if (user?.user?._id && user?.user?.isBasic) {
        router.push('/dashboard');
        setLoading(true)
      } else {
        alert("User does not exist, please finish onboarding")
        handlePayment()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caipAddress, dispatch, isConnected, router]);

  // Show a loading screen if data is still being fetched.
  if (loading) {
    return <Rendering />;
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
                {isMobile && (
                  <div className="flex items-center justify-center space-x-2 tracking-tight">
                    <Button onClick={handleConnect} variant={"secondary"} className="inline-flex items-center w-full" style={{ cursor: "pointer" }}>
                      Sign In
                    </Button>
                  </div>
                )}
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
    </div>
  );
}