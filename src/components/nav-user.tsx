"use client"

import { useState, useEffect } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useDisconnect } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi"
import { User } from '@/store/slices/userSlice'
import { Icons } from "./icons";

export function NavUser({
  user,
}: any) {
  const { isMobile } = useSidebar()
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const router = useRouter();
  const [userData, setUserData] = useState<User>(user?.user)

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])


  const handleDisconnect = () => {
    console.log("Disconnecting wallet...");
    disconnect();
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback className="rounded-lg">{userData?.firstName && userData?.lastName
                    ? `${userData.firstName[0]}${userData.lastName[0]}`
                    : "N/A"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData?.firstName}</span>
                  <span className="truncate text-xs">{userData?.lastName}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback className="rounded-lg">{userData?.firstName && userData?.lastName
                      ? `${userData.firstName[0]}${userData.lastName[0]}`
                      : "N/A"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userData?.firstName}</span>
                    <span className="truncate text-xs">{userData?.lastName}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userData?.isPro === false && <><DropdownMenuGroup>
                <DropdownMenuItem onClick={() =>
                  window.open(process.env.NEXT_PUBLIC_PAYMENT_LINK, '_blank', 'noopener noreferrer')
                }>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup><DropdownMenuSeparator /></>}

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/account')}>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                {userData?.isPro &&
                  <DropdownMenuItem onClick={() => router.push('/billing')}>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>}
                <DropdownMenuItem onClick={() => window.open("https://kliqlylink.canny.io/", "blank", "noopener noreferrer")}>
                  <Icons.LucideMap />
                  Roadmap
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDisconnect}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
