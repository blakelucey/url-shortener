import { CalendarDays } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardPricing() {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <p className="text-secondary" style={{ cursor: "pointer" }}>14-day free trial</p>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Pricing:</h4>
                        <li>
                            14-day free trial.
                        </li>
                        <li>
                            $1 monthly flat fee.
                        </li>
                        <li>
                            Usage based billing: $0.0005/click, $0.01/link
                        </li>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
