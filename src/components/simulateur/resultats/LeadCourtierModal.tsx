"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONSENTEMENTS_FINANCEMENT } from "@/types/lead-financement";

// Schema de validation du formulaire
const leadCourtierSchema = z.object({
  prenom: z.string().min(2, "Prénom requis (min 2 caractères)"),
  nom: z.string().min(2, "Nom requis (min 2 caractères)"),
  email: z.string().email("Email invalide"),
  telephone: z
    .string()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  consentementRgpd: z
    .boolean()
    .refine((val) => val === true, "Vous devez accepter le traitement de vos données"),
  consentementCourtier: z
    .boolean()
    .refine((val) => val === true, "Vous devez accepter d'être recontacté"),
});

type LeadCourtierFormData = z.infer<typeof leadCourtierSchema>;

interface LeadCourtierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simulationData?: {
    simulationId?: string | undefined;
    revenuMensuel: number;
    montantProjet: number;
    apport: number;
    montantEmprunt: number;
    dureeEmpruntMois: number;
    tauxEndettement: number;
    mensualiteEstimee: number;
    villeProjet?: string | undefined;
    typeBien?: "neuf" | "ancien" | undefined;
  } | undefined;
}

/**
 * Modal de capture de lead pour transmission au courtier partenaire
 *
 * Collecte les coordonnées de l'utilisateur avec consentements RGPD
 * et envoie les données au courtier partenaire.
 */
export function LeadCourtierModal({
  open,
  onOpenChange,
  simulationData,
}: LeadCourtierModalProps) {
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
  } = useForm<LeadCourtierFormData>({
    resolver: zodResolver(leadCourtierSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      consentementRgpd: false,
      consentementCourtier: false,
    },
  });

  const consentementRgpd = watch("consentementRgpd");
  const consentementCourtier = watch("consentementCourtier");

  const onSubmit = async (data: LeadCourtierFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/leads/financement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          ...simulationData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de l'envoi");
      }

      setSubmitSuccess(true);
      reset();
      // Auto-close handled by useEffect below
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-close modal after successful submission
  useEffect(() => {
    if (!submitSuccess) return;

    const timer = setTimeout(() => {
      setSubmitSuccess(false);
      onOpenChange(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [submitSuccess, onOpenChange]);

  // Affichage succès
  if (submitSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <span className="text-3xl">✓</span>
            </div>
            <DialogTitle className="text-xl">Demande envoyée !</DialogTitle>
            <DialogDescription className="mt-2">
              Un courtier partenaire vous contactera sous 48h pour étudier votre
              financement.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-amber-500">📞</span>
            Être rappelé par un courtier
          </DialogTitle>
          <DialogDescription>
            Renseignez vos coordonnées pour être recontacté gratuitement par un
            courtier partenaire sous 48h.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Données simulation (récap) */}
          {simulationData && (
            <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-950/20 p-3 text-sm">
              <p className="font-medium text-amber-500 mb-2">Votre projet</p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Montant à financer :</span>
                <span className="font-mono">
                  {simulationData.montantEmprunt.toLocaleString("fr-FR")} €
                </span>
                <span>Mensualité estimée :</span>
                <span className="font-mono">
                  {simulationData.mensualiteEstimee.toLocaleString("fr-FR")} €
                </span>
                <span>Taux d'endettement :</span>
                <span className="font-mono">
                  {(simulationData.tauxEndettement * 100).toFixed(1)} %
                </span>
              </div>
            </div>
          )}

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                placeholder="Jean"
                {...register("prenom")}
                aria-invalid={!!errors.prenom}
                aria-describedby={errors.prenom ? "prenom-error" : undefined}
              />
              {errors.prenom && (
                <p id="prenom-error" className="text-xs text-destructive" role="alert">{errors.prenom.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                placeholder="Dupont"
                {...register("nom")}
                aria-invalid={!!errors.nom}
                aria-describedby={errors.nom ? "nom-error" : undefined}
              />
              {errors.nom && (
                <p id="nom-error" className="text-xs text-destructive" role="alert">{errors.nom.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="jean.dupont@email.fr"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-destructive" role="alert">{errors.email.message}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              type="tel"
              placeholder="06 12 34 56 78"
              {...register("telephone")}
              aria-invalid={!!errors.telephone}
              aria-describedby={errors.telephone ? "telephone-error" : undefined}
            />
            {errors.telephone && (
              <p id="telephone-error" className="text-xs text-destructive" role="alert">{errors.telephone.message}</p>
            )}
          </div>

          {/* Consentements */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="consentementRgpd"
                checked={consentementRgpd === true}
                onCheckedChange={(checked) =>
                  setValue("consentementRgpd", checked as true)
                }
                aria-describedby={errors.consentementRgpd ? "consentementRgpd-error" : undefined}
              />
              <label
                htmlFor="consentementRgpd"
                className="text-xs text-muted-foreground leading-tight cursor-pointer"
              >
                {CONSENTEMENTS_FINANCEMENT.rgpd}
              </label>
            </div>
            {errors.consentementRgpd && (
              <p id="consentementRgpd-error" className="text-xs text-destructive ml-6" role="alert">
                {errors.consentementRgpd.message}
              </p>
            )}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="consentementCourtier"
                checked={consentementCourtier === true}
                onCheckedChange={(checked) =>
                  setValue("consentementCourtier", checked as true)
                }
                aria-describedby={errors.consentementCourtier ? "consentementCourtier-error" : undefined}
              />
              <label
                htmlFor="consentementCourtier"
                className="text-xs text-muted-foreground leading-tight cursor-pointer"
              >
                {CONSENTEMENTS_FINANCEMENT.courtier}
              </label>
            </div>
            {errors.consentementCourtier && (
              <p id="consentementCourtier-error" className="text-xs text-destructive ml-6" role="alert">
                {errors.consentementCourtier.message}
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
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Vos données sont transmises uniquement à notre courtier partenaire.
            <br />
            Aucun engagement, service 100% gratuit.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
