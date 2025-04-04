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
import { selectUser } from "@/store/slices/userSlice"
import { useAppSelector } from "@/store/hooks"
import { AreaChartInteractive } from "@/components/charts/AnalyticsPage/AreaChartInteractive/page"
import { BarChartBrowser } from "@/components/charts/AnalyticsPage/BarChartBrowser/page"
import { BarChartOS } from "@/components/charts/AnalyticsPage/BarChartOS/page"
import { ModeToggle } from "@/components/themeToggle"
import { CarouselAnalytics } from "@/components/charts/AnalyticsPage/Carousel/page"
import { LineChartLinks } from "@/components/charts/AnalyticsPage/LineChartLinks/page"

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

    }, [isConnected, caipAddress, user]);

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
                        <div className="absolute top-2 right-5">
                            <ModeToggle />
                        </div>
                    </header>

                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                            <AreaChartInteractive />
                        </div>
                        <div className="flex flex-row gap-4 p-4">
                            <BarChartBrowser />
                            <BarChartOS />
                            <div className="mx-auto">
                                <CarouselAnalytics />
                            </div>
                        </div>
                        <div>
                        </div>
                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                            <LineChartLinks />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}