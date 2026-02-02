"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TMI and level options as const for type safety
const TMI_OPTIONS = ["11", "30", "41", "45"] as const;
const TYPE_BIEN_OPTIONS = ["neuf", "ancien"] as const;
const NIVEAU_LOYER_OPTIONS = [
  "intermediaire",
  "social",
  "tres_social",
] as const;

// Zod schema validation
const simulatorSchema = z.object({
  montant: z
    .number({ message: "Montant obligatoire" })
    .min(100000, "Montant minimum: 100 000 €")
    .max(500000, "Montant maximum: 500 000 €"),
  tmi: z.enum(TMI_OPTIONS, { message: "Sélectionnez votre TMI" }),
  typeBien: z.enum(TYPE_BIEN_OPTIONS, {
    message: "Sélectionnez le type de bien",
  }),
  niveauLoyer: z.enum(NIVEAU_LOYER_OPTIONS, {
    message: "Sélectionnez le niveau de loyer",
  }),
});

type SimulatorFormData = z.infer<typeof simulatorSchema>;

// Types pour les résultats
interface SimulationResult {
  amortAnnuel: number;
  economieAnnuelle: number;
  economieTotale: number;
}

export function SimulatorQuickForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SimulatorFormData>({
    resolver: zodResolver(simulatorSchema),
    mode: "onBlur",
  });

  const tmi = watch("tmi");
  const typeBien = watch("typeBien");
  const niveauLoyer = watch("niveauLoyer");

  // Calcul client-side
  const calculateResult = (data: SimulatorFormData): SimulationResult => {
    const tauxAmortissement: Record<
      (typeof NIVEAU_LOYER_OPTIONS)[number],
      number
    > = {
      intermediaire: 0.035,
      social: 0.045,
      tres_social: 0.055,
    };
    const plafondAnnuel: Record<(typeof NIVEAU_LOYER_OPTIONS)[number], number> =
      {
        intermediaire: 8000,
        social: 10000,
        tres_social: 12000,
      };

    const amortAnnuel = Math.min(
      data.montant * 0.8 * tauxAmortissement[data.niveauLoyer],
      plafondAnnuel[data.niveauLoyer]
    );
    const economieAnnuelle = amortAnnuel * (Number(data.tmi) / 100);
    const economieTotale = economieAnnuelle * 9; // 9 ans

    return {
      amortAnnuel: Math.round(amortAnnuel),
      economieAnnuelle: Math.round(economieAnnuelle),
      economieTotale: Math.round(economieTotale),
    };
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger("montant");
    } else if (currentStep === 2) {
      isValid = await trigger("tmi");
    } else if (currentStep === 3) {
      isValid = await trigger("typeBien");
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
    setResult(null);
  };

  const onSubmit = (data: SimulatorFormData) => {
    const calculatedResult = calculateResult(data);
    setResult(calculatedResult);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Simulateur Rapide Loi Jeanbrun
        </CardTitle>
        {/* Progress bar accessible */}
        <div
          className="mt-4"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Étape ${currentStep} sur 4`}
        >
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all",
                  step <= currentStep
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#F4E5B8]"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Étape {currentStep} sur 4
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Étape 1: Montant investissement */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="montant" className="text-base font-semibold">
                  Quel est le montant de votre investissement ?
                </Label>
                <div className="mt-2 relative">
                  <Input
                    id="montant"
                    type="number"
                    step="1000"
                    placeholder="Ex: 250000"
                    aria-required="true"
                    aria-invalid={errors.montant ? "true" : "false"}
                    aria-describedby={
                      errors.montant ? "montant-error" : "montant-hint"
                    }
                    className={cn(
                      "text-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]",
                      errors.montant && "border-destructive"
                    )}
                    {...register("montant", { valueAsNumber: true })}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-muted-foreground">€</span>
                  </div>
                </div>
                <p
                  id="montant-hint"
                  className="text-xs text-muted-foreground mt-1"
                >
                  Entre 100 000 € et 500 000 €
                </p>
                {errors.montant && (
                  <p
                    id="montant-error"
                    role="alert"
                    className="text-sm text-destructive mt-1"
                  >
                    {errors.montant.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Étape 2: TMI */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  Quelle est votre Tranche Marginale d'Imposition (TMI) ?
                </Label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Si vous ne connaissez pas votre TMI, consultez votre dernier
                  avis d'imposition
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {TMI_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className={cn(
                        "flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all",
                        "hover:border-[#D4AF37] hover:bg-[#D4AF37]/5",
                        "focus-within:ring-2 focus-within:ring-[#D4AF37] focus-within:ring-offset-2",
                        tmi === option
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/20"
                          : "border-border bg-card"
                      )}
                    >
                      <input
                        type="radio"
                        value={option}
                        className="sr-only"
                        {...register("tmi")}
                      />
                      <span className="text-lg font-semibold">{option}%</span>
                    </label>
                  ))}
                </div>
                {errors.tmi && (
                  <p role="alert" className="text-sm text-destructive mt-2">
                    {errors.tmi.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Étape 3: Type de bien */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  Quel type de bien souhaitez-vous acquérir ?
                </Label>
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {[
                    {
                      value: "neuf" as const,
                      label: "Neuf",
                      description:
                        "Logement neuf ou en l'état futur d'achèvement",
                    },
                    {
                      value: "ancien" as const,
                      label: "Ancien avec travaux",
                      description:
                        "Logement ancien avec rénovation énergétique complète",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all",
                        "hover:border-[#D4AF37] hover:bg-[#D4AF37]/5",
                        "focus-within:ring-2 focus-within:ring-[#D4AF37] focus-within:ring-offset-2",
                        typeBien === option.value
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/20"
                          : "border-border bg-card"
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        aria-describedby={`${option.value}-description`}
                        className="sr-only"
                        {...register("typeBien")}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-lg">
                          {option.label}
                        </div>
                        <p
                          id={`${option.value}-description`}
                          className="text-sm text-muted-foreground mt-1"
                        >
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.typeBien && (
                  <p role="alert" className="text-sm text-destructive mt-2">
                    {errors.typeBien.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Étape 4: Niveau de loyer */}
          {currentStep === 4 && !result && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  Quel niveau de loyer souhaitez-vous pratiquer ?
                </Label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Plus le loyer est bas, plus l'avantage fiscal est important
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      value: "intermediaire" as const,
                      label: "Intermédiaire",
                      rate: "3.5%",
                      plafond: "8 000 €/an",
                    },
                    {
                      value: "social" as const,
                      label: "Social",
                      rate: "4.5%",
                      plafond: "10 000 €/an",
                    },
                    {
                      value: "tres_social" as const,
                      label: "Très social",
                      rate: "5.5%",
                      plafond: "12 000 €/an",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all",
                        "hover:border-[#D4AF37] hover:bg-[#D4AF37]/5",
                        "focus-within:ring-2 focus-within:ring-[#D4AF37] focus-within:ring-offset-2",
                        niveauLoyer === option.value
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/20"
                          : "border-border bg-card"
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        className="sr-only"
                        {...register("niveauLoyer")}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-lg">
                            {option.label}
                          </span>
                          <span className="text-[#D4AF37] font-bold text-lg">
                            {option.rate}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Plafond: {option.plafond}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.niveauLoyer && (
                  <p role="alert" className="text-sm text-destructive mt-2">
                    {errors.niveauLoyer.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Résultat */}
          {currentStep === 4 && result && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">
                  Votre économie d'impôt estimée
                </h3>
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#F4E5B8]/20 border-2 border-[#D4AF37] rounded-lg p-6 shadow-xl shadow-[#D4AF37]/30">
                  <div className="text-5xl font-bold text-[#D4AF37] mb-2">
                    {formatCurrency(result.economieTotale)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    sur 9 ans (durée de l'amortissement)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Amortissement annuel
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.amortAnnuel)}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Économie annuelle
                  </div>
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    {formatCurrency(result.economieAnnuelle)}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                  onClick={() => {
                    window.location.href = "/simulateur";
                  }}
                >
                  Voir le détail sur 30 ans →
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Simulation détaillée avec comparaison LMNP classique
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && !result && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex-1"
              >
                Précédent
              </Button>
            )}
            {currentStep < 4 && (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              >
                Suivant
              </Button>
            )}
            {currentStep === 4 && !result && (
              <Button
                type="submit"
                className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              >
                Calculer
              </Button>
            )}
            {result && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                  setResult(null);
                }}
                className="flex-1"
              >
                Nouvelle simulation
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
