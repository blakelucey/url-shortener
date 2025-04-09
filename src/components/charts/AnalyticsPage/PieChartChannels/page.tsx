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
import { selectChannelsBreakdownFromClicks } from "@/store/selectors/linkSelectors"

const chartConfig = {} satisfies ChartConfig;

const colorMap: Record<string, string> = {};

function getDynamicColor(channel: string): string {
  if (!colorMap[channel]) {
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))'
    ];
    // Pick a random index
    const randomIndex = Math.floor(Math.random() * colors.length);
    colorMap[channel] = colors[randomIndex];
  }
  return colorMap[channel];
}

export function PieChartChannels() {
  // Use the combined selector that aggregates channels from clicks.
  const channelsData = useAppSelector(selectChannelsBreakdownFromClicks)

  // Format the data (each object will have a "category" key for the channel name and a count).
  const groupedData = useMemo(() => {
    return channelsData.map((item) => ({
      category: item.channel, // Use the channel name from your selector.
      count: item.count,
    }))
  }, [channelsData])

  // Total clicks (aggregated from all channels).
  const totalClicks = useMemo(() => {
    return groupedData.reduce((acc, curr) => acc + curr.count, 0)
  }, [groupedData])

  // Compute the timeframe as the last 6 months from today's date.
  const timeframe = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return `${sixMonthsAgo.toLocaleDateString("en-US", { month: "long", year: "numeric" })} - ${now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
  }, []);

  // Since your aggregated channels data doesn't include timestamps, we'll display no trend.
  const mostProminentTrend: any = undefined;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Channels</CardTitle>
        <CardDescription>{timeframe}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer className="mx-auto aspect-square max-h-[250px]" config={chartConfig}>
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
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalClicks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Clicks
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
              {groupedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getDynamicColor(entry.category)}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {mostProminentTrend ? (
            mostProminentTrend.trend > 0 ? (
              <>
                Trending up by {Math.abs(mostProminentTrend.trend).toFixed(1)}% in{" "}
                {mostProminentTrend.category} <TrendingUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Trending down by {Math.abs(mostProminentTrend.trend).toFixed(1)}% in{" "}
                {mostProminentTrend.category} <TrendingDown className="h-4 w-4" />
              </>
            )
          ) : (
            <div className="flex items-center gap-2 font-medium leading-none">
              No significant trend
            </div>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing channel clicks for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}