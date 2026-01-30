/**
 * Tests pour le module orchestrateur de simulation
 *
 * TDD Phase 6 - Tests ecrits AVANT l'implementation
 *
 * L'orchestrateur combine tous les modules de calcul:
 * - IR et TMI
 * - Jeanbrun Neuf/Ancien
 * - Deficit foncier
 * - Credit
 * - Plus-value
 * - LMNP (comparatif)
 * - Rendements
 *
 * Fonctions principales:
 * - calculerLoyerEstime(surface, zoneFiscale, niveauLoyer): loyer mensuel estime
 * - orchestrerSimulation(input): resultat complet de la simulation
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect } from "vitest";
import { calculerLoyerEstime, orchestrerSimulation } from "../orchestrateur";
import type {
  SimulationCalculInput,
} from "../types/simulation";

// ============================================
// TESTS CALCUL LOYER ESTIME
// ============================================

describe("calculerLoyerEstime", () => {
  describe("zone A_BIS - niveau intermediaire", () => {
    it("devrait calculer le loyer pour 50m2 en zone A_BIS", () => {
      // Plafond A_BIS intermediaire: 18.89 EUR/m2
      // Coefficient surface: min(0.7 + 19/50, 1.2) = min(1.08, 1.2) = 1.08
      // Loyer plafond = 50 * 18.89 * 1.08 = 1020.06 EUR/mois
      const loyer = calculerLoyerEstime(50, "A_BIS", "intermediaire");

      expect(loyer).toBeCloseTo(1020, 0);
    });

    it("devrait calculer le loyer pour 30m2 en zone A_BIS (coefficient maximal)", () => {
      // Coefficient surface: min(0.7 + 19/30, 1.2) = min(1.333, 1.2) = 1.2 (plafonne)
      // Loyer plafond = 30 * 18.89 * 1.2 = 680.04 EUR/mois
      const loyer = calculerLoyerEstime(30, "A_BIS", "intermediaire");

      expect(loyer).toBeCloseTo(680, 0);
    });

    it("devrait calculer le loyer pour 100m2 en zone A_BIS (grand logement)", () => {
      // Coefficient surface: min(0.7 + 19/100, 1.2) = min(0.89, 1.2) = 0.89
      // Loyer plafond = 100 * 18.89 * 0.89 = 1681.21 EUR/mois
      const loyer = calculerLoyerEstime(100, "A_BIS", "intermediaire");

      expect(loyer).toBeCloseTo(1681, 0);
    });
  });

  describe("zone A - niveau intermediaire", () => {
    it("devrait calculer le loyer pour 50m2 en zone A", () => {
      // Plafond A intermediaire: 14.03 EUR/m2
      // Coefficient surface: min(0.7 + 19/50, 1.2) = 1.08
      // Loyer plafond = 50 * 14.03 * 1.08 = 757.62 EUR/mois
      const loyer = calculerLoyerEstime(50, "A", "intermediaire");

      expect(loyer).toBeCloseTo(758, 0);
    });
  });

  describe("zone B1 - niveau intermediaire", () => {
    it("devrait calculer le loyer pour 50m2 en zone B1", () => {
      // Plafond B1 intermediaire: 11.31 EUR/m2
      // Coefficient surface: 1.08
      // Loyer plafond = 50 * 11.31 * 1.08 = 610.74 EUR/mois
      const loyer = calculerLoyerEstime(50, "B1", "intermediaire");

      expect(loyer).toBeCloseTo(611, 0);
    });
  });

  describe("zone B2 - niveau intermediaire", () => {
    it("devrait calculer le loyer pour 50m2 en zone B2", () => {
      // Plafond B2 intermediaire: 9.83 EUR/m2
      // Coefficient surface: 1.08
      // Loyer plafond = 50 * 9.83 * 1.08 = 530.82 EUR/mois
      const loyer = calculerLoyerEstime(50, "B2", "intermediaire");

      expect(loyer).toBeCloseTo(531, 0);
    });
  });

  describe("zone C - niveau intermediaire", () => {
    it("devrait calculer le loyer pour 50m2 en zone C", () => {
      // Plafond C intermediaire: 9.83 EUR/m2 (meme que B2)
      // Coefficient surface: 1.08
      // Loyer plafond = 50 * 9.83 * 1.08 = 530.82 EUR/mois
      const loyer = calculerLoyerEstime(50, "C", "intermediaire");

      expect(loyer).toBeCloseTo(531, 0);
    });
  });

  describe("niveau social", () => {
    it("devrait calculer le loyer social pour 50m2 en zone A", () => {
      // Plafond A social: 11.22 EUR/m2
      // Coefficient surface: 1.08
      // Loyer plafond = 50 * 11.22 * 1.08 = 605.88 EUR/mois
      const loyer = calculerLoyerEstime(50, "A", "social");

      expect(loyer).toBeCloseTo(606, 0);
    });

    it("devrait calculer le loyer social pour 50m2 en zone B1", () => {
      // Plafond B1 social: 9.05 EUR/m2
      // Coefficient surface: 1.08
      // Loyer plafond = 50 * 9.05 * 1.08 = 488.70 EUR/mois
      const loyer = calculerLoyerEstime(50, "B1", "social");

      expect(loyer).toBeCloseTo(489, 0);
    });
  });

  describe("niveau tres_social", () => {
    it("devrait calculer le loyer tres social pour 50m2 en zone A", () => {
      // Plafond A tres_social: 8.98 EUR/m2
      // Coefficient surface: 1.08
      // Loyer plafond = 50 * 8.98 * 1.08 = 484.92 EUR/mois
      const loyer = calculerLoyerEstime(50, "A", "tres_social");

      expect(loyer).toBeCloseTo(485, 0);
    });

    it("devrait calculer le loyer tres social pour 50m2 en zone B1", () => {
      // Plafond B1 tres_social: 7.24 EUR/m2
      // Coefficient surface: 1.08
      // Loyer plafond = 50 * 7.24 * 1.08 = 390.96 EUR/mois
      const loyer = calculerLoyerEstime(50, "B1", "tres_social");

      expect(loyer).toBeCloseTo(391, 0);
    });
  });

  describe("coefficient de surface", () => {
    it("devrait plafonner le coefficient a 1.2 pour les petites surfaces", () => {
      // 20m2: coefficient = min(0.7 + 19/20, 1.2) = min(1.65, 1.2) = 1.2
      const loyer20m2 = calculerLoyerEstime(20, "B1", "intermediaire");
      // Loyer = 20 * 11.31 * 1.2 = 271.44 EUR

      expect(loyer20m2).toBeCloseTo(271, 0);
    });

    it("devrait appliquer le coefficient correctement pour les grandes surfaces", () => {
      // 150m2: coefficient = min(0.7 + 19/150, 1.2) = min(0.8267, 1.2) = 0.8267
      const loyer150m2 = calculerLoyerEstime(150, "B1", "intermediaire");
      // Loyer = 150 * 11.31 * 0.8267 = 1402.24 EUR

      expect(loyer150m2).toBeCloseTo(1402, 0);
    });
  });

  describe("cas limites", () => {
    it("devrait retourner 0 pour une surface de 0", () => {
      const loyer = calculerLoyerEstime(0, "A", "intermediaire");

      expect(loyer).toBe(0);
    });

    it("devrait gerer une surface negative", () => {
      const loyer = calculerLoyerEstime(-50, "A", "intermediaire");

      expect(loyer).toBe(0);
    });

    it("devrait retourner un entier (arrondi)", () => {
      const loyer = calculerLoyerEstime(45, "A", "intermediaire");

      expect(Number.isInteger(loyer)).toBe(true);
    });
  });
});

// ============================================
// TESTS ORCHESTRATION SIMULATION - NEUF INTERMEDIAIRE
// ============================================

describe("orchestrerSimulation - Neuf Intermediaire", () => {
  const inputNeufIntermediaire: SimulationCalculInput = {
    // Situation fiscale
    revenuNetImposable: 60000,
    nombreParts: 2,

    // Bien immobilier
    typeBien: "neuf",
    prixAcquisition: 200000,
    surface: 50,
    zoneFiscale: "B1",

    // Niveau de loyer
    niveauLoyer: "intermediaire",
  };

  it("devrait calculer l'IR et la TMI correctement", () => {
    const result = orchestrerSimulation(inputNeufIntermediaire);

    // TMI pour 60000 EUR / 2 parts = 30000 EUR par part
    // 30000 est dans la tranche 30% (> 29315)
    expect(result.tmi.tmi).toBe(0.3);
    expect(result.ir.quotientFamilial).toBe(30000);
  });

  it("devrait calculer l'amortissement Jeanbrun Neuf correctement", () => {
    const result = orchestrerSimulation(inputNeufIntermediaire);

    // Prix 200 000 EUR
    // Base = 200 000 * 0.8 = 160 000 EUR
    // Taux intermediaire neuf = 3.5%
    // Amortissement = 160 000 * 0.035 = 5 600 EUR/an
    expect(result.jeanbrun).toBeDefined();

    // TypeScript: verifie si c'est un resultat neuf
    if ("taux" in result.jeanbrun) {
      expect(result.jeanbrun.baseAmortissement).toBe(160000);
      expect(result.jeanbrun.amortissementNet).toBe(5600);
      expect(result.jeanbrun.plafondApplique).toBe(false);
    }
  });

  it("devrait calculer l'economie d'impot correctement", () => {
    const result = orchestrerSimulation(inputNeufIntermediaire);

    // Amortissement = 5600 EUR
    // TMI = 30%
    // Economie impot = 5600 * 0.30 = 1680 EUR/an
    expect(result.economieImpot).toBeDefined();
    expect(result.economieImpot.economieAmortissement).toBeCloseTo(1680, 0);
    expect(result.economieImpot.economieTotaleAnnuelle).toBeCloseTo(1680, 0);
    expect(result.economieImpot.economieTotale9ans).toBeCloseTo(15120, 0);
  });

  it("devrait generer une projection sur 9 ans", () => {
    const result = orchestrerSimulation(inputNeufIntermediaire);

    expect(result.projection).toHaveLength(9);

    // Premiere annee
    const annee1 = result.projection[0];
    expect(annee1).toBeDefined();
    expect(annee1?.annee).toBe(1);
    expect(annee1?.amortissement).toBe(5600);

    // Derniere annee
    const annee9 = result.projection[8];
    expect(annee9).toBeDefined();
    expect(annee9?.annee).toBe(9);
    expect(annee9?.cumulEconomieImpots).toBeGreaterThan(0);
  });

  it("devrait calculer les rendements", () => {
    const result = orchestrerSimulation(inputNeufIntermediaire);

    expect(result.rendements).toBeDefined();
    expect(result.rendements.rendementBrut).toBeGreaterThan(0);
    expect(result.rendements.rendementNet).toBeDefined();
    expect(result.rendements.rendementNetNet).toBeDefined();
  });

  it("devrait remplir la synthese correctement", () => {
    const result = orchestrerSimulation(inputNeufIntermediaire);

    expect(result.synthese).toBeDefined();
    expect(result.synthese.economieImpotsAnnuelle).toBeCloseTo(1680, 0);
    expect(result.synthese.economieImpots9ans).toBeCloseTo(15120, 0);
    expect(result.synthese.rendementBrut).toBeGreaterThan(0);
    expect(result.synthese.rendementNet).toBeDefined();
    expect(result.synthese.rendementNetNet).toBeDefined();
  });

  it("devrait inclure les metadonnees", () => {
    const result = orchestrerSimulation(inputNeufIntermediaire);

    expect(result.dateCalcul).toBeDefined();
    expect(result.versionFormules).toBeDefined();
    expect(typeof result.dateCalcul).toBe("string");
  });
});

// ============================================
// TESTS ORCHESTRATION SIMULATION - ANCIEN AVEC TRAVAUX
// ============================================

describe("orchestrerSimulation - Ancien avec Travaux", () => {
  describe("travaux eligibles (>= 30%)", () => {
    const inputAncienEligible: SimulationCalculInput = {
      // Situation fiscale
      revenuNetImposable: 60000,
      nombreParts: 2,

      // Bien immobilier
      typeBien: "ancien",
      prixAcquisition: 150000,
      montantTravaux: 50000, // 33% > 30% requis
      surface: 60,
      zoneFiscale: "B1",

      // Niveau de loyer
      niveauLoyer: "intermediaire",
    };

    it("devrait etre eligible si travaux >= 30%", () => {
      const result = orchestrerSimulation(inputAncienEligible);

      // Verification eligibilite
      expect(result.jeanbrun).toBeDefined();
      if ("eligible" in result.jeanbrun) {
        expect(result.jeanbrun.eligible).toBe(true);
      }
    });

    it("devrait calculer l'amortissement Jeanbrun Ancien correctement", () => {
      const result = orchestrerSimulation(inputAncienEligible);

      // Prix achat = 150 000 EUR
      // Travaux = 50 000 EUR (33%)
      // Prix total = 200 000 EUR
      // Base = 200 000 * 0.8 = 160 000 EUR
      // Taux intermediaire ancien = 3.0%
      // Amortissement = 160 000 * 0.03 = 4 800 EUR/an

      if ("eligible" in result.jeanbrun && result.jeanbrun.eligible) {
        expect(result.jeanbrun.prixTotal).toBe(200000);
        expect(result.jeanbrun.baseAmortissement).toBe(160000);
        expect(result.jeanbrun.amortissementNet).toBe(4800);
      }
    });

    it("devrait calculer l'economie d'impot pour bien ancien", () => {
      const result = orchestrerSimulation(inputAncienEligible);

      // Amortissement = 4800 EUR
      // TMI = 30%
      // Economie impot = 4800 * 0.30 = 1440 EUR/an
      expect(result.economieImpot.economieAmortissement).toBeCloseTo(1440, 0);
    });
  });

  describe("travaux insuffisants (< 30%)", () => {
    const inputAncienIneligible: SimulationCalculInput = {
      // Situation fiscale
      revenuNetImposable: 60000,
      nombreParts: 2,

      // Bien immobilier
      typeBien: "ancien",
      prixAcquisition: 150000,
      montantTravaux: 30000, // 20% < 30% requis
      surface: 60,
      zoneFiscale: "B1",

      // Niveau de loyer
      niveauLoyer: "intermediaire",
    };

    it("devrait etre ineligible si travaux < 30%", () => {
      const result = orchestrerSimulation(inputAncienIneligible);

      expect(result.jeanbrun).toBeDefined();
      if ("eligible" in result.jeanbrun) {
        expect(result.jeanbrun.eligible).toBe(false);
        expect(result.jeanbrun.message).toBeDefined();
        expect(result.jeanbrun.seuilTravauxRequis).toBe(45000); // 30% de 150000
        expect(result.jeanbrun.montantManquant).toBe(15000); // 45000 - 30000
      }
    });

    it("devrait avoir une economie d'impot nulle si ineligible", () => {
      const result = orchestrerSimulation(inputAncienIneligible);

      expect(result.economieImpot.economieAmortissement).toBe(0);
      expect(result.economieImpot.economieTotaleAnnuelle).toBe(0);
    });
  });
});

// ============================================
// TESTS ORCHESTRATION SIMULATION - COMPARATIF LMNP
// ============================================

describe("orchestrerSimulation - Comparatif LMNP", () => {
  const inputAvecLMNP: SimulationCalculInput = {
    // Situation fiscale
    revenuNetImposable: 60000,
    nombreParts: 2,

    // Bien immobilier
    typeBien: "neuf",
    prixAcquisition: 200000,
    surface: 50,
    zoneFiscale: "B1",

    // Niveau de loyer
    niveauLoyer: "intermediaire",

    // Options
    comparerLMNP: true,
  };

  it("devrait inclure le comparatif LMNP si demande", () => {
    const result = orchestrerSimulation(inputAvecLMNP);

    expect(result.comparatifLMNP).toBeDefined();
  });

  it("devrait calculer les economies Jeanbrun dans le comparatif", () => {
    const result = orchestrerSimulation(inputAvecLMNP);

    expect(result.comparatifLMNP?.jeanbrun.economieAnnuelle).toBeGreaterThan(0);
    expect(result.comparatifLMNP?.jeanbrun.economie9ans).toBe(
      (result.comparatifLMNP?.jeanbrun.economieAnnuelle ?? 0) * 9
    );
  });

  it("devrait calculer les economies LMNP dans le comparatif", () => {
    const result = orchestrerSimulation(inputAvecLMNP);

    expect(result.comparatifLMNP?.lmnpReel.economieAnnuelle).toBeDefined();
    expect(result.comparatifLMNP?.lmnpReel.economie9ans).toBeDefined();
  });

  it("devrait fournir une recommandation", () => {
    const result = orchestrerSimulation(inputAvecLMNP);

    expect(result.comparatifLMNP?.recommandation).toBeDefined();
    expect(["jeanbrun", "lmnp", "equivalent"]).toContain(
      result.comparatifLMNP?.recommandation
    );
  });

  it("devrait fournir une justification", () => {
    const result = orchestrerSimulation(inputAvecLMNP);

    expect(result.comparatifLMNP?.justification).toBeDefined();
    expect((result.comparatifLMNP?.justification ?? "").length).toBeGreaterThan(
      0
    );
  });

  it("devrait calculer la difference correctement", () => {
    const result = orchestrerSimulation(inputAvecLMNP);

    const expectedDiff =
      (result.comparatifLMNP?.jeanbrun.economieAnnuelle ?? 0) -
      (result.comparatifLMNP?.lmnpReel.economieAnnuelle ?? 0);

    expect(result.comparatifLMNP?.difference).toBeCloseTo(expectedDiff, 0);
  });

  it("ne devrait pas inclure le comparatif LMNP si non demande", () => {
    const inputSansLMNP: SimulationCalculInput = {
      ...inputAvecLMNP,
      comparerLMNP: false,
    };

    const result = orchestrerSimulation(inputSansLMNP);

    expect(result.comparatifLMNP).toBeUndefined();
  });
});

// ============================================
// TESTS ORCHESTRATION SIMULATION - PLUS-VALUE
// ============================================

describe("orchestrerSimulation - Plus-Value", () => {
  const inputAvecPlusValue: SimulationCalculInput = {
    // Situation fiscale
    revenuNetImposable: 60000,
    nombreParts: 2,

    // Bien immobilier
    typeBien: "neuf",
    prixAcquisition: 200000,
    surface: 50,
    zoneFiscale: "B1",

    // Niveau de loyer
    niveauLoyer: "intermediaire",

    // Options plus-value
    calculerPlusValue: true,
    dureeDetentionPrevue: 25,
    prixReventeEstime: 300000,
  };

  it("devrait inclure le calcul de plus-value si demande", () => {
    const result = orchestrerSimulation(inputAvecPlusValue);

    expect(result.plusValue).toBeDefined();
  });

  it("devrait calculer la plus-value brute correctement", () => {
    const result = orchestrerSimulation(inputAvecPlusValue);

    // Prix vente = 300 000 EUR
    // Prix achat = 200 000 EUR
    // Frais acquisition forfait 7.5% = 15 000 EUR
    // Travaux forfait 15% (> 5 ans) = 30 000 EUR
    // Base = 200 000 + 15 000 + 30 000 = 245 000 EUR
    // PV brute = 300 000 - 245 000 = 55 000 EUR
    expect(result.plusValue?.plusValueBrute).toBeCloseTo(55000, 0);
  });

  it("devrait appliquer les abattements pour duree de detention", () => {
    const result = orchestrerSimulation(inputAvecPlusValue);

    // 25 ans de detention
    // Abattement IR: 100% (exonere apres 22 ans)
    expect(result.plusValue?.abattementIR).toBe(1);

    // Abattement PS: 28% + (25-22) * 9% = 28% + 27% = 55%
    // Wait, 23-30 = 8 annees * 9% = 72% + 28% = 100% max a 30 ans
    // A 25 ans: 28% + 3*9% = 55%
    expect(result.plusValue?.abattementPS).toBeCloseTo(0.55, 2);
  });

  it("devrait exonerer l'IR apres 22 ans", () => {
    const result = orchestrerSimulation(inputAvecPlusValue);

    expect(result.plusValue?.impotIR).toBe(0);
  });

  it("devrait calculer les prelevements sociaux restants", () => {
    const result = orchestrerSimulation(inputAvecPlusValue);

    // PS non exoneres avant 30 ans
    // PV imposable PS = PV brute * (1 - 0.55) = 55000 * 0.45 = 24750
    // Impot PS = 24750 * 17.2% = 4257
    expect(result.plusValue?.impotPS).toBeCloseTo(4257, 0);
  });

  it("devrait ne pas avoir de surtaxe si PV imposable IR = 0", () => {
    const result = orchestrerSimulation(inputAvecPlusValue);

    // PV imposable IR = 0 (exonere)
    // Pas de surtaxe
    expect(result.plusValue?.surtaxe).toBe(0);
  });

  it("ne devrait pas inclure la plus-value si non demandee", () => {
    const inputSansPlusValue: SimulationCalculInput = {
      ...inputAvecPlusValue,
      calculerPlusValue: false,
    };

    const result = orchestrerSimulation(inputSansPlusValue);

    expect(result.plusValue).toBeUndefined();
  });

  describe("exoneration totale apres 30 ans", () => {
    const inputPlusValue30ans: SimulationCalculInput = {
      ...inputAvecPlusValue,
      dureeDetentionPrevue: 30,
    };

    it("devrait etre totalement exonere apres 30 ans", () => {
      const result = orchestrerSimulation(inputPlusValue30ans);

      expect(result.plusValue?.exonere).toBe(true);
      expect(result.plusValue?.impotIR).toBe(0);
      expect(result.plusValue?.impotPS).toBe(0);
      expect(result.plusValue?.impotTotal).toBe(0);
      expect(result.plusValue?.motifExoneration).toContain("30");
    });
  });
});

// ============================================
// TESTS ORCHESTRATION SIMULATION - AVEC CREDIT
// ============================================

describe("orchestrerSimulation - Avec Credit", () => {
  const inputAvecCredit: SimulationCalculInput = {
    // Situation fiscale
    revenuNetImposable: 60000,
    nombreParts: 2,

    // Bien immobilier
    typeBien: "neuf",
    prixAcquisition: 200000,
    surface: 50,
    zoneFiscale: "B1",

    // Niveau de loyer
    niveauLoyer: "intermediaire",

    // Financement
    apportPersonnel: 40000, // 20% apport
    tauxCredit: 0.035, // 3.5%
    dureeCredit: 240, // 20 ans
    tauxAssurance: 0.003, // 0.3%
  };

  it("devrait calculer le credit si financement fourni", () => {
    const result = orchestrerSimulation(inputAvecCredit);

    expect(result.credit).toBeDefined();
  });

  it("devrait calculer les mensualites correctement", () => {
    const result = orchestrerSimulation(inputAvecCredit);

    // Capital emprunte = 200000 - 40000 = 160000 EUR
    // Mensualite sur 20 ans a 3.5% = ~928 EUR hors assurance
    expect(result.credit?.mensualiteHorsAssurance).toBeCloseTo(928, 0);
  });

  it("devrait inclure l'assurance dans la mensualite totale", () => {
    const result = orchestrerSimulation(inputAvecCredit);

    // Assurance mensuelle = 160000 * 0.003 / 12 = 40 EUR
    // Mensualite avec assurance = 928 + 40 = 968 EUR
    expect(result.credit?.mensualiteAvecAssurance).toBeCloseTo(968, 0);
  });

  it("devrait calculer le taux d'endettement", () => {
    const result = orchestrerSimulation(inputAvecCredit);

    expect(result.tauxEndettement).toBeDefined();
    // Revenus mensuels = 60000 / 12 = 5000 EUR
    // Mensualite = ~968 EUR
    // Taux = 968 / 5000 = 19.36%
    expect(result.tauxEndettement?.tauxEndettement).toBeCloseTo(0.194, 2);
    expect(result.tauxEndettement?.acceptable).toBe(true);
    expect(result.tauxEndettement?.recommande).toBe(true);
  });

  it("devrait calculer le cout total du credit", () => {
    const result = orchestrerSimulation(inputAvecCredit);

    // Cout total = mensualites sur 20 ans - capital
    // = 240 * 928 - 160000 = 62720 EUR (hors assurance)
    expect(result.credit?.totalInterets).toBeGreaterThan(60000);
    expect(result.credit?.totalInterets).toBeLessThan(70000);
  });

  it("devrait generer un tableau d'amortissement", () => {
    const result = orchestrerSimulation(inputAvecCredit);

    expect(result.credit?.tableau).toBeDefined();
    expect(result.credit?.tableau.length).toBe(240); // 20 ans * 12 mois
  });

  it("devrait ne pas calculer le credit si pas de financement", () => {
    const inputSansCredit: SimulationCalculInput = {
      revenuNetImposable: 60000,
      nombreParts: 2,
      typeBien: "neuf",
      prixAcquisition: 200000,
      surface: 50,
      zoneFiscale: "B1",
      niveauLoyer: "intermediaire",
    };

    const result = orchestrerSimulation(inputSansCredit);

    expect(result.credit).toBeUndefined();
    expect(result.tauxEndettement).toBeUndefined();
  });
});

// ============================================
// TESTS EDGE CASES ET CAS LIMITES
// ============================================

describe("orchestrerSimulation - Edge Cases", () => {
  describe("revenus minimaux (non imposable)", () => {
    const inputRevenusMinimaux: SimulationCalculInput = {
      revenuNetImposable: 10000, // Sous le seuil de la tranche 11%
      nombreParts: 1,
      typeBien: "neuf",
      prixAcquisition: 100000,
      surface: 30,
      zoneFiscale: "C",
      niveauLoyer: "intermediaire",
    };

    it("devrait gerer les revenus non imposables", () => {
      const result = orchestrerSimulation(inputRevenusMinimaux);

      expect(result.tmi.tmi).toBe(0);
      expect(result.ir.impotNet).toBe(0);
      // Pas d'economie d'impot possible si TMI = 0
      expect(result.economieImpot.economieAmortissement).toBe(0);
    });
  });

  describe("revenus eleves (TMI 45%)", () => {
    const inputRevenusEleves: SimulationCalculInput = {
      revenuNetImposable: 400000,
      nombreParts: 2,
      typeBien: "neuf",
      prixAcquisition: 300000,
      surface: 80,
      zoneFiscale: "A",
      niveauLoyer: "intermediaire",
    };

    it("devrait calculer avec TMI 45%", () => {
      const result = orchestrerSimulation(inputRevenusEleves);

      // QF = 400000 / 2 = 200000 EUR -> tranche 45%
      expect(result.tmi.tmi).toBe(0.45);
    });

    it("devrait maximiser l'economie d'impot avec TMI elevee", () => {
      const result = orchestrerSimulation(inputRevenusEleves);

      // Amortissement plafonne = 8000 EUR (plafond intermediaire neuf)
      // Economie = 8000 * 0.45 = 3600 EUR
      expect(result.economieImpot.economieAmortissement).toBeCloseTo(3600, 0);
    });
  });

  describe("bien tres couteux (plafonnement)", () => {
    const inputBienCouteux: SimulationCalculInput = {
      revenuNetImposable: 100000,
      nombreParts: 2,
      typeBien: "neuf",
      prixAcquisition: 500000,
      surface: 100,
      zoneFiscale: "A_BIS",
      niveauLoyer: "intermediaire",
    };

    it("devrait appliquer le plafond d'amortissement", () => {
      const result = orchestrerSimulation(inputBienCouteux);

      // Base = 500000 * 0.8 = 400000 EUR
      // Amortissement brut = 400000 * 0.035 = 14000 EUR
      // Plafond intermediaire neuf = 8000 EUR
      if ("taux" in result.jeanbrun) {
        expect(result.jeanbrun.amortissementBrut).toBe(14000);
        expect(result.jeanbrun.amortissementNet).toBe(8000);
        expect(result.jeanbrun.plafondApplique).toBe(true);
      }
    });
  });

  describe("valeurs manquantes ou nulles", () => {
    it("devrait gerer prixAcquisition = 0", () => {
      const inputPrixZero: SimulationCalculInput = {
        revenuNetImposable: 60000,
        nombreParts: 2,
        typeBien: "neuf",
        prixAcquisition: 0,
        surface: 50,
        zoneFiscale: "B1",
        niveauLoyer: "intermediaire",
      };

      const result = orchestrerSimulation(inputPrixZero);

      if ("taux" in result.jeanbrun) {
        expect(result.jeanbrun.amortissementNet).toBe(0);
      }
      expect(result.economieImpot.economieAmortissement).toBe(0);
    });

    it("devrait gerer surface = 0", () => {
      const inputSurfaceZero: SimulationCalculInput = {
        revenuNetImposable: 60000,
        nombreParts: 2,
        typeBien: "neuf",
        prixAcquisition: 200000,
        surface: 0,
        zoneFiscale: "B1",
        niveauLoyer: "intermediaire",
      };

      const result = orchestrerSimulation(inputSurfaceZero);

      // Le calcul devrait quand meme fonctionner
      expect(result.jeanbrun).toBeDefined();
    });
  });

  describe("ancien sans montantTravaux specifie", () => {
    it("devrait traiter montantTravaux undefined comme 0", () => {
      const inputAncienSansTravaux: SimulationCalculInput = {
        revenuNetImposable: 60000,
        nombreParts: 2,
        typeBien: "ancien",
        prixAcquisition: 150000,
        // montantTravaux non specifie
        surface: 60,
        zoneFiscale: "B1",
        niveauLoyer: "intermediaire",
      };

      const result = orchestrerSimulation(inputAncienSansTravaux);

      if ("eligible" in result.jeanbrun) {
        expect(result.jeanbrun.eligible).toBe(false);
        expect(result.jeanbrun.seuilTravauxRequis).toBe(45000);
        expect(result.jeanbrun.montantManquant).toBe(45000);
      }
    });
  });
});

// ============================================
// TESTS NIVEAUX LOYER SOCIAL ET TRES SOCIAL
// ============================================

describe("orchestrerSimulation - Niveaux Social et Tres Social", () => {
  const baseInput: Omit<SimulationCalculInput, "niveauLoyer"> = {
    revenuNetImposable: 60000,
    nombreParts: 2,
    typeBien: "neuf",
    prixAcquisition: 200000,
    surface: 50,
    zoneFiscale: "B1",
  };

  describe("niveau social", () => {
    const inputSocial: SimulationCalculInput = {
      ...baseInput,
      niveauLoyer: "social",
    };

    it("devrait appliquer le taux social (4.5%)", () => {
      const result = orchestrerSimulation(inputSocial);

      // Base = 200000 * 0.8 = 160000 EUR
      // Amortissement = 160000 * 0.045 = 7200 EUR
      if ("taux" in result.jeanbrun) {
        expect(result.jeanbrun.taux).toBe(0.045);
        expect(result.jeanbrun.amortissementNet).toBe(7200);
        expect(result.jeanbrun.plafond).toBe(10000);
      }
    });

    it("devrait calculer l'economie d'impot avec taux social", () => {
      const result = orchestrerSimulation(inputSocial);

      // Economie = 7200 * 0.30 = 2160 EUR
      expect(result.economieImpot.economieAmortissement).toBeCloseTo(2160, 0);
    });
  });

  describe("niveau tres social", () => {
    const inputTresSocial: SimulationCalculInput = {
      ...baseInput,
      niveauLoyer: "tres_social",
    };

    it("devrait appliquer le taux tres social (5.5%)", () => {
      const result = orchestrerSimulation(inputTresSocial);

      // Base = 200000 * 0.8 = 160000 EUR
      // Amortissement = 160000 * 0.055 = 8800 EUR
      if ("taux" in result.jeanbrun) {
        expect(result.jeanbrun.taux).toBe(0.055);
        expect(result.jeanbrun.amortissementNet).toBe(8800);
        expect(result.jeanbrun.plafond).toBe(12000);
      }
    });

    it("devrait calculer l'economie d'impot avec taux tres social", () => {
      const result = orchestrerSimulation(inputTresSocial);

      // Economie = 8800 * 0.30 = 2640 EUR
      expect(result.economieImpot.economieAmortissement).toBeCloseTo(2640, 0);
    });
  });
});

// ============================================
// TESTS REVENUS LOCATIFS ET CHARGES
// ============================================

describe("orchestrerSimulation - Revenus Locatifs et Charges", () => {
  const inputAvecRevenus: SimulationCalculInput = {
    revenuNetImposable: 60000,
    nombreParts: 2,
    typeBien: "neuf",
    prixAcquisition: 200000,
    surface: 50,
    zoneFiscale: "B1",
    niveauLoyer: "intermediaire",

    // Revenus locatifs et charges
    loyerMensuelEstime: 700,
    chargesCopropriete: 1200, // 100 EUR/mois
    taxeFonciere: 1500,
  };

  it("devrait calculer le cash-flow mensuel", () => {
    const result = orchestrerSimulation(inputAvecRevenus);

    // Cash-flow = loyer - (charges mensuelles + taxe fonciere mensuelle)
    // = 700 - (100 + 125) = 475 EUR/mois (approximatif)
    expect(result.cashflowMensuel).toBeDefined();
  });

  it("devrait calculer le cash-flow annuel", () => {
    const result = orchestrerSimulation(inputAvecRevenus);

    // Cash-flow annuel = loyer annuel - charges annuelles - taxe fonciere
    // = 700*12 - 1200 - 1500 = 8400 - 2700 = 5700 EUR
    expect(result.cashflowAnnuel).toBeCloseTo(5700, 0);
  });

  it("devrait calculer le rendement brut", () => {
    const result = orchestrerSimulation(inputAvecRevenus);

    // Rendement brut = (loyer annuel / prix acquisition) * 100
    // = (8400 / 200000) * 100 = 4.2%
    expect(result.rendements.rendementBrut).toBeCloseTo(4.2, 1);
  });

  it("devrait calculer le rendement net", () => {
    const result = orchestrerSimulation(inputAvecRevenus);

    // Rendement net = ((loyer annuel - charges) / prix acquisition) * 100
    // = ((8400 - 2700) / 200000) * 100 = 2.85%
    expect(result.rendements.rendementNet).toBeCloseTo(2.85, 1);
  });

  it("devrait estimer le loyer si non fourni", () => {
    // Omit loyerMensuelEstime from the input to test auto-estimation
    const { loyerMensuelEstime: _, ...inputSansLoyer } = inputAvecRevenus;

    const result = orchestrerSimulation(inputSansLoyer);

    // Le loyer devrait etre estime automatiquement
    // Zone B1, 50m2, intermediaire -> ~611 EUR/mois
    expect(result.projection[0]?.loyerAnnuel).toBeGreaterThan(0);
  });
});
