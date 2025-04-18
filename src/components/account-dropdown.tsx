import {
    CreditCard,
    Sparkles,
    Users,
} from "lucide-react"
import React, { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "./icons"
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi"
import { deleteUserAsync, selectUser, User, selectSubscription } from "@/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function AccountDropdownMenu() {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const stripeSubscription = useAppSelector(selectSubscription)
    const { caipAddress } = useAppKitAccount();
    const { disconnect } = useDisconnect();
    const { isConnected } = useAccount();
    const user: any = useAppSelector(selectUser)
    const [stripeStatus, setStripeStatus] = useState(stripeSubscription?.data[0]?.status)
    const [userData, setUserData] = useState<User>(user?.user)
    const userId = caipAddress!

    useEffect(() => {
        if (!isConnected) {
            router.push('/')
        }
    }, [isConnected, router])

    const handleDisconnect = () => {
        console.log("Disconnecting wallet...");
        disconnect();
    };

    const handleUserDeletion = async () => {
        const response = await dispatch(deleteUserAsync(userId)).unwrap().then(() => {
            disconnect();
            router.push("/")
        }).catch((e) => {
            console.error(e)
        })
        console.log('response', response)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Icons.LucideMousePointerClick />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {stripeStatus === "trialing" || stripeStatus === "active" ? <>
                    <DropdownMenuItem onClick={() => router.push('/billing')}>
                        <CreditCard />
                        <span>Billing</span>
                    </DropdownMenuItem>
                </> : null}
                {/* {userData?.isBasic === false && <><DropdownMenuGroup>
                    <DropdownMenuItem onClick={() =>
                        window.open(process.env.NEXT_PUBLIC_PAYMENT_LINK, '_blank', 'noopener noreferrer')
                    }>
                        <Sparkles />
                        Upgrade to Pro
                    </DropdownMenuItem>
                </DropdownMenuGroup><DropdownMenuSeparator /></>} */}
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => window.open("https://kliqlylink.canny.io/", "blank", "noopener noreferrer")}>
                        <Icons.LucideMap />
                        <span>Roadmap</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleDisconnect}>
                        <Users />
                        <span>Log Out</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Icons.LucideUserX />
                            <span>Delete Account</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={handleUserDeletion}>
                                    <Icons.LucideUserX />
                                    <span>Yes, I'm sure</span>
                                </DropdownMenuItem >
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => console.log("user didn't delete their account")}>
                                    <Icons.LucideUserPlus />
                                    <span>No, I don't want to delete my account</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
