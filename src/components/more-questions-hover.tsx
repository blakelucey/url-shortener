import { CalendarDays, Contact } from "lucide-react"

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
import { ContactDialog } from "./contact-dialog"
import { useState } from "react"

export function MoreQuestions() {
    const [contact, setContact] = useState<boolean>(false)
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link" style={{ cursor: "pointer" }}>More questions?</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Button variant={"link"} style={{ cursor: "pointer" }} onClick={() => setContact(true)}>
                        Contact Us
                    </Button>
                    <Button variant={"link"} style={{ cursor: "pointer" }} onClick={() => console.log('sign up')}>
                        Sign Up
                    </Button>
                </div>
            </HoverCardContent>
            {contact && <ContactDialog open={contact} onOpenChange={setContact} />}
        </HoverCard>
    )
}
