"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppKitAccount } from "@reown/appkit/react";
import { createUserAsync } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { Rendering } from "./rendering";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // This flag allows closing only after a successful submission.
  const [canClose, setCanClose] = useState(false);
  const { caipAddress, embeddedWalletInfo } = useAppKitAccount();
  const dispatch = useAppDispatch();


  const userId = caipAddress!;
  const authType = embeddedWalletInfo?.authProvider;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userData = { userId, firstName, lastName, email, authType };
      const response: any = await dispatch(createUserAsync(userData)).unwrap().catch((e) => {
        console.log(e)
      });
      console.log("response", response?._id);
      if (response?._id) {
        // Allow closing after a successful submission.
        setCanClose(true);
        onOpenChange(false);
      } else {
        console.error("Failed to submit onboarding data");
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Rendering />;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        // Prevent closing unless allowed.
        if (!openState && !canClose) return;
        onOpenChange(openState);
      }}
    >
      <DialogContent
        className="w-full"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your first name, last name, and email to complete your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}