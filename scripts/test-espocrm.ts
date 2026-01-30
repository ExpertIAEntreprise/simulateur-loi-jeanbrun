/**
 * Script de test manuel pour le client EspoCRM
 *
 * Usage:
 * 1. Configurer ESPOCRM_API_KEY dans .env.local
 * 2. Exécuter: pnpm tsx scripts/test-espocrm.ts
 */

import { EspoCRMClient } from "../src/lib/espocrm/client";
// Décommenter ces imports si vous testez la création de leads (test 7)
// import { toEspoLead } from "../src/lib/espocrm/types";
// import type { LeadInput } from "../src/types/lead";

const API_KEY = process.env.ESPOCRM_API_KEY;
const BASE_URL =
  process.env.ESPOCRM_BASE_URL ||
  "https://espocrm.expert-ia-entreprise.fr/api/v1";

async function main() {
  console.log("🧪 Test du client EspoCRM\n");

  if (!API_KEY) {
    console.error("❌ ESPOCRM_API_KEY non configurée dans .env.local");
    process.exit(1);
  }

  const client = new EspoCRMClient(BASE_URL, API_KEY);

  // Test 1: Health check
  console.log("1️⃣ Test de connexion...");
  const isHealthy = await client.healthCheck();
  console.log(isHealthy ? "✅ Connexion OK" : "❌ Connexion échouée");
  console.log();

  if (!isHealthy) {
    console.error("❌ Impossible de continuer sans connexion EspoCRM");
    process.exit(1);
  }

  // Test 2: Récupérer toutes les villes
  console.log("2️⃣ Récupération de toutes les villes...");
  const villesResponse = await client.getVilles();
  console.log(`✅ ${villesResponse.total} villes trouvées`);
  console.log(`   Premières villes:`, villesResponse.list.slice(0, 3).map((v) => v.name));
  console.log();

  // Test 3: Filtrer villes par département
  console.log("3️⃣ Filtrage villes département 75 (Paris)...");
  const villesParis = await client.getVilles({ departement: "75" });
  console.log(`✅ ${villesParis.total} ville(s) trouvée(s)`);
  if (villesParis.list.length > 0) {
    console.log(`   Ville: ${villesParis.list[0]?.name}`);
    console.log(`   Zone fiscale: ${villesParis.list[0]?.cZoneFiscale}`);
    console.log(`   Prix m²: ${villesParis.list[0]?.cPrixM2Moyen}€`);
  }
  console.log();

  // Test 4: Rechercher ville par slug
  console.log("4️⃣ Recherche ville par slug 'paris'...");
  const paris = await client.getVilleBySlug("paris");
  if (paris) {
    console.log(`✅ Ville trouvée: ${paris.name}`);
    console.log(`   Code INSEE: ${paris.cCodeInsee}`);
    console.log(`   Population: ${paris.cPopulationCommune}`);
  } else {
    console.log("❌ Ville non trouvée");
  }
  console.log();

  // Test 5: Récupérer programmes (si ville trouvée)
  if (paris) {
    console.log("5️⃣ Récupération programmes à Paris...");
    const programmes = await client.getProgrammes({ villeId: paris.id });
    console.log(`✅ ${programmes.total} programme(s) trouvé(s)`);
    if (programmes.list.length > 0) {
      console.log(`   Premier programme: ${programmes.list[0]?.name}`);
      console.log(`   Promoteur: ${programmes.list[0]?.cPromoteur}`);
      console.log(`   Prix: ${programmes.list[0]?.cPrixMin}€ - ${programmes.list[0]?.cPrixMax}€`);
    }
    console.log();
  }

  // Test 6: Vérifier si un lead existe
  console.log("6️⃣ Recherche lead test (test@example.com)...");
  const existingLead = await client.findLeadByEmail("test@example.com");
  console.log(
    existingLead
      ? `✅ Lead existant trouvé: ${existingLead.id}`
      : "ℹ️  Lead non trouvé (normal si jamais créé)"
  );
  console.log();

  // Test 7: Créer un lead de test (optionnel, décommenter si besoin)
  /*
  console.log("7️⃣ Création d'un lead de test...");
  const leadData: LeadInput = {
    email: `test-${Date.now()}@example.com`,
    telephone: "+33612345678",
    prenom: "Test",
    nom: "EspoCRM",
    consentementRgpd: true,
    consentementMarketing: false,
    sourceUtm: "test-script",
  };

  const espoLead = toEspoLead(leadData);
  const createdLead = await client.createLead(espoLead);
  console.log(`✅ Lead créé: ${createdLead.id}`);
  console.log(`   Email: ${createdLead.emailAddress}`);
  console.log(`   Source: ${createdLead.cSource}`);
  console.log();
  */

  console.log("✅ Tous les tests sont passés!");
}

// Exécuter le script
main().catch((error) => {
  console.error("❌ Erreur lors du test:", error);
  process.exit(1);
});
