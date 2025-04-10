import React from "react";
import { Icons } from "./icons";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LandingPageHero = () => {
    const features = [
        { title: "Real-Time Analytics", icon: Icons.LucideChartNetwork },
        { title: "Advanced Routing", icon: Icons.LucideNetwork },
        { title: "Secure Sharing", icon: Icons.Share2Icon },
    ];

    return (
        <div className="w-full min-h-[60vh] bg-primary flex flex-col items-center justify-center p-4">
            <h1 className="text-secondary font-bold tracking-tight lg:text-5xl my-8">
                Links That Work Harder for You
            </h1>
            <div className="w-full max-w-3xl flex flex-row justify-between items-center">
                <div className="flex flex-col space-y-4 w-full max-w-md">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <h2 className="text-secondary">{feature.title}</h2>
                            <feature.icon className="text-secondary" />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center w-full max-w-md space-y-2">
                    <Label htmlFor="link" className="text-secondary">
                        Shorten your link:
                    </Label>
                    <Input id="link" className="text-secondary" /> {/* TO DO: add demo functionality */}
                    <p className="text-secondary">
                        Your link: 
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPageHero;