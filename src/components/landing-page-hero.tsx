import React from "react";
import { Icons } from "./icons";

const LandingPageHero = () => {
    const features = [
        {
            title: "Transparent pricing",
            description: "Pay $1/month plus low usage fees—no hidden upgrades.",
            icon: Icons.LucideDollarSign,
        },
        {
            title: "Conversion routing tools (coming soon)",
            description: "Plan device, geo, and campaign targeting that will roll out in upcoming releases.",
            icon: Icons.LucideSplit,
        },
        {
            title: "In-app analytics",
            description: "Track clicks, referrers, and engagement inside the Kliqly dashboard.",
            icon: Icons.LucideBarChart3,
        },
        {
            title: "Wallet-ready access (coming soon)",
            description: "Future releases will add wallet sign-in alongside email onboarding.",
            icon: Icons.LucideWallet,
        },
    ];

    return (
        <section className="w-full bg-primary px-4 py-16 text-secondary">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
                <div className="space-y-4 text-center">
                    <span className="text-sm font-semibold uppercase tracking-wide text-secondary/70">Product highlights</span>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Powerful link management without the enterprise price tag.
                    </h2>
                    <p className="text-base text-secondary/80">
                        Launch curated link hubs today, monitor performance instantly, and preview routing automation coming soon.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col gap-3 rounded-3xl bg-secondary/10 p-6">
                            <feature.icon className="h-6 w-6" />
                            <h3 className="text-xl font-semibold">{feature.title}</h3>
                            <p className="text-sm text-secondary/80">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingPageHero;
