"use client"

import { AppSidebar } from "@/components/app-sidebar"
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AreaChartInteractive } from "@/components/charts/AnalyticsPage/AreaChartInteractive/page"
import { BarChartBrowser } from "@/components/charts/AnalyticsPage/BarChartBrowser/page"
import { BarChartOS } from "@/components/charts/AnalyticsPage/BarChartOS/page"
import { ModeToggle } from "@/components/themeToggle"
import { CarouselAnalytics } from "@/components/charts/AnalyticsPage/Carousel/page"
import { LineChartLinks } from "@/components/charts/AnalyticsPage/LineChartLinks/page"
import { LineChartUTMSource } from "@/components/charts/AnalyticsPage/LineChartUTMSource/page"
import { LineChartUTMMedium } from "@/components/charts/AnalyticsPage/LineChartUTMMedium/page"
import { LineChartUTMCampaign } from "@/components/charts/AnalyticsPage/LineChartUTMCampaign/page"
import { LineChartUTMTerm } from "@/components/charts/AnalyticsPage/LineChartUTMTerm/page"
import { LineChartUTMContent } from "@/components/charts/AnalyticsPage/LineChartUTMContent/page"
import { PieChartReferrer } from "@/components/charts/AnalyticsPage/PieChartReferrer/page";
import { PieChartChannels } from "@/components/charts/AnalyticsPage/PieChartChannels/page";
import { PieChartCampaigns } from "@/components/charts/AnalyticsPage/PieChartCampaigns/page";
const DynamicMap = dynamic(() => import("@/components/charts/AnalyticsPage/MapLibreComp/page"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});
import { cn } from "@/lib/utils";

export default function Analytics() {

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
                        <div className="flex flex-row gap-4 p-4">
                            <PieChartReferrer />
                            <PieChartChannels />
                            <PieChartCampaigns />
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            <div className={cn(
                                "border-border/50 bg-background grid min-w-[8rem] items-start gap-4 rounded-lg border px-2.5 py-1.5 text-xs shadow-md",
                            )}>
                                <AccordionItem value="accordion-1" >
                                    <AccordionTrigger style={{ cursor: "pointer" }}>
                                        View UTM Parameters
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min mb-4">
                                            <LineChartLinks />
                                        </div>
                                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min mb-4">
                                            <LineChartUTMSource />
                                        </div>
                                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min mb-4">
                                            <LineChartUTMMedium />
                                        </div>
                                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min mb-4">
                                            <LineChartUTMCampaign />
                                        </div>
                                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min mb-4">
                                            <LineChartUTMTerm />
                                        </div>
                                        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min mb-4">
                                            <LineChartUTMContent />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </div>
                        </Accordion>
                        <div>
                            <Accordion type="single" collapsible className="w-full">
                                <div className={cn(
                                    "border-border/50 bg-background grid min-w-[8rem] items-start gap-4 rounded-lg border px-2.5 py-1.5 text-xs shadow-md",
                                )}>
                                    <AccordionItem value="accordion-1" >
                                        <AccordionTrigger style={{ cursor: "pointer" }}>
                                            View Geo Data
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min mb-4">
                                                <DynamicMap />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </div>
                            </Accordion>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}