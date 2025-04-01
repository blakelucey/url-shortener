"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/userSlice";

interface TopReferrersProps {
    topReferrers: { referrer: string; count: number }[];
}

export function TopReferrers({ topReferrers }: TopReferrersProps) {
    // Sort the topReferrers array by count (highest first)
    const sortedReferrers = [...topReferrers].sort((a, b) => b.count - a.count);
    const user: any = useAppSelector(selectUser);
    const createdAt = new Date(user?.user?.createdAt).toDateString();

    console.log('top referers', topReferrers)

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>All Time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {sortedReferrers.slice(0, 5).map(({ referrer, count }) => (
                    <div key={referrer} className="mb-2">
                        <span className="font-bold">{referrer}</span>: {count}
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing data since: {createdAt}
                </div>
            </CardFooter>
        </Card>
    );
}