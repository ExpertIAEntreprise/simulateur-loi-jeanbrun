"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import type { Lot } from "@/lib/espocrm";

/**
 * Schema de validation Zod pour le formulaire de contact programme
 */
const contactProgrammeSchema = z.object({
  nom: z.string().min(2, "Nom requis (min 2 caracteres)"),
  prenom: z.string().min(2, "Prenom requis (min 2 caracteres)"),
  email: z.string().email("Email invalide"),
  telephone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Numero de telephone invalide"
    ),
  message: z.string().min(10, "Message requis (min 10 caracteres)"),
  consentementRgpd: z
    .boolean()
    .refine((val) => val === true, "Vous devez accepter le traitement de vos donnees"),
});

type ContactProgrammeFormData = z.infer<typeof contactProgrammeSchema>;

interface ContactProgrammeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lot: Lot | null;
  programmeName: string;
  programmeSlug: string;
  villeName: string | null;
}

/**
 * ContactProgrammeModal - Modal de contact pour un programme/lot
 *
 * Formulaire avec validation Zod : nom, prenom, email, tel, message, checkbox RGPD.
 * Message pre-rempli avec les infos du lot selectionne.
 *
 * @see Phase 5 du plan page-programme
 */
export function ContactProgrammeModal({
  open,
  onOpenChange,
  lot,
  programmeName,
  programmeSlug,
  villeName,
}: ContactProgrammeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Message pre-rempli selon le lot ou le programme
  const defaultMessage = lot
    ? `Je suis interesse par le lot ${lot.type} ${lot.surface}m2 du programme ${programmeName}${villeName ? ` a ${villeName}` : ""}.`
    : `Je suis interesse par le programme ${programmeName}${villeName ? ` a ${villeName}` : ""}.`;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ContactProgrammeFormData>({
    resolver: zodResolver(contactProgrammeSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      message: defaultMessage,
      consentementRgpd: false,
    },
  });

  const consentementRgpd = watch("consentementRgpd");

  // Mettre a jour le message quand le lot change
  useEffect(() => {
    if (open) {
      const msg = lot
        ? `Je suis interesse par le lot ${lot.type} ${lot.surface}m2 du programme ${programmeName}${villeName ? ` a ${villeName}` : ""}.`
        : `Je suis interesse par le programme ${programmeName}${villeName ? ` a ${villeName}` : ""}.`;
      setValue("message", msg);
    }
  }, [lot, programmeName, villeName, open, setValue]);

  const onSubmit = async (data: ContactProgrammeFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads/programme-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          programmeName,
          programmeSlug,
          villeName,
          lotType: lot?.type ?? null,
          lotSurface: lot?.surface ?? null,
          lotPrix: lot?.prix ?? null,
          lotEtage: lot?.etage ?? null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ?? "Erreur lors de l'envoi"
        );
      }

      setSubmitSuccess(true);
      toast.success("Votre demande a ete envoyee");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fermeture apres succes
  useEffect(() => {
    if (!submitSuccess) return;

    const timer = setTimeout(() => {
      setSubmitSuccess(false);
      onOpenChange(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [submitSuccess, onOpenChange]);

  // Affichage succes
  if (submitSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/20">
              <Mail className="size-8 text-green-600" aria-hidden="true" />
            </div>
            <DialogTitle className="text-xl">Demande envoyee !</DialogTitle>
            <DialogDescription className="mt-2">
              Nous revenons vers vous rapidement concernant le programme{" "}
              {programmeName}.
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
            <Mail className="size-5 text-primary" aria-hidden="true" />
            Recevoir les informations
          </DialogTitle>
          <DialogDescription>
            Remplissez le formulaire pour recevoir les details du programme{" "}
            {programmeName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Lot selectionne (recap) */}
          {lot && (
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-sm">
              <p className="mb-1 font-medium text-primary">Lot selectionne</p>
              <p className="text-muted-foreground">
                {lot.type} - {lot.surface} m² - Etage{" "}
                {lot.etage != null
                  ? lot.etage === 0
                    ? "RDC"
                    : lot.etage
                  : "-"}{" "}
                -{" "}
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(lot.prix)}
              </p>
            </div>
          )}

          {/* Prenom / Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-prenom">Prenom *</Label>
              <Input
                id="contact-prenom"
                placeholder="Jean"
                {...register("prenom")}
                aria-invalid={!!errors.prenom}
                aria-describedby={
                  errors.prenom ? "contact-prenom-error" : undefined
                }
              />
              {errors.prenom && (
                <p
                  id="contact-prenom-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {errors.prenom.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-nom">Nom *</Label>
              <Input
                id="contact-nom"
                placeholder="Dupont"
                {...register("nom")}
                aria-invalid={!!errors.nom}
                aria-describedby={errors.nom ? "contact-nom-error" : undefined}
              />
              {errors.nom && (
                <p
                  id="contact-nom-error"
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
            <Label htmlFor="contact-email">Email *</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="jean.dupont@email.fr"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
            />
            {errors.email && (
              <p
                id="contact-email-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Telephone */}
          <div className="space-y-2">
            <Label htmlFor="contact-telephone">Telephone *</Label>
            <Input
              id="contact-telephone"
              type="tel"
              placeholder="06 12 34 56 78"
              {...register("telephone")}
              aria-invalid={!!errors.telephone}
              aria-describedby={
                errors.telephone ? "contact-telephone-error" : undefined
              }
            />
            {errors.telephone && (
              <p
                id="contact-telephone-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.telephone.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              rows={3}
              {...register("message")}
              aria-invalid={!!errors.message}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
            />
            {errors.message && (
              <p
                id="contact-message-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Consentement RGPD */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="contact-consentementRgpd"
                checked={consentementRgpd === true}
                onCheckedChange={(checked) =>
                  setValue("consentementRgpd", checked as true)
                }
                aria-describedby={
                  errors.consentementRgpd
                    ? "contact-consentementRgpd-error"
                    : undefined
                }
              />
              <label
                htmlFor="contact-consentementRgpd"
                className="cursor-pointer text-xs leading-tight text-muted-foreground"
              >
                J&apos;accepte que mes donnees personnelles soient traitees pour
                repondre a ma demande d&apos;information, conformement a la
                politique de confidentialite. *
              </label>
            </div>
            {errors.consentementRgpd && (
              <p
                id="contact-consentementRgpd-error"
                className="ml-6 text-xs text-destructive"
                role="alert"
              >
                {errors.consentementRgpd.message}
              </p>
            )}
          </div>

          {/* Bouton submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Mail className="size-4" aria-hidden="true" />
            {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Vos donnees sont traitees uniquement pour repondre a votre demande.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
