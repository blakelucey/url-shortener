"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/userSlice";

interface TopCountryProps {
  topCountry: { country: string; count: number } | null;
}

export function TopCountry({ topCountry }: TopCountryProps) {
  const user: any = useAppSelector(selectUser);
  const createdAt = new Date(user?.user?.createdAt).toDateString();

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Country</CardTitle>
        <CardDescription>All Time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {topCountry ? (
          <div className="mb-2">
            <span className="font-bold">{topCountry.country}</span>: {topCountry.count}
          </div>
        ) : (
          <div className="mb-2">No data available</div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing data since: {createdAt}
        </div>
      </CardFooter>
    </Card>
  );
}