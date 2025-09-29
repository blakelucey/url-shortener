"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { NavigationMenuUI } from "@/components/navigation-menu";
import { Icons } from "@/components/icons";
import TypingText from '../components/textAnimation'
import LandingPageHero from "@/components/landing-page-hero";
import AnalyticsPreview from "@/components/landing-page-analytics-preview";
import LandingPagePricing from "@/components/landing-page-pricing";
import Footer from "@/components/footer";
import FAQ from "@/components/faq/page";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppKit } from "@reown/appkit/react";
import { Rendering } from "@/components/rendering";
import { useRouter } from "next/navigation";
import { logFn } from "../../logging/logging";
import { useCurrentUser } from "@/hooks/use-current-user";
const log = logFn("src.app.page.tsx.")

export default function HomePage() {
  const { theme } = useTheme();
  const { open } = useAppKit()
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const { user, exists, isComplete, loading, isConnected } = useCurrentUser();



  const isMobile = useIsMobile();

  interface PaymentLinkResponse {
    url: string
  }

  useEffect(() => {
    if (!isConnected || loading || redirecting) {
      return;
    }

    if (exists && user?.isBasic) {
      setRedirecting(true);
      router.push('/dashboard');
    }
  }, [exists, isConnected, loading, router, user, redirecting]);

  if (loading || redirecting) {
    return <Rendering />;
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
      log("error", 'error', e);
      alert("We couldn't open the checkout. Please refresh and try again.");
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
            <main className="flex-1 flex items-center justify-center px-4 py-16" id="#">
              <div className="text-center space-y-8 max-w-3xl">
                <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Launch smarter links without the premium price tag
                </span>
                <h1 className="scroll-m-40 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Own your link-in-bio for $1/month + usage. Legacy platform users still pay $35.
                </h1>
                <h5 className="scroll-m-20 text-xl sm:text-2xl tracking-tight text-muted-foreground">
                  Kliqly.link stays lightweight, transparent, and pay-as-you-go so you only pay for the clicks you earn.
                </h5>
                <TypingText />
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    onClick={handlePayment}
                    className="w-full sm:w-auto px-8 py-6 text-base font-semibold"
                    style={{ cursor: "pointer" }}
                  >
                    Start for $1/month
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto px-8 py-6 text-base"
                    style={{ cursor: "pointer" }}
                  >
                    See pricing details
                  </Button>
                </div>
                {isMobile && (
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={handleConnect}
                      variant={"secondary"}
                      className="w-full px-8 py-6 text-base"
                      style={{ cursor: "pointer" }}
                    >
                      Sign in with your wallet
                    </Button>
                  </div>
                )}
                {isConnected && exists === false && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    We couldn't find an active subscription for this wallet. Start your plan below to access the dashboard.
                  </div>
                )}
                <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-center">
                  <span>Transparent $1/month platform fee plus simple usage pricing</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Stripe-powered checkout keeps payments secure</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Built-in analytics show clicks, devices, and geography</span>
                </div>
              </div>
            </main>
          </div>
        </div>
        <section className="px-4 py-12">
          <div className="mx-auto grid w-full max-w-5xl gap-6 rounded-3xl border bg-card p-8 shadow-sm md:grid-cols-3">
            <div className="md:col-span-2 space-y-5 text-left">
              <h2 className="text-2xl font-bold tracking-tight">Why teams choose Kliqly.link</h2>
              <p className="text-muted-foreground">
                Keep link-in-bio experiences fast, simple, and measurable while staying within budget.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icons.LucideCheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span>Route visitors by device, locale, or campaign (coming soon) without maintaining scripts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.LucideCheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span>Track clicks, referrers, and top-performing content through the built-in analytics suite.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.LucideCheckCircle className="mt-1 h-5 w-5 text-primary" />
                  <span>Stay in control of spend with $1/month pricing plus usage that scales with demand.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border bg-background p-4">
                <p className="font-semibold">Secure Stripe checkout</p>
                <p>Stripe-hosted billing encrypts payment details and keeps them secure.</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="font-semibold">Fast setup</p>
                <p>Publish shortened links and share them in minutes with minimal configuration.</p>
              </div>
            </div>
          </div>
        </section>
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
        <section className="px-4 py-16 bg-primary/10">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to launch smarter links?</h2>
            <p className="text-muted-foreground">
              Join Kliqly.link for just $1/month plus transparent usage—spend 97% less than comparable plans on legacy platforms.
            </p>
            <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={handlePayment}
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold"
                style={{ cursor: "pointer" }}
              >
                Start for $1/month
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-6 text-base"
                style={{ cursor: "pointer" }}
              >
                Review the plan
              </Button>
            </div>
          </div>
        </section>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
