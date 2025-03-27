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
import { createLinkAsync } from '@/store/slices/linkSlice';
import { useAppDispatch } from '@/store/hooks';
import { Checkbox } from '@/components/ui/checkbox';

const CreateLinkInput = () => {
    const [link, setLink] = useState(""); // Original URL input
    const [shortUrl, setShortUrl] = useState(""); // Short hash from Java service
    const [shortHash, setShortHash] = useState(""); // Short hash from Java service
    const [isFetchingHash, setIsFetchingHash] = useState(false); // Loading state for hash preview
    const [campaigns, setCampaigns] = useState<string[]>([]); // Selected campaigns
    const [channels, setChannels] = useState<string[]>([]); // Selected channels
    const [addUtm, setAddUtm] = useState<boolean>(false)
    const [utmParams, setUtmParams] = useState({
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_term: "",
        utm_content: "",
    });

    const [utmErrors, setUtmErrors] = useState({
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_term: "",
        utm_content: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
    const { caipAddress } = useAppKitAccount(); // User ID from AppKit
    const userId = caipAddress!;
    const dispatch = useAppDispatch()

    // Fetch short hash from Java Shortening Service when the URL changes
    useEffect(() => {
        const fetchShortUrl = async () => {
            if (!link) {
                setShortUrl("");
                return;
            }
            setIsFetchingHash(true);
            try {
                const response = await axios.post("http://localhost:8080/shorten", { url: link, userId: userId });
                console.log('response', response)
                const shortUrl = response.data.shortUrl; // e.g., "http://localhost:8081/abc123"
                const shortHash = response.data.shortHash
                setShortUrl(shortUrl);
                setShortHash(shortHash);
            } catch (error) {
                console.error("Error fetching short hash:", error);
                setShortUrl("Error");
            } finally {
                setIsFetchingHash(false);
            }
        };
        fetchShortUrl();
    }, [link, userId]);

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
        if (!userId || !shortUrl || shortUrl === "Error") {
            console.error("Missing required fields or invalid short hash");
            return;
        }
        setIsSubmitting(true);
        try {

            const linkData = { userId, originalUrl: link, shortUrl, shortHash, channels, campaigns, ...utmParams }

            console.log('linkData', linkData)

            const response: any = await dispatch(createLinkAsync({ linkData })).unwrap().catch((e) => {
                console.error(e)
            })

            if (response.status === 200 || 201) {
                console.log('Success:', response);
            } else {
                console.error("Failed to submit link data");
            }
        } catch (error) {
            console.error("Error submitting link:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Generic onBlur that cleans whitespace and sets an error if changed.
    const handleUtmBlur = (field: keyof typeof utmParams) => (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/\s/g, "");
        if (cleanedValue !== value) {
            setUtmErrors(prev => ({ ...prev, [field]: "Whitespace has been removed" }));
            setUtmParams(prev => ({ ...prev, [field]: cleanedValue }));
        } else {
            setUtmErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    // Generic onChange for convenience.
    const handleUtmChange = (field: keyof typeof utmParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setUtmParams(prev => ({ ...prev, [field]: e.target.value }));
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
                                    <Link href={`${shortUrl}`} target="_blank">
                                        {shortUrl}
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
                    <div className="space-y-1.5">
                        <div className="items-top flex space-x-2">
                            <Checkbox id="terms1" checked={addUtm} onCheckedChange={() => setAddUtm(!addUtm)} />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms1"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Add utm parameters to this link?
                                </label>
                            </div>
                        </div>
                    </div>
                    {addUtm &&
                        (["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as (keyof typeof utmParams)[]).map(field => (
                            <div key={field} className="space-y-1.5">
                                <Label htmlFor={field} className="text-gray-700">
                                    Input your {field} here:
                                </Label>
                                <Input
                                    type="text"
                                    id={field}
                                    placeholder={`${field} (optional)`}
                                    value={utmParams[field]}
                                    onChange={handleUtmChange(field)}
                                    onBlur={handleUtmBlur(field)}
                                    className="w-full"
                                />
                                {utmErrors[field] && <small style={{ color: "red" }}>{utmErrors[field]}</small>}
                            </div>
                        ))}

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" className="w-full" disabled={(isSubmitting || !shortUrl || shortHash || utmErrors) === "Error"}>
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet >
    );
};

export default CreateLinkInput;