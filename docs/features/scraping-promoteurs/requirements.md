# Requirements : Scraping Programmes Promoteurs

**Feature:** scraping-promoteurs
**Sprint:** 4 (SEO / Data)
**Priorite:** HAUTE
**Date:** 5 fevrier 2026

---

## Description

Scraper les programmes immobiliers neufs des **20 plus grands promoteurs nationaux** pour alimenter les pages SEO du Simulateur Loi Jeanbrun. Les programmes sont stockes dans EspoCRM (`CJeanbrunProgramme`) et affiches automatiquement sur `/programmes` et `/villes/[slug]`.

**Objectif:** Passer de ~153 programmes (Nexity seul) a 1 500-3 000 programmes (20 promoteurs) sur 382 villes.

---

## 20 Promoteurs Cibles

| # | Promoteur | CA 2024 | Site principal | Groupe |
|---|-----------|---------|----------------|--------|
| 1 | **Nexity** | #1 | nexity.fr | Nexity |
| 2 | **Bouygues Immobilier** | 1,451 Md | bouygues-immobilier.com | Bouygues |
| 3 | **Icade** | 1,210 Md | icade-immobilier.com | Caisse des Depots |
| 4 | **Vinci Immobilier** | 1,143 Md | vinci-immobilier.com | Vinci |
| 5 | **Kaufman & Broad** | 1,077 Md | kaufmanbroad.fr | K&B |
| 6 | **Bassac** (LNC + Marignan) | 1,052 Md | les-nouveaux-constructeurs.com / marignan.com | Bassac |
| 7 | **Procivis** | 1,049 Md | procivis.fr | Procivis |
| 8 | **Eiffage Immobilier** | 695 M | eiffage-immobilier.com | Eiffage |
| 9 | **Pichet** | 625 M | pichet.fr | Pichet |
| 10 | **Adim** | 605 M | adim.fr | Vinci |
| 11 | **Linkcity** | 530 M | linkcity.com | Bouygues |
| 12 | **BNP Paribas Real Estate** | 458 M | bnppre.fr | BNP Paribas |
| 13 | **Credit Agricole Immobilier** | 457 M | ca-immobilier.fr | Credit Agricole |
| 14 | **Emerige** | 433 M | emerige.com | Emerige |
| 15 | **Greencity Immobilier** | 428 M | greencity.fr | Greencity |
| 16 | **Quartus** | 419 M | quartus.fr | Quartus |
| 17 | **Sogeprom** | 378 M | sogeprom.fr | Societe Generale |
| 18 | **Demathieu Bard Immobilier** | 337 M | demathieu-bard-immobilier.com | Demathieu Bard |
| 19 | **Pierreval** | 337 M | pierreval.fr | Pierreval |

**Note :** Nexity (#1) est deja operationnel via `scrape_jeanbrun.py`. Ce projet etend le scraping aux 18 promoteurs restants.

---

## Donnees a Extraire par Programme

Mapping vers les champs existants de l'entite EspoCRM `CJeanbrunProgramme` :

### Champs obligatoires (CRITIQUE)

| Champ EspoCRM | Type | Description | Source |
|---------------|------|-------------|--------|
| `name` | text | Nom du programme | H1 ou titre card |
| `slug` | text | URL-safe (genere) | Depuis `name` + ville |
| `promoteur` | text | Nom du promoteur | Config |
| `villeId` | FK | Lien vers CJeanbrunVille | Lookup par codePostal/slug |
| `urlExterne` | url | Lien vers page du promoteur | Scrappe |
| `idExterne` | text | ID unique chez le promoteur | Parse URL |
| `sourceApi` | text | Cle du promoteur | Config (ex: "nexity") |
| `zoneFiscale` | enum | Zone de la ville | Depuis ville |
| `eligibleJeanbrun` | boolean | Toujours true | Hardcode |
| `actif` | boolean | Programme disponible | Default true |
| `imagePrincipale` | url | Image hero | Premiere image scrappee |
| `images` | JSON | Array d'URLs images | Scrappees via proxy |

### Champs importants (HAUTE priorite)

| Champ EspoCRM | Type | Description |
|---------------|------|-------------|
| `prixMin` | integer | Prix minimum global en euros |
| `prixMax` | integer | Prix maximum global en euros |
| `adresse` | text | Adresse du programme |
| `codePostal` | text | Code postal |
| `dateLivraison` | text | Date de livraison estimee |
| `nbLotsDisponibles` | integer | Nombre total de lots disponibles |
| `typesLots` | JSON | Types disponibles (["T1","T2","T3","T4","T5"]) |

### Champs par typologie - IMPERATIF (identifies via Chrome DevTools 5 fev 2026)

> **CRITIQUE pour CardImmo** : Ces donnees ne sont disponibles que sur les pages DETAIL.
> Le scraping doit se faire en 2 etapes : listing → detail.

| Champ EspoCRM | Type | Description | Source |
|---------------|------|-------------|--------|
| `lotsParTypologie` | JSON | Lots detailles par type | Page detail |

Format JSON `lotsParTypologie` :
```json
{
  "T1": { "nbLots": 4, "prixMin": 224900, "prixMax": 239900, "surfaceMin": 31.64 },
  "T2": { "nbLots": 9, "prixMin": 299000, "prixMax": 324900, "surfaceMin": 45.08 },
  "T3": { "nbLots": 6, "prixMin": 389900, "prixMax": 429900, "surfaceMin": 66.96 },
  "T4": { "nbLots": 6, "prixMin": null, "prixMax": null, "surfaceMin": null },
  "T5": { "nbLots": 2, "prixMin": null, "prixMax": null, "surfaceMin": null }
}
```

**Bouygues** fournit : prix min/max par type, nb lots, surface, etage, disponibilite
**Icade** fournit : prix TVA 20% ET TVA 5.5%, prix promos (barres), nb lots, surface, etage, parking, numero de lot, mensualites

### Champs optionnels (MOYENNE priorite)

| Champ EspoCRM | Type | Description |
|---------------|------|-------------|
| `surfaceMin` | float | Surface minimale en m2 |
| `surfaceMax` | float | Surface maximale en m2 |
| `prixM2Moyen` | integer | Prix moyen au m2 |
| `nbLotsTotal` | integer | Nombre total de lots (incl. non disponibles) |
| `description` | text | Description du programme |
| `latitude` | float | Coordonnee GPS |
| `longitude` | float | Coordonnee GPS |
| `imageAlt` | text | Alt text SEO |
| `siteWeb` | url | Site du promoteur |
| `telephone` | text | Telephone commercial |
| `prixTvaReduite` | JSON | Prix TVA 5.5% par type (Icade) |
| `mensualites` | JSON | Mensualites par type (Icade) |

---

## Exigences Fonctionnelles

### EF-1 : Architecture multi-promoteurs

- Le systeme doit supporter 20 promoteurs avec des configurations independantes
- Chaque promoteur a un fichier config Python avec : URL pattern, selecteurs CSS, scraper type, rate limits
- Un orchestrateur central gere l'execution sequentielle ou par batch
- CLI avec options : `--promoteurs`, `--dry-run`, `--skip-images`, `--cities`

### EF-2 : Scraping via Firecrawl

- Utiliser l'infrastructure Firecrawl existante (localhost:3003)
- Proxy Webshare rotatif pour les sites proteges
- `waitFor` configurable par promoteur (3-7 secondes)
- Formats : `markdown` (principal), `html` et `links` selon besoin

### EF-3 : Selecteurs CSS par promoteur (COLLABORATIF)

- Les selecteurs CSS sont identifies manuellement via Chrome DevTools MCP
- Chaque session DevTools produit un fichier config pour 1 promoteur
- **2 niveaux de selecteurs par promoteur :**
  - **Selecteurs LISTING** : nom, prix global, ville/CP, image, lien detail, ID externe
  - **Selecteurs DETAIL** : prix par typologie, nb lots par type, surface, etage, disponibilite
- URL patterns : listing (par ville) + detail (par programme)
- La plupart des promoteurs necessitent un scraping en 2 etapes (listing → detail)

### EF-4 : Pipeline images

- Les images sont telechargees via le Gateway API existant (`POST /api/scrape/image`)
- Le proxy ajoute automatiquement les headers navigateur (Referer, User-Agent)
- Maximum 5 images par programme
- Le batch endpoint (`POST /api/scrape/images`) gere jusqu'a 50 images/requete
- **Sans images, les programmes ne sont pas affiches sur le site** (filtre `isEnrichedProgramme()`)

### EF-5 : Deduplication

- Cle unique : `sourceApi` + `idExterne`
- Avant creation : verification existence dans EspoCRM
- Si existe : mise a jour des champs modifies (prix, disponibilite)
- Si programme disparu du listing : marquer `statut: "vendu"`

### EF-6 : Mapping villes

- Lookup ville dans `CJeanbrunVille` (382 villes) par `codePostal` ou `slug`
- Programmes hors zone eligible (B2, C) : ignores
- Zones acceptees : A_bis, A, B1

### EF-7 : Automatisation

- Execution bi-mensuelle via cron (toutes les 2 semaines, dimanche 1h)
- Mode incremental : ne scrape que les changements (nouveaux, mis a jour, supprimes)
- Rapport de synthese par email en cas d'erreur

---

## Exigences Non-Fonctionnelles

### ENF-1 : Rate limiting

- Delai minimum 10 secondes entre chaque ville par promoteur
- Maximum 10 requetes/minute via le Gateway API
- Randomisation du delai (10-15s) pour eviter les patterns detectables
- Scraping durant les heures creuses (1h-5h du matin)

### ENF-2 : Gestion d'erreurs

- Retry 3 fois avec backoff exponentiel (10s, 30s, 60s)
- Timeout configurable par promoteur (default 60s)
- Log structure JSON pour chaque action (succes/erreur)
- Alerte email si taux d'erreur > 30% sur un run

### ENF-3 : Proxy et anti-bot

- Proxy Webshare rotatif (IP residentielle, rotation automatique)
- Resource blocking (ads, trackers, fonts) via Firecrawl Playwright
- Random User-Agent par requete
- Stealth mode Playwright (pas de detection headless)

### ENF-4 : Monitoring

- Log centralise dans `/var/log/scrape-promoteurs.log`
- Metriques par run : programmes trouves/crees/mis a jour, erreurs, duree
- Stats par promoteur : taux de succes, programmes actifs, derniere execution
- Endpoint stats dans le Gateway API : `GET /api/scrape-promoteurs/stats`

### ENF-5 : Performance

- Run complet (20 promoteurs x 382 villes) : < 8 heures
- Maximum 2 jobs concurrents Firecrawl
- Scraping nuit uniquement pour ne pas impacter les autres services

---

## Criteres d'Acceptation

### CA-1 : Infrastructure

- [ ] Script orchestrateur `scrape_promoteurs.py` fonctionnel avec CLI
- [ ] Architecture modulaire : 1 fichier config par promoteur
- [ ] Mode `--dry-run` simule sans ecrire en base
- [ ] Logs structures JSON dans `/var/log/scrape-promoteurs.log`

### CA-2 : Couverture promoteurs

- [ ] Minimum 5 promoteurs operationnels (top 5 : Nexity, Bouygues, Icade, Vinci, K&B)
- [ ] Cible 20 promoteurs a terme
- [ ] Chaque config validee via test sur 3 villes

### CA-3 : Qualite des donnees

- [ ] 100% des programmes ont un `name`, `urlExterne`, `sourceApi`, `idExterne`
- [ ] > 80% des programmes ont des images (condition d'affichage)
- [ ] > 70% des programmes ont un prix (`prixMin` ou `prixMax`)
- [ ] 0 doublons crees (verification par `sourceApi` + `idExterne`)
- [ ] Mapping ville correct (verification `villeId` valide)

### CA-4 : Volume

- [ ] > 500 programmes apres le top 10 promoteurs
- [ ] > 1 500 programmes apres les 20 promoteurs
- [ ] Programmes repartis sur > 200 villes (sur 382)

### CA-5 : Automatisation

- [ ] Cron bi-mensuel configure et fonctionnel
- [ ] Alerte email en cas d'echec
- [ ] Mode incremental (pas de re-scraping complet a chaque run)

### CA-6 : SEO

- [ ] Programmes visibles sur `/programmes` (filtre images)
- [ ] Programmes lies aux pages `/villes/[slug]`
- [ ] Augmentation du nombre de pages enrichies (avant/apres)

---

## Dependances

| Dependance | Statut | Description |
|------------|--------|-------------|
| EspoCRM `CJeanbrunProgramme` | OK | Entite existante avec tous les champs |
| EspoCRM `CJeanbrunVille` | OK | 382 villes importees (zones A_bis, A, B1) |
| Firecrawl Docker | OK | localhost:3003, 5 containers |
| Gateway API | OK | Port 3010, endpoints scraping + images |
| Webshare proxy | OK | Proxy rotatif configure |
| Script `scrape_jeanbrun.py` | OK | Pattern Nexity fonctionnel (a refactorer) |

---

## Hors Scope (sessions futures)

- Pages individuelles `/programmes/[slug]` (detail programme)
- Pages promoteurs `/promoteurs/[slug]`
- Filtres par promoteur sur les pages villes
- Sitemap dynamique pour les programmes
- Enrichissement IA des descriptions

---

**Auteur:** Claude (Opus 4.5)
**Date:** 5 fevrier 2026
**Version:** 1.0
