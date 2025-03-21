"use client"

import { AppSidebar } from "@/components/app-sidebar"
import React, { useState, useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAccount } from "wagmi"
import { useAppKitAccount } from "@reown/appkit/react";
import { OnboardingDialog } from "@/components/finish-onboarding"
import { LinkDataTable } from "@/components/link-table"
import { selectUser } from "@/store/slices/userSlice"
import { useAppSelector } from "@/store/hooks"

export default function Dashboard() {
  const { embeddedWalletInfo, caipAddress } = useAppKitAccount();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const { isConnected, address } = useAccount();
  const user = useAppSelector(selectUser)

  useEffect(() => {
    console.log('isConnected:', isConnected);
    console.log('caipAddress:', caipAddress);

    try {
      const checkUserStatus = async () => {
        if (isConnected && caipAddress !== undefined) {
          try {
            if (user) {
              setIsOnboardingOpen(false);
            } else {
              setIsOnboardingOpen(true);
            }
          } catch (error) {
            console.error("Error checking user status:", error);
            setIsOnboardingOpen(true);
          }
        } else {
          setIsOnboardingOpen(false);
        }
      };
      checkUserStatus().catch((e) => {
        console.error(e);
      });
    } catch (e) { console.error(e) }

  }, [isConnected, caipAddress!]);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Links</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Create a new Link</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
              <LinkDataTable />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      {isOnboardingOpen && (
        <OnboardingDialog
          open={isOnboardingOpen}
          onOpenChange={setIsOnboardingOpen}
        />
      )}
    </div>
  );
}