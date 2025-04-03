"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,

} from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks";
import { selectUser, User } from "@/store/slices/userSlice"

interface UniqueLinksProps {
    uniqueLinks: number
}

export function UniqueLinks({uniqueLinks}: UniqueLinksProps) {
    const user: any = useAppSelector(selectUser)

    const createdAt = new Date(user?.user?.createdAt).toDateString()
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center flex-col gap-4 pb-0">
                <CardTitle>Total Unique Links</CardTitle>
                <CardDescription>All Time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {uniqueLinks}
                </h1>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Showing data since: {createdAt}
                </div>
            </CardFooter>
        </Card>
    )
}
