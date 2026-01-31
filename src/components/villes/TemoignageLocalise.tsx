/**
 * TemoignageLocalise.tsx
 * Temoignage client avec selection aleatoire cote client
 */

"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TemoignageLocaliseSProps {
  villeNom: string;
}

interface Temoignage {
  id: number;
  citation: string;
  nom: string;
  metier: string;
  note: number; // 1-5
  initiales: string;
}

/**
 * Pool de 10 temoignages generiques pour investissement Loi Jeanbrun
 * Les temoignages sont selectionnes aleatoirement cote client
 */
const TEMOIGNAGES: Temoignage[] = [
  {
    id: 1,
    citation:
      "Grace au simulateur, j'ai compris que la Loi Jeanbrun etait plus avantageuse que le LMNP pour mon profil. L'economie fiscale estimee m'a convaincu de passer a l'action.",
    nom: "Laurent M.",
    metier: "Cadre superieur",
    note: 5,
    initiales: "LM",
  },
  {
    id: 2,
    citation:
      "Le simulateur m'a permis de comparer plusieurs villes et de choisir celle avec le meilleur rendement. Tres utile pour prendre une decision eclairee.",
    nom: "Sophie D.",
    metier: "Medecin",
    note: 5,
    initiales: "SD",
  },
  {
    id: 3,
    citation:
      "J'hesitais entre plusieurs investissements. Le calcul detaille des avantages fiscaux m'a aide a voir clair. Je recommande vivement ce simulateur.",
    nom: "Pierre B.",
    metier: "Chef d'entreprise",
    note: 4,
    initiales: "PB",
  },
  {
    id: 4,
    citation:
      "Simple, rapide et precis. En quelques minutes, j'avais une estimation complete de mon futur investissement avec tous les avantages fiscaux.",
    nom: "Marie C.",
    metier: "Avocate",
    note: 5,
    initiales: "MC",
  },
  {
    id: 5,
    citation:
      "Mon conseiller m'avait parle de la Loi Jeanbrun mais je ne comprenais pas bien. Le simulateur m'a tout explique clairement avec des chiffres concrets.",
    nom: "Thomas R.",
    metier: "Ingenieur",
    note: 4,
    initiales: "TR",
  },
  {
    id: 6,
    citation:
      "Excellente decouverte ! J'ai pu simuler plusieurs scenarios et optimiser mon investissement. Le rapport qualite/prix est imbattable.",
    nom: "Claire V.",
    metier: "Directrice marketing",
    note: 5,
    initiales: "CV",
  },
  {
    id: 7,
    citation:
      "Apres avoir utilise le simulateur, j'ai pris rendez-vous avec un conseiller. La simulation etait exacte, ce qui m'a mis en confiance.",
    nom: "Jean-Marc L.",
    metier: "Pharmacien",
    note: 5,
    initiales: "JL",
  },
  {
    id: 8,
    citation:
      "Premier investissement locatif reussi grace aux informations du simulateur. Les projections sur 9 ans m'ont vraiment aide a me projeter.",
    nom: "Nathalie P.",
    metier: "Consultante",
    note: 4,
    initiales: "NP",
  },
  {
    id: 9,
    citation:
      "Interface intuitive et resultats instantanes. J'ai compare plusieurs programmes et trouve celui qui correspondait a mon budget et mes objectifs.",
    nom: "Olivier G.",
    metier: "Architecte",
    note: 5,
    initiales: "OG",
  },
  {
    id: 10,
    citation:
      "Le barometre mensuel de la ville m'a rassure sur la tension locative. Je sais maintenant que mon bien se louera facilement.",
    nom: "Isabelle F.",
    metier: "Responsable RH",
    note: 4,
    initiales: "IF",
  },
];

/**
 * Affiche les etoiles de notation
 */
function NoteEtoiles({ note }: { note: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Note: ${note} etoiles sur 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < note
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Composant temoignage avec selection aleatoire
 * La selection se fait cote client pour eviter le mismatch SSR/CSR
 */
export function TemoignageLocalise({ villeNom }: TemoignageLocaliseSProps) {
  const [temoignage, setTemoignage] = useState<Temoignage | null>(null);

  useEffect(() => {
    // Selection aleatoire cote client
    const randomIndex = Math.floor(Math.random() * TEMOIGNAGES.length);
    const selected = TEMOIGNAGES[randomIndex];
    if (selected) {
      setTemoignage(selected);
    }
  }, []);

  // Affichage skeleton pendant le chargement
  if (!temoignage) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-20 rounded bg-muted" />
          <div className="mt-4 flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Personnaliser la citation avec le nom de la ville si possible
  const citationPersonnalisee = temoignage.citation.includes("ville")
    ? temoignage.citation.replace("ville", villeNom)
    : temoignage.citation;

  return (
    <Card className="relative overflow-hidden">
      {/* Icone citation decorative */}
      <Quote
        className="absolute -top-2 -left-2 size-16 rotate-180 text-primary/5"
        aria-hidden="true"
      />

      <CardContent className="relative p-6">
        {/* Note */}
        <div className="mb-3">
          <NoteEtoiles note={temoignage.note} />
        </div>

        {/* Citation */}
        <blockquote className="mb-4 text-foreground">
          <p className="italic leading-relaxed">
            &ldquo;{citationPersonnalisee}&rdquo;
          </p>
        </blockquote>

        {/* Auteur */}
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {temoignage.initiales}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{temoignage.nom}</p>
            <p className="text-sm text-muted-foreground">{temoignage.metier}</p>
          </div>
        </div>

        {/* Mention ville */}
        <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
          Investisseur interesse par {villeNom}
        </p>
      </CardContent>
    </Card>
  );
}
