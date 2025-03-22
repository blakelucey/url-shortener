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
import { selectUser } from "@/store/slices/userSlice"
import { useAppSelector } from "@/store/hooks"
import { AreaChartInteractive } from "@/components/charts/AreaChartInteractive/page"
import { DonutChart } from "@/components/charts/DonutChart/page"
import { RadialChart } from "@/components/charts/RadialChart/page"
import { PieChartInteractive } from "@/components/charts/PieChartInteractive/page"
import { BarChartInteractive } from "@/components/charts/BarChartInteractive/page"
import { TotalClicks } from "@/components/charts/TotalClicks/page"
import { MostPopularOS } from "@/components/charts/PopularOS/page"

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
        <div className="analytics-page">
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
                                        <BreadcrumbLink href="/analytics">Analytics</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage></BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                            <AreaChartInteractive />
                        </div>
                        <div className="flex flex-1 flex-row gap-4 p-4">
                            <DonutChart />
                            <RadialChart />
                            <BarChartInteractive />
                            <TotalClicks />
                            <MostPopularOS />
                        </div>
                        <div>
                            <PieChartInteractive />
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