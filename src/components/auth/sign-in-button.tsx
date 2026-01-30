"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, useSession } from "@/lib/auth-client"
import {
  parseAuthError,
  shouldShowLockoutMessage,
  LOCKOUT_ERROR_STYLES,
  AuthErrorType,
  type AuthError,
} from "@/lib/auth-lockout"

export function SignInButton() {
  const { data: session, isPending: sessionPending } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<AuthError | null | undefined>(undefined)
  const [isPending, setIsPending] = useState(false)

  if (sessionPending) {
    return <Button disabled>Chargement...</Button>
  }

  if (session) {
    return null
  }

  /**
   * Gère la soumission du formulaire de connexion
   *
   * 1. Appelle signIn.email() avec les credentials
   * 2. Parse l'erreur si le serveur retourne une erreur
   * 3. Distingue les erreurs de lockout des autres erreurs
   * 4. Désactive le formulaire si le compte est verrouillé
   * 5. Redirige vers le dashboard en cas de succès
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      })

      if (result.error) {
        // Parse l'erreur et détecte si c'est un lockout (rate limit)
        const authError = parseAuthError(result.error)
        setError(authError)
      } else {
        // Succès: AuthProvider gère la synchronisation de session automatiquement
        // Le compteur de tentatives échouées est réinitialisé par Better Auth
        router.push("/dashboard")
      }
    } catch (err) {
      // Gère les erreurs inattendues
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur inattendue s'est produite"
      setError({
        type: AuthErrorType.UNKNOWN,
        message: errorMessage,
        isLocked: false,
      })
    } finally {
      setIsPending(false)
    }
  }

  // Le compte est verrouillé: désactiver le formulaire pendant le lockout
  const isAccountLocked = error ? shouldShowLockoutMessage(error) : false

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-sm"
      aria-label="Formulaire de connexion"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending || isAccountLocked}
          aria-describedby={error ? "signin-error" : undefined}
          aria-invalid={!!error}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isPending || isAccountLocked}
          aria-describedby={error ? "signin-error" : undefined}
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <div
          id="signin-error"
          className={
            isAccountLocked ? LOCKOUT_ERROR_STYLES.container : LOCKOUT_ERROR_STYLES.standard
          }
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isAccountLocked}
        aria-busy={isPending}
      >
        {isPending ? "Connexion en cours..." : "Se connecter"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <Link href="/forgot-password" className="hover:underline">
          Mot de passe oublié ?
        </Link>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Vous n&apos;avez pas de compte ?{" "}
        <Link href="/register" className="text-primary hover:underline">
          S&apos;inscrire
        </Link>
      </div>
    </form>
  )
}
