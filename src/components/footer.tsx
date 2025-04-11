"use client";
import React, { useState } from 'react'
import { Icons } from './icons'
import { ContactDialog } from './contact-dialog';

const Footer = () => {
  const [contact, setContact] = useState<boolean>(false)
  return (
    <footer className="fixed bottom-0 left-0 w-full border-t border-muted bg-background z-50">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">kliqly.link</span>. All rights reserved.</p>
        </div>

        <div className="flex gap-6 text-center">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a onClick={() => setContact(true)} style={{ cursor: "pointer" }} className="hover:underline">Contact</a>
        </div>

        <div className="flex gap-4 items-center justify-center">
          <a href="https://x.com/kliqlylink" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-foreground transition-colors">
            <Icons.Linkedin />
          </a>
          <a href="https://github.com/kliqly" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-foreground transition-colors">
            <Icons.Github />
          </a>
          <a href="mailto:support@kliqly.link" aria-label="Email" className="hover:text-foreground transition-colors">
            <Icons.Mail />
          </a>
        </div>
      </div>
      {contact && <ContactDialog open={contact} onOpenChange={setContact} />}
    </footer>
  )
}

export default Footer