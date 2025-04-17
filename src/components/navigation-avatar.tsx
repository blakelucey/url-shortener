import React, { useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { selectUser, User } from "@/store/slices/userSlice"
import { useAppSelector } from "@/store/hooks"

export function NavigationAvatar() {
    const user: any = useAppSelector(selectUser)
    const [userData, setUserData] = useState<User>(user?.user)

    return (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{userData?.firstName[0] + userData?.lastName[0]}</AvatarFallback>
        </Avatar>
    )
}
