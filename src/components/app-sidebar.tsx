"use client"

import * as React from "react"
import { useState } from "react"
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

// Sample data (unchanged)
const data = {
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
  ],
  navMain: [
    {
      title: "Links",
      url: "#",
      icon: Icons.LucideLink,
      isActive: true,
      items: [
        { title: "Create a new link", url: "#" },
        { title: "View all links", url: "#" },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: Icons.LucideChartNetwork,
      items: [{ title: "View", url: "#" }],
    },
    {
      title: "Contact",
      url: "#",
      icon: Icons.LucideBadgeHelp,
      items: [
        { title: "Help", url: "#" },
        { title: "Suggest a new feature", url: "#" },
        { title: "Report a bug", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Icons.LucideSettings,
      items: [{ title: "General", url: "#" }],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  console.log('open', isContactDialogOpen)

  const modifiedNavMain = data.navMain.map(item => ({
    ...item,
    items: item.items?.map(subItem => ({
      ...subItem,
      onClick: item.title === "Contact" ? () => setIsContactDialogOpen(true) : () => {}, // No-op for others
    })),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={modifiedNavMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
      <OnboardingDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </Sidebar>
  );
}