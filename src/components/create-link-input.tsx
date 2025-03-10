import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useAppKitAccount } from '@reown/appkit/react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChannelComboxInput } from './channel-input';
import { CampaignComboInput } from './campaign-input';
import Link from 'next/link';

const CreateLinkInput = () => {
    const [link, setLink] = useState(""); // Original URL input
    const [shortHash, setShortHash] = useState(""); // Short hash from Java service
    const [isFetchingHash, setIsFetchingHash] = useState(false); // Loading state for hash preview
    const [campaigns, setCampaigns] = useState<string[]>([]); // Selected campaigns
    const [channels, setChannels] = useState<string[]>([]); // Selected channels
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
    const { caipAddress } = useAppKitAccount(); // User ID from AppKit
    const userId = caipAddress;

    // Fetch short hash from Java Shortening Service when the URL changes
    useEffect(() => {
        const fetchShortHash = async () => {
            if (!link) {
                setShortHash("");
                return;
            }
            setIsFetchingHash(true);
            try {
                const response = await axios.post("http://localhost:8080/shorten", { url: link, userId: userId });
                console.log('response', response)
                const shortUrl = response.data.shortUrl; // e.g., "http://localhost:8081/abc123"
                // const hash = shortUrl.split('/').pop(); // Extract "abc123" from the URL
                setShortHash(shortUrl);
            } catch (error) {
                console.error("Error fetching short hash:", error);
                setShortHash("Error");
            } finally {
                setIsFetchingHash(false);
            }
        };
        fetchShortHash();
    }, [link]);

    // Handle campaign selection
    const handleCampaignSelection = (values: string[]) => {
        setCampaigns(values);
    };

    // Handle channel selection
    const handleChannelSelection = (values: string[]) => {
        setChannels(values);
    };


    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !shortHash || shortHash === "Error") {
            console.error("Missing required fields or invalid short hash");
            return;
        }
        setIsSubmitting(true);
        try {

            const signResponse = await axios.get(`${process.env.NEXT_PUBLIC_FRONTEND_URL!}/api/signToken`, {
                params: { userId } // Pass any required data here
            });
            const token = signResponse.data.data;

            const response = await axios.post("http://localhost:3000/api/links", {
                userId,
                originalUrl: link,
                shortHash,
                channels,
                campaigns
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('response', response)
            if (response.statusText === 'Created') {
                console.log('Success:', response.data);
            } else {
                console.error("Failed to submit link data");
            }
        } catch (error) {
            console.error("Error submitting link:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Add a new link</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add your link</SheetTitle>
                    <SheetDescription>
                        Add your link, preview the shortened version, select channels and campaigns, then submit.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                    <div className="space-y-1.5">
                        <Label htmlFor="link" className="text-gray-700">Input your link here:</Label>
                        <Input
                            type="url"
                            id="link"
                            placeholder="https://example.com"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    {link && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Preview:</p>
                            <p className="text-blue-500 break-all">
                                {isFetchingHash ? (
                                    "Generating..."
                                ) : (
                                    <Link href={`http://localhost:8081/${shortHash}`} target="_blank">
                                        {shortHash}
                                    </Link>
                                )}
                            </p>
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label htmlFor="channels" className="text-gray-700">What channels will you use?</Label>
                        <ChannelComboxInput onSelectionChange={handleChannelSelection} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="campaigns" className="text-gray-700">What campaign(s) will you use?</Label>
                        <CampaignComboInput onSelectionChange={handleCampaignSelection} />
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" className="w-full" disabled={isSubmitting || !shortHash || shortHash === "Error"}>
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default CreateLinkInput;