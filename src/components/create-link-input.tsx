import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Assuming this is available in your UI library
import axios from 'axios'
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
} from "@/components/ui/sheet"
import { ChannelComboxInput } from './channel-input';
import { nanoid } from "nanoid";
import Link from 'next/link';
import { CampaignComboInput } from './campaign-input';

const CreateLinkInput = () => {
    const [link, setLink] = useState("");
    const { caipAddress } = useAppKitAccount();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [campaigns, setCampaigns] = useState<string[]>([]);
    const [channels, setChannels] = useState<string[]>([]);
    const [shortHash, setShortHash] = useState(nanoid(7))

    const handleCampaignSelection = (values: string[]) => {
        console.log('Selected campaigns:', values);
        setCampaigns(values);
    };

    const handleChannelSelection = (values: string[]) => {
        console.log('Selected channels:', values);
        setChannels(values);
    };

    const userId = caipAddress;

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Submitted link:", link);
        // Future axios.post('/api/shorten', { url: link }) can go here
        try {
            const response = await axios.post("http://localhost:3000/api/users", { userId, campaigns, link, channels, shortHash });
            if (response.status === 200) {
                console.log('success')
                setIsSubmitting(true)
            } else {
                console.error("Failed to submit onboarding data");
            }
        } catch (error) {
            console.error("Error submitting onboarding:", error);
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
                        Add your link, see what it will look like, input channels and campaigns for analytics. Click submit when you're done.                    </SheetDescription>
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
                            <p className="text-blue-500 break-all"><Link href={link} target='a'>`short.ly/{shortHash}`</Link></p>
                        </div>
                    )}
                    <div className='space-y-1.5'>
                        <Label htmlFor="What channels will you use?" className='text-gray-700'>What channels will you use?</Label>
                        <ChannelComboxInput onSelectionChange={handleChannelSelection} />
                    </div>
                    <div className='space-y-1.5'>
                        <Label htmlFor="What campaign(s) will you use?" className='text-gray-700'>What campaign(s) will you use?</Label>
                        <CampaignComboInput onSelectionChange={handleCampaignSelection} />
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" className="w-full">Submit</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default CreateLinkInput;