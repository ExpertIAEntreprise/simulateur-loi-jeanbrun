#!/usr/bin/env node
/**
 * Import Loyers depuis data.gouv.fr
 * Source: Carte des loyers - Ministere de la Transition ecologique
 *
 * Usage: node import-loyers.js [--year 2025]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const LOYERS_URLS = {
  2025: {
    appartements: 'https://static.data.gouv.fr/resources/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/20251211-145010/pred-app-mef-dhup.csv',
    maisons: 'https://static.data.gouv.fr/resources/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/20251211-145039/pred-mai-mef-dhup.csv'
  }
};

const OUTPUT_DIR = path.join(__dirname, '..', 'data');

// Parse arguments
const args = process.argv.slice(2);
const yearIndex = args.indexOf('--year');
const YEAR = yearIndex !== -1 ? parseInt(args[yearIndex + 1]) : 2025;

async function downloadCSV(url) {
  return new Promise((resolve, reject) => {
    console.log(`Telechargement: ${url}`);
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadCSV(res.headers.location).then(resolve).catch(reject);
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseCSV(csvData, typeBien) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(';').map(h => h.replace(/"/g, ''));

  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(';').map(v => v.replace(/"/g, ''));
    const record = {};

    headers.forEach((h, idx) => {
      record[h] = values[idx];
    });

    // Convertir les valeurs numeriques (format francais avec virgule)
    const loyer = parseFloat((record.loypredm2 || '').replace(',', '.'));
    const loyerMin = parseFloat((record['lwr.IPm2'] || '').replace(',', '.'));
    const loyerMax = parseFloat((record['upr.IPm2'] || '').replace(',', '.'));

    if (isNaN(loyer)) continue;

    records.push({
      code_commune: record.INSEE_C,
      nom_commune: record.LIBGEO,
      departement: record.DEP,
      region: record.REG,
      loyer_m2: Math.round(loyer * 100) / 100,
      loyer_m2_min: Math.round(loyerMin * 100) / 100,
      loyer_m2_max: Math.round(loyerMax * 100) / 100,
      type_prediction: record.TYPPRED,
      nb_observations: parseInt(record.nbobs_com) || 0,
      type_bien: typeBien,
      annee: YEAR,
      source: 'MTE-DHUP',
      date_maj: new Date().toISOString()
    });
  }

  return records;
}

async function main() {
  console.log(`\n=== Import Loyers ${YEAR} ===\n`);

  // Creer dossier si necessaire
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const urls = LOYERS_URLS[YEAR];
  if (!urls) {
    console.error(`Annee ${YEAR} non supportee`);
    process.exit(1);
  }

  const allRecords = [];

  // Appartements
  try {
    console.log('Traitement appartements...');
    const csvApparts = await downloadCSV(urls.appartements);
    const apparts = parseCSV(csvApparts, 'appartement');
    console.log(`  -> ${apparts.length} communes`);
    allRecords.push(...apparts);
  } catch (error) {
    console.error('Erreur appartements:', error.message);
  }

  // Maisons
  try {
    console.log('Traitement maisons...');
    const csvMaisons = await downloadCSV(urls.maisons);
    const maisons = parseCSV(csvMaisons, 'maison');
    console.log(`  -> ${maisons.length} communes`);
    allRecords.push(...maisons);
  } catch (error) {
    console.error('Erreur maisons:', error.message);
  }

  // Sauvegarder
  const outputFile = path.join(OUTPUT_DIR, `loyers_${YEAR}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(allRecords, null, 2));
  console.log(`\nSauvegarde: ${outputFile}`);
  console.log(`Total: ${allRecords.length} enregistrements`);

  // Stats par departement
  const statsDep = {};
  allRecords.forEach(r => {
    if (!statsDep[r.departement]) {
      statsDep[r.departement] = { count: 0, loyer_sum: 0 };
    }
    statsDep[r.departement].count++;
    statsDep[r.departement].loyer_sum += r.loyer_m2;
  });

  console.log('\nTop 10 departements par loyer moyen:');
  Object.entries(statsDep)
    .map(([dep, s]) => ({ dep, moyenne: s.loyer_sum / s.count }))
    .sort((a, b) => b.moyenne - a.moyenne)
    .slice(0, 10)
    .forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.dep}: ${d.moyenne.toFixed(2)} EUR/m2`);
    });
}

main().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
