import React from 'react'
import { BarChartDemo } from './charts/AnalyticsPreview/BarChartDemo/page'
import { AreaChartDemo } from './charts/AnalyticsPreview/AreaChartDemo/page'
import { LineChartDemo } from './charts/AnalyticsPreview/LineChartDemo/page'
import { PieChartDemo } from './charts/AnalyticsPreview/PieChartDemo/page'
import { BarChartOSDemo } from './charts/AnalyticsPreview/BarChartOSDemo/page'
import { BarChartBrowserDemo } from './charts/AnalyticsPreview/BarChartBrowserDemo/page'
import { useIsMobile } from '@/hooks/use-mobile'

const AnalyticsPreview = () => {
    const isMobile = useIsMobile();
    return (
        <>
        <div className='p-4'>
            <div>
                <h1 className="font-bold tracking-tight lg:text-5xl my-8">
                    All the analytics you could ever need
                </h1>
            </div>
            <div className="analytics-page">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                        <BarChartDemo />
                        <div className={`${isMobile ? "flex flex-1 flex-column gap-2 p-4 overflow-scroll" : "flex flex-row gap-15 p-4"}`}>
                            <AreaChartDemo />
                            <LineChartDemo />
                            <PieChartDemo />
                            <BarChartOSDemo />
                            <BarChartBrowserDemo />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default AnalyticsPreview