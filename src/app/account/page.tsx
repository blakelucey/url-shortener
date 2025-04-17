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
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { ModeToggle } from "@/components/themeToggle"
import { fetchUser, selectUser, User } from "@/store/slices/userSlice"
import { MostPopularOS } from "@/components/charts/AccountPage/PopularOS/page"
import { TotalClicks } from "@/components/charts/AccountPage/TotalClicks/page"
import UpdateEmail from "@/components/update-email"
import { AccountDropdownMenu } from "@/components/account-dropdown"
import { selectUserAnalyticsSummary, selectClicksByOperatingSystem, selectClicksByBrowser, selectTopReferrers, selectTopCountry, selectTopRegion, selectTopCity, selectTopUTMSource, selectTopUTMMedium, selectTopUTMCampaign, selectTopUTMTerm, selectTopUTMContent } from "@/store/selectors/clickSelectors"
import { AverageClicks } from "@/components/charts/AccountPage/AverageClicksPerLink/page"
import { MostPopularLink } from "@/components/charts/AccountPage/MostPopularLink/page"
import { UniqueLinks } from "@/components/charts/AccountPage/UniqueLinks/page"
import { MostPopularBrowser } from "@/components/charts/AccountPage/PopularBrowser/page"
import { TopReferrers } from "@/components/charts/AccountPage/TopReferrers/page"
import { TopCountry } from "@/components/charts/AccountPage/TopCountry/page"
import { TopRegion } from "@/components/charts/AccountPage/TopRegion/page"
import { TopCity } from "@/components/charts/AccountPage/TopCity/page"
import { TopUTMSource } from "@/components/charts/AccountPage/TopUTMSource/page"
import { TopUTMMedium } from "@/components/charts/AccountPage/TopUTMMedium/page"
import { TopUTMTerm } from "@/components/charts/AccountPage/TopUTMTerm/page"
import { TopUTMContent } from "@/components/charts/AccountPage/TopUTMContent/page"
import { TopUTMCampaign } from "@/components/charts/AccountPage/TopUTMCampaign/page"



export default function Account() {
    const { embeddedWalletInfo, caipAddress } = useAppKitAccount();
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
    const topUTMTerm = useAppSelector(selectTopUTMTerm);
    const topUTMContent = useAppSelector(selectTopUTMContent);
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

    }, [isConnected, caipAddress, dispatch]);

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
                                        <BreadcrumbPage>Paid Account: {userData?.isBasic === false ? 'No' : userData?.isBasic === true ? 'Yes' : ""}</BreadcrumbPage>
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
                            <div className="rounded-xl flex flex-1 flex-row p-4 gap-4">
                                <UpdateEmail />
                                <AccountDropdownMenu />
                            </div>
                            <div className="flex flex-1 flex-row gap-4 p-4">
                                <UniqueLinks uniqueLinks={userAnalytics?.uniqueLinks} />
                                <TotalClicks totalClicks={userAnalytics?.totalClicks} />
                                <AverageClicks averageClicks={userAnalytics?.averageClicksPerLink} />
                                <MostPopularLink mostPopularLink={userAnalytics?.mostPopular} />
                            </div>
                            <div className="flex flex-1 flex-row gap-4 p-4">
                                <MostPopularOS os={osCounts} />
                                <MostPopularBrowser MostPopularBrowser={browserCounts} />
                                <TopReferrers topReferrers={topReferrers} />
                                <TopCountry topCountry={topCountry} />
                                <TopRegion topRegion={topRegion} />
                                <TopCity topCity={topCity} />
                            </div>
                            <div className="flex flex-1 flex-row gap-4 p-4">
                                <TopUTMSource topUTMSource={topUTMSource} />
                                <TopUTMMedium topUTMMedium={topUTMMedium} />
                                <TopUTMTerm topUTMTerm={topUTMTerm} />
                                <TopUTMContent topUTMContent={topUTMContent} />
                                <TopUTMCampaign topUTMCampaign={topUTMCampaign} />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}