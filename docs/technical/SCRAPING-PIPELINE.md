# Pipeline de Scraping - Simulateur Loi Jeanbrun

**Version:** 1.0
**Date:** 30 janvier 2026
**Auteur:** Scraping Expert Agent

---

## Table des matieres

1. [Vue d'ensemble](#1-vue-densemble)
2. [Sources de donnees](#2-sources-de-donnees)
3. [Architecture du pipeline](#3-architecture-du-pipeline)
4. [Implementation par source](#4-implementation-par-source)
5. [Orchestration n8n](#5-orchestration-n8n)
6. [Planning de collecte](#6-planning-de-collecte)
7. [Stockage et cache](#7-stockage-et-cache)
8. [Monitoring et alertes](#8-monitoring-et-alertes)

---

## 1. Vue d'ensemble

### 1.1 Objectif

Alimenter les **pages villes SEO** avec des donnees fraiches et sourcees :

| Donnee | Usage | Priorite |
|--------|-------|----------|
| Prix m2 | Indicateur marche immobilier | HAUTE |
| Evolution prix | Tendance sur 1 an | HAUTE |
| Loyers moyens | Calcul rendement locatif | HAUTE |
| Population/demographie | Contexte ville | MOYENNE |
| Agences immobilieres | Annuaire local | MOYENNE |
| Tension locative | Score attractivite | BASSE |

### 1.2 Infrastructure disponible

```
+------------------------------------------------------------------+
|                        VPS HOSTINGER                              |
|                                                                   |
|  +-------------------+    +-------------------+                   |
|  | Firecrawl API     |    | Scraper Custom    |                   |
|  | 127.0.0.1:3003    |    | 127.0.0.1:3004    |                   |
|  | - JS rendering    |    | - Playwright      |                   |
|  | - Anti-bot bypass |    | - Stealth mode    |                   |
|  +-------------------+    +-------------------+                   |
|           |                        |                              |
|           +----------+-------------+                              |
|                      |                                            |
|  +-------------------v-------------------+                        |
|  |              n8n                      |                        |
|  |         127.0.0.1:5678               |                        |
|  |    Orchestration des workflows        |                        |
|  +---------------------------------------+                        |
|                      |                                            |
|  +-------------------v-------------------+                        |
|  |         Webshare Proxies              |                        |
|  |    80M IPs residentiels               |                        |
|  |    Rotation automatique               |                        |
|  +---------------------------------------+                        |
|                                                                   |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                      MOLTBOT (autre VPS)                          |
|    Scraping autonome programme 24/7                               |
|    Ideal pour taches longues et recurrentes                       |
+------------------------------------------------------------------+
```

### 1.3 Strategie globale

| Type de source | Methode | Frequence |
|----------------|---------|-----------|
| Open Data (DVF, INSEE) | Telechargement direct CSV/JSON | Mensuelle |
| API publiques | Appels REST | Temps reel ou cache 24h |
| Sites proteges | Firecrawl + Proxy | Hebdomadaire |
| Sites tres proteges | Playwright Stealth | Manuelle ou Moltbot |

---

## 2. Sources de donnees

### 2.1 DVF - Demandes de Valeurs Foncieres (PRIORITE 1)

**Source officielle et gratuite des prix immobiliers**

| Attribut | Valeur |
|----------|--------|
| URL | https://www.data.gouv.fr/datasets/demandes-de-valeurs-foncieres/ |
| Format | TXT (pipe-separated) ou CSV |
| Mise a jour | Semestrielle (S1/S2) |
| Couverture | France entiere sauf Alsace-Moselle |
| Licence | Licence Ouverte 2.0 |

#### Fichiers disponibles

```
https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/
├── valeursfoncieres-2025-s1.txt.zip  (dernier)
├── valeursfoncieres-2024.txt.zip
├── valeursfoncieres-2023.txt.zip
├── valeursfoncieres-2022.txt.zip
└── valeursfoncieres-2021.txt.zip
```

#### Structure des donnees

```csv
id_mutation,date_mutation,valeur_fonciere,code_postal,code_commune,nom_commune,
type_local,surface_reelle_bati,nombre_pieces_principales,longitude,latitude
```

**Champs utiles pour prix m2 :**
- `valeur_fonciere` : Prix de vente
- `surface_reelle_bati` : Surface en m2
- `type_local` : Appartement, Maison, etc.
- `code_commune` : Code INSEE
- `date_mutation` : Date de vente

#### Alternative : API Geo-DVF

```
URL: https://files.data.gouv.fr/geo-dvf/latest/csv/2024/full.csv.gz
Format: CSV compresse (700+ Mo)
Avantage: Geolocalise (lat/lon)
```

### 2.2 Carte des Loyers (PRIORITE 1)

**Source officielle des loyers par commune**

| Attribut | Valeur |
|----------|--------|
| URL | https://www.data.gouv.fr/datasets/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/ |
| Producteur | Ministere de la Transition ecologique |
| Format | CSV |
| Mise a jour | Annuelle |
| Licence | Licence Ouverte 2.0 |

#### Fichiers disponibles (2025)

```
pred-app-mef-dhup.csv         # Loyers appartements (tous types)
pred-app12-mef-dhup.csv       # Loyers appartements 1-2 pieces
pred-app3-mef-dhup.csv        # Loyers appartements 3+ pieces
pred-mai-mef-dhup.csv         # Loyers maisons
```

#### Structure des donnees

```csv
"id_zone";"INSEE_C";"LIBGEO";"EPCI";"DEP";"REG";"loypredm2";"lwr.IPm2";"upr.IPm2";"TYPPRED"
```

**Champs cles :**
- `INSEE_C` : Code commune INSEE
- `LIBGEO` : Nom de la commune
- `loypredm2` : Loyer predit au m2 (EUR)
- `lwr.IPm2` / `upr.IPm2` : Intervalle de prediction
- `TYPPRED` : Type (commune ou maille)

### 2.3 API Geo Communes (PRIORITE 1)

**Donnees geographiques et demographiques**

| Attribut | Valeur |
|----------|--------|
| URL | https://geo.api.gouv.fr |
| Format | JSON |
| Mise a jour | Temps reel |
| Licence | Libre |
| Rate limit | Aucun documente |

#### Endpoints utiles

```bash
# Toutes les communes d'un departement
GET /communes?codeDepartement=69&fields=nom,code,codesPostaux,population

# Commune par code postal
GET /communes?codePostal=75001&fields=nom,code,population,departement,region

# Recherche par nom
GET /communes?nom=Lyon&boost=population

# Communes limitrophes
GET /communes/{code}/voisines
```

#### Exemple de reponse

```json
{
  "nom": "Lyon",
  "code": "69123",
  "codesPostaux": ["69001", "69002", "69003", ...],
  "population": 522969,
  "departement": {"code": "75", "nom": "Rhone"},
  "region": {"code": "84", "nom": "Auvergne-Rhone-Alpes"}
}
```

### 2.4 INSEE (PRIORITE 2)

**Donnees socio-demographiques detaillees**

| Source | URL | Donnees |
|--------|-----|---------|
| Population legale | data.gouv.fr/datasets/population-legale | Pop par commune |
| Revenus fiscaux | data.gouv.fr | Revenus medians |
| Logements | data.gouv.fr | Nb logements, vacance |

#### Datasets recommandes

```
- population-legale-2021
- revenus-et-niveau-de-vie-des-menages
- nombre-de-logements-par-commune
```

### 2.5 Annuaire Agences (PRIORITE 2)

**Sources pour constituer l'annuaire**

| Source | Protection | Methode |
|--------|------------|---------|
| PagesJaunes | Anti-bot moyen | Firecrawl + Proxy |
| Google Maps API | Quota API | API Places officielle |
| Sites reseaux | Faible | Scraping direct |

#### PagesJaunes

```
URL Pattern: https://www.pagesjaunes.fr/recherche/{ville}/agences-immobilieres
Protection: Challenge Cloudflare
Solution: Proxy residentiel + delai 2-3s
```

#### Google Places API

```bash
# Recherche agences immobilieres
GET https://maps.googleapis.com/maps/api/place/textsearch/json
  ?query=agence+immobiliere+lyon
  &key=YOUR_API_KEY

# Details d'un lieu
GET https://maps.googleapis.com/maps/api/place/details/json
  ?place_id=ChIJLU...
  &fields=name,formatted_address,formatted_phone_number,rating,reviews
  &key=YOUR_API_KEY
```

**Cout:** ~17 EUR pour 1000 requetes (voir pricing Google)

#### Sites des reseaux immobiliers

| Reseau | URL Annuaire | Protection |
|--------|--------------|------------|
| Century 21 | century21.fr/agences | Faible |
| Laforet | laforet.com/agences | Faible |
| Orpi | orpi.com/agences | Faible |
| Stephane Plaza | stephaneplazaimmobilier.com | Faible |
| IAD France | iad-france.fr/conseillers | Moyenne |
| SAFTI | safti.fr/conseillers | Moyenne |

---

## 3. Architecture du pipeline

### 3.1 Schema global

```
+-------------------------------------------------------------------+
|                         COLLECTE                                   |
+-------------------------------------------------------------------+
|                                                                   |
|   [DVF]          [Loyers]        [Geo API]        [Agences]       |
|     |               |                |                |           |
|     v               v                v                v           |
|  Download        Download         REST API        Firecrawl       |
|  CSV/TXT          CSV             JSON            + Proxy         |
|     |               |                |                |           |
|     +-------+-------+----------------+----------------+           |
|             |                                                     |
|             v                                                     |
+-------------------------------------------------------------------+
|                         TRANSFORMATION                             |
+-------------------------------------------------------------------+
|                                                                   |
|   [Parser]  -->  [Aggregation]  -->  [Enrichissement]             |
|                                                                   |
|   - Parse CSV       - Groupby       - Geocodage                   |
|   - Nettoyage       commune         - Score tension               |
|   - Validation      - Calcul        - Zone fiscale                |
|                     mediane                                       |
+-------------------------------------------------------------------+
|                         STOCKAGE                                   |
+-------------------------------------------------------------------+
|                                                                   |
|   [PostgreSQL]          [Redis Cache]         [S3/Minio]          |
|   Donnees finales       Cache API 24h         Fichiers bruts      |
|                                                                   |
+-------------------------------------------------------------------+
|                         EXPOSITION                                 |
+-------------------------------------------------------------------+
|                                                                   |
|   [API REST]  -->  [Pages Villes SSG]  -->  [Simulateur]          |
|                                                                   |
+-------------------------------------------------------------------+
```

### 3.2 Flux de donnees detaille

```
1. PRIX M2 (DVF)
   ┌─────────────────────────────────────────────────────────────┐
   │ Download DVF ZIP --> Unzip --> Parse TXT                    │
   │     |                                                       │
   │     v                                                       │
   │ Filtrer type_local IN ('Appartement', 'Maison')            │
   │     |                                                       │
   │     v                                                       │
   │ Calculer prix_m2 = valeur_fonciere / surface_reelle_bati   │
   │     |                                                       │
   │     v                                                       │
   │ Grouper par code_commune                                    │
   │     |                                                       │
   │     v                                                       │
   │ Calculer: median(prix_m2), percentile_25, percentile_75    │
   │           count(transactions), evolution_vs_annee_prec     │
   │     |                                                       │
   │     v                                                       │
   │ Stocker en base: ville.prix_m2_median, ville.evolution_1an │
   └─────────────────────────────────────────────────────────────┘

2. LOYERS (Carte des loyers)
   ┌─────────────────────────────────────────────────────────────┐
   │ Download CSV loyers --> Parse (sep=;)                       │
   │     |                                                       │
   │     v                                                       │
   │ Mapper INSEE_C --> code_commune                            │
   │     |                                                       │
   │     v                                                       │
   │ Extraire loypredm2 (remplacer , par .)                     │
   │     |                                                       │
   │     v                                                       │
   │ Stocker: ville.loyer_m2_moyen, ville.loyer_min, loyer_max  │
   └─────────────────────────────────────────────────────────────┘

3. DONNEES VILLES (Geo API + INSEE)
   ┌─────────────────────────────────────────────────────────────┐
   │ Appel API geo.api.gouv.fr/communes                         │
   │     |                                                       │
   │     v                                                       │
   │ Enrichir: population, departement, region, coordonnees     │
   │     |                                                       │
   │     v                                                       │
   │ Calculer zone fiscale (A, Abis, B1, B2, C)                 │
   │     |                                                       │
   │     v                                                       │
   │ Stocker toutes les communes de France (~35000)             │
   └─────────────────────────────────────────────────────────────┘

4. AGENCES (Scraping)
   ┌─────────────────────────────────────────────────────────────┐
   │ Pour chaque ville prioritaire (top 200):                   │
   │     |                                                       │
   │     v                                                       │
   │ Firecrawl scrape PagesJaunes + proxy                       │
   │     |                                                       │
   │     v                                                       │
   │ Parser HTML: nom, adresse, telephone, note_google          │
   │     |                                                       │
   │     v                                                       │
   │ Dedupliquer par nom + ville                                │
   │     |                                                       │
   │     v                                                       │
   │ Stocker: agences, lier a ville_id                          │
   └─────────────────────────────────────────────────────────────┘
```

---

## 4. Implementation par source

### 4.1 Script DVF - Prix m2

```javascript
// /root/simulateur_loi_Jeanbrun/scripts/import-dvf.js

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createGunzip } = require('zlib');
const { parse } = require('csv-parse');

const DVF_URL = 'https://files.data.gouv.fr/geo-dvf/latest/csv/2024/full.csv.gz';
const OUTPUT_DIR = '/root/simulateur_loi_Jeanbrun/data';

async function downloadDVF() {
  console.log('Telechargement DVF 2024...');

  const filePath = path.join(OUTPUT_DIR, 'dvf_2024.csv.gz');
  const file = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    https.get(DVF_URL, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Telechargement termine:', filePath);
        resolve(filePath);
      });
    }).on('error', reject);
  });
}

async function parseDVF(filePath) {
  console.log('Parsing DVF...');

  const communes = new Map();

  const parser = fs.createReadStream(filePath)
    .pipe(createGunzip())
    .pipe(parse({
      columns: true,
      delimiter: ',',
      skip_empty_lines: true
    }));

  for await (const record of parser) {
    // Filtrer: uniquement ventes d'appartements et maisons
    if (!['Appartement', 'Maison'].includes(record.type_local)) continue;
    if (!record.valeur_fonciere || !record.surface_reelle_bati) continue;

    const codeCommune = record.code_commune;
    const prixM2 = parseFloat(record.valeur_fonciere) / parseFloat(record.surface_reelle_bati);

    // Filtrer prix aberrants
    if (prixM2 < 500 || prixM2 > 30000) continue;

    if (!communes.has(codeCommune)) {
      communes.set(codeCommune, {
        code: codeCommune,
        nom: record.nom_commune,
        departement: record.code_departement,
        transactions: []
      });
    }

    communes.get(codeCommune).transactions.push({
      prix_m2: prixM2,
      date: record.date_mutation,
      type: record.type_local
    });
  }

  return communes;
}

function calculateStats(communes) {
  console.log('Calcul des statistiques...');

  const results = [];

  for (const [code, data] of communes) {
    if (data.transactions.length < 5) continue; // Min 5 transactions

    const prix = data.transactions.map(t => t.prix_m2).sort((a, b) => a - b);
    const n = prix.length;

    results.push({
      code_commune: code,
      nom_commune: data.nom,
      departement: data.departement,
      nb_transactions: n,
      prix_m2_median: prix[Math.floor(n / 2)],
      prix_m2_p25: prix[Math.floor(n * 0.25)],
      prix_m2_p75: prix[Math.floor(n * 0.75)],
      prix_m2_min: prix[0],
      prix_m2_max: prix[n - 1],
      date_maj: new Date().toISOString()
    });
  }

  return results;
}

async function main() {
  try {
    // Creer dossier data si necessaire
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Telecharger DVF
    const filePath = await downloadDVF();

    // Parser
    const communes = await parseDVF(filePath);
    console.log(`${communes.size} communes avec transactions`);

    // Calculer stats
    const stats = calculateStats(communes);
    console.log(`${stats.length} communes avec stats valides`);

    // Sauvegarder JSON
    const outputFile = path.join(OUTPUT_DIR, 'prix_m2_communes.json');
    fs.writeFileSync(outputFile, JSON.stringify(stats, null, 2));
    console.log('Sauvegarde:', outputFile);

  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

main();
```

### 4.2 Script Loyers

```javascript
// /root/simulateur_loi_Jeanbrun/scripts/import-loyers.js

const fs = require('fs');
const path = require('path');
const https = require('https');
const { parse } = require('csv-parse/sync');

const LOYERS_URL = 'https://static.data.gouv.fr/resources/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/20251211-145010/pred-app-mef-dhup.csv';
const OUTPUT_DIR = '/root/simulateur_loi_Jeanbrun/data';

async function downloadLoyers() {
  console.log('Telechargement donnees loyers 2025...');

  return new Promise((resolve, reject) => {
    https.get(LOYERS_URL, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
      response.on('error', reject);
    });
  });
}

function parseLoyers(csvData) {
  console.log('Parsing loyers...');

  const records = parse(csvData, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true
  });

  return records.map(r => ({
    code_commune: r.INSEE_C,
    nom_commune: r.LIBGEO,
    departement: r.DEP,
    region: r.REG,
    loyer_m2: parseFloat(r.loypredm2.replace(',', '.')),
    loyer_m2_min: parseFloat(r['lwr.IPm2'].replace(',', '.')),
    loyer_m2_max: parseFloat(r['upr.IPm2'].replace(',', '.')),
    type_prediction: r.TYPPRED,
    nb_observations: parseInt(r.nbobs_com) || 0,
    date_maj: new Date().toISOString()
  })).filter(r => !isNaN(r.loyer_m2));
}

async function main() {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const csvData = await downloadLoyers();
    const loyers = parseLoyers(csvData);

    console.log(`${loyers.length} communes avec donnees loyers`);

    const outputFile = path.join(OUTPUT_DIR, 'loyers_communes.json');
    fs.writeFileSync(outputFile, JSON.stringify(loyers, null, 2));
    console.log('Sauvegarde:', outputFile);

  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

main();
```

### 4.3 Script Geo API

```javascript
// /root/simulateur_loi_Jeanbrun/scripts/import-communes.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const GEO_API_BASE = 'https://geo.api.gouv.fr';
const OUTPUT_DIR = '/root/simulateur_loi_Jeanbrun/data';

// Zones fiscales simplifiees (a affiner avec donnees officielles)
const ZONES_FISCALES = {
  '75': 'A_bis',  // Paris
  '92': 'A',      // Hauts-de-Seine
  '93': 'A',      // Seine-Saint-Denis
  '94': 'A',      // Val-de-Marne
  '69': 'A',      // Rhone (Lyon)
  '13': 'A',      // Bouches-du-Rhone (Marseille)
  '06': 'A',      // Alpes-Maritimes (Nice)
  '33': 'B1',     // Gironde (Bordeaux)
  '31': 'B1',     // Haute-Garonne (Toulouse)
  '44': 'B1',     // Loire-Atlantique (Nantes)
  // ... a completer
};

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    });
  });
}

async function getDepartements() {
  console.log('Recuperation des departements...');
  return fetchJSON(`${GEO_API_BASE}/departements`);
}

async function getCommunesByDepartement(codeDep) {
  const url = `${GEO_API_BASE}/departements/${codeDep}/communes?fields=nom,code,codesPostaux,population,centre,contour`;
  return fetchJSON(url);
}

async function main() {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const departements = await getDepartements();
    console.log(`${departements.length} departements`);

    const allCommunes = [];

    for (const dep of departements) {
      console.log(`Traitement ${dep.nom} (${dep.code})...`);

      try {
        const communes = await getCommunesByDepartement(dep.code);

        for (const c of communes) {
          allCommunes.push({
            code: c.code,
            nom: c.nom,
            codes_postaux: c.codesPostaux || [],
            population: c.population || 0,
            departement: dep.code,
            departement_nom: dep.nom,
            region: dep.codeRegion,
            latitude: c.centre?.coordinates?.[1] || null,
            longitude: c.centre?.coordinates?.[0] || null,
            zone_fiscale: ZONES_FISCALES[dep.code] || 'C',
            date_maj: new Date().toISOString()
          });
        }

        // Rate limiting soft
        await new Promise(r => setTimeout(r, 100));

      } catch (error) {
        console.error(`Erreur departement ${dep.code}:`, error.message);
      }
    }

    console.log(`${allCommunes.length} communes total`);

    const outputFile = path.join(OUTPUT_DIR, 'communes_france.json');
    fs.writeFileSync(outputFile, JSON.stringify(allCommunes, null, 2));
    console.log('Sauvegarde:', outputFile);

  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

main();
```

### 4.4 Script Scraping Agences

```javascript
// /root/simulateur_loi_Jeanbrun/scripts/scrape-agences.js

const fs = require('fs');
const path = require('path');

const FIRECRAWL_URL = 'http://127.0.0.1:3003/v1/scrape';
const OUTPUT_DIR = '/root/simulateur_loi_Jeanbrun/data';

// Top 50 villes prioritaires
const VILLES_PRIORITAIRES = [
  'paris', 'marseille', 'lyon', 'toulouse', 'nice',
  'nantes', 'montpellier', 'strasbourg', 'bordeaux', 'lille',
  'rennes', 'reims', 'saint-etienne', 'toulon', 'le-havre',
  'grenoble', 'dijon', 'angers', 'nimes', 'villeurbanne',
  'saint-denis', 'clermont-ferrand', 'le-mans', 'aix-en-provence', 'brest',
  'tours', 'amiens', 'limoges', 'annecy', 'perpignan',
  'boulogne-billancourt', 'metz', 'besancon', 'orleans', 'rouen',
  'mulhouse', 'caen', 'nancy', 'saint-paul', 'argenteuil',
  'montreuil', 'roubaix', 'dunkerque', 'tourcoing', 'avignon',
  'nanterre', 'vitry-sur-seine', 'creteil', 'poitiers', 'versailles'
];

async function scrapeAgences(ville) {
  const url = `https://www.pagesjaunes.fr/recherche/${ville}/agences-immobilieres`;

  console.log(`Scraping agences ${ville}...`);

  try {
    const response = await fetch(FIRECRAWL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        waitFor: 5000,
        onlyMainContent: true,
        // Utiliser proxy pour eviter blocage
        // proxy: 'http://lwvlrigg-rotate:mpn0iyk96ehv@p.webshare.io:80'
      })
    });

    const data = await response.json();

    if (!data.success) {
      console.error(`Erreur scraping ${ville}:`, data.error);
      return [];
    }

    // Parser le markdown pour extraire les agences
    const agences = parseAgencesFromMarkdown(data.data?.markdown || '', ville);
    console.log(`  -> ${agences.length} agences trouvees`);

    return agences;

  } catch (error) {
    console.error(`Erreur ${ville}:`, error.message);
    return [];
  }
}

function parseAgencesFromMarkdown(markdown, ville) {
  const agences = [];

  // Pattern basique - a affiner selon structure reelle
  const lines = markdown.split('\n');
  let currentAgence = null;

  for (const line of lines) {
    // Detecter nom d'agence (titre)
    if (line.match(/^#+\s+(.+)/) || line.match(/^\*\*(.+)\*\*/)) {
      if (currentAgence && currentAgence.nom) {
        agences.push(currentAgence);
      }
      currentAgence = {
        nom: line.replace(/[#*]/g, '').trim(),
        ville,
        source: 'pagesjaunes',
        date_scraping: new Date().toISOString()
      };
    }

    // Detecter telephone
    const telMatch = line.match(/(\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2})/);
    if (telMatch && currentAgence) {
      currentAgence.telephone = telMatch[1].replace(/[\s.-]/g, '');
    }

    // Detecter adresse
    if (line.match(/\d{5}/) && currentAgence) {
      currentAgence.adresse = line.trim();
    }
  }

  if (currentAgence && currentAgence.nom) {
    agences.push(currentAgence);
  }

  return agences;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allAgences = [];

  for (const ville of VILLES_PRIORITAIRES) {
    const agences = await scrapeAgences(ville);
    allAgences.push(...agences);

    // Delai entre requetes pour eviter blocage
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\nTotal: ${allAgences.length} agences`);

  const outputFile = path.join(OUTPUT_DIR, 'agences.json');
  fs.writeFileSync(outputFile, JSON.stringify(allAgences, null, 2));
  console.log('Sauvegarde:', outputFile);
}

main();
```

---

## 5. Orchestration n8n

### 5.1 Workflows recommandes

```
+------------------------------------------------------------------+
|                     WORKFLOWS N8N                                  |
+------------------------------------------------------------------+
|                                                                   |
|  [1] Import DVF Mensuel                                           |
|      Trigger: Cron 1er du mois 02:00                             |
|      Actions:                                                     |
|      - Download DVF depuis data.gouv.fr                          |
|      - Parse et calcul stats                                      |
|      - Update PostgreSQL                                          |
|      - Notification Slack                                         |
|                                                                   |
|  [2] Import Loyers Annuel                                         |
|      Trigger: Cron 15 janvier 02:00                              |
|      Actions:                                                     |
|      - Download CSV loyers                                        |
|      - Parse et stockage                                          |
|      - Notification                                               |
|                                                                   |
|  [3] Sync Communes                                                |
|      Trigger: Manuel ou cron trimestriel                         |
|      Actions:                                                     |
|      - Appel API geo.api.gouv.fr                                 |
|      - Enrichissement zone fiscale                                |
|      - Upsert PostgreSQL                                          |
|                                                                   |
|  [4] Scraping Agences                                             |
|      Trigger: Cron dimanche 03:00 (hebdo)                        |
|      Actions:                                                     |
|      - Boucle sur villes prioritaires                            |
|      - Firecrawl avec proxy                                       |
|      - Parse et deduplique                                        |
|      - Upsert PostgreSQL                                          |
|      - Alerte si erreur >20%                                      |
|                                                                   |
|  [5] Fusion Donnees Ville                                         |
|      Trigger: Apres workflows 1-4                                |
|      Actions:                                                     |
|      - Join prix + loyers + demo + agences                       |
|      - Calcul scores (tension, attractivite)                     |
|      - Update table villes_enrichies                              |
|      - Trigger rebuild SSG pages villes                          |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Exemple workflow n8n (JSON)

```json
{
  "name": "Import DVF Mensuel",
  "nodes": [
    {
      "name": "Cron Trigger",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "rule": {
          "interval": [{"field": "cronExpression", "expression": "0 2 1 * *"}]
        }
      }
    },
    {
      "name": "Download DVF",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://files.data.gouv.fr/geo-dvf/latest/csv/2024/full.csv.gz",
        "method": "GET",
        "options": {"response": {"response": {"fullResponse": true}}}
      }
    },
    {
      "name": "Execute Script",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "node /root/simulateur_loi_Jeanbrun/scripts/import-dvf.js"
      }
    },
    {
      "name": "Slack Notification",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#data-pipeline",
        "text": "Import DVF termine: {{ $json.nb_communes }} communes mises a jour"
      }
    }
  ]
}
```

### 5.3 Configuration n8n pour Firecrawl

```javascript
// Node HTTP Request personnalise pour Firecrawl
{
  "name": "Firecrawl Scrape",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "http://127.0.0.1:3003/v1/scrape",
    "method": "POST",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {"name": "Content-Type", "value": "application/json"}
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {"name": "url", "value": "={{ $json.url }}"},
        {"name": "formats", "value": "[\"markdown\"]"},
        {"name": "waitFor", "value": "3000"},
        {"name": "onlyMainContent", "value": "true"}
      ]
    }
  }
}
```

---

## 6. Planning de collecte

### 6.1 Frequences optimales

| Source | Frequence | Justification | Jour/Heure |
|--------|-----------|---------------|------------|
| DVF | Mensuelle | Nouvelles transactions chaque mois | 1er du mois, 02:00 |
| Loyers | Annuelle | Dataset mis a jour 1x/an | 15 janvier, 02:00 |
| API Geo | Trimestrielle | Fusions communes rares | 1er jan/avr/jul/oct |
| Agences | Hebdomadaire | Turnover agences | Dimanche, 03:00 |
| Villes prioritaires | Quotidienne | Cache API | Chaque nuit, 04:00 |

### 6.2 Calendrier annuel

```
JANVIER
  - 01: Sync communes (trimestriel)
  - 15: Import loyers annuel
  - Chaque lundi: MAJ agences

FEVRIER - DECEMBRE
  - 1er: Import DVF mensuel
  - Dimanche: MAJ agences
  - 1er avr/jul/oct: Sync communes

CONTINU
  - Cache Redis: Invalidation 24h
  - Healthcheck Firecrawl: toutes les 5 min
  - Backup donnees: quotidien
```

### 6.3 Estimation volumes

| Source | Volume brut | Volume final | Temps traitement |
|--------|-------------|--------------|------------------|
| DVF annuel | ~700 Mo (gz) | ~35000 communes | 15-30 min |
| Loyers | ~2 Mo | ~35000 communes | < 1 min |
| API Geo | ~50 Mo JSON | ~35000 communes | 5-10 min |
| Agences (50 villes) | ~50 pages | ~2000 agences | 10-15 min |

---

## 7. Stockage et cache

### 7.1 Schema PostgreSQL

```sql
-- Table communes (donnees de reference)
CREATE TABLE communes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(5) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  codes_postaux TEXT[],
  departement VARCHAR(3),
  region VARCHAR(3),
  population INTEGER,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  zone_fiscale VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table prix (DVF)
CREATE TABLE prix_communes (
  id SERIAL PRIMARY KEY,
  commune_code VARCHAR(5) REFERENCES communes(code),
  annee INTEGER,
  prix_m2_median DECIMAL(10,2),
  prix_m2_p25 DECIMAL(10,2),
  prix_m2_p75 DECIMAL(10,2),
  nb_transactions INTEGER,
  evolution_1an DECIMAL(5,2),
  type_bien VARCHAR(20),
  source VARCHAR(50) DEFAULT 'DVF',
  date_maj TIMESTAMP DEFAULT NOW(),
  UNIQUE(commune_code, annee, type_bien)
);

-- Table loyers
CREATE TABLE loyers_communes (
  id SERIAL PRIMARY KEY,
  commune_code VARCHAR(5) REFERENCES communes(code),
  annee INTEGER,
  loyer_m2 DECIMAL(6,2),
  loyer_m2_min DECIMAL(6,2),
  loyer_m2_max DECIMAL(6,2),
  type_logement VARCHAR(20),
  source VARCHAR(50) DEFAULT 'MTE',
  date_maj TIMESTAMP DEFAULT NOW(),
  UNIQUE(commune_code, annee, type_logement)
);

-- Table agences
CREATE TABLE agences (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(200) NOT NULL,
  enseigne VARCHAR(100),
  commune_code VARCHAR(5) REFERENCES communes(code),
  adresse TEXT,
  telephone VARCHAR(20),
  email VARCHAR(100),
  site_web VARCHAR(200),
  note_google DECIMAL(2,1),
  nb_avis INTEGER,
  specialites TEXT[],
  source VARCHAR(50),
  verifie BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vue materialisee pour pages villes
CREATE MATERIALIZED VIEW villes_enrichies AS
SELECT
  c.code,
  c.nom,
  c.population,
  c.zone_fiscale,
  c.departement,
  c.latitude,
  c.longitude,
  p.prix_m2_median,
  p.evolution_1an,
  p.nb_transactions,
  l.loyer_m2,
  (SELECT COUNT(*) FROM agences a WHERE a.commune_code = c.code) as nb_agences,
  CASE
    WHEN l.loyer_m2 > 0 AND p.prix_m2_median > 0
    THEN (l.loyer_m2 * 12) / p.prix_m2_median * 100
    ELSE NULL
  END as rendement_brut_pct
FROM communes c
LEFT JOIN prix_communes p ON c.code = p.commune_code AND p.annee = 2024
LEFT JOIN loyers_communes l ON c.code = l.commune_code AND l.annee = 2025;

-- Index pour performances
CREATE INDEX idx_communes_code ON communes(code);
CREATE INDEX idx_communes_departement ON communes(departement);
CREATE INDEX idx_prix_commune ON prix_communes(commune_code);
CREATE INDEX idx_loyers_commune ON loyers_communes(commune_code);
CREATE INDEX idx_agences_commune ON agences(commune_code);
```

### 7.2 Cache Redis

```javascript
// Configuration cache
const CACHE_CONFIG = {
  // Donnees statiques - TTL long
  'commune:*': 86400 * 7,      // 7 jours
  'prix:*': 86400 * 30,        // 30 jours
  'loyers:*': 86400 * 30,      // 30 jours

  // Donnees dynamiques - TTL court
  'agences:*': 86400,          // 24 heures
  'api:geo:*': 86400 * 7,      // 7 jours

  // API responses
  'api:ville:*': 3600,         // 1 heure
};

// Exemple usage
async function getCommuneData(codeCommune) {
  const cacheKey = `commune:${codeCommune}`;

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Fetch from DB
  const data = await db.query(
    'SELECT * FROM villes_enrichies WHERE code = $1',
    [codeCommune]
  );

  // Store in cache
  await redis.setex(cacheKey, CACHE_CONFIG['commune:*'], JSON.stringify(data));

  return data;
}
```

---

## 8. Monitoring et alertes

### 8.1 Healthchecks

```bash
# /root/scripts/check-scraping-health.sh

#!/bin/bash

# Check Firecrawl
FIRECRAWL_STATUS=$(curl -s http://127.0.0.1:3003/health | jq -r '.status')
if [ "$FIRECRAWL_STATUS" != "ok" ]; then
  echo "ALERT: Firecrawl unhealthy"
  # Send alert
fi

# Check proxy
PROXY_IP=$(curl -s --proxy http://lwvlrigg-rotate:mpn0iyk96ehv@p.webshare.io:80 https://httpbin.org/ip | jq -r '.origin')
if [ -z "$PROXY_IP" ]; then
  echo "ALERT: Proxy not working"
fi

# Check data freshness
LAST_DVF=$(psql -t -c "SELECT MAX(date_maj) FROM prix_communes")
DAYS_OLD=$(( ($(date +%s) - $(date -d "$LAST_DVF" +%s)) / 86400 ))
if [ $DAYS_OLD -gt 35 ]; then
  echo "ALERT: DVF data older than 35 days"
fi
```

### 8.2 Metriques a suivre

| Metrique | Seuil alerte | Action |
|----------|--------------|--------|
| Firecrawl API response time | > 10s | Restart containers |
| Taux d'erreur scraping | > 20% | Verifier proxy/bot detect |
| Donnees DVF age | > 35 jours | Lancer import manuel |
| Espace disque | > 80% | Cleanup vieux fichiers |
| Redis memory | > 80% | Purger cache ancien |

### 8.3 Logs

```
/var/log/simulateur-jeanbrun/
├── dvf-import.log
├── loyers-import.log
├── agences-scraping.log
├── communes-sync.log
└── errors.log
```

---

## Annexes

### A. Commandes utiles

```bash
# Test Firecrawl
curl -X POST http://127.0.0.1:3003/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","formats":["markdown"]}'

# Test proxy Webshare
curl --proxy http://lwvlrigg-rotate:mpn0iyk96ehv@p.webshare.io:80 https://httpbin.org/ip

# Check donnees loyers
curl -s "https://static.data.gouv.fr/resources/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/20251211-145010/pred-app-mef-dhup.csv" | head -5

# API Geo - communes Lyon
curl -s "https://geo.api.gouv.fr/communes?codePostal=69001" | jq
```

### B. URLs sources

| Donnee | URL |
|--------|-----|
| DVF | https://www.data.gouv.fr/datasets/demandes-de-valeurs-foncieres/ |
| Geo-DVF | https://files.data.gouv.fr/geo-dvf/latest/csv/2024/full.csv.gz |
| Loyers 2025 | https://www.data.gouv.fr/datasets/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/ |
| API Geo | https://geo.api.gouv.fr |
| INSEE | https://www.insee.fr/fr/statistiques |

### C. Contacts API

| Service | Limite | Contact |
|---------|--------|---------|
| data.gouv.fr | Illimite | data.gouv.fr/contact |
| geo.api.gouv.fr | Illimite | github.com/etalab |
| Webshare | 80M IPs | webshare.io |
| Google Places | Payant | console.cloud.google.com |

---

**Document genere le:** 30 janvier 2026
**Prochaine revision:** Apres premier run complet du pipeline
