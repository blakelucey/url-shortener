import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios'
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


interface ContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("")
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messageType, setMessageType] = useState("")



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post("http://localhost:3000/api/help", { firstName, lastName, email, phoneNumber, message, messageType });
            if (response.status === 200) {
                onOpenChange(false); // Close dialog on success
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="flex justify-end">
                    <DialogClose onClick={() => onOpenChange(false)} className="transition-transform duration-300 hover:rotate-180" />
                </div>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Please provide your first name, last name, and email to complete your profile.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="messageType" className="text-right">
                                Message Type
                            </Label>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="What are you contact us about?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Help" id="Help" onClick={() => setMessageType("Help")}>I need help with something</SelectItem>
                                        <SelectItem value="Suggest a new feature" id="Suggest a new feature" onClick={() => setMessageType("Suggest a new feature")}>I want to suggest a new feature</SelectItem>
                                        <SelectItem value="Report a bug" id="Suggest a new feature" onClick={() => setMessageType("Suggest a new feature")}>I want to report a bug</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                                Phone Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                type="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="message" className="text-right">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="col-span-3 resize-y"
                                rows={10}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}