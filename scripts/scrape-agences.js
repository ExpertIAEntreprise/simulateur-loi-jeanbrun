#!/usr/bin/env node
/**
 * Scraping Agences Immobilieres via Firecrawl
 * Sources: PagesJaunes, Sites reseaux
 *
 * Usage: node scrape-agences.js [--ville lyon] [--limit 10]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FIRECRAWL_URL = 'http://127.0.0.1:3003/v1/scrape';
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const DELAY_BETWEEN_REQUESTS = 3000; // 3 secondes

// Top 50 villes prioritaires (slugs PagesJaunes)
const VILLES_PRIORITAIRES = [
  { slug: 'paris-75', nom: 'Paris', code: '75056' },
  { slug: 'marseille-13', nom: 'Marseille', code: '13055' },
  { slug: 'lyon-69', nom: 'Lyon', code: '69123' },
  { slug: 'toulouse-31', nom: 'Toulouse', code: '31555' },
  { slug: 'nice-06', nom: 'Nice', code: '06088' },
  { slug: 'nantes-44', nom: 'Nantes', code: '44109' },
  { slug: 'montpellier-34', nom: 'Montpellier', code: '34172' },
  { slug: 'strasbourg-67', nom: 'Strasbourg', code: '67482' },
  { slug: 'bordeaux-33', nom: 'Bordeaux', code: '33063' },
  { slug: 'lille-59', nom: 'Lille', code: '59350' },
  { slug: 'rennes-35', nom: 'Rennes', code: '35238' },
  { slug: 'reims-51', nom: 'Reims', code: '51454' },
  { slug: 'saint-etienne-42', nom: 'Saint-Etienne', code: '42218' },
  { slug: 'toulon-83', nom: 'Toulon', code: '83137' },
  { slug: 'le-havre-76', nom: 'Le Havre', code: '76351' },
  { slug: 'grenoble-38', nom: 'Grenoble', code: '38185' },
  { slug: 'dijon-21', nom: 'Dijon', code: '21231' },
  { slug: 'angers-49', nom: 'Angers', code: '49007' },
  { slug: 'nimes-30', nom: 'Nimes', code: '30189' },
  { slug: 'aix-en-provence-13', nom: 'Aix-en-Provence', code: '13001' }
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkFirecrawl() {
  try {
    const response = await fetch('http://127.0.0.1:3003/health');
    return response.ok;
  } catch {
    return false;
  }
}

async function scrapeVille(ville) {
  const url = `https://www.pagesjaunes.fr/recherche/${ville.slug}/agences-immobilieres`;

  console.log(`\nScraping ${ville.nom}...`);
  console.log(`  URL: ${url}`);

  try {
    const response = await fetch(FIRECRAWL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        waitFor: 5000,
        onlyMainContent: true,
        actions: [
          { type: 'wait', milliseconds: 2000 },
          { type: 'scroll', direction: 'down', amount: 500 }
        ]
      })
    });

    const result = await response.json();

    if (!result.success) {
      console.log(`  ERREUR: ${result.error || 'Unknown error'}`);
      return [];
    }

    const markdown = result.data?.markdown || '';
    const agences = parseAgences(markdown, ville);

    console.log(`  -> ${agences.length} agences trouvees`);
    return agences;

  } catch (error) {
    console.log(`  ERREUR: ${error.message}`);
    return [];
  }
}

function parseAgences(markdown, ville) {
  const agences = [];

  // Diviser par lignes
  const lines = markdown.split('\n');
  let currentAgence = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detecter un nom d'agence (commence par # ou **)
    const titleMatch = trimmed.match(/^(?:#{1,3}\s+|\*\*)(.+?)(?:\*\*)?$/);
    if (titleMatch) {
      // Sauvegarder l'agence precedente
      if (currentAgence && currentAgence.nom && currentAgence.nom.length > 3) {
        agences.push(currentAgence);
      }

      currentAgence = {
        nom: titleMatch[1].trim(),
        ville: ville.nom,
        code_commune: ville.code,
        source: 'pagesjaunes',
        date_scraping: new Date().toISOString()
      };
      continue;
    }

    if (!currentAgence) continue;

    // Detecter telephone
    const telMatch = trimmed.match(/(?:Tel|Telephone|Appeler)?\s*:?\s*(\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2})/i);
    if (telMatch) {
      currentAgence.telephone = telMatch[1].replace(/[\s.-]/g, '');
    }

    // Detecter code postal et adresse
    const cpMatch = trimmed.match(/(\d{5})\s+([A-Z][a-zA-Z\s-]+)/);
    if (cpMatch) {
      currentAgence.code_postal = cpMatch[1];
      currentAgence.adresse = trimmed;
    }

    // Detecter note
    const noteMatch = trimmed.match(/(\d[,\.]\d)\s*\/\s*5/);
    if (noteMatch) {
      currentAgence.note = parseFloat(noteMatch[1].replace(',', '.'));
    }

    // Detecter nombre d'avis
    const avisMatch = trimmed.match(/(\d+)\s*avis/i);
    if (avisMatch) {
      currentAgence.nb_avis = parseInt(avisMatch[1]);
    }
  }

  // Derniere agence
  if (currentAgence && currentAgence.nom && currentAgence.nom.length > 3) {
    agences.push(currentAgence);
  }

  // Deduplication par nom
  const seen = new Set();
  return agences.filter(a => {
    const key = `${a.nom.toLowerCase()}|${a.ville}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  console.log('\n=== Scraping Agences Immobilieres ===\n');

  // Parse arguments
  const args = process.argv.slice(2);
  const villeIndex = args.indexOf('--ville');
  const limitIndex = args.indexOf('--limit');

  const filterVille = villeIndex !== -1 ? args[villeIndex + 1].toLowerCase() : null;
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : null;

  // Verifier Firecrawl
  console.log('Verification Firecrawl...');
  const firecrawlOk = await checkFirecrawl();
  if (!firecrawlOk) {
    console.error('ERREUR: Firecrawl non disponible sur 127.0.0.1:3003');
    console.error('Lancer: /root/scripts/firecrawl-monitor.sh auto-heal');
    process.exit(1);
  }
  console.log('Firecrawl OK\n');

  // Creer dossier si necessaire
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Filtrer villes
  let villes = VILLES_PRIORITAIRES;
  if (filterVille) {
    villes = villes.filter(v =>
      v.nom.toLowerCase().includes(filterVille) ||
      v.slug.includes(filterVille)
    );
  }
  if (limit) {
    villes = villes.slice(0, limit);
  }

  console.log(`Villes a traiter: ${villes.length}`);

  const allAgences = [];
  const errors = [];

  for (let i = 0; i < villes.length; i++) {
    const ville = villes[i];
    console.log(`\n[${i + 1}/${villes.length}]`);

    try {
      const agences = await scrapeVille(ville);
      allAgences.push(...agences);
    } catch (error) {
      errors.push({ ville: ville.nom, error: error.message });
    }

    // Attendre entre chaque requete
    if (i < villes.length - 1) {
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }

  // Sauvegarder
  const outputFile = path.join(OUTPUT_DIR, 'agences.json');
  fs.writeFileSync(outputFile, JSON.stringify(allAgences, null, 2));

  console.log('\n=== Resultat ===');
  console.log(`Total agences: ${allAgences.length}`);
  console.log(`Erreurs: ${errors.length}`);
  console.log(`Fichier: ${outputFile}`);

  if (errors.length > 0) {
    console.log('\nVilles en erreur:');
    errors.forEach(e => console.log(`  - ${e.ville}: ${e.error}`));
  }

  // Stats par ville
  console.log('\nAgences par ville:');
  const byVille = {};
  allAgences.forEach(a => {
    byVille[a.ville] = (byVille[a.ville] || 0) + 1;
  });
  Object.entries(byVille)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ville, count]) => {
      console.log(`  ${ville}: ${count}`);
    });
}

main().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
