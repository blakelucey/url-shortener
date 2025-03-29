"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { selectUser, User } from "@/store/slices/userSlice"

interface MostPopularBrowserProps {
    MostPopularBrowser: {
        [browser: string]: number;
    };
}

export function MostPopularBrowser({ MostPopularBrowser }: MostPopularBrowserProps) {
    // Convert the os object into an array of [osName, count] pairs.
    const osEntries = Object.entries(MostPopularBrowser);
    const user: any = useAppSelector(selectUser)

    const createdAt = new Date(user?.user?.createdAt).toDateString()

    // Optionally, sort by count (highest first)
    const sortedOSEntries = osEntries.sort(([, aCount], [, bCount]) => bCount - aCount);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Most Popular Browser</CardTitle>
                <CardDescription>All Time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {sortedOSEntries.map(([osName, count]) => (
                    <div key={osName} className="mb-2">
                        <span className="font-bold">{osName}</span>: {count}
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