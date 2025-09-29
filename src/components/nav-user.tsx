"use client"

import { useEffect } from "react";
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
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
import { Icons } from "./icons";
import type { User } from '@/store/slices/userSlice';
import { logFn } from "../../logging/logging";
const log = logFn("src.components.nav-user.tsx.")

export function NavUser({
  user,
}: { user: User | null }) {
  const { isMobile } = useSidebar()
  const { disconnect } = useDisconnect();
  const { isConnected, isConnecting, isReconnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isConnected && !isConnecting && !isReconnecting) {
      log('No user state and wallet disconnected; returning to home', 'info');
      router.push('/')
    }
  }, [user, isConnected, isConnecting, isReconnecting, router])


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
                  <AvatarFallback className="rounded-lg">{user?.firstName && user?.lastName
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : "??"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.firstName ?? 'User'}</span>
                  <span className="truncate text-xs">{user?.lastName ?? ''}</span>
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
                    <AvatarFallback className="rounded-lg">{user?.firstName && user?.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                      : "??"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.firstName ?? 'User'}</span>
                    <span className="truncate text-xs">{user?.lastName ?? ''}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* {user?.isBasic === false && <><DropdownMenuGroup>
                <DropdownMenuItem onClick={handlePayment}>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup><DropdownMenuSeparator /></>} */}

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/account')}>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => window.open(process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL, "_blank", "noopener noreferrer")}>
                    <CreditCard />
                    <span>Billing</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup><DropdownMenuSeparator />
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
