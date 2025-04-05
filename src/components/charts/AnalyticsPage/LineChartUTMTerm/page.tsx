"use client"

import * as React from "react";
import { useMemo, useState } from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { selectClicksByUTMComparisonOverTime, selectAllLinks, selectUTMTermCounts } from "@/store/selectors/clickSelectors";
import { TrendingUp, TrendingDown } from "lucide-react";

const chartConfig = {
    desktop: {
        label: "Primary",
        color: "var(--color-primary)",
    },
    mobile: {
        label: "Comparison",
        color: "var(--color-secondary)",
    },
} satisfies { [key: string]: { label: string; color: string } };

export function LineChartUTMTerm() {
    // Local state for UTM selections.
    // You can default these to any valid UTM source value from your dataset.
    const [primaryValue, setPrimaryValue] = useState("primary");
    const [comparisonValue, setComparisonValue] = useState("comparison");

    // Retrieve all links (if you want to show link-specific info in the UI).
    const utm_term = useAppSelector(selectUTMTermCounts);

    // Retrieve dynamic time-series data for utm_term using our selector.
    const utmData = useAppSelector((state) =>
        selectClicksByUTMComparisonOverTime(state, "utm_term", primaryValue, comparisonValue)
    );

    // Compute total clicks over the period for each UTM value.
    const totalPrimary = useMemo(
        () => utmData.reduce((acc, curr) => acc + curr.primary, 0),
        [utmData]
    );
    const totalComparison = useMemo(
        () => utmData.reduce((acc, curr) => acc + curr.comparison, 0),
        [utmData]
    );

    // Compute trend percentage.
    const trendPercentage = useMemo(() => {
        if (totalComparison === 0) return null;
        return ((totalPrimary - totalComparison) / totalComparison) * 100;
    }, [totalPrimary, totalComparison]);

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-4">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>UTM Term Comparison</CardTitle>
                    <CardDescription>
                        Comparing clicks between "{primaryValue}" and "{comparisonValue}" over the last 3 months.
                    </CardDescription>
                    <div className="flex gap-2">
                        <Select value={primaryValue} onValueChange={setPrimaryValue}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select primary UTM" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Primary UTM Term</SelectLabel>
                                    {Object.keys(utm_term).map((source) => {
                                        return (
                                            <SelectItem value={source} key={source}>
                                                {source}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select value={comparisonValue} onValueChange={setComparisonValue}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select comparison UTM" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Comparison UTM Term</SelectLabel>
                                    {Object.keys(utm_term).map((source) => {
                                        return (
                                            <SelectItem value={source} key={source}>
                                                {source}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <LineChart data={utmData} accessibilityLayer margin={{ right: 12, left: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <YAxis hide />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }
                                />
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="primary"
                            stroke={chartConfig.desktop.color}
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="comparison"
                            stroke={chartConfig.mobile.color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    {trendPercentage !== null ? (
                        trendPercentage > 0 ? (
                            <>
                                Trending up by {Math.abs(trendPercentage).toFixed(1)}% this month{" "}
                                <TrendingUp className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Trending down by {Math.abs(trendPercentage).toFixed(1)}% this month{" "}
                                <TrendingDown className="h-4 w-4" />
                            </>
                        )
                    ) : (
                        "Insufficient data for trend"
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}