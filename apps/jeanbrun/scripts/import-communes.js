#!/usr/bin/env node
/**
 * Import Communes depuis l'API Geo
 * Source: geo.api.gouv.fr (Etalab)
 *
 * Usage: node import-communes.js [--departement 69]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const GEO_API_BASE = 'https://geo.api.gouv.fr';
const OUTPUT_DIR = path.join(__dirname, '..', 'data');

// Zones fiscales (simplifiees - a affiner avec arrete officiel)
const ZONES_FISCALES = {
  // Zone A bis - Paris et petite couronne
  '75': 'A_bis',

  // Zone A - Ile-de-France, Cote d'Azur, Genevois
  '77': 'A', '78': 'A', '91': 'A', '92': 'A', '93': 'A', '94': 'A', '95': 'A',
  '06': 'A', '69': 'A', '13': 'A', '01': 'A', '74': 'A',

  // Zone B1 - Grandes agglomerations
  '33': 'B1', '31': 'B1', '44': 'B1', '67': 'B1', '59': 'B1',
  '35': 'B1', '34': 'B1', '38': 'B1', '54': 'B1', '57': 'B1',

  // Zone B2 - Villes moyennes
  // ... autres departements

  // Zone C - Reste du territoire (defaut)
};

function getZoneFiscale(codeDep, codeCommune, population) {
  // Paris
  if (codeCommune === '75056') return 'A_bis';

  // Grande couronne tres peuplee
  if (['92', '93', '94'].includes(codeDep)) return 'A';

  // Grandes metropoles
  if (['69123', '13055', '31555', '33063', '44109', '59350', '67482'].includes(codeCommune)) {
    return 'A';
  }

  // Par departement
  if (ZONES_FISCALES[codeDep]) return ZONES_FISCALES[codeDep];

  // Defaut selon population
  if (population > 250000) return 'B1';
  if (population > 50000) return 'B2';

  return 'C';
}

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function getDepartements() {
  console.log('Recuperation liste departements...');
  const deps = await fetchJSON(`${GEO_API_BASE}/departements`);
  return deps.map(d => ({
    code: d.code,
    nom: d.nom,
    region: d.codeRegion
  }));
}

async function getCommunesByDepartement(codeDep) {
  const url = `${GEO_API_BASE}/departements/${codeDep}/communes?fields=nom,code,codesPostaux,population,centre`;
  return fetchJSON(url);
}

async function main() {
  console.log('\n=== Import Communes France ===\n');

  // Parse arguments
  const args = process.argv.slice(2);
  const depIndex = args.indexOf('--departement');
  const filterDep = depIndex !== -1 ? args[depIndex + 1] : null;

  // Creer dossier si necessaire
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Recuperer departements
  const departements = await getDepartements();
  console.log(`${departements.length} departements`);

  const allCommunes = [];
  const depsToProcess = filterDep
    ? departements.filter(d => d.code === filterDep)
    : departements;

  for (const dep of depsToProcess) {
    process.stdout.write(`\rTraitement ${dep.nom} (${dep.code})...`);

    try {
      const communes = await getCommunesByDepartement(dep.code);

      for (const c of communes) {
        const commune = {
          code: c.code,
          nom: c.nom,
          codes_postaux: c.codesPostaux || [],
          population: c.population || 0,
          departement: dep.code,
          departement_nom: dep.nom,
          region: dep.region,
          latitude: c.centre?.coordinates?.[1] || null,
          longitude: c.centre?.coordinates?.[0] || null,
          zone_fiscale: getZoneFiscale(dep.code, c.code, c.population || 0),
          date_maj: new Date().toISOString()
        };

        allCommunes.push(commune);
      }

      // Rate limiting soft
      await new Promise(r => setTimeout(r, 50));

    } catch (error) {
      console.error(`\nErreur ${dep.code}: ${error.message}`);
    }
  }

  console.log(`\n\nTotal: ${allCommunes.length} communes`);

  // Sauvegarder
  const outputFile = path.join(OUTPUT_DIR, 'communes.json');
  fs.writeFileSync(outputFile, JSON.stringify(allCommunes, null, 2));
  console.log(`Sauvegarde: ${outputFile}`);

  // Stats zones fiscales
  const statsZones = {};
  allCommunes.forEach(c => {
    statsZones[c.zone_fiscale] = (statsZones[c.zone_fiscale] || 0) + 1;
  });

  console.log('\nRepartition zones fiscales:');
  Object.entries(statsZones)
    .sort((a, b) => b[1] - a[1])
    .forEach(([zone, count]) => {
      console.log(`  ${zone}: ${count} communes`);
    });

  // Top 20 villes par population
  console.log('\nTop 20 communes par population:');
  allCommunes
    .sort((a, b) => b.population - a.population)
    .slice(0, 20)
    .forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.nom} (${c.departement}): ${c.population.toLocaleString()} hab - Zone ${c.zone_fiscale}`);
    });
}

main().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
