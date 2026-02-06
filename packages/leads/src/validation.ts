import { z } from "zod/v4";

export const leadCaptureSchema = z.object({
  email: z.string().email("Email invalide"),
  phone: z.string().regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, "Numéro de téléphone invalide").optional(),
  firstName: z.string().min(2, "Prénom trop court").max(50).optional(),
  lastName: z.string().min(2, "Nom trop court").max(100).optional(),
  consentPromoter: z.boolean(),
  consentBroker: z.boolean(),
  consentNewsletter: z.boolean(),
});

export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
