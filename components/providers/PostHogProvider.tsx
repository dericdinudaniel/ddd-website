/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePostHog } from "posthog-js/react";

let posthogInstance: any = null; // outside component, cache instance

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    import("posthog-js").then((ph) => {
      posthogInstance = ph.default;
      posthogInstance.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: true,
        disable_session_recording: true,
      });
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <>{children}</>; // don't block app from rendering
  }

  return (
    <PHProvider client={posthogInstance}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;

    const handlePageview = () => {
      let url = window.location.origin + window.location.pathname;
      if (window.location.search) {
        url += window.location.search;
      }

      posthog.capture("$pageview", {
        $current_url: url,
      });
    };

    // Fire a pageview immediately on first render
    handlePageview();

    // Fire a pageview whenever the URL/path changes
    // `pathname` and `searchParams` are reactive in Next.js App Router
  }, [pathname, searchParams, posthog]); // triggers when URL changes

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
