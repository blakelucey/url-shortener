"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppSelector } from "@/store/hooks"
import { selectClicksByDateAndDevice } from "@/store/selectors/clickSelectors"
import { cn } from "@/lib/utils"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  date: {
    label: "Date",
    color: "hsl(var(--primary-))",
  },
};

export function AreaChartInteractive() {
  const [timeRange, setTimeRange] = useState("7d")
  const clicksData = useAppSelector(selectClicksByDateAndDevice)

  const { filteredData, domain } = useMemo(() => {
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7

    const endDate = new Date()
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    const domain = [startDate.getTime(), endDate.getTime()]

    const filteredData = clicksData
      .filter(item => {
        const ts = new Date(item.date).getTime()
        return ts >= domain[0] && ts <= domain[1]
      })
      .map(item => ({
        ...item,
        date: new Date(item.date).getTime(),
      }))

    return { filteredData, domain }
  }, [clicksData, timeRange])

  const CustomTooltip = ({ active = false, payload = [], label = "" }) => {

    if (!active || !payload.length) return null;

    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString("en-US", {

        month: "short",
        day: "numeric",
      });
      return (
        <div
          className={cn(
            "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
          )}
        >          <p className="font-bold">{date}</p>
          {payload.map((item: { name: string | number; value: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }, index: React.Key | null | undefined) => (
            <p key={index}>
              {chartConfig[item.name as keyof typeof chartConfig]?.label}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total clicks for the selected time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} margin={{ top: 20 }}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={domain}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(date) => {
                const newDate = new Date(date)
                return newDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              stroke="var(--color-mobile)"
              stackId="a"
              connectNulls={false}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              stroke="var(--color-desktop)"
              stackId="a"
              connectNulls={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}