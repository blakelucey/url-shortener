"use client"

import * as React from "react"
import { useEffect, useState } from "react"
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
import { fetchLinks } from "@/store/slices/linkSlice";
import { fetchClicks } from "@/store/slices/clickSlice"
import { useAppDispatch } from "@/store/hooks"
import { useDisconnect } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi"
import { useCurrentUser } from "@/hooks/use-current-user";
import { Rendering } from "./rendering";


// Sample data (unchanged)
const data = {
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
      items: [{ title: "Account", url: "/account" }, { title: "Billing", }, { title: "Roadmap", url: "https://kliqlylink.canny.io/" }, { title: "Log out", }],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const dispatch = useAppDispatch()
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const router = useRouter();
  const { user, loading, wallet, exists } = useCurrentUser({ requireAuthenticated: true });

  const handleDisconnect = () => {
    console.log("Disconnecting wallet...");
    disconnect();
  };

  useEffect(() => {
    if (!isConnected || !wallet || !exists) {
      return;
    }

    dispatch(fetchLinks(wallet)).unwrap().catch((e) => {
        console.error(e)
      });
    dispatch(fetchClicks(wallet))
        .unwrap()
        .then((clicks) => {
          console.log('Fetched clicks:', clicks);
        })
        .catch((e) => {
          console.error('Error fetching clicks:', e);
        });
  }, [dispatch, isConnected, wallet, exists])

  console.log('open', isContactDialogOpen)

  if (loading || !exists || !user) {
    return <Rendering />;
  }

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
          return { ...subItem, onClick: () => window.open(process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL, "_blank", "noopener noreferrer") };
        }
        if (item.title === "Settings" && subItem.title === "Roadmap") {
          return !user?.isBasic
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
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
      <ContactDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </Sidebar>
  );
}
