"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Schema de validation du formulaire
const leadGateSchema = z
  .object({
    email: z.string().email("Email invalide"),
    telephone: z
      .string()
      .regex(
        /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
        "Numéro de téléphone invalide"
      ),
    prenom: z.string().min(2, "Prénom requis (min 2 caractères)"),
    nom: z.string().min(2, "Nom requis (min 2 caractères)"),
    consentPromoteur: z.boolean(),
    consentCourtier: z.boolean(),
    consentNewsletter: z.boolean(),
  })
  .refine(
    (data) => data.consentPromoteur || data.consentCourtier,
    "Vous devez accepter au moins un des deux consentements (promoteur ou courtier)"
  );

type LeadGateFormData = z.infer<typeof leadGateSchema>;

interface LeadGateFormProps {
  /** Callback appelé après une soumission réussie */
  onSubmitSuccess?: () => void;
  /** Données de simulation à envoyer avec le lead (stocké en JSONB) */
  simulationData?: Record<string, unknown>;
  /** Désactiver le formulaire */
  disabled?: boolean;
}

/**
 * Formulaire de capture de lead inline pour accès au rapport complet
 *
 * Affiché directement dans la page résultats (pas de modal).
 * Collecte les coordonnées avec 3 consentements indépendants :
 * - Promoteur (recommandation programmes neufs)
 * - Courtier (financement personnalisé)
 * - Newsletter (conseils investissement)
 *
 * Au moins un des deux premiers consentements est requis pour soumettre.
 * Les données sont envoyées à POST /api/leads avec simulationData en JSONB.
 */
export function LeadGateForm({
  onSubmitSuccess,
  simulationData,
  disabled = false,
}: LeadGateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<LeadGateFormData>({
    resolver: zodResolver(leadGateSchema),
    defaultValues: {
      email: "",
      telephone: "",
      prenom: "",
      nom: "",
      consentPromoteur: false,
      consentCourtier: false,
      consentNewsletter: false,
    },
  });

  const consentPromoteur = watch("consentPromoteur");
  const consentCourtier = watch("consentCourtier");
  const consentNewsletter = watch("consentNewsletter");

  const onSubmit = async (data: LeadGateFormData) => {
    if (disabled) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          simulationData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de l'envoi");
      }

      setSubmitSuccess(true);
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage succès
  if (submitSuccess) {
    return (
      <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 to-background animate-in fade-in duration-500">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 animate-in zoom-in duration-300">
            <svg
              className="h-10 w-10 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-emerald-500">
            Rapport envoyé !
          </h3>
          <p className="text-muted-foreground max-w-md">
            Votre rapport détaillé vous sera envoyé par email sous quelques
            minutes. Consultez également votre boîte spam.
          </p>
          {(consentPromoteur || consentCourtier) && (
            <p className="text-sm text-muted-foreground mt-4">
              {consentPromoteur && consentCourtier
                ? "Un promoteur et un courtier partenaires vous contacteront sous 48h."
                : consentPromoteur
                  ? "Un promoteur partenaire vous contactera sous 48h."
                  : "Un courtier partenaire vous contactera sous 48h."}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-950/20 via-background to-zinc-950/30 relative overflow-hidden">
      {/* Bordure animée effet "gratuit" */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 opacity-50 blur-xl animate-pulse" />

      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
              <svg
                className="h-6 w-6 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <CardTitle className="text-xl sm:text-2xl leading-tight">
              Débloquez votre rapport complet
            </CardTitle>
          </div>
          <Badge className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 font-bold shrink-0">
            GRATUIT
          </Badge>
        </div>

        <p className="text-muted-foreground mt-3 text-sm sm:text-base">
          Pour recevoir votre{" "}
          <span className="font-semibold text-emerald-500">
            rapport détaillé GRATUIT
          </span>{" "}
          avec les programmes éligibles et une estimation de financement
          personnalisée
        </p>
      </CardHeader>

      <Separator className="opacity-30" />

      <CardContent className="relative pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Prénom / Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">
                Prénom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prenom"
                placeholder="Jean"
                {...register("prenom")}
                disabled={disabled || isSubmitting}
                aria-invalid={!!errors.prenom}
                aria-describedby={errors.prenom ? "prenom-error" : undefined}
                className="bg-zinc-900/50 border-zinc-700"
              />
              {errors.prenom && (
                <p
                  id="prenom-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {errors.prenom.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nom"
                placeholder="Dupont"
                {...register("nom")}
                disabled={disabled || isSubmitting}
                aria-invalid={!!errors.nom}
                aria-describedby={errors.nom ? "nom-error" : undefined}
                className="bg-zinc-900/50 border-zinc-700"
              />
              {errors.nom && (
                <p
                  id="nom-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {errors.nom.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jean.dupont@email.fr"
              {...register("email")}
              disabled={disabled || isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="bg-zinc-900/50 border-zinc-700"
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="telephone">
              Téléphone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="telephone"
              type="tel"
              placeholder="06 12 34 56 78"
              {...register("telephone")}
              disabled={disabled || isSubmitting}
              aria-invalid={!!errors.telephone}
              aria-describedby={
                errors.telephone ? "telephone-error" : undefined
              }
              className="bg-zinc-900/50 border-zinc-700"
            />
            {errors.telephone && (
              <p
                id="telephone-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.telephone.message}
              </p>
            )}
          </div>

          <Separator className="opacity-20" />

          {/* Consentements */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Je souhaite recevoir{" "}
              <span className="text-foreground">
                (au moins 1 des 2 premiers requis)
              </span>{" "}
              :
            </p>

            <div className="space-y-3">
              {/* Promoteur */}
              <div className="flex items-start space-x-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 transition-colors hover:border-emerald-500/30">
                <Checkbox
                  id="consentPromoteur"
                  checked={consentPromoteur === true}
                  onCheckedChange={(checked) =>
                    setValue("consentPromoteur", checked as boolean)
                  }
                  disabled={disabled || isSubmitting}
                  className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <label
                  htmlFor="consentPromoteur"
                  className="text-sm leading-tight cursor-pointer flex-1"
                >
                  <span className="font-medium text-foreground">
                    Recommandation de programmes neufs
                  </span>
                  <span className="block text-muted-foreground mt-1">
                    J'accepte que mes coordonnées soient transmises à un
                    promoteur partenaire pour une présentation de programmes
                    immobiliers neufs adaptés à mon projet.
                  </span>
                </label>
              </div>

              {/* Courtier */}
              <div className="flex items-start space-x-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 transition-colors hover:border-emerald-500/30">
                <Checkbox
                  id="consentCourtier"
                  checked={consentCourtier === true}
                  onCheckedChange={(checked) =>
                    setValue("consentCourtier", checked as boolean)
                  }
                  disabled={disabled || isSubmitting}
                  className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <label
                  htmlFor="consentCourtier"
                  className="text-sm leading-tight cursor-pointer flex-1"
                >
                  <span className="font-medium text-foreground">
                    Proposition de financement
                  </span>
                  <span className="block text-muted-foreground mt-1">
                    J'accepte que mes coordonnées soient transmises à un
                    courtier partenaire pour une proposition de financement
                    personnalisée.
                  </span>
                </label>
              </div>

              {/* Newsletter */}
              <div className="flex items-start space-x-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 transition-colors hover:border-emerald-500/30">
                <Checkbox
                  id="consentNewsletter"
                  checked={consentNewsletter === true}
                  onCheckedChange={(checked) =>
                    setValue("consentNewsletter", checked as boolean)
                  }
                  disabled={disabled || isSubmitting}
                  className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <label
                  htmlFor="consentNewsletter"
                  className="text-sm leading-tight cursor-pointer flex-1"
                >
                  <span className="font-medium text-foreground">
                    Newsletter investissement
                  </span>
                  <span className="block text-muted-foreground mt-1">
                    J'accepte de recevoir la newsletter avec des conseils en
                    investissement immobilier.
                  </span>
                </label>
              </div>
            </div>

            {/* Erreur de validation globale (au moins un consent requis) */}
            {errors.root && (
              <p className="text-xs text-destructive" role="alert">
                {errors.root.message}
              </p>
            )}
          </div>

          {/* Erreur globale */}
          {submitError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          {/* Bouton submit */}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-emerald-950 font-semibold h-12 text-base"
            disabled={disabled || isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              "Recevoir mon rapport complet gratuit"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            🔒 Vos données sont sécurisées et utilisées uniquement pour vous
            envoyer le rapport.
            <br />
            Aucun engagement • Service 100% gratuit
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
