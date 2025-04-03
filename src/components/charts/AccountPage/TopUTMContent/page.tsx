"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/userSlice";

interface TopUTMContentProps {
    topUTMContent: {
        utm_content: string;
        count: number;
    } | null;
}

export function TopUTMContent({ topUTMContent }: TopUTMContentProps) {
    const user: any = useAppSelector(selectUser);
    const createdAt = new Date(user?.user?.createdAt).toDateString();

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Top utm_content</CardTitle>
                <CardDescription>All Time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {topUTMContent ? (
                    <div className="mb-2">
                        <span className="font-bold">{topUTMContent.utm_content}</span>: {topUTMContent.count}
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