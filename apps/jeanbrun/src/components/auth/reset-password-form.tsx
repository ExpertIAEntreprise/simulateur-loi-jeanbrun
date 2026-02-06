"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/auth-client"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [isPending, setIsPending] = useState(false)

  if (error === "invalid_token" || !token) {
    return (
      <div
        className="space-y-4 w-full max-w-sm text-center"
        role="alert"
        aria-live="polite"
      >
        <p className="text-sm text-destructive">
          {error === "invalid_token"
            ? "This password reset link is invalid or has expired."
            : "No reset token provided."}
        </p>
        <Link href="/forgot-password">
          <Button variant="outline" className="w-full">
            Request a new link
          </Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (password !== confirmPassword) {
      setFormError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters")
      return
    }

    setIsPending(true)

    try {
      const result = await resetPassword({
        newPassword: password,
        token,
      })

      if (result.error) {
        setFormError(result.error.message || "Failed to reset password")
      } else {
        router.push("/login?reset=success")
      }
    } catch {
      setFormError("An unexpected error occurred")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm" aria-label="Reset password form">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isPending}
          aria-describedby={formError ? "reset-error" : "password-requirements"}
          aria-invalid={!!formError}
        />
        <p
          id="password-requirements"
          className="text-xs text-muted-foreground"
          aria-live="polite"
        >
          Password must be at least 8 characters.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isPending}
          aria-describedby={formError ? "reset-error" : undefined}
          aria-invalid={!!formError}
        />
      </div>
      {formError && (
        <p
          id="reset-error"
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {formError}
        </p>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  )
}
