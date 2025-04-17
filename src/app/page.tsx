"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "next-themes";
import { NavigationMenuUI } from "@/components/navigation-menu";
import TypingText from '../components/textAnimation'
import LandingPageHero from "@/components/landing-page-hero";
import AnalyticsPreview from "@/components/landing-page-analytics-preview";
import LandingPagePricing from "@/components/landing-page-pricing";
import Footer from "@/components/footer";
import FAQ from "@/components/faq/page";

export default function HomePage() {
  const { theme } = useTheme();

  const handlePayment = () => {
    window.open(process.env.NEXT_PUBLIC_PAYMENT_LINK, '_blank', 'noopener noreferrer')
  }

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
    </div>
  );
}