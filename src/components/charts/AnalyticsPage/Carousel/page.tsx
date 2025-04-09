import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { selectUserAnalyticsSummary, selectClicksByOperatingSystem, selectClicksByBrowser, selectTopReferrers, selectTopCountry, selectTopRegion, selectTopCity, selectTopUTMSource, selectTopUTMMedium, selectTopUTMCampaign, selectTopUTMTerm, selectTopUTMContent } from "@/store/selectors/clickSelectors"
import { AverageClicks } from "@/components/charts/AccountPage/AverageClicksPerLink/page"
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
import { MostPopularOS } from "@/components/charts/AccountPage/PopularOS/page"
import { TotalClicks } from "@/components/charts/AccountPage/TotalClicks/page"
import { useAppDispatch, useAppSelector } from "@/store/hooks"


export function CarouselAnalytics() {
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


    const charts = [
        <UniqueLinks key="unique-links" uniqueLinks={userAnalytics?.uniqueLinks} />,
        <TotalClicks key="total-clicks" totalClicks={userAnalytics?.totalClicks} />,
        <AverageClicks key="average-clicks" averageClicks={userAnalytics?.averageClicksPerLink} />,
        // <MostPopularLink key="most-popular-link" mostPopularLink={userAnalytics?.mostPopular} />,
        <MostPopularOS key="most-popular-os" os={osCounts} />,
        <MostPopularBrowser key="most-popular-browser" MostPopularBrowser={browserCounts} />,
        <TopReferrers key="top-referrers" topReferrers={topReferrers} />,
        <TopCountry key="top-country" topCountry={topCountry} />,
        <TopRegion key="top-region" topRegion={topRegion} />,
        <TopCity key="top-city" topCity={topCity} />,
        <TopUTMSource key="top-utm-source" topUTMSource={topUTMSource} />,
        <TopUTMMedium key="top-utm-medium" topUTMMedium={topUTMMedium} />,
        <TopUTMTerm key="top-utm-term" topUTMTerm={topUTMTerm} />,
        <TopUTMContent key="top-utm-content" topUTMContent={topUTMContent} />,
        <TopUTMCampaign key="top-utm-campaign" topUTMCampaign={topUTMCampaign} />,
    ];

    return (
        <Carousel className="w-full max-w-lg">
      {/* Set CarouselContent to a flex container with a gap */}
      <CarouselContent className="flex gap-4">
        {charts.map((chart, index) => (
          // On small screens, each item takes half width, on medium and above, one-third.
          <CarouselItem key={index} className="w-full sm:w-1/2 md:w-1/3">
            <div className="p-1">
              <Card >
                <CardContent className="flex items-center justify-center aspect-auto h-[370px]">
                  {chart}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    )
}
