import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Assuming this is available in your UI library
import axios from 'axios'
import { useAppKitAccount } from '@reown/appkit/react';

const CreateLinkInput = () => {
    const [link, setLink] = useState("");
    const { caipAddress } = useAppKitAccount();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userId = caipAddress;

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Submitted link:", link);
        // Future axios.post('/api/shorten', { url: link }) can go here
        try {
            const response = await axios.post("http://localhost:3000/api/users", { userId, });
            if (response.status === 200) {
                console.log('success')
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
            <Button type="submit" className="w-full">Shorten URL</Button>
            {link && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Preview:</p>
                    <p className="text-blue-500 break-all">{link}</p>
                </div>
            )}
        </form>
    );
};

export default CreateLinkInput;