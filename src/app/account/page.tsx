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
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { ModeToggle } from "@/components/themeToggle"
import { fetchUser, selectUser, User } from "@/store/slices/userSlice"
import { MostPopularOS } from "@/components/charts/PopularOS/page"
import { TotalClicks } from "@/components/charts/TotalClicks/page"
import UpdateEmail from "@/components/update-email"
import { AccountDropdownMenu } from "@/components/account-dropdown"
import { selectUserAnalyticsSummary, selectClicksByOperatingSystem, selectClicksByBrowser, selectTopReferrers, selectTopCountry, selectTopRegion, selectTopCity, selectTopUTMSource, selectTopUTMMedium, selectTopUTMCampaign, selectTopUTMTerm, selectTopUTMContent } from "@/store/selectors/clickSelectors"
import { AverageClicks } from "@/components/charts/AverageClicksPerLink/page"
import { MostPopularLink } from "@/components/charts/MostPopularLink/page"
import { UniqueLinks } from "@/components/charts/UniqueLinks/page"
import { MostPopularBrowser } from "@/components/charts/PopularBrowser/page"
import { TopReferrers } from "@/components/charts/TopReferrers/page"
import { TopCountry } from "@/components/charts/TopCountry/page"



export default function Account() {
    const { embeddedWalletInfo, caipAddress } = useAppKitAccount();
    const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
    const { isConnected, address } = useAccount();
    const user: any = useAppSelector(selectUser)
    const [userData, setUserData] = useState<User>(user?.user)
    const userAnalytics = useAppSelector(selectUserAnalyticsSummary);
    const osCounts = useAppSelector(selectClicksByOperatingSystem);
    const browserCounts = useAppSelector(selectClicksByBrowser)
    const topReferrers = useAppSelector(selectTopReferrers)
    const topCountry = useAppSelector(selectTopCountry);
    const topRegion = useAppSelector(selectTopRegion);
    const topCity = useAppSelector(selectTopCity);
    const topUTMSource = useAppSelector(selectTopUTMSource);
    const topUTMMedium = useAppSelector(selectTopUTMMedium);
    const topUTMCTerm = useAppSelector(selectTopUTMTerm);
    const topUTMCContent = useAppSelector(selectTopUTMContent);
    const topUTMCampaign = useAppSelector(selectTopUTMCampaign);



    console.log('osCounts', osCounts);
    console.log('browserCounts', browserCounts)

    console.log('userAnalytics', userAnalytics)

    const createdDate = new Date(userData?.createdAt).toDateString()

    console.log('userData', userData)

    const dispatch = useAppDispatch()


    useEffect(() => {
        console.log('isConnected:', isConnected);
        console.log('caipAddress:', caipAddress);

        try {
            if (caipAddress) {
                dispatch(fetchUser(caipAddress)).catch((e) => {
                    console.error(e)
                })
            }
        }
        catch (e) {
            console.error(e)
        }

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
                                        <BreadcrumbLink href="/Account">Account</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{userData?.firstName} {userData?.lastName}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Account Created: {createdDate}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Paid Account: {userData?.isPro === false ? 'No' : userData?.isPro === true ? 'Yes' : ""}</BreadcrumbPage>
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
                            <div className="rounded-xl p-2 ml-auto flex items-center space-x-2 gap-4">
                                <UpdateEmail />
                                <AccountDropdownMenu />
                            </div>
                            <div className="flex flex-1 flex-row gap-4 p-4">

                                <TotalClicks totalClicks={userAnalytics?.totalClicks} />
                                <MostPopularOS os={osCounts} />
                                <AverageClicks averageClicks={userAnalytics?.averageClicksPerLink} />
                                <MostPopularLink mostPopularLink={userAnalytics?.mostPopular} />
                            </div>
                            <div className="flex flex-1 flex-row gap-4 p-4">
                                <UniqueLinks uniqueLinks={userAnalytics?.uniqueLinks} />
                                <MostPopularBrowser MostPopularBrowser={browserCounts} />
                                <TopReferrers topReferrers={topReferrers} />
                                <TopCountry topCountry={topCountry} />
                            </div>
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