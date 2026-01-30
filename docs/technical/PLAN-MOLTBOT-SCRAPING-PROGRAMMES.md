# Plan Moltbot - Scraping Programmes Immobiliers Neufs

**Version:** 1.0
**Date:** 30 janvier 2026
**Objectif:** Configurer Moltbot pour scraper autonomement les programmes neufs pour le Simulateur Loi Jeanbrun

---

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VPS MOLTBOT (72.60.176.228)                         │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                      Moltbot (Claude autonome)                      │  │
│   │   • Skill: programme-scraper                                        │  │
│   │   • Cron: quotidien 04:00 Europe/Paris                             │  │
│   │   • Canal: WhatsApp pour alertes                                   │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    │ SSH / HTTP                             │
│                                    ▼                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ API Gateway (port 3010)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     VPS CARDIMMO (147.93.53.108)                            │
│                                                                             │
│   ┌─────────────────────┐    ┌─────────────────────┐                       │
│   │ Firecrawl API       │    │ Scraper Playwright  │                       │
│   │ 127.0.0.1:3003      │    │ 127.0.0.1:3004      │                       │
│   └─────────────────────┘    └─────────────────────┘                       │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                         EspoCRM                                     │  │
│   │   • CJeanbrunVille: 50 villes prioritaires                                 │  │
│   │   • CJeanbrunProgramme: programmes neufs scrapés                           │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ API EspoCRM
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       VERCEL (Simulateur Loi Jeanbrun)                      │
│                                                                             │
│   Pages /villes/[slug] → Affichent top 3 programmes par ville              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Sources de programmes neufs

### Sources prioritaires (Phase 1)

| Source | URL | Protection | Méthode |
|--------|-----|------------|---------|
| **SeLoger Neuf** | seloger.com/immobilier-neuf | Cloudflare | Firecrawl + Proxy |
| **Logic-Immo Neuf** | logic-immo.com/neuf | Moyenne | Firecrawl |
| **Nexity** | nexity.fr/programmes-immobiliers-neufs | Faible | HTTP direct |
| **Bouygues Immobilier** | bouygues-immobilier.com | Faible | HTTP direct |

### Sources secondaires (Phase 2)

| Source | URL | Protection |
|--------|-----|------------|
| Kaufman & Broad | kaufmanbroad.fr | Moyenne |
| Vinci Immobilier | vinci-immobilier.com | Faible |
| Eiffage Immobilier | eiffage-immobilier.com | Faible |
| Pichet | pichet.fr | Faible |
| Cogedim | cogedim.com | Moyenne |

### Promoteurs locaux (Phase 3 - SEO Enrichment)

**Objectif:** Trouver les promoteurs locaux par ville pour enrichir le contenu SEO des pages villes.

**Stratégie de recherche:**

| Méthode | URL Pattern | Description |
|---------|-------------|-------------|
| Google Search | `promoteur immobilier neuf {ville}` | Via Firecrawl SerpAPI ou scraping Google |
| Pages Jaunes | pagesjaunes.fr/recherche/promoteur-immobilier/{ville} | Annuaire local |
| Societe.com | societe.com/recherche/?text=promoteur+immobilier+{ville} | Données entreprises |
| BienIci | bienici.com/recherche/achat/{ville}/neuf | Agrégateur programmes neufs |
| MeilleursAgents | meilleursagents.com/promoteurs/{ville} | Section promoteurs |

**Données à extraire par promoteur local:**

```json
{
  "name": "Nom du promoteur",
  "slug": "nom-promoteur-ville",
  "promoteur": "Nom officiel",
  "isLocal": true,
  "villesPrincipales": ["Lyon", "Villeurbanne"],
  "siteWeb": "https://...",
  "telephone": "04 xx xx xx xx",
  "description": "Description SEO-friendly",
  "nbProgrammesActifs": 5,
  "sourceApi": "google_search|pagesjaunes|societe"
}
```

**Enrichissement SEO pages villes:**

Pour chaque page `/villes/[slug]`, afficher:
- Top 3 promoteurs nationaux avec programmes
- Top 3 promoteurs locaux de la ville
- Mention "Découvrez les promoteurs immobiliers à {ville}"

---

## Structure EspoCRM (CJeanbrunProgramme) ✅ CRÉÉ

Entité custom créée dans EspoCRM:

```json
{
  "name": "CJeanbrunProgramme",
  "fields": {
    "name": {"type": "varchar", "required": true},
    "slug": {"type": "varchar", "maxLength": 150, "required": true},
    "promoteur": {"type": "varchar", "maxLength": 150},
    "isLocal": {"type": "bool", "default": false},
    "adresse": {"type": "text"},
    "latitude": {"type": "float"},
    "longitude": {"type": "float"},
    "prixMin": {"type": "int", "min": 0},
    "prixMax": {"type": "int", "min": 0},
    "prixM2Moyen": {"type": "int", "min": 0},
    "nbLotsTotal": {"type": "int", "min": 0},
    "nbLotsDisponibles": {"type": "int", "min": 0},
    "typesLots": {"type": "multiEnum", "options": ["T1", "T2", "T3", "T4", "T5", "Maison", "Autre"]},
    "dateLivraison": {"type": "varchar", "maxLength": 50},
    "eligibleJeanbrun": {"type": "bool", "default": false},
    "zoneFiscale": {"type": "enum", "options": ["", "A_bis", "A", "B1", "B2", "C"]},
    "description": {"type": "text"},
    "images": {"type": "text"},
    "sourceApi": {"type": "varchar", "maxLength": 50},
    "idExterne": {"type": "varchar", "maxLength": 100},
    "urlExterne": {"type": "url"},
    "statut": {"type": "enum", "options": ["disponible", "en_commercialisation", "epuise", "livre"]},
    "telephone": {"type": "varchar", "maxLength": 30},
    "siteWeb": {"type": "url"},
    "villeId": {"type": "link", "entity": "CJeanbrunVille"}
  }
}
```

---

## Phases d'implémentation

### Phase 1: Configuration EspoCRM ✅ TERMINÉ

1. **Entité CJeanbrunVille** créée
   - 14 champs: name, slug, codePostal, codeInsee, departement, region, zoneFiscale, population, prixM2Moyen, loyerM2Moyen, plafondLoyerJeanbrun, plafondPrixJeanbrun, nbProgrammesNeufs, latitude, longitude

2. **Entité CJeanbrunProgramme** créée
   - 22 champs (voir schéma ci-dessus)
   - Relation: villeId → CJeanbrunVille (belongsTo)

3. **50 villes prioritaires importées**
   - Zone A_bis (11): Paris, Saint-Denis, Argenteuil, Montreuil, Nanterre, Créteil, Versailles, Courbevoie, Vitry-sur-Seine, Colombes, Asnières-sur-Seine
   - Zone A (11): Lyon, Marseille, Nice, Toulouse, Montpellier, Bordeaux, Lille, Strasbourg, Nantes, Villeurbanne, Aix-en-Provence
   - Zone B1 (28): Rennes, Grenoble, Rouen, Toulon, Angers, Dijon, Nîmes, Le Mans, Reims, Le Havre, Saint-Étienne, Clermont-Ferrand, Brest, Tours, Limoges, Amiens, Perpignan, Metz, Besançon, Orléans, Mulhouse, Caen, Nancy, Roubaix, Tourcoing, Avignon, Dunkerque, Poitiers

4. **API configurée**
   - Utilisateur: `cardimmo_integration`
   - Clé API: `1a97a8b3ca73fd5f1cdfed6c4f5341ec`
   - Permissions: CJeanbrunVille, CJeanbrunProgramme (create, read, edit, delete)

### Phase 2: Skill Moltbot (À FAIRE - VPS Moltbot)

**Estimation:** 2-3 heures

**Chemin:** `/root/.clawdbot/skills/programme-scraper/SKILL.md`

```markdown
# Skill: Programme Scraper Jeanbrun

## But
Scraper les programmes immobiliers neufs depuis diverses sources et les envoyer vers EspoCRM.

## Configuration

### Endpoints
- VPS CardImmo Gateway: http://147.93.53.108:3010
- EspoCRM: https://espocrm.expert-ia-entreprise.fr/api/v1
- Firecrawl: via Gateway /scraper/run

### Credentials (à configurer dans env)
- GATEWAY_TOKEN: 4002e4d70d3a76432f47aa636cb67c306a708a6e7eb15c60a6d992fa566558e9
- ESPOCRM_API_KEY: 1a97a8b3ca73fd5f1cdfed6c4f5341ec

## Sources supportées

### 1. Nexity (prioritaire - facile)
URL Pattern: https://www.nexity.fr/programmes-immobiliers-neufs/{ville}
Méthode: HTTP direct (pas de protection)

### 2. SeLoger Neuf (complexe)
URL Pattern: https://www.seloger.com/immobilier-neuf/{departement}/{ville}/
Méthode: Firecrawl via Gateway avec proxy

### 3. Bouygues Immobilier
URL Pattern: https://www.bouygues-immobilier.com/recherche?location={ville}
Méthode: HTTP direct

## Workflow

1. Pour chaque ville prioritaire:
   a. Scraper Nexity
   b. Scraper SeLoger Neuf (via Firecrawl)
   c. Extraire: nom, adresse, prix, lots, date livraison
   d. Vérifier éligibilité Jeanbrun (neuf, prix 100k-500k)
   e. POST vers EspoCRM /api/v1/CJeanbrunProgramme

2. Dédupliquer par cIdExterne (source + id)

3. Mettre à jour compteur ville: cNbProgrammesNeufs

## Commandes

### Scraper une ville
```
Tom, scrape les programmes neufs pour Lyon
```

### Scraper toutes les villes
```
Tom, lance le scraping complet des programmes Jeanbrun
```

### Vérifier le statut
```
Tom, combien de programmes Jeanbrun sont dans EspoCRM ?
```

## Rate Limiting

- Nexity: 1 req/2s
- SeLoger: 1 req/5s (Cloudflare)
- EspoCRM: 20 req/min

## Gestion erreurs

- Si source down → passer à la suivante
- Si rate-limited → attendre et retry
- Si programme existe (cIdExterne) → UPDATE au lieu de CREATE
- Notifier via WhatsApp si erreur critique
```

### Phase 3: Cron Moltbot (À FAIRE - VPS Moltbot)

**Commande pour créer le cron:**

```bash
docker compose -f /root/moltbot/docker-compose.yml exec moltbot-gateway node dist/index.js cron add \
  --name "jeanbrun-programmes-scraper" \
  --cron "0 4 * * *" \
  --tz "Europe/Paris" \
  --session isolated \
  --message "Lance le scraping quotidien des programmes immobiliers neufs pour Jeanbrun. Scrape Nexity et SeLoger pour les 50 villes prioritaires. Envoie les programmes vers EspoCRM (entité CJeanbrunProgramme). À la fin, donne-moi un résumé: nombre de programmes trouvés, créés, mis à jour, erreurs." \
  --deliver --channel whatsapp
```

### Phase 4: Extension Gateway (À FAIRE - VPS CardImmo)

Ajouter des endpoints au clawdbot-gateway pour supporter le projet Jeanbrun:

**Fichier:** `/root/clawdbot-gateway/server.js`

Nouveaux endpoints:
- `GET /espocrm/villes-jeanbrun` → Liste les CJeanbrunVille
- `GET /espocrm/programmes-jeanbrun` → Liste les CJeanbrunProgramme
- `POST /espocrm/programme-jeanbrun` → Créer/Update un programme
- `GET /espocrm/stats-jeanbrun` → Stats (nb villes, programmes, par zone)

**Whitelist EspoCRM:**
```javascript
const JEANBRUN_ENTITIES = ['CJeanbrunVille', 'CJeanbrunProgramme', 'cLeadJeanbrun', 'cSimulationJeanbrun'];
```

### Phase 5: Tests et validation

1. **Test manuel via WhatsApp:**
   ```
   Tom, scrape les programmes neufs pour Lyon seulement (test)
   ```

2. **Vérifier dans EspoCRM:**
   - Les programmes apparaissent dans CJeanbrunProgramme
   - Le lien CJeanbrunVilleId est correct
   - Les données sont complètes

3. **Test complet:**
   ```
   Tom, lance un test de scraping sur 5 villes: Paris, Lyon, Bordeaux, Nantes, Lille
   ```

---

## Exemple de scraping Nexity

### Script TypeScript (référence pour Moltbot)

```typescript
// Nexity est relativement simple à scraper
const scrapeNexityVille = async (ville: string) => {
  const slug = ville.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '-');

  const url = `https://www.nexity.fr/programmes-immobiliers-neufs/${slug}`;

  // Appel via Gateway → Firecrawl
  const response = await fetch('http://147.93.53.108:3010/scraper/run', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + GATEWAY_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url,
      options: {
        waitForSelector: '.program-card',
        scrollToBottom: true,
        timeout: 30000
      }
    })
  });

  const { data } = await response.json();

  // Parser le markdown/HTML pour extraire les programmes
  const programmes = parseNexityHTML(data.html);

  return programmes.map(p => ({
    name: p.nom,
    slug: generateSlug(p.nom, ville),
    promoteur: 'Nexity',
    adresse: p.adresse,
    prixMin: p.prixMin,
    prixMax: p.prixMax,
    dateLivraison: p.livraison,
    nbLotsDisponibles: p.lotsDisponibles,
    eligibleJeanbrun: p.prixMin >= 100000 && p.prixMax <= 500000,
    sourceApi: 'nexity',
    idExterne: `nexity_${p.id}`,
    urlExterne: p.url,
    statut: 'disponible'
  }));
};
```

---

## Checklist avant lancement

### VPS CardImmo (147.93.53.108)

- [x] Entité CJeanbrunVille créée dans EspoCRM
- [x] Entité CJeanbrunProgramme créée dans EspoCRM
- [x] 50 villes prioritaires importées
- [x] Clé API générée: `1a97a8b3ca73fd5f1cdfed6c4f5341ec`
- [ ] Gateway endpoints ajoutés (optionnel)

### VPS Moltbot (72.60.176.228)

- [ ] Skill `programme-scraper` créé
- [ ] Variable d'env: `ESPOCRM_API_KEY=1a97a8b3ca73fd5f1cdfed6c4f5341ec`
- [ ] Test manuel réussi sur 1 ville
- [ ] Test batch réussi sur 5 villes
- [ ] Cron quotidien configuré

### Documentation

- [x] Ce plan partagé avec Moltbot
- [x] Mapping champs source → EspoCRM documenté
- [ ] Procédure de reprise en cas d'erreur

---

## Monitoring et maintenance

### Alertes WhatsApp attendues

```
✅ Scraping Jeanbrun terminé
   - Villes traitées: 50
   - Programmes trouvés: 127
   - Créés: 23
   - Mis à jour: 104
   - Erreurs: 0
```

```
⚠️ Scraping Jeanbrun - Alertes
   - 3 villes en erreur: Perpignan, Amiens, Limoges
   - Raison: Timeout Firecrawl
   - Action: Retry dans 1h
```

### Commandes de diagnostic

```bash
# VPS CardImmo - Stats EspoCRM
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunProgramme?maxSize=1" \
  -H "X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec" | jq '.total'

# VPS Moltbot - Logs du cron
docker compose -f /root/moltbot/docker-compose.yml exec moltbot-gateway \
  node dist/index.js cron logs --name "jeanbrun-programmes-scraper"

# VPS CardImmo - Santé Firecrawl
curl http://127.0.0.1:3010/firecrawl/health
```

---

## Prochaines étapes

1. **Aujourd'hui:** Créer les entités EspoCRM (CJeanbrunVille, CJeanbrunProgramme)
2. **Demain:** Créer le skill Moltbot et tester sur Lyon
3. **J+2:** Configurer le cron et valider le scraping complet
4. **J+3:** Connecter les pages villes du simulateur à EspoCRM

---

**Auteur:** Claude (Opus 4.5)
**Date:** 30 janvier 2026
