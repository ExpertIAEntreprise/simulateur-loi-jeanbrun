"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type FormStatus = "idle" | "loading" | "success" | "error";

export function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") ?? "";

  const [token, setToken] = useState(initialToken);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (token.trim().length === 0) {
      setStatus("error");
      setMessage("Veuillez entrer votre token de desinscription.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/leads/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message: string;
      };

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(
          data.message ??
            "Vos consentements ont ete retires avec succes."
        );
      } else {
        setStatus("error");
        setMessage(
          data.message ?? "Une erreur est survenue. Veuillez reessayer."
        );
      }
    } catch {
      setStatus("error");
      setMessage(
        "Impossible de contacter le serveur. Veuillez reessayer plus tard."
      );
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Gestion de vos preferences</CardTitle>
        <CardDescription>
          Entrez le token recu par email pour retirer vos consentements
          commerciaux. Cette action est irreversible et prend effet
          immediatement, conformement a l&apos;article 7.3 du RGPD.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" ? (
          <div
            role="alert"
            className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
          >
            <p className="font-medium">Desinscription confirmee</p>
            <p className="mt-1 text-sm">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unsubscribe-token">
                Token de desinscription
              </Label>
              <Input
                id="unsubscribe-token"
                type="text"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  if (status === "error") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
                placeholder="Collez votre token ici"
                disabled={status === "loading"}
                autoComplete="off"
              />
            </div>

            {status === "error" && message && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={status === "loading" || token.trim().length === 0}
            >
              {status === "loading"
                ? "Traitement en cours..."
                : "Retirer mes consentements"}
            </Button>

            <p className="text-xs text-muted-foreground">
              En cliquant sur ce bouton, vous retirez votre consentement
              pour les communications commerciales des promoteurs, courtiers
              et newsletters. Vos donnees de simulation restent conservees
              conformement a notre politique de confidentialite.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
