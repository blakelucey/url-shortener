"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { logFn } from "../../logging/logging"
const log = logFn("src.components.PostHogProvider.tsx.")



export function PostHogProvider({ children }: { children: React.ReactNode }) {
  log("checkingWindow", "debug", {
    typeofWindow: typeof window,
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    host: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  });
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      capture_pageview: true,
      capture_pageleave: true,
      debug: process.env.NEXT_PUBLIC_STAGE! === "development" ? true : false,
      capture_dead_clicks: true,
      capture_heatmaps: true,
      capture_performance: true,
      capture_exceptions: true,
      autocapture: true,
      person_profiles: "identified_only"
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += "?" + search
      }
      posthog.capture("$pageview", { "$current_url": url })
    }
  }, [pathname, searchParams, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
