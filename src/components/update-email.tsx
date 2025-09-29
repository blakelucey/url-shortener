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

import { createLinkAsync } from '@/store/slices/linkSlice';
import { useAppDispatch } from '@/store/hooks';
import { fetchUser } from "@/store/slices/userSlice"
import { useAccount } from 'wagmi';
import { useCurrentUser } from '@/hooks/use-current-user';


const UpdateEmail = () => {
    const [newEmail, setNewEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
    const { isConnected, address } = useAccount();
    const { caipAddress } = useAppKitAccount(); // User ID from AppKit
    const { user, loading, exists } = useCurrentUser({ requireAuthenticated: true, requireCompletedProfile: true });
    const [oldEmail, setOldEmail] = useState(user?.email)
    const [emailError, setEmailError] = useState("");
    const userId = (user?.userId ?? caipAddress) ?? '';
    const dispatch = useAppDispatch()


    useEffect(() => {
        if (user?.email) {
            setOldEmail(user.email);
        }
    }, [user?.email]);

    if (loading || !exists || !user || !userId) {
        return null;
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !user) {
            console.error("Missing required fields or invalid short hash");
            return;
        }
        setIsSubmitting(true);
        try {

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, type: "update", newEmail })
            });

            if (response.status === 200) {
                console.log('Success:', response);
                await dispatch(fetchUser(userId)).catch((e) => {
                    console.error(e)
                })
            } else {
                console.error("Failed to submit link data");
            }
        } catch (error) {
            console.error("Error submitting link:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailBlur = () => {
        // Only validate if the email has changed from the original.
        if (newEmail === oldEmail) {
            setEmailError("This email is already in use.");
        } else if (newEmail !== oldEmail) {
            // Basic email format validation using regex.
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                setEmailError("Please enter a valid email address.");
            } else {
                setEmailError("");
            }
        } else {
            // Clear any error if the email hasn't changed.
            setEmailError("");
        }
    };


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" onClick={() => setNewEmail("")}>Update Email</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Update your email</SheetTitle>
                    <SheetDescription>
                        Your current email is {oldEmail}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                    <div className="space-y-1.5">
                        <Label htmlFor="link" className="text-gray-700">Input your new email here:</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="email@gmail.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full"
                            required
                            onBlur={handleEmailBlur}
                        />
                        {emailError && <small className="text-red-500 text-sm mt-1">{emailError}</small>}
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" className="w-full" disabled={(isSubmitting || (oldEmail === newEmail))}>
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet >
    );
};

export default UpdateEmail;
