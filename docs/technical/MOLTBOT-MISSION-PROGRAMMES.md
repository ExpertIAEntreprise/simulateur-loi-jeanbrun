# Mission Moltbot - Scraping Programmes Immobiliers Neufs

**Date:** 30 janvier 2026
**Projet:** Simulateur Loi Jeanbrun
**Priorité:** HAUTE
**Canal de rapport:** WhatsApp

---

## Contexte

Le Simulateur Loi Jeanbrun est une plateforme de simulation fiscale pour la loi Jeanbrun (PLF 2026). Les pages SEO `/villes/[slug]` doivent afficher les programmes immobiliers neufs disponibles dans chaque ville.

**Ta mission:** Scraper quotidiennement les programmes neufs et les envoyer vers EspoCRM.

---

## Infrastructure disponible

### VPS CardImmo (147.93.53.108)

| Service | Endpoint | Description |
|---------|----------|-------------|
| Gateway API | `http://147.93.53.108:3010` | Point d'entrée authentifié |
| Firecrawl | via `/scraper/run` | Scraping avec proxy Webshare |
| EspoCRM | `https://espocrm.expert-ia-entreprise.fr/api/v1` | Stockage données |

### Authentification

```
GATEWAY_TOKEN: 4002e4d70d3a76432f47aa636cb67c306a708a6e7eb15c60a6d992fa566558e9
ESPOCRM_API_KEY: 1a97a8b3ca73fd5f1cdfed6c4f5341ec
```

---

## Tâches à accomplir

### Phase 1: Vérification prérequis ✅ VALIDÉ

Les prérequis sont maintenant configurés:

- [x] Entité `CJeanbrunVille` existe dans EspoCRM
- [x] Entité `CJeanbrunProgramme` existe dans EspoCRM
- [x] 50 villes prioritaires importées (zones A_bis, A, B1)
- [x] Clé API configurée: `1a97a8b3ca73fd5f1cdfed6c4f5341ec`

**Commande de test:**
```bash
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunVille?maxSize=5" \
  -H "X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec" | jq '.total'
# Retourne: 50
```

**Tu peux maintenant passer au scraping (Phase 2).**

---

### Phase 2: Scraping programmes nationaux

**Sources à scraper (ordre de priorité):**

#### 1. Nexity (facile)
```
URL: https://www.nexity.fr/programmes-immobiliers-neufs/{ville-slug}
Méthode: HTTP direct via Gateway
Rate limit: 1 requête / 2 secondes
```

#### 2. Bouygues Immobilier (facile)
```
URL: https://www.bouygues-immobilier.com/recherche?location={ville}
Méthode: HTTP direct via Gateway
Rate limit: 1 requête / 2 secondes
```

#### 3. SeLoger Neuf (Cloudflare - complexe)
```
URL: https://www.seloger.com/immobilier-neuf/{departement}/{ville}/
Méthode: Firecrawl via Gateway avec proxy
Rate limit: 1 requête / 5 secondes
```

#### 4. Logic-Immo Neuf
```
URL: https://www.logic-immo.com/neuf/{ville}
Méthode: Firecrawl via Gateway
Rate limit: 1 requête / 3 secondes
```

**Appel via Gateway:**
```bash
curl -X POST "http://147.93.53.108:3010/scraper/run" \
  -H "Authorization: Bearer $GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.nexity.fr/programmes-immobiliers-neufs/lyon",
    "options": {
      "waitForSelector": ".program-card",
      "scrollToBottom": true,
      "timeout": 30000
    }
  }'
```

---

### Phase 3: Scraping promoteurs locaux

**Pour enrichir le SEO**, recherche les promoteurs locaux par ville:

#### Méthode Google Search
```
Requête: "promoteur immobilier neuf {ville}"
Extraire: Top 5 résultats avec nom, site web, téléphone
```

#### Méthode Pages Jaunes
```
URL: https://www.pagesjaunes.fr/annuaire/chercherlespros?quoiqui=promoteur+immobilier&ou={ville}
Extraire: Nom, adresse, téléphone, site web
```

---

### Phase 4: Envoi vers EspoCRM

**Format de données CJeanbrunProgramme:**
```json
{
  "name": "Résidence Les Jardins de Lyon",
  "slug": "residence-jardins-lyon",
  "promoteur": "Nexity",
  "adresse": "15 rue de la République, 69001 Lyon",
  "latitude": 45.7640,
  "longitude": 4.8357,
  "prixMin": 185000,
  "prixMax": 420000,
  "prixM2Moyen": 4500,
  "nbLotsTotal": 45,
  "nbLotsDisponibles": 12,
  "typesLots": ["T2", "T3", "T4"],
  "dateLivraison": "T4 2027",
  "eligibleJeanbrun": true,
  "zoneFiscale": "A",
  "description": "Programme neuf au coeur de Lyon...",
  "sourceApi": "nexity",
  "idExterne": "nexity_12345",
  "urlExterne": "https://www.nexity.fr/...",
  "statut": "disponible",
  "villeId": "id-ville-lyon"
}
```

**Règles d'éligibilité Jeanbrun:**
- Type: Neuf uniquement
- Prix: Entre 100 000 et 500 000 euros
- Zone: A bis, A, B1 (B2 et C exclus)
- Livraison: Future (pas livré)

**Création/Update:**
```bash
# Vérifier si existe déjà
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunProgramme" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" \
  --data-urlencode "where[0][type]=equals" \
  --data-urlencode "where[0][attribute]=idExterne" \
  --data-urlencode "where[0][value]=nexity_12345"

# Si existe (total > 0) → PUT pour update
# Si n'existe pas → POST pour create
```

---

## Les 50 villes prioritaires

### Zone A bis (Paris et petite couronne)
Paris, Saint-Denis, Argenteuil, Montreuil, Nanterre, Créteil, Versailles, Courbevoie, Vitry-sur-Seine, Colombes, Asnières-sur-Seine

### Zone A (Grandes agglomérations)
Lyon, Marseille, Nice, Toulouse, Montpellier, Bordeaux, Lille, Strasbourg, Nantes, Villeurbanne, Aix-en-Provence

### Zone B1 (Villes moyennes tendues)
Rennes, Grenoble, Rouen, Toulon, Angers, Dijon, Nîmes, Le Mans, Reims, Le Havre, Saint-Étienne, Clermont-Ferrand, Brest, Tours, Limoges, Amiens, Perpignan, Metz, Besançon, Orléans, Mulhouse, Caen, Nancy, Roubaix, Tourcoing, Avignon, Dunkerque, Poitiers

---

## Workflow quotidien (cron 04:00)

```
1. Récupérer liste des 50 CJeanbrunVille depuis EspoCRM
2. Pour chaque ville:
   a. Scraper Nexity → extraire programmes
   b. Scraper Bouygues → extraire programmes
   c. (Si Cloudflare OK) Scraper SeLoger → extraire programmes
   d. Dédupliquer par cIdExterne
   e. Calculer éligibilité Jeanbrun
   f. POST/PUT vers EspoCRM CJeanbrunProgramme
3. Mettre à jour compteur nbProgrammesNeufs sur chaque CJeanbrunVille
4. Envoyer rapport WhatsApp
```

---

## Format du rapport WhatsApp

**Succès:**
```
Scraping Jeanbrun terminé

Villes traitées: 50/50
Programmes trouvés: 127
- Nexity: 45
- Bouygues: 38
- SeLoger: 44

Nouveaux: 23
Mis à jour: 104
Erreurs: 0

Top 3 villes:
- Paris: 28 programmes
- Lyon: 15 programmes
- Bordeaux: 12 programmes
```

**Erreur:**
```
Scraping Jeanbrun - ALERTES

Villes en erreur: 3
- Perpignan: Timeout Firecrawl
- Amiens: SeLoger bloqué
- Limoges: 0 programme trouvé

Action: Retry ces villes dans 1h

Villes OK: 47/50
Programmes créés: 98
```

---

## Commandes manuelles (via WhatsApp)

### Test une ville
```
Tom, scrape les programmes neufs pour Lyon seulement (test)
```

### Test 5 villes
```
Tom, lance un test de scraping sur 5 villes: Paris, Lyon, Bordeaux, Nantes, Lille
```

### Scraping complet
```
Tom, lance le scraping complet des programmes Jeanbrun
```

### Statut
```
Tom, combien de programmes Jeanbrun sont dans EspoCRM ?
```

### Stats par zone
```
Tom, donne-moi les stats programmes par zone fiscale
```

---

## Gestion des erreurs

| Erreur | Action |
|--------|--------|
| Timeout Firecrawl | Retry 3x avec délai croissant |
| Rate limit (429) | Attendre 60s, puis retry |
| Cloudflare block | Utiliser proxy Webshare via Gateway |
| EspoCRM down | Mettre en queue, retry après 5min |
| Programme existe | UPDATE au lieu de CREATE |
| Ville non trouvée | Log warning, skip |

---

## Prérequis - ✅ VALIDÉ

Les prérequis sont maintenant configurés:

1. **Entité CJeanbrunVille** créée dans EspoCRM
   - Champs: name, slug, codePostal, departement, region, zoneFiscale, population, nbProgrammesNeufs, latitude, longitude

2. **Entité CJeanbrunProgramme** créée dans EspoCRM
   - Champs: name, slug, promoteur, adresse, latitude, longitude, prixMin, prixMax, prixM2Moyen, nbLotsTotal, nbLotsDisponibles, typesLots, dateLivraison, eligibleJeanbrun, zoneFiscale, sourceApi, idExterne, urlExterne, statut, telephone, siteWeb
   - Relation: `villeId` → CJeanbrunVille

3. **50 villes importées** avec zones fiscales (A_bis, A, B1)

4. **Clé API:** `1a97a8b3ca73fd5f1cdfed6c4f5341ec`
   - Utilisateur: `cardimmo_integration`
   - Accès: CJeanbrunVille, CJeanbrunProgramme (create, read, edit, delete)

---

## Checklist avant lancement

- [x] Entités EspoCRM créées et validées
- [x] 50 villes importées
- [x] Clé API configurée
- [ ] Test manuel sur Lyon réussi
- [ ] Test batch sur 5 villes réussi
- [ ] Cron configuré (04:00 Europe/Paris)
- [ ] Rapport WhatsApp fonctionnel

---

**Créé par:** Claude (Opus 4.5) sur VPS CardImmo
**Pour:** Moltbot sur VPS 72.60.176.228
**Date:** 30 janvier 2026
