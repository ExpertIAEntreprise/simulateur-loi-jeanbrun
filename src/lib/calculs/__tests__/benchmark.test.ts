/**
 * Benchmarks de performance pour le moteur de calcul fiscal
 *
 * Objectif: Detecter les regressions de performance
 * Exigence ENF-1: Temps de calcul < 50ms pour une simulation complete
 *
 * Metriques mesurees:
 * - calculerIR: calcul IR seul
 * - calculerJeanbrunNeuf: amortissement neuf seul
 * - calculerPlusValue: plus-value seul
 * - orchestrerSimulation: simulation complete
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect } from "vitest";
import { calculerIR } from "../ir";
import { calculerJeanbrunNeuf } from "../jeanbrun-neuf";
import { orchestrerSimulation } from "../orchestrateur";
import { calculerPlusValue } from "../plus-value";
import type { IRInput } from "../types/ir";
import type { JeanbrunNeufInput } from "../types/jeanbrun";
import type { PlusValueInput } from "../types/plus-value";
import type { SimulationCalculInput } from "../types/simulation";

// ============================================
// DONNEES DE TEST POUR BENCHMARKS
// ============================================

/**
 * Input IR typique (celibataire revenu moyen)
 */
const irInput: IRInput = {
  revenuNetImposable: 45000,
  nombreParts: 1,
};

/**
 * Input IR couple avec enfants (cas plus complexe)
 */
const irInputComplex: IRInput = {
  revenuNetImposable: 120000,
  nombreParts: 3,
};

/**
 * Input Jeanbrun Neuf typique
 */
const jeanbrunNeufInput: JeanbrunNeufInput = {
  prixAcquisition: 250000,
  niveauLoyer: "intermediaire",
};

/**
 * Input Jeanbrun Neuf avec plafonnement
 */
const jeanbrunNeufInputPlafonne: JeanbrunNeufInput = {
  prixAcquisition: 400000,
  niveauLoyer: "intermediaire",
};

/**
 * Input Plus-Value typique (detention moyenne)
 */
const plusValueInput: PlusValueInput = {
  prixVente: 350000,
  prixAchat: 250000,
  dureeDetention: 10,
};

/**
 * Input Plus-Value complexe (avec travaux et frais)
 */
const plusValueInputComplex: PlusValueInput = {
  prixVente: 500000,
  prixAchat: 300000,
  fraisAcquisition: 25000,
  travaux: 50000,
  fraisVente: 15000,
  dureeDetention: 18,
};

/**
 * Input simulation complete typique (bien neuf)
 */
const simulationInputNeuf: SimulationCalculInput = {
  revenuNetImposable: 60000,
  nombreParts: 2,
  typeBien: "neuf",
  prixAcquisition: 280000,
  surface: 65,
  zoneFiscale: "B1",
  niveauLoyer: "intermediaire",
  chargesCopropriete: 1200,
  taxeFonciere: 800,
};

/**
 * Input simulation complete avec credit
 */
const simulationInputAvecCredit: SimulationCalculInput = {
  revenuNetImposable: 75000,
  nombreParts: 2.5,
  typeBien: "neuf",
  prixAcquisition: 320000,
  surface: 75,
  zoneFiscale: "A",
  niveauLoyer: "social",
  apportPersonnel: 60000,
  tauxCredit: 3.5,
  dureeCredit: 240,
  tauxAssurance: 0.3,
  chargesCopropriete: 1500,
  taxeFonciere: 1200,
};

/**
 * Input simulation complete avec options (LMNP + plus-value)
 */
const simulationInputComplet: SimulationCalculInput = {
  revenuNetImposable: 90000,
  nombreParts: 3,
  typeBien: "neuf",
  prixAcquisition: 350000,
  surface: 85,
  zoneFiscale: "A_BIS",
  niveauLoyer: "social",
  apportPersonnel: 70000,
  tauxCredit: 3.2,
  dureeCredit: 300,
  tauxAssurance: 0.25,
  chargesCopropriete: 1800,
  taxeFonciere: 1500,
  comparerLMNP: true,
  calculerPlusValue: true,
  dureeDetentionPrevue: 15,
  prixReventeEstime: 450000,
};

/**
 * Input simulation bien ancien
 */
const simulationInputAncien: SimulationCalculInput = {
  revenuNetImposable: 55000,
  nombreParts: 1.5,
  typeBien: "ancien",
  prixAcquisition: 180000,
  montantTravaux: 60000, // 33% du prix (eligible)
  surface: 60,
  zoneFiscale: "B2",
  niveauLoyer: "intermediaire",
  chargesCopropriete: 900,
  taxeFonciere: 600,
};

// ============================================
// CONSTANTES BENCHMARK
// ============================================

const ITERATIONS = 100;
const MAX_TIME_MS = 50; // ENF-1: < 50ms par simulation

// ============================================
// BENCHMARKS calculerIR
// ============================================

describe("Performance Benchmarks - calculerIR", () => {
  it("devrait calculer IR en moins de 1ms en moyenne (cas simple)", () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      calculerIR(irInput);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] calculerIR (simple): ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(1);
  });

  it("devrait calculer IR en moins de 1ms en moyenne (cas complexe)", () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      calculerIR(irInputComplex);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] calculerIR (complex): ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(1);
  });

  it("devrait calculer IR pour 1000 iterations en moins de 500ms", () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      calculerIR(irInput);
    }

    const duration = performance.now() - start;

    console.log(`[Benchmark] calculerIR x1000: ${duration.toFixed(2)}ms total`);

    expect(duration).toBeLessThan(500);
  });
});

// ============================================
// BENCHMARKS calculerJeanbrunNeuf
// ============================================

describe("Performance Benchmarks - calculerJeanbrunNeuf", () => {
  it("devrait calculer Jeanbrun Neuf en moins de 0.5ms en moyenne", () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      calculerJeanbrunNeuf(jeanbrunNeufInput);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] calculerJeanbrunNeuf: ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(0.5);
  });

  it("devrait calculer Jeanbrun Neuf avec plafonnement en moins de 0.5ms", () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      calculerJeanbrunNeuf(jeanbrunNeufInputPlafonne);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] calculerJeanbrunNeuf (plafonne): ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(0.5);
  });

  it("devrait calculer les 3 niveaux de loyer en moins de 1ms total", () => {
    const niveaux = ["intermediaire", "social", "tres_social"] as const;

    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      for (const niveau of niveaux) {
        calculerJeanbrunNeuf({ prixAcquisition: 250000, niveauLoyer: niveau });
      }
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] calculerJeanbrunNeuf (3 niveaux): ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(1);
  });
});

// ============================================
// BENCHMARKS calculerPlusValue
// ============================================

describe("Performance Benchmarks - calculerPlusValue", () => {
  it("devrait calculer la plus-value en moins de 0.5ms en moyenne (cas simple)", () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      calculerPlusValue(plusValueInput);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] calculerPlusValue (simple): ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(0.5);
  });

  it("devrait calculer la plus-value en moins de 1ms en moyenne (cas complexe)", () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      calculerPlusValue(plusValueInputComplex);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] calculerPlusValue (complex): ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(1);
  });

  it("devrait calculer plus-values pour differentes durees de detention en moins de 5ms", () => {
    // Test 30 durees differentes (0 a 30 ans)
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      for (let duree = 0; duree <= 30; duree++) {
        calculerPlusValue({
          ...plusValueInput,
          dureeDetention: duree,
        });
      }
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] calculerPlusValue (31 durees): ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(5);
  });
});

// ============================================
// BENCHMARKS orchestrerSimulation (ENF-1)
// ============================================

describe("Performance Benchmarks - orchestrerSimulation (ENF-1)", () => {
  it(`devrait executer simulation complete en moins de ${MAX_TIME_MS}ms (cas simple)`, () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      orchestrerSimulation(simulationInputNeuf);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] orchestrerSimulation (neuf simple): ${avgTime.toFixed(3)}ms/iteration`);

    // ENF-1: Temps de calcul < 50ms pour une simulation complete
    expect(avgTime).toBeLessThan(MAX_TIME_MS);
  });

  it(`devrait executer simulation avec credit en moins de ${MAX_TIME_MS}ms`, () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      orchestrerSimulation(simulationInputAvecCredit);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] orchestrerSimulation (avec credit): ${avgTime.toFixed(3)}ms/iteration`);

    // ENF-1: Temps de calcul < 50ms pour une simulation complete
    expect(avgTime).toBeLessThan(MAX_TIME_MS);
  });

  it(`devrait executer simulation complete avec LMNP + plus-value en moins de ${MAX_TIME_MS}ms`, () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      orchestrerSimulation(simulationInputComplet);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] orchestrerSimulation (complet): ${avgTime.toFixed(3)}ms/iteration`);

    // ENF-1: Temps de calcul < 50ms pour une simulation complete
    expect(avgTime).toBeLessThan(MAX_TIME_MS);
  });

  it(`devrait executer simulation bien ancien en moins de ${MAX_TIME_MS}ms`, () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      orchestrerSimulation(simulationInputAncien);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] orchestrerSimulation (ancien): ${avgTime.toFixed(3)}ms/iteration`);

    // ENF-1: Temps de calcul < 50ms pour une simulation complete
    expect(avgTime).toBeLessThan(MAX_TIME_MS);
  });

  it("devrait executer 1000 simulations en moins de 5 secondes", () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      orchestrerSimulation(simulationInputNeuf);
    }

    const duration = performance.now() - start;

    console.log(`[Benchmark] orchestrerSimulation x1000: ${duration.toFixed(2)}ms total (${(duration / 1000).toFixed(3)}ms/op)`);

    // 1000 simulations en moins de 5 secondes = 5ms/simulation en moyenne
    expect(duration).toBeLessThan(5000);
  });
});

// ============================================
// BENCHMARKS COMBINAISON DE MODULES
// ============================================

describe("Performance Benchmarks - Combinaison de modules", () => {
  it("devrait executer IR + Jeanbrun + PlusValue en moins de 2ms", () => {
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      calculerIR(irInput);
      calculerJeanbrunNeuf(jeanbrunNeufInput);
      calculerPlusValue(plusValueInput);
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] IR + Jeanbrun + PlusValue: ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(2);
  });

  it("devrait executer tous les modules en parallele conceptuel en moins de 5ms", () => {
    // Simule l'execution de tous les calculs comme dans une vraie application
    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      // Calculs fiscaux de base
      calculerIR({ revenuNetImposable: 30000, nombreParts: 1 });
      calculerIR({ revenuNetImposable: 60000, nombreParts: 2 });
      calculerIR({ revenuNetImposable: 90000, nombreParts: 3 });

      // Calculs Jeanbrun pour differents prix
      calculerJeanbrunNeuf({ prixAcquisition: 200000, niveauLoyer: "intermediaire" });
      calculerJeanbrunNeuf({ prixAcquisition: 300000, niveauLoyer: "social" });
      calculerJeanbrunNeuf({ prixAcquisition: 400000, niveauLoyer: "tres_social" });

      // Calculs plus-value pour differentes durees
      calculerPlusValue({ prixVente: 300000, prixAchat: 200000, dureeDetention: 5 });
      calculerPlusValue({ prixVente: 400000, prixAchat: 250000, dureeDetention: 15 });
      calculerPlusValue({ prixVente: 500000, prixAchat: 300000, dureeDetention: 25 });
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] Tous modules (9 calculs): ${avgTime.toFixed(3)}ms/iteration`);

    expect(avgTime).toBeLessThan(5);
  });
});

// ============================================
// BENCHMARKS STRESS TEST
// ============================================

describe("Performance Benchmarks - Stress Test", () => {
  it("devrait supporter 10000 calculs IR en moins de 2 secondes", () => {
    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      calculerIR({
        revenuNetImposable: 20000 + (i % 100) * 1000,
        nombreParts: 1 + (i % 4) * 0.5,
      });
    }

    const duration = performance.now() - start;

    console.log(`[Benchmark] calculerIR x10000: ${duration.toFixed(2)}ms total`);

    expect(duration).toBeLessThan(2000);
  });

  it("devrait supporter variations rapides d'inputs simulation", () => {
    const zones = ["A_BIS", "A", "B1", "B2", "C"] as const;
    const niveaux = ["intermediaire", "social", "tres_social"] as const;

    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
      const zoneIndex = i % zones.length;
      const niveauIndex = i % niveaux.length;
      const zone = zones[zoneIndex] ?? "B1";
      const niveau = niveaux[niveauIndex] ?? "intermediaire";
      const prix = 150000 + (i % 20) * 25000;

      orchestrerSimulation({
        revenuNetImposable: 40000 + (i % 10) * 5000,
        nombreParts: 1 + (i % 5) * 0.5,
        typeBien: i % 2 === 0 ? "neuf" : "ancien",
        prixAcquisition: prix,
        montantTravaux: i % 2 === 1 ? prix * 0.35 : 0,
        surface: 40 + (i % 10) * 10,
        zoneFiscale: zone,
        niveauLoyer: niveau,
        chargesCopropriete: 600 + (i % 5) * 200,
        taxeFonciere: 400 + (i % 5) * 150,
      });
    }

    const duration = performance.now() - start;
    const avgTime = duration / ITERATIONS;

    console.log(`[Benchmark] orchestrerSimulation (variations): ${avgTime.toFixed(3)}ms/iteration`);

    // Meme avec variations, devrait rester sous 50ms
    expect(avgTime).toBeLessThan(MAX_TIME_MS);
  });
});

// ============================================
// RAPPORT DE PERFORMANCE
// ============================================

describe("Rapport de Performance", () => {
  it("devrait generer un resume des benchmarks", () => {
    const results: Record<string, number> = {};

    // IR
    let start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) calculerIR(irInput);
    results["calculerIR"] = (performance.now() - start) / ITERATIONS;

    // Jeanbrun Neuf
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) calculerJeanbrunNeuf(jeanbrunNeufInput);
    results["calculerJeanbrunNeuf"] = (performance.now() - start) / ITERATIONS;

    // Plus-Value
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) calculerPlusValue(plusValueInput);
    results["calculerPlusValue"] = (performance.now() - start) / ITERATIONS;

    // Simulation complete
    start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) orchestrerSimulation(simulationInputComplet);
    results["orchestrerSimulation"] = (performance.now() - start) / ITERATIONS;

    console.log("\n========================================");
    console.log("RAPPORT DE PERFORMANCE (moyenne sur", ITERATIONS, "iterations)");
    console.log("========================================");
    console.log(`| Module                  | Temps (ms) |`);
    console.log(`|-------------------------|------------|`);
    Object.entries(results).forEach(([name, time]) => {
      const status = time < MAX_TIME_MS ? "OK" : "LENT";
      console.log(`| ${name.padEnd(23)} | ${time.toFixed(3).padStart(10)} | ${status}`);
    });
    console.log("========================================");
    console.log(`Seuil ENF-1: ${MAX_TIME_MS}ms max par simulation`);
    console.log("========================================\n");

    // Tous les modules doivent etre sous le seuil
    expect(results["orchestrerSimulation"]).toBeLessThan(MAX_TIME_MS);
  });
});
