"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

/**
 * Shared sign-out hook for consistent behavior across components.
 * Handles sign out and navigation without redundant router.refresh()
 * since AuthProvider handles session changes automatically.
 */
export function useSignOut() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.replace("/")
  }

  return { signOut: handleSignOut }
}
