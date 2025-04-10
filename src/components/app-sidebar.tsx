"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  Contact,
  GalleryVerticalEnd,
  LogOutIcon,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Icons } from "./icons"
import { ContactDialog } from "./contact-dialog" // Adjust path
import { NavUser } from "./nav-user"
import { fetchUser, selectUser, User } from "@/store/slices/userSlice"
import { fetchLinks } from "@/store/slices/linkSlice";
import { fetchClicks } from "@/store/slices/clickSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useAppKitAccount } from "@reown/appkit/react"
import { useDisconnect } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi"


// Sample data (unchanged)
const data = {
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
  ],
  navMain: [
    {
      title: "Links",
      url: "/dashboard",
      icon: Icons.LucideLink,
      isActive: true,
      items: [
        { title: "View all links", url: "/dashboard" },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: Icons.LucideChartNetwork,
      items: [{ title: "View your analytics", url: "/analytics" }],
    },
    {
      title: "Contact",
      icon: Icons.LucideBadgeHelp,
      items: [
        { title: "Help" },
        { title: "Suggest a new feature" },
        { title: "Report a bug" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Icons.LucideSettings,
      items: [{ title: "Account", url: "/account" }, { title: "Upgrade to Pro", url: process.env.NEXT_PUBLIC_PAYMENT_LINK }, { title: "Billing", url: "/billing" }, { title: "Roadmap", url: "https://kliqlylink.canny.io/" }, { title: "Log out", }],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const { embeddedWalletInfo, caipAddress } = useAppKitAccount();
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const [userData, setUserData] = useState<User>(user!)
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleDisconnect = () => {
    console.log("Disconnecting wallet...");
    disconnect();
  };

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
    if (caipAddress) {
      dispatch(fetchUser(caipAddress)).unwrap().catch((e) => {
        console.error(e)
      })
      dispatch(fetchLinks(caipAddress)).unwrap().catch((e) => {
        console.error(e)
      });
      dispatch(fetchClicks(caipAddress))
        .unwrap()
        .then((clicks) => {
          console.log('Fetched clicks:', clicks);
        })
        .catch((e) => {
          console.error('Error fetching clicks:', e);
        });
    }
  }, [caipAddress, dispatch, isConnected, router])

  console.log('user', user)

  console.log('open', isContactDialogOpen)

  const modifiedNavMain = data.navMain.map((item) => ({
    ...item,
    items: item.items
      ?.map((subItem) => {
        if (item.title === "Contact") {
          return { ...subItem, onClick: () => setIsContactDialogOpen(true) };
        }
        if (item.title === "Settings" && subItem.title === "Log out") {
          return { ...subItem, onClick: handleDisconnect };
        }
        if (item.title === "Settings" && subItem.title === "Billing") {
          return userData?.isPro ? { ...subItem, onClick: () => { } } : null;
        }
        if (item.title === "Settings" && subItem.title === "Upgrade to Pro") {
          return !userData?.isPro
            ? {
              ...subItem,
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(process.env.NEXT_PUBLIC_PAYMENT_LINK, '_blank', 'noopener noreferrer');
              },
            }
            : null;
        }
        if (item.title === "Settings" && subItem.title === "Roadmap") {
          return !userData?.isPro
            ? {
              ...subItem,
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                window.open("https://kliqlylink.canny.io/", '_blank', 'noopener noreferrer');
              },
            }
            : null;
        }
        return { ...subItem, onClick: () => { } };
      })
      .filter((s): s is { title: string; url?: string; onClick: () => void } => Boolean(s)),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={modifiedNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
      <ContactDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </Sidebar>
  );
}