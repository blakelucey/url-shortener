import React, { useState } from "react";
import { Icons } from "./icons";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { nanoid } from "@reduxjs/toolkit";
import axios from 'axios';
import { nullable } from "zod";

const LandingPageHero = () => {
    const [link, setLink] = useState("")
    const [copied, setCopied] = useState<boolean>(false);
    const features = [
        { title: "Real-Time Analytics", icon: Icons.LucideChartNetwork },
        { title: "Advanced Routing", icon: Icons.LucideNetwork },
        { title: "Secure Sharing", icon: Icons.Share2Icon },
    ];

    const handleDemo: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const raw = e.target.value.trim();      // grab the text once

        // 1 · if field is empty, stop here
        if (!raw) {
            setLink("");                          // clear the UI copy-link
            return;
        }

        // 2 · (optional) naive URL sanity check – skip if it’s garbage
        try {
            // adds "https://" if the user forgets it, then validates
            new URL(raw.startsWith("http") ? raw : `https://${raw}`);
        } catch {
            return;                               // don’t POST junk
        }

        // 3 · it’s non-empty & looks like a URL → generate slug & POST
        const slug = nanoid(5);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/go`,
                { slug, url: raw, ttl: 900 },
            );

            // Upstash route returns 201; accept any 2xx
            if (res.status >= 200 && res.status < 300) {
                setLink(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/go/${slug}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                    <Input id="link" className="text-secondary" onChange={handleDemo} />
                    <p className="text-secondary">
                        Your link:&nbsp;
                        {link && (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    navigator.clipboard.writeText(link);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 1500); // brief feedback
                                }}
                                className={`
            cursor-pointer underline font-semibold transition
            hover:opacity-80 active:scale-95 focus:outline-none
          `}
                            >
                                {copied ? "Copied ✔" : link}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPageHero;