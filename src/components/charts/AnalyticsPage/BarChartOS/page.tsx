"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAppSelector } from "@/store/hooks"
import { selectClicksByOSOverTime, selectMonthlyClicks } from "@/store/selectors/clickSelectors"
import { TrendingDown, TrendingUp } from "lucide-react"

const chartConfig = {
    visitors: { label: "Visitors" },
    windows: { label: "Windows", color: "hsl(var(--chart-1))" },
    macOs: { label: "Mac OS", color: "hsl(var(--chart-2))" },
    ios: { label: "iOS", color: "hsl(var(--chart-3))" },
    android: { label: "Android", color: "hsl(var(--chart-4))" },
    other: { label: "Other", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

export function BarChartOS() {
    // Fixed time range: Last 6 months (approx. 180 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 180);
    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();

    // Get os data for this fixed range.
    const osData = useAppSelector((state) =>
        selectClicksByOSOverTime(state, startDateISO, endDateISO)
    );

    // Map each data point to include a fill color from chartConfig.

    const coloredData = useMemo(() => {
        const knownOS = ["windows", "macOs", "ios", "android", "other"] as const;
        return osData.map((item) => {
            // Convert the os name to lowercase.
            const key = item.os.toLowerCase();
            // If the key is not one of the known os, default to "other".
            const osKey: typeof knownOS[number] =
                knownOS.includes(key as any) ? key as typeof knownOS[number] : "other";
            return { ...item, fill: chartConfig[osKey].color };
        });
    }, [osData]);

    // Compute monthly trend from monthlyCounts for the CardFooter.
    const monthlyCounts = useAppSelector(selectMonthlyClicks);
    const monthlyTrend = useMemo(() => {
        const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
            Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
        };

        const monthlyArray = Object.entries(monthlyCounts)
            .map(([monthLabel, count]) => {
                // Assume monthLabel is in the format "Jun 2024"
                const [mon, year] = monthLabel.split(" ");
                const formattedDate = `${year}-${monthMap[mon]}-01`;
                return { monthLabel, count, date: new Date(formattedDate) };
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        if (monthlyArray.length < 2) return null;
        const previous = monthlyArray[monthlyArray.length - 2];
        const latest = monthlyArray[monthlyArray.length - 1];
        if (previous.count === 0) return null;
        return ((latest.count - previous.count) / previous.count) * 100;
    }, [monthlyCounts]);

    return (
        <div className="bar-chart-interactive">
            <Card>
                <CardHeader>
                    <CardTitle>OS Clicks</CardTitle>
                    <CardDescription>
                        Total clicks by OS for the last 6 months
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer className="aspect-auto h-[250px] w-full" config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            layout="vertical"
                            data={coloredData}
                            margin={{ left: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <YAxis
                                dataKey="os"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tickFormatter={(value) => value.toLowerCase()}
                            />
                            <XAxis dataKey="visitors" type="number" hide />
                            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                            <Bar dataKey="visitors" radius={5}>
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        {monthlyTrend !== null ? (
                            <>
                                Trending {monthlyTrend > 0 ? "up" : "down"} by {Math.abs(monthlyTrend).toFixed(1)}% this month{" "}
                                {monthlyTrend > 0 ? (
                                    <TrendingUp className="h-4 w-4" />
                                ) : (
                                    <TrendingDown className="h-4 w-4" />
                                )}
                            </>
                        ) : (
                            "Insufficient data for trend"
                        )}
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing common OS clicks for {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}