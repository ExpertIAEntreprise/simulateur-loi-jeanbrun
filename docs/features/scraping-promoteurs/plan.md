# Plan : Scraping Programmes Promoteurs

**Feature:** scraping-promoteurs
**Sprint:** 4 (SEO / Data)
**Effort:** ~30 sessions (5 phases)
**Statut:** Bouygues PRODUCTION READY - Tom execute ce soir (5 fev 2026)
**Derniere MAJ:** 5 fevrier 2026 (soir)

---

## EXECUTION TOM - CE SOIR 5 FEV 2026

### Commande SSH

```bash
# Depuis le VPS Boldbot (72.60.176.228) :
ssh root@147.93.53.108 "cd /root/scripts/scrape-promoteurs && python3 scrape_promoteurs.py --promoteurs bouygues --verbose 2>&1 | tee /var/log/scrape-promoteurs-bouygues.log"
```

### Ce que Tom doit faire

1. Se connecter en SSH au VPS CardImmo (147.93.53.108)
2. Lancer le scraping Bouygues sur TOUTES les villes zones A_bis, A, B1 (252 villes)
3. Attendre la fin (estimation : 2-4 heures)
4. Verifier le resume final dans les logs

### Estimation

| Donnee | Valeur |
|--------|--------|
| Villes | 252 (zones A_bis, A, B1) |
| Temps listing | ~10s/ville + 10-15s delai = ~100 min |
| Temps detail | ~10s/programme + 5-10s delai = ~200 min (si ~500 programmes) |
| **Total estime** | **3-5 heures** |
| Programmes attendus | 500-1000 |

### Verification apres execution

```bash
# Depuis le VPS CardImmo (147.93.53.108) :

# Compter les programmes crees
ESPOCRM_KEY=$(grep ESPOCRM_API_KEY /root/scripts/scrape-promoteurs/.env | cut -d= -f2)
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunProgramme?maxSize=1" \
  -H "X-Api-Key: $ESPOCRM_KEY" | python3 -c "import sys,json; print(f'Total: {json.load(sys.stdin)[\"total\"]}')"

# Voir les logs
tail -50 /var/log/scrape-promoteurs-bouygues.log
```

---

## DECOUVERTE CRITIQUE : Scraping en 2 etapes

> **Identifie le 5 fevrier 2026 via Chrome DevTools.**
> Les prix par typologie et le nombre de lots par type ne sont PAS sur les pages listing.
> Ils sont UNIQUEMENT sur les pages detail de chaque programme.

### Impact sur l'architecture

```
ETAPE 1 : Scrape LISTING (1 requete par ville)
  → Recupere : nom, prix global min/max, types (range), livraison, URL detail, image, ID
  → Rapide : ~382 requetes par promoteur

ETAPE 2 : Scrape DETAIL (1 requete par programme)
  → Recupere : prix par typologie (T1, T2...), nb lots par type, surfaces, etages, dispo
  → Lent : potentiellement 1500-3000 requetes supplementaires pour 20 promoteurs
```

### Strategie d'execution

- **Nous (sessions collaboratives)** : Identifions les selecteurs CSS, creons les configs, testons
- **Tom (de nuit, autonome)** : Execute le scraping complet sur toutes les villes
  - Via SSH : `ssh root@147.93.53.108 "python3 /root/scripts/scrape-promoteurs/scrape_promoteurs.py --promoteurs all"`
  - Ou via Gateway endpoint dedie (a creer Phase 5)

### Filtrage programmes (REGLES METIER)

- **Exclure les programmes deja livres** : si dateLivraison < date du jour → skip
  - Le champ dateLivraison est du texte ("4eme trim. 2027") → parser en date comparable
  - Programmes livres 2020-2024 vus chez Bouygues → sans prix, sans interet
- **Ne PAS recuperer les infos fiscalite** : LMNP/LMP, LLI, BRS, ANRU TVA reduite → on ignore
  - Ces labels sont specifiques au promoteur, pas pertinents pour CardImmo
  - On ne stocke pas, on ne scrape pas

### Optimisation Etape 2

- Au 1er run : scrape TOUS les details
- Aux runs suivants : scrape UNIQUEMENT les nouveaux programmes (idExterne pas encore en DB)
- Estimation temps : Etape 1 (~5h pour 20 promo) + Etape 2 (~3h pour ~1500 nouveaux) = ~8h

### Modele de donnees : LOTS INDIVIDUELS (decide le 5 fev 2026)

> **UX cible :** Prospect voit un programme → voit les lots individuels (T3 a 471K, 67.9m², 3eme) →
> clique "Simuler" → simulation Loi Jeanbrun avec CE prix → economie d'impot + cout mensuel →
> "Contacter un conseiller"

**Champ `lotsDetails` (TEXT = JSON string) sur CJeanbrunProgramme :**

```json
[
  {"type": "T2", "surface": 46.9, "etage": "2eme", "prix": 336000, "prestations": "Parking"},
  {"type": "T3", "surface": 67.9, "etage": "3eme", "prix": 471000, "prestations": "Parking"},
  {"type": "T4", "surface": 89.0, "etage": "1er", "prix": 605000, "prestations": "Parking"},
  {"type": "T5", "surface": 110.0, "etage": "6eme", "prix": 882000, "prestations": "Parking"}
]
```

**IMPORTANT:** Le champ EspoCRM est `lotsDetails` (type TEXT), pas `lots`.
Il faut `json.dumps(lots)` avant l'envoi et `json.loads(lotsDetails)` a la lecture.

**Champs de synthese (calcules automatiquement depuis les lots) :**

| Champ EspoCRM | Type | Usage |
|-------|------|-------|
| `prixMin` | int | Filtre/tri listing |
| `prixMax` | int | Filtre/tri listing |
| `surfaceMin` | float | Filtre/tri listing (cree le 5 fev 2026) |
| `surfaceMax` | float | Filtre/tri listing (cree le 5 fev 2026) |
| `nbLotsDisponibles` | int | Affichage "26 lots" |
| `typesLots` | multiEnum | Filtre rapide (Studio,T1-T5,Maison,Autre) |
| `description` | text | Points forts marketing |
| `adresse` | text | Adresse exacte |

### Donnees NON collectees (regles metier)

- ~~Disponibilite~~ (on s'en fout)
- ~~Fiscalite~~ (LMNP/LMP, LLI, BRS, ANRU) - specifique promoteur, pas pertinent
- ~~Programmes livres~~ (dateLivraison < aujourd'hui) - a filtrer

---

## Phase 0 : Nettoyage base existante ✅ (5 fev 2026 soir)

- [x] 153 programmes Nexity de test supprimes (tous)
- [x] 19 programmes Bouygues de test supprimes (tous)
- [x] Base EspoCRM propre : 0 programmes

---

## Phase 1 : Script orchestrateur multi-promoteurs (1-2 sessions) ✅

### Taches

- [x] 1.1 Creer `/root/scripts/scrape-promoteurs/` avec structure modulaire
- [x] 1.2 Creer `scrape_promoteurs.py` (orchestrateur CLI)
- [x] 1.3 Creer `helpers.py` (fonctions EspoCRM, Firecrawl, images)
- [x] 1.4 Creer `configs/__init__.py` (registry promoteurs)
- [x] 1.5 Migrer la logique Nexity depuis `scrape_jeanbrun.py` vers `configs/nexity.py`
- [x] 1.6 Tester le nouveau script sur Nexity (3 villes de test)

### Structure cible

```
/root/scripts/scrape-promoteurs/
  scrape_promoteurs.py       # Orchestrateur CLI
  helpers.py                 # EspoCRM API, Firecrawl, image proxy, dedup
  configs/
    __init__.py              # Registry : PROMOTEUR_CONFIGS, ACTIVE_PROMOTEURS
    nexity.py                # Config Nexity (migre depuis scrape_jeanbrun.py)
    bouygues.py              # (Phase 2 - selecteurs identifies)
    icade.py                 # (Phase 2 - selecteurs identifies)
    vinci.py                 # (Phase 2)
    kaufman_broad.py         # (Phase 2)
    ... (20 fichiers total)
```

### CLI du script

```bash
# Scraper un promoteur sur 3 villes (test)
python3 scrape_promoteurs.py --promoteurs nexity --cities lyon,bordeaux,nantes --dry-run

# Scraper le top 5 sur toutes les villes
python3 scrape_promoteurs.py --promoteurs nexity,bouygues,icade,vinci,kaufman_broad

# Scraper tous les promoteurs actifs
python3 scrape_promoteurs.py --promoteurs all

# Sans images (plus rapide)
python3 scrape_promoteurs.py --promoteurs nexity --skip-images
```

### Validation Phase 1

- [x] Script fonctionne avec `--dry-run` (0 ecriture DB)
- [x] Nexity scrape 3 villes avec succes (26 programmes: Bordeaux 9, Lyon 15, Nantes 2)
- [x] Logs structures JSON (fichier + console)
- [x] Erreurs gerees (retry avec backoff, timeout configurable)

---

## Phase 2 : Selecteurs CSS par promoteur (COLLABORATIF - 10-20 sessions)

> **Cette phase se fait ensemble via Chrome DevTools.**
> On traite 1-2 promoteurs par session.

### Workflow par promoteur (MIS A JOUR)

1. Ouvrir le site du promoteur dans Chrome DevTools
2. Naviguer vers "programmes neufs" d'une ville test (ex: Lyon)
3. **Page LISTING - Identifier :**
   - URL pattern listing (comment la ville est encodee)
   - Selecteur CSS pour la liste des programmes
   - Selecteurs : nom, prix global min/max, ville/CP, livraison, image, lien detail, ID externe
4. **Page DETAIL - Identifier (NOUVEAU) :**
   - URL pattern detail (comment l'ID programme est encode)
   - Selecteurs : prix par typologie (T1, T2, T3...), nb lots par type, surface par type
   - Selecteurs optionnels : etage, disponibilite, parking, DPE
5. Extraire les donnees structurees via `evaluate_script`
6. Creer le fichier config Python avec les 2 niveaux de selecteurs
7. Tester sur 3 villes

### Ordre de traitement

| Batch | Promoteurs | Sessions estimees | Statut |
|-------|-----------|-------------------|--------|
| **Batch 1** | Nexity ✅, Bouygues ✅, Icade ✅, Vinci, K&B | 4 sessions | **EN COURS (3/5)** |
| **Batch 2** | Bassac, Procivis, Eiffage, Pichet, Adim | 5 sessions | A faire |
| **Batch 3** | Linkcity, BNPPRE, CA Immobilier, Emerige, Greencity | 5 sessions | A faire |
| **Batch 4** | Quartus, Sogeprom, Demathieu Bard, Pierreval | 4 sessions | A faire |

---

### BOUYGUES IMMOBILIER - Analyse Chrome DevTools (5 fev 2026) ✅

#### URLs identifiees

| Type | Pattern | Exemple |
|------|---------|---------|
| **Listing** | `/{departement_nom}/{ville}` | `/rhone/lyon` |
| **Detail** | `/programme-neuf-{ville}/ref/{id}` | `/programme-neuf-lyon/ref/6612` |
| ~~Recherche~~ | `/immobilier-neuf/recherche?localisation=lyon` | **404 - NE FONCTIONNE PAS** |

**Note :** `dept_required` = le nom du departement (pas le code), ex: `rhone` pas `69`.

#### Page LISTING - Donnees disponibles (19 programmes trouves a Lyon)

| Donnee | Selecteur/Methode | Exemple |
|--------|------------------|---------|
| **Card programme** | `.list-item-wrapper[data-ucci]` | Container principal |
| **Nom** | `.crd-title` ou `h3` dans la card | "Cote Parc" |
| **Ville + CP** | `.crd-localization` ou regex `(Ville) (XXXXX)` | "Lyon (69007)" |
| **Prix global** | Regex `(\d[\d\s]+)\s*€\s*a\s*(\d[\d\s]+)\s*€` | "224 900 € a 639 900 €" |
| **Types lots (range)** | Regex `Du (studio\|X pieces) au (Y pieces)` | "Du studio au 5 pieces" |
| **Livraison** | Regex `Livraison[^.]+` | "Livraison 4eme trim. 2027" |
| **Image** | `picture source` ou `img` dans card | CDN Bouygues |
| **URL detail** | `a[href*="/programme-neuf"]` | `/programme-neuf-lyon/ref/6612` |
| **ID externe** | attribut `data-ucci` | `030-269K94` |

#### Page DETAIL - Donnees supplementaires (CRITIQUES)

| Donnee | Disponible | Exemple |
|--------|-----------|---------|
| **Prix par typologie** | OUI | T1: 224 900€ - 239 900€, T2: 299 000€ - 324 900€ |
| **Nb lots par type** | OUI | T1(4), T2(9), T3(6), T4(6), T5(2) = 27 lots |
| **Surface par lot** | OUI | T1: 31.64m², T2: 45.08m², T3: 66.96m² |
| **Etage** | OUI | 1er, 2eme... 10eme |
| **Disponibilite** | OUI | "Disponible" / "Liste d'attente" |
| **Adresse exacte** | OUI | "124 Avenue Jean Jaures 69007" |
| **Prestations** | OUI | DPE A, balcon, terrasse... |

#### Structure config a creer : `configs/bouygues.py`

```python
CONFIG_BOUYGUES = {
    "key": "bouygues",
    "name": "Bouygues Immobilier",
    "base_url": "https://www.bouygues-immobilier.com",

    # URL patterns
    "url_pattern_listing": "/{dept_nom}/{ville_slug}",   # /rhone/lyon
    "url_pattern_detail": "/programme-neuf-{ville_slug}/ref/{id}",
    "has_detail_page": True,  # SCRAPING 2 ETAPES

    # Scraper
    "scraper_type": "firecrawl",
    "requires_proxy": True,
    "wait_for_ms": 3000,
    "formats": ["html"],  # HTML pour CSS selectors

    # Selecteurs LISTING
    "selectors_listing": {
        "programme_cards": ".list-item-wrapper[data-ucci]",
        "nom": "h3",
        "prix": None,  # regex dans innerText
        "ville_cp": None,  # regex (Ville) (XXXXX)
        "image": "picture source, img",
        "lien_detail": "a[href*='/programme-neuf']",
        "livraison": None,  # regex Livraison...
        "id_externe": "data-ucci",  # attribut HTML
    },

    # Selecteurs DETAIL (page individuelle)
    "selectors_detail": {
        "tableau_lots": "table, .lot-table, [class*='lot']",
        "type_lot": "td:first-child, .type",  # T1, T2, T3...
        "nb_lots": "td:nth-child(2), .count",
        "surface": "td:nth-child(3), .surface",
        "prix_min_max": "td:nth-child(4), .price",
        "adresse": "[class*='address'], .location",
    },

    # Parsing
    "prix_regex": r"([\d\s]+)\s*€\s*[aà]\s*([\d\s]+)\s*€",
    "types_regex": r"Du?\s+(studio|[\d]+\s*pièces?)\s+au\s+([\d]+\s*pièces?)",
    "livraison_regex": r"Livraison[^.]+",
    "ville_cp_regex": r"([A-ZÀ-Ü][a-zà-ü-]+(?:\s+[a-zà-ü-]+)*)\s*\((\d{5})\)",

    # Ville dans URL : {dept_nom}/{ville_slug}
    "city_slug_format": "lowercase",  # lyon (sans tiret)
    "dept_format": "nom_lowercase",   # rhone (nom complet, minuscule)
    "dept_required": True,

    # Rate limiting
    "delay_between_cities_sec": 10,
    "delay_between_details_sec": 5,
    "max_retries": 3,
    "timeout_ms": 60000,

    # Image referer
    "image_referer": "https://www.bouygues-immobilier.com/",
}
```

**Statut Bouygues : PRODUCTION READY ✅** (configs/bouygues.py)

Test production Lyon (5 fev 2026 soir) : **19/19 programmes crees, 0 erreurs**

| Resultat | Valeur |
|----------|--------|
| Programmes trouves | 19 |
| Programmes crees | 19 |
| Erreurs | 0 |
| Temps total | ~8 minutes |
| Programmes avec lots | 7/10 (ceux avec prix) |
| Lots individuels (ex: Cote Parc) | 27 lots, 224K-639K, Studio→T5, 31-95m2 |
| Programmes sans prix | 9 (livres 2020-2024, pas de lots) |

**Fixes appliques :**
- Nom extrait de `data-prgdata` JSON (pas le texte concatene)
- `lotsDetails` = JSON string (pas array) pour champ TEXT EspoCRM
- `typesLots` enum: ajoute "Studio" aux options
- `update_ville_count` filtre sur `statut="disponible"` (pas `actif`)
- Retire `codePostal` du programme (deja sur la ville)
- Retire `actif` (utilise `statut`)
- Champs `surfaceMin`/`surfaceMax` crees dans EspoCRM (float)

---

### ICADE IMMOBILIER - Analyse Chrome DevTools (5 fev 2026) ✅

#### URLs identifiees

| Type | Pattern | Exemple |
|------|---------|---------|
| **Listing** | `/programmes-immobilier-neufs,{ville}-{cp}` | `/programmes-immobilier-neufs,lyon-69000` |
| **Detail** | `/programmes-immobiliers-neufs-{ville-arr}/{slug},p{id}` | `/programmes-immobiliers-neufs-lyon-9e/pierre-levee---la-sauvegarde,p30626` |
| ~~Recherche~~ | `/programme-immobilier-neuf/lyon` | **404 - NE FONCTIONNE PAS** |
| ~~Acheter~~ | `/acheter/programme-immobilier-neuf` | **404 - NE FONCTIONNE PAS** |

**Note :** Le format listing est `{ville}-{cp5}`, pas `{ville}-{dept2}`.

#### Page LISTING - Donnees disponibles (5 programmes trouves a Lyon)

| Donnee | Selecteur/Methode | Exemple |
|--------|------------------|---------|
| **Card programme** | `.block-item` ou cards contenant € et "pieces" | Container principal |
| **Nom** | `h3` ou titre dans la card | "Pierre Levee - La Sauvegarde" |
| **Ville** | Texte dans card | "LYON 9E (69)" |
| **Prix par type (partiel)** | Texte listing | "3 pieces a partir de 241 000 €" |
| **Types lots** | Texte listing | "Appartements du 3 au 5 pieces" |
| **Image** | `img` dans card | CDN Icade |
| **URL detail** | `a[href*="programmes-immobiliers"]` | `/programmes-immobiliers-neufs-lyon-9e/...` |
| **ID externe** | `data-program-id` ou regex `,p(\d+)` dans URL | `30626` |
| **Livraison** | **NON disponible sur listing** | - |

#### Page DETAIL - Donnees supplementaires (TRES RICHES)

| Donnee | Disponible | Exemple |
|--------|-----------|---------|
| **Prix par lot individuel** | OUI | "274 200 € TTC (TVA 20%)" |
| **Prix TVA reduite** | OUI | "241 000 € TTC (TVA 5.5%)" |
| **Prix promos (barres)** | OUI | Prix original barre + nouveau prix |
| **Nb lots total** | OUI | "69 logements traversants" |
| **Nb lots par type** | OUI | Filtres : 3P, 4P, 5P |
| **Surface par lot** | OUI | "64.6 m²", "68 m²", "83.8 m²" |
| **Numero de lot** | OUI | "N°G232P" |
| **Etage** | OUI | Dans card lot |
| **Parking inclus** | OUI | Dans card lot |
| **Livraison** | OUI | "4E TRIMESTRE 2027" |
| **Adresse exacte** | OUI | "Allee Suzanne Lacore, 69009" |
| **Mensualites** | OUI | "2P 765€/mois, 3P 860€/mois, 4P 1200€/mois" |

#### Structure config a creer : `configs/icade.py`

```python
CONFIG_ICADE = {
    "key": "icade",
    "name": "Icade Immobilier",
    "base_url": "https://www.icade-immobilier.com",

    # URL patterns
    "url_pattern_listing": "/programmes-immobilier-neufs,{ville_slug}-{cp}",
    "url_pattern_detail": None,  # Extrait depuis les liens listing
    "has_detail_page": True,  # SCRAPING 2 ETAPES

    # Scraper
    "scraper_type": "firecrawl",
    "requires_proxy": True,
    "wait_for_ms": 3000,
    "formats": ["html"],

    # Selecteurs LISTING
    "selectors_listing": {
        "programme_cards": ".block-item, [class*='program']",
        "nom": "h3",
        "prix": None,  # regex "X pieces a partir de Y €"
        "ville_cp": None,  # regex dans texte
        "image": "img",
        "lien_detail": "a[href*='programmes-immobiliers']",
        "id_externe": "data-program-id",  # ou regex ,p(\d+) dans URL
    },

    # Selecteurs DETAIL
    "selectors_detail": {
        "lots_cards": "[class*='lot'], .apartment-card",
        "lot_type": ".type, [class*='type']",
        "lot_surface": "[class*='surface']",
        "lot_prix_tva20": "[class*='price']",
        "lot_prix_tva55": "[class*='reduced'], [class*='tva']",
        "lot_numero": "[class*='number'], [class*='ref']",
        "livraison": "[class*='delivery'], [class*='livraison']",
        "adresse": "[class*='address']",
        "nb_lots_total": None,  # regex "X logements"
    },

    # Parsing
    "prix_regex": r"à partir de\s*([\d\s]+)\s*€",
    "types_regex": r"du\s+(\d+)\s+au\s+(\d+)\s+pièces",

    # Ville dans URL : {ville_slug}-{cp}
    "city_slug_format": "lowercase",  # lyon
    "cp_required": True,  # CP 5 chiffres dans URL (69000 pas 69)
    "dept_required": False,

    # Rate limiting
    "delay_between_cities_sec": 10,
    "delay_between_details_sec": 5,
    "max_retries": 3,
    "timeout_ms": 60000,

    # Image referer
    "image_referer": "https://www.icade-immobilier.com/",
}
```

**Statut Icade :** CODE + DRY-RUN OK ✅ (configs/icade.py)
- 5 programmes trouves a Lyon (dry-run)
- Lots individuels extraits avec prixTva20 + prixTva55
- Memes fixes que Bouygues (lotsDetails JSON string, etc.)
- **NON TESTE en production** - sera teste apres Bouygues

---

### VINCI IMMOBILIER - A analyser

**Statut :** Non commence. Prochaine session.

### KAUFMAN & BROAD - A analyser

**Statut :** Non commence. Prochaine session.

---

### Structure MISE A JOUR d'un fichier config (v2 - avec detail)

```python
# configs/promoteur.py

CONFIG_PROMOTEUR = {
    "key": "promoteur",
    "name": "Nom Promoteur",
    "base_url": "https://www.promoteur.com",

    # URL patterns (NOUVEAU : 2 patterns)
    "url_pattern_listing": "/recherche/{ville_slug}",
    "url_pattern_detail": "/programme/{id}",  # ou None si extrait du listing
    "has_detail_page": True,  # True = scraping 2 etapes

    # Scraper
    "scraper_type": "firecrawl",
    "requires_proxy": True,
    "wait_for_ms": 3000,
    "formats": ["html"],

    # Selecteurs PAGE LISTING
    "selectors_listing": {
        "programme_cards": ".card",
        "nom": "h3",
        "prix": ".price",
        "ville_cp": ".location",
        "image": "img",
        "lien_detail": "a[href]",
        "livraison": ".delivery",
        "id_externe": "data-id",
    },

    # Selecteurs PAGE DETAIL (NOUVEAU)
    "selectors_detail": {
        "tableau_lots": "table, .lots-container",
        "type_lot": ".type",
        "nb_lots": ".count",
        "surface": ".surface",
        "prix_min_max": ".price-range",
        "adresse": ".address",
    },

    # Regex patterns (NOUVEAU)
    "prix_regex": r"...",
    "types_regex": r"...",
    "livraison_regex": r"...",

    # Rate limiting (NOUVEAU : delay details)
    "delay_between_cities_sec": 10,
    "delay_between_details_sec": 5,  # NOUVEAU
    "max_retries": 3,
    "timeout_ms": 60000,
}

def parse_listing(scrape_data, ville_id, zone, ville_slug, config):
    """Etape 1 : Parse listing → retourne liste programmes avec URLs detail."""
    pass

def parse_detail(scrape_data, programme, config):
    """Etape 2 : Parse detail → enrichit programme avec prix/lots par typo."""
    pass
```

### Validation Phase 2 (par promoteur)

- [ ] URL pattern listing identifie et teste sur 3 villes
- [ ] URL pattern detail identifie et teste sur 3 programmes
- [ ] Selecteurs listing extraient les donnees de base
- [ ] Selecteurs detail extraient prix par typo + nb lots
- [ ] Fichier config cree et enregistre dans le registry
- [ ] Parser listing + detail retournent des programmes valides
- [ ] Test scraping sur 5 villes sans erreur

---

## Phase 3 : Pipeline images (1-2 sessions)

### Taches

- [ ] 3.1 Integrer le download d'images dans `helpers.py`
- [ ] 3.2 Pour chaque programme : extraire URLs images depuis la page detail
- [ ] 3.3 Telecharger via Gateway proxy (`POST /api/scrape/image`)
- [ ] 3.4 Stocker les URLs dans le champ `images` (JSON array)
- [ ] 3.5 Definir `imagePrincipale` = premiere image
- [ ] 3.6 Generer `imageAlt` depuis nom programme + ville

### Contraintes

- Maximum 5 images par programme
- Utiliser le batch endpoint (50 images/requete) pour les gros volumes
- Rate limit : 30 req/min pour les images
- Timeout : 30s par image
- **Sans images, les programmes ne s'affichent pas** (filtre `isEnrichedProgramme()`)

### Fichiers a modifier

| Fichier | Modification |
|---------|-------------|
| `helpers.py` | Ajouter `download_image()`, `download_images_batch()` |
| `scrape_promoteurs.py` | Integrer appel images apres creation programme |
| `configs/*.py` | Ajouter selecteurs images dans chaque config |

### Validation Phase 3

- [ ] > 80% des programmes ont au moins 1 image
- [ ] Images accessibles via URL (pas de 403/404)
- [ ] Programmes avec images apparaissent sur `/programmes`
- [ ] Batch endpoint fonctionne (50 images/req)

---

## Phase 4 : Deduplication & mapping villes (1 session)

### Taches

- [ ] 4.1 Implementer `programme_exists(source_api, id_externe)` dans helpers
- [ ] 4.2 Implementer `get_ville_by_code_postal()` avec cache local
- [ ] 4.3 Mode update : mettre a jour prix/disponibilite si programme existe
- [ ] 4.4 Mode cleanup : marquer `statut: "vendu"` si programme disparu
- [ ] 4.5 Gestion multi-villes : un programme sur une frontiere = 1 seul enregistrement

### Logique de deduplication

```
Pour chaque programme scrappe :
  1. Extraire id_externe depuis URL
  2. Chercher dans EspoCRM : sourceApi + idExterne
  3. Si existe :
     a. Comparer prix, lots, statut
     b. Si change : PUT pour update
     c. Si identique : skip
  4. Si n'existe pas :
     a. Lookup ville par codePostal
     b. Si ville trouvee (zone A/A_bis/B1) : POST pour create
     c. Si ville hors zone : skip
```

### Validation Phase 4

- [ ] 0 doublons apres 2 runs consecutifs
- [ ] Programmes mis a jour (pas recrees) au 2eme run
- [ ] Programmes disparus marques "vendu"
- [ ] 100% des programmes lies a une ville valide

---

## Phase 5 : Automatisation bi-mensuelle (1 session)

### Taches

- [ ] 5.1 Configurer cron : `0 1 */14 * 0` (dimanche 1h, toutes les 2 semaines)
- [ ] 5.2 Creer wrapper bash avec env : `run_scrape_promoteurs.sh`
- [ ] 5.3 Log rotation via logrotate
- [ ] 5.4 Alerte email si erreur > 30% : `send-audit-email.sh`
- [ ] 5.5 Endpoint stats dans Gateway : `GET /api/scrape-promoteurs/stats`

### Cron

```bash
# Scraping programmes promoteurs - Bi-mensuel dimanche 1h
0 1 */14 * 0 /root/scripts/scrape-promoteurs/run_scrape_promoteurs.sh >> /var/log/scrape-promoteurs.log 2>&1
```

### Wrapper bash

```bash
#!/bin/bash
# /root/scripts/scrape-promoteurs/run_scrape_promoteurs.sh
source /root/scripts/scrape-promoteurs/.env
cd /root/scripts/scrape-promoteurs
python3 scrape_promoteurs.py --promoteurs all 2>&1

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  /root/scripts/send-audit-email.sh \
    "Scraping Promoteurs - ERREUR" \
    "<h1>Echec scraping</h1><p>Exit code: $EXIT_CODE</p>"
fi
```

### Fichiers a creer/modifier

| Fichier | Action |
|---------|--------|
| `scripts/scrape-promoteurs/run_scrape_promoteurs.sh` | Creer |
| `scripts/scrape-promoteurs/.env` | Creer (ESPOCRM_API_KEY, BEARER_TOKEN) |
| `/etc/logrotate.d/scrape-promoteurs` | Creer |
| `jeanbrun-blog-api/server.js` | Ajouter endpoint stats |
| `crontab` | Ajouter entree |

### Validation Phase 5

- [ ] Cron fonctionne (test manuel : `run_scrape_promoteurs.sh`)
- [ ] Logs ecrits dans `/var/log/scrape-promoteurs.log`
- [ ] Email envoye en cas d'erreur
- [ ] Stats endpoint retourne metriques correctes
- [ ] Run complet < 8 heures

---

## Recapitulatif

| Phase | Sessions | Responsable | Dependances |
|-------|----------|-------------|-------------|
| 0. Nettoyage | 1 | Claude | - |
| 1. Orchestrateur | 1-2 | Claude | Phase 0 |
| 2. CSS DevTools | 10-20 | **Collaboratif** | Phase 1 |
| 3. Images | 1-2 | Claude | Phase 2 (batch 1 min) |
| 4. Deduplication | 1 | Claude | Phase 1 |
| 5. Automatisation | 1 | Claude | Phase 1-4 |

**Total estime:** 15-27 sessions (selon rythme Phase 2)

### Jalons

| Jalon | Critere | Quand |
|-------|---------|-------|
| MVP | 5 promoteurs, 500+ programmes | Apres Batch 1 Phase 2 |
| V1 | 10 promoteurs, 1000+ programmes | Apres Batch 2 Phase 2 |
| V2 | 20 promoteurs, 1500+ programmes, cron | Fin Phase 5 |

---

**Auteur:** Claude (Opus 4.5)
**Date:** 5 fevrier 2026
**Version:** 1.0
