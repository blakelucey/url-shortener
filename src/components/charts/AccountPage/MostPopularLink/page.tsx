"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/userSlice";

interface MostPopularLinkProps {
    mostPopularLink: { linkId: string; count: number, originalUrl: string, shortUrl: string };
}

export function MostPopularLink({ mostPopularLink }: MostPopularLinkProps) {
    const user: any = useAppSelector(selectUser);
    const createdAt = new Date(user?.user?.createdAt).toDateString();

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Most Popular Link</CardTitle>
                <CardDescription>All Time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="mb-2">
                    <span >{mostPopularLink?.originalUrl}</span><br />
                    <br />
                    <span>{mostPopularLink?.shortUrl}</span><br />
                    <br />
                    <span className="font-bold">Clicks</span>: {mostPopularLink.count}
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing data since: {createdAt}
                </div>
            </CardFooter>
        </Card>
    );
}