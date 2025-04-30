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
import { fetchUser, selectUser, User, selectSubscription } from "@/store/slices/userSlice"
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
import AnimeCountdown from "@/components/anime-countdown"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useIsMobile } from "@/hooks/use-mobile"



export default function Account() {
    const { embeddedWalletInfo, caipAddress } = useAppKitAccount();
    const stripeSubscription = useAppSelector(selectSubscription)
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
    const [reactivateSub, setReactivateSub] = useState<boolean>()

    const isMobile = useIsMobile();

    const trialEnd = stripeSubscription?.data[0]?.trial_end



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

    }, [isConnected, caipAddress, dispatch, reactivateSub]);

    const handleReactivate = async () => {
        const customerId = userData?.stripeCustomerId;
        const deleteAt = userData?.deletionScheduledAt;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/stripe/reactivate-subscription`, { customerId, deleteAt })


        if (response.status === 200) {
            console.log('success')
            window.open(response.data.url, "_blank", "noopener noreferrer")
            setReactivateSub(true)
        }
    }


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
                                    {userData?.subscriptionStatus === "trialing" ?
                                        (<><BreadcrumbSeparator className="hidden md:block" /><BreadcrumbItem>
                                            <BreadcrumbPage><AnimeCountdown trialEnd={trialEnd} /></BreadcrumbPage>
                                        </BreadcrumbItem></>) : (<><BreadcrumbSeparator className="hidden md:block" /><BreadcrumbItem>
                                            <BreadcrumbPage>Basic Plan</BreadcrumbPage>
                                        </BreadcrumbItem></>)}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="absolute top-2 right-5">
                            <ModeToggle />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {userData?.subscriptionStatus === "canceled" ? (<div className="flex flex-col p-4 m-4 gap-12">
                            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                                Please re-activate your subscription to access features</h1>
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                If you do not re-activate your subscription by {new Date(userData?.deletionScheduledAt).toLocaleDateString()}, your data will be deleted.</h4>
                            <Button onClick={() => handleReactivate().catch((e) => console.error(e))} style={{ cursor: "pointer" }}>re-activate my subscription</Button>
                        </div>) : (
                            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                                <div className={`${isMobile ? "rounded-xl flex flex-1 justify-center flex-row p-4 gap-4" : "rounded-xl flex flex-1 flex-row p-4 gap-4"}`}>
                                    <UpdateEmail />
                                    <AccountDropdownMenu />
                                </div>
                                <div className={`${isMobile ? "flex flex-1 max-w-[400px] items-center flex-col gap-4 p-4" : "flex flex-1 flex-row gap-4 p-4"}`}>
                                    <UniqueLinks uniqueLinks={userAnalytics?.uniqueLinks} />
                                    <TotalClicks totalClicks={userAnalytics?.totalClicks} />
                                    <AverageClicks averageClicks={userAnalytics?.averageClicksPerLink} />
                                    <MostPopularLink mostPopularLink={userAnalytics?.mostPopular} />
                                </div>
                                <div className={`${isMobile ? "flex flex-1 max-w-[400px] items-center flex-col gap-4 p-4" : "flex flex-1 flex-row gap-4 p-4"}`}>
                                    <MostPopularOS os={osCounts} />
                                    <MostPopularBrowser MostPopularBrowser={browserCounts} />
                                    <TopReferrers topReferrers={topReferrers} />
                                    <TopCountry topCountry={topCountry} />
                                    <TopRegion topRegion={topRegion} />
                                    <TopCity topCity={topCity} />
                                </div>
                                <div className={`${isMobile ? "flex flex-1 max-w-[400px] items-center flex-col gap-4 p-4" : "flex flex-1 flex-row gap-4 p-4"}`}>
                                    <TopUTMSource topUTMSource={topUTMSource} />
                                    <TopUTMMedium topUTMMedium={topUTMMedium} />
                                    <TopUTMTerm topUTMTerm={topUTMTerm} />
                                    <TopUTMContent topUTMContent={topUTMContent} />
                                    <TopUTMCampaign topUTMCampaign={topUTMCampaign} />
                                </div>
                            </div>
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}