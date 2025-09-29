import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUser } from '@/hooks/use-current-user';

export function NavigationAvatar() {
    const { user } = useCurrentUser();

    const initials = React.useMemo(() => {
        if (!user?.firstName && !user?.lastName) {
            return '??';
        }
        const first = user?.firstName?.[0] ?? '';
        const last = user?.lastName?.[0] ?? '';
        const combined = `${first}${last}`.trim();
        return combined.length > 0 ? combined.toUpperCase() : '??';
    }, [user?.firstName, user?.lastName]);

    return (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    )
}
