import React from 'react'
import { NavigationMenuUI } from '@/components/navigation-menu'
import Footer from '@/components/footer'

export default function AboutPage() {
  return (
    <div>
      <div className="fixed top-5 left-5">
        <NavigationMenuUI />
      </div>
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-foreground">About kliqly.link</h1>
        <p className="text-muted-foreground text-lg mb-4">
          kliqly.link is a smart redirection platform designed for the modern internet — creators, builders, marketers, and developers who want control, insights, and simplicity.
        </p>
        <p className="text-muted-foreground text-lg mb-4">
          We’re not here to sell bloated enterprise dashboards or lock your data behind a paywall. We’re here to deliver:
        </p>
        <ul className="list-disc list-inside text-muted-foreground text-lg mb-4 space-y-2">
          <li>Instant link shortening</li>
          <li>Clean, privacy-respecting analytics</li>
          <li>Custom domains (coming soon)</li>
          <li>Lightning-fast redirects</li>
        </ul>
        <p className="text-muted-foreground text-lg mb-4">
          Our mission is simple: <strong>make linking smarter and more ethical</strong>—without adding friction.
        </p>
        <p className="text-muted-foreground text-lg mb-4">
          We're not backed by VCs (yet), and we're not trying to harvest your data to build an ad empire. We're a lean team shipping fast, listening closely, and building what we actually want to use.
        </p>
        <p className="text-muted-foreground text-lg">
          Got feedback? Want to collaborate? Just want to chat? <a href="mailto:support@kliqly.link" className="underline hover:text-foreground">Email us</a> — we read everything.
        </p>
      </main>
      <Footer/>
    </div>
  )
}