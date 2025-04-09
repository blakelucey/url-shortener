"use client"

import * as React from "react"
import { useMemo } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useAppSelector } from "@/store/hooks"
import { selectAllReferrersWithTime } from "@/store/selectors/clickSelectors"

// Broad categories config.
const chartConfig = {
    social: { label: "Social", color: "hsl(var(--chart-1))" },
    email: { label: "Email", color: "hsl(var(--chart-2))" },
    search: { label: "Search", color: "hsl(var(--chart-3))" },
    direct: { label: "Direct", color: "hsl(var(--chart-4))" },
    other: { label: "Other", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

/**
 * Helper to determine the broad category from a referrer string.
 */
function getReferrerCategory(referrer: string): string {
    const r = referrer.toLowerCase()
    if (
        r.includes("facebook") ||
        r.includes("twitter") ||
        r.includes("instagram") ||
        r.includes("linkedin") ||
        r.includes("pinterest")
    ) {
        return "social"
    } else if (r.includes("mail") || r.includes("newsletter") || r.includes("email")) {
        return "email"
    } else if (r.includes("google") || r.includes("bing") || r.includes("yahoo") || r.includes("search")) {
        return "search"
    } else if (r.includes("direct")) {
        return "direct"
    }
    return "other"
}

export function PieChartReferrer() {
    // referrers is now expected to have { referrer: string; count: number; timestamp: string }
    const referrers = useAppSelector(selectAllReferrersWithTime)

    // Group referrer data into broad categories for the PieChart.
    const groupedData = useMemo(() => {
        const groups: Record<string, { category: string; count: number }> = {}
        referrers.forEach((item) => {
            const category = getReferrerCategory(item.referrer)
            if (!groups[category]) {
                groups[category] = { category, count: 0 }
            }
            groups[category].count += item.count
        })
        return Object.values(groups)
    }, [referrers])

    // Total visitors across all groups.
    const totalVisitors = useMemo(() => {
        return groupedData.reduce((acc, curr) => acc + curr.count, 0)
    }, [groupedData])

    // Compute the most prominent referrer trend by comparing two 30-day periods.
    const mostProminentTrend = useMemo(() => {
        if (referrers.length === 0) return undefined

        // Get the maximum date from all items using the timestamp field.
        const maxTimestamp = Math.max(...referrers.map((item) => new Date(item.timestamp).getTime()))
        const maxDate = new Date(maxTimestamp)

        const oneDayMs = 24 * 60 * 60 * 1000
        const currentStart = new Date(maxDate.getTime() - 30 * oneDayMs)
        const previousStart = new Date(currentStart.getTime() - 30 * oneDayMs)

        // Group counts for current and previous periods per category.
        const trends: Record<string, { current: number; previous: number; trend?: number }> = {}
        referrers.forEach((item) => {
            const category = getReferrerCategory(item.referrer)
            const ts = new Date(item.timestamp)
            if (!trends[category]) {
                trends[category] = { current: 0, previous: 0 }
            }
            if (ts >= currentStart && ts <= maxDate) {
                trends[category].current += item.count
            } else if (ts >= previousStart && ts < currentStart) {
                trends[category].previous += item.count
            }
        })

        // Compute the percentage change (trend) for each category.
        Object.keys(trends).forEach((category) => {
            const { current, previous } = trends[category]
            trends[category].trend = previous > 0 ? ((current - previous) / previous) * 100 : undefined
        })

        // Choose the category with the largest absolute percentage change.
        let prominent: { category: string; trend: number } | undefined = undefined
        for (const category in trends) {
            const trendValue = trends[category].trend
            if (trendValue !== undefined && !isNaN(trendValue)) {
                if (prominent === undefined || Math.abs(trendValue) > Math.abs(prominent.trend)) {
                    prominent = { category, trend: trendValue }
                }
            }
        }
        return prominent
    }, [referrers])

    // Compute timeframe as the last 6 months from today's date.
    const timeframe = useMemo(() => {
        const now = new Date()
        const sixMonthsAgo = new Date(now)
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        return `${sixMonthsAgo.toLocaleDateString("en-US", { month: "long", year: "numeric" })} - ${now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
    }, [])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Referrers</CardTitle>
                <CardDescription>{timeframe}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            offset={20}
                            wrapperStyle={{ transform: "translate(16px, -16px)" }}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={groupedData}
                            dataKey="count"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                    Clicks
                                                </tspan>
                                            </text>
                                        )
                                    }
                                    return null
                                }}
                            />
                            {groupedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        chartConfig[entry.category as keyof typeof chartConfig]?.color ||
                                        chartConfig.other.color
                                    }
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {mostProminentTrend ? (
                    <div className="flex items-center gap-2 font-medium leading-none">
                        {mostProminentTrend.trend > 0 ? (
                            <>
                                Trending up by {Math.abs(mostProminentTrend.trend).toFixed(1)}% in{" "}
                                {chartConfig[mostProminentTrend.category as keyof typeof chartConfig]?.label ||
                                    mostProminentTrend.category}{" "}
                                <TrendingUp className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Trending down by {Math.abs(mostProminentTrend.trend).toFixed(1)}% in{" "}
                                {chartConfig[mostProminentTrend.category as keyof typeof chartConfig]?.label ||
                                    mostProminentTrend.category}{" "}
                                <TrendingDown className="h-4 w-4" />
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 font-medium leading-none">
                        No significant trend
                    </div>
                )}
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}