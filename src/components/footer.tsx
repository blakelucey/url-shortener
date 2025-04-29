"use client";
import React, { useState } from 'react'
import { Icons } from './icons'
import { ContactDialog } from './contact-dialog';
import Link from 'next/link';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const [contact, setContact] = useState<boolean>(false)

  const isMobile = useIsMobile();
  return (
    <footer className={`${isMobile ? "bottom-0 left-0 w-full border-t border-muted bg-background z-50" : "fixed bottom-0 left-0 w-full border-t border-muted bg-background z-50"}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">kliqly.link</span>. All rights reserved.</p>
        </div>

        <div className="flex gap-6 text-center">
          <Button onClick={() => window.open("/privacy", '_blank', 'noopener noreferrer')} style={{ cursor: "pointer" }} variant="link" className="hover:underline">Privacy</Button>
          <Button onClick={() => window.open("/terms", '_blank', 'noopener noreferrer')} style={{ cursor: "pointer" }} variant="link" className="hover:underline">Terms</Button>
          <Button onClick={() => setContact(true)} style={{ cursor: "pointer" }} variant="link" className="hover:underline">Contact</Button>
        </div>

        <div className="flex gap-4 items-center justify-center">
          <Button onClick={() => window.open("https://www.linkedin.com/company/kliqly-link", '_blank', 'noopener noreferrer')} variant="link" style={{ cursor: "pointer" }} aria-label="LinkedIn" className="hover:text-foreground transition-colors">
            <Icons.Linkedin />
          </Button>
          <Button onClick={() => window.open("mailto:support@kliqly.link", "_blank", "noopener, noreferrer")} variant="link" style={{ cursor: "pointer" }} aria-label="Email" className="hover:text-foreground transition-colors">
            <Icons.Mail />
          </Button>
        </div>
      </div>
      {contact && <ContactDialog open={contact} onOpenChange={setContact} />}
    </footer>
  )
}

export default Footer