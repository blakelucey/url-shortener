"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  Component,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
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
import { OnboardingDialog } from "./contact-dialog" // Adjust path
import { NavUser } from "./nav-user"
import { fetchUser, selectUser, User } from "@/store/slices/userSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useAppKitAccount } from "@reown/appkit/react"



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
      items: [{ title: "General", url: "#" }],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const { embeddedWalletInfo, caipAddress } = useAppKitAccount();
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const [userData, setUserData] = useState<User>(user!)

  useEffect(() => {
    if (caipAddress) {
      dispatch(fetchUser(caipAddress)).catch((e) => {
        console.error(e)
      })
    }
  }, [])

  console.log('user', user)

  console.log('open', isContactDialogOpen)

  const modifiedNavMain = data.navMain.map(item => ({
    ...item,
    items: item.items?.map(subItem => ({
      ...subItem,
      onClick: item.title === "Contact" ? () => setIsContactDialogOpen(true) : () => { }, // No-op for others
    })),
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
      <OnboardingDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </Sidebar>
  );
}