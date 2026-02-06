import type { Metadata } from "next";
import { Suspense } from "react";
import { UnsubscribeForm } from "./unsubscribe-form";

export const metadata: Metadata = {
  title: "Desinscription - Simulateur Loi Jeanbrun",
  description: "Gerez vos preferences et retirez votre consentement",
  robots: { index: false, follow: false },
};

export default function DesinscriptionPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Gestion de vos preferences
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Conformement au RGPD (article 7.3), vous pouvez retirer votre
        consentement a tout moment. Utilisez le token recu dans vos emails
        pour gerer vos preferences de communication.
      </p>
      <Suspense fallback={null}>
        <UnsubscribeForm />
      </Suspense>
    </div>
  );
}
