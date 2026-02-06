"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

/**
 * AuthProvider component that listens to Better Auth session changes
 * and triggers router refresh when session state changes.
 *
 * This ensures that Server Components re-fetch session data and protected
 * routes properly redirect when authentication state changes.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: session } = useSession()
  const previousSessionRef = useRef(session)

  useEffect(() => {
    // Check if session state changed (logged in/out)
    const previousSession = previousSessionRef.current
    const sessionChanged =
      (previousSession === null && session !== null) ||
      (previousSession !== null && session === null)

    if (sessionChanged) {
      // Refresh Server Components to get updated session data
      router.refresh()
    }

    previousSessionRef.current = session
  }, [session, router])

  return <>{children}</>
}
