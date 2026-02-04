# Instructions Tom : Scraping & Enrichissement Programmes Immobiliers

Ce document est le **guide complet** que Tom doit suivre pour enrichir les 153 programmes immobiliers dans EspoCRM. Il contient l'etat actuel des donnees, les champs exacts a remplir, les regles metier, et les pieges a eviter.

---

## 1. REGLES METIER CRITIQUES

### Modele economique

**On vend des lots.** On n'envoie PAS les gens chez le promoteur.

- **AUCUN telephone** promoteur
- **AUCUN site web** promoteur
- On garde uniquement le **nom du programme** dans l'affichage (ex: "KARA", "Liberty")
- On **stocke** le nom du promoteur et l'URL de la fiche programme en base (champs `promoteur` et `urlExterne`) pour usage interne et eviter de rescraper, mais on ne les **affiche jamais** cote utilisateur

### Logique ville / arrondissement

- **Grande ville** (Paris, Marseille) → afficher le **nom de l'arrondissement** (ex: "Paris 15eme", "Marseille 8eme")
- **Autre ville** → afficher le **nom de la ville** (ex: "Lyon", "Nantes", "Cannes")
- Le `villeId` doit pointer vers l'entite **arrondissement** pour Paris/Marseille, pas vers la metropole

---

## 2. ETAT ACTUEL ESPOCRM

### Entite : CJeanbrunProgramme

**153 programmes** existants. Source unique : Nexity.

**Champs remplis actuellement :**
- `name` : nom du programme
- `prixMin`, `prixMax` : fourchette prix (parfois prixMin=0, incorrect)
- `villeId`, `villeName` : ville liee
- `zoneFiscale` : zone fiscale
- `statut` : statut du programme
- `sourceApi` : "nexity"
- `idExterne`, `urlExterne` : identifiants Nexity

**Champs VIDES a enrichir :**
- `description` : NULL
- `images` : NULL (champ text, JSON array)
- `imagePrincipale` : NULL
- `imageAlt` : NULL
- `typesLots` : NULL (multiEnum EspoCRM : T1, T2, T3, T4, T5, Maison, Autre)
- `nbLotsTotal` : NULL
- `nbLotsDisponibles` : NULL
- `prixM2Moyen` : NULL
- `adresse` : NULL
- `dateLivraison` : NULL
- `latitude`, `longitude` : NULL

### Entite : CJeanbrunVille

**313 villes** (52 metropoles + 261 peripheriques). Inclut :
- 20 arrondissements Paris (paris-1 a paris-20) → metropoleParentId = Paris
- 16 arrondissements Marseille (marseille-1 a marseille-16) → metropoleParentId = Marseille

---

## 3. CHAMPS A SCRAPER (EXHAUSTIF)

### Champs a remplir via scraping

| # | Champ API | Type EspoCRM | Scraper | Afficher | Description |
|---|-----------|-------------|---------|----------|-------------|
| 1 | `description` | text | OUI | OUI | Description du programme (texte brut, pas HTML) |
| 2 | `imagePrincipale` | url (max 500) | OUI | OUI | URL image principale sur R2 |
| 3 | `imageAlt` | varchar(200) | OUI | OUI | Alt text SEO (ex: "Programme neuf KARA Lyon 3eme") |
| 4 | `images` | text (JSON) | OUI | OUI | JSON array d'URLs images supplementaires sur R2 |
| 5 | `typesLots` | multiEnum | OUI | OUI | Valeurs EXACTES : T1, T2, T3, T4, T5, Maison, Autre |
| 6 | `prixMin` | int (min:0) | CORRIGER | OUI | Corriger les valeurs a 0 |
| 7 | `prixMax` | int (min:0) | CORRIGER | OUI | Corriger si manquant |
| 8 | `prixM2Moyen` | int (min:0) | OUI | OUI | Prix moyen au m2 |
| 9 | `nbLotsTotal` | int (min:0) | OUI | OUI | Nombre total de lots |
| 10 | `nbLotsDisponibles` | int (min:0) | OUI | OUI | Lots encore disponibles |
| 11 | `adresse` | text | OUI | **NON** | Stocke mais pas affiche (usage geoloc interne) |
| 12 | `dateLivraison` | varchar(50) | OUI | OUI | Format libre : "T4 2027", "2027", "Livree" |
| 13 | `latitude` | float | OUI | NON (futur) | Geocodage depuis adresse via API Adresse |
| 14 | `longitude` | float | OUI | NON (futur) | Geocodage depuis adresse via API Adresse |
| 15 | `promoteur` | varchar(150) | OUI | **NON** | Nom du promoteur. Stocke en base, jamais affiche |
| 16 | `urlExterne` | url | OUI | **NON** | URL fiche programme chez le promoteur. Stocke, jamais affiche |

### Nouveau champ a creer : lotsDetails

**Ce champ n'existe pas encore dans EspoCRM.** Il faut le creer avant de scraper.

| Champ API | Type | Description |
|-----------|------|-------------|
| `lotsDetails` | text (JSON) | Prix detaille par typologie |

**Format JSON attendu :**

```json
[
  {
    "typologie": "T3",
    "prixMin": 245000,
    "prixMax": 310000,
    "surfaceMin": 65,
    "surfaceMax": 75,
    "nbLots": 25
  },
  {
    "typologie": "T4",
    "prixMin": 350000,
    "prixMax": 450000,
    "surfaceMin": 85,
    "surfaceMax": 95,
    "nbLots": 12
  }
]
```

**Regles lotsDetails :**
- `typologie` : une des valeurs T1, T2, T3, T4, T5, Maison
- Prix en euros, entiers, pas de decimales
- Surfaces en m2, entiers
- Si un seul prix connu : `prixMin` = `prixMax`
- Si surface unique : `surfaceMin` = `surfaceMax`
- `nbLots` : nombre de lots de cette typologie (optionnel, mettre null si inconnu)

### Champs a NE PAS toucher

| Champ | Raison |
|-------|--------|
| `telephone` | Pas de telephone promoteur |
| `siteWeb` | Pas de site web promoteur |
| `sourceApi` | Deja rempli ("nexity"), ne pas changer |
| `idExterne` | Deja rempli, ne pas changer |
| `slug` | Deja rempli pour certains, voir regles ci-dessous |
| `villeId` | Deja rempli, ne changer QUE si incorrect |
| `zoneFiscale` | Deja rempli, ne changer QUE si incorrect |
| `eligibleJeanbrun` | Sera recalcule cote code, pas par le scraping |

---

## 4. REGLES TECHNIQUES CRITIQUES

### Slugs programmes

**Convention obligatoire :**
- Minuscules, sans accents, tirets pour espaces
- Format : `{nom-programme}-{ville}` (ex: `kara-lyon-3eme`, `liberty-nancy`)
- Max 150 caracteres
- **UNIQUE** : verifier qu'il n'existe pas deja

**Generation slug :**
```
"KARA" + "Lyon 3eme" → "kara-lyon-3eme"
"Les Jardins de Provence" + "Aix-en-Provence" → "les-jardins-de-provence-aix-en-provence"
```

### Enums EspoCRM (valeurs EXACTES)

**zoneFiscale (CJeanbrunProgramme) :**
- ATTENTION : l'enum programme utilise `A_bis` (minuscule b) tandis que l'enum ville utilise `A_BIS` (majuscule). C'est une incoherence EspoCRM.
- Valeurs acceptees sur CJeanbrunProgramme : `A_bis`, `A`, `B1`, `B2`, `C`

**typesLots (multiEnum) :**
- Valeurs EXACTES : `T1`, `T2`, `T3`, `T4`, `T5`, `Maison`, `Autre`
- C'est un multiEnum EspoCRM, pas un JSON string
- Envoyer comme array : `["T2", "T3", "T4"]`

**statut :**
- Valeurs : `disponible`, `en_commercialisation`, `epuise`, `livre`

### Images sur R2

**Bucket R2 :** `pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev`
**Convention de nommage :**
```
programmes/{slug}/{image-name}.webp
```
Exemple :
```
programmes/kara-lyon-3eme/principale.webp
programmes/kara-lyon-3eme/vue-facade.webp
programmes/kara-lyon-3eme/salon-t3.webp
```

**Format obligatoire :** WebP (comme les photos villes)
**imagePrincipale :** URL complete R2 de l'image principale
**images :** JSON array des URLs R2 supplementaires
```json
["https://pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev/programmes/kara-lyon-3eme/vue-facade.webp",
 "https://pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev/programmes/kara-lyon-3eme/salon-t3.webp"]
```

### API EspoCRM - Comment mettre a jour

**Endpoint :** `PUT https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunProgramme/{id}`
**Header :** `X-Api-Key: {ESPOCRM_API_KEY}` + `Content-Type: application/json`

**Exemple payload enrichissement :**
```json
{
  "description": "Au coeur du 3eme arrondissement de Lyon, la residence KARA offre des appartements lumineux du T3 au T5 avec terrasses et vues degagees.",
  "imagePrincipale": "https://pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev/programmes/kara-lyon-3eme/principale.webp",
  "imageAlt": "Programme neuf KARA Lyon 3eme",
  "images": "[\"https://pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev/programmes/kara-lyon-3eme/facade.webp\"]",
  "typesLots": ["T3", "T4", "T5"],
  "prixMin": 481000,
  "prixMax": 1064000,
  "prixM2Moyen": 5800,
  "nbLotsTotal": 6,
  "nbLotsDisponibles": 6,
  "adresse": "15 rue Example, 69003 Lyon",
  "dateLivraison": "T4 2027",
  "slug": "kara-lyon-3eme",
  "lotsDetails": "[{\"typologie\":\"T3\",\"prixMin\":481000,\"prixMax\":481000,\"surfaceMin\":69,\"surfaceMax\":69,\"nbLots\":2},{\"typologie\":\"T4\",\"prixMin\":519000,\"prixMax\":519000,\"surfaceMin\":90,\"surfaceMax\":90,\"nbLots\":2},{\"typologie\":\"T5\",\"prixMin\":1064000,\"prixMax\":1064000,\"surfaceMin\":145,\"surfaceMax\":145,\"nbLots\":2}]"
}
```

**ATTENTION** : les champs `images` et `lotsDetails` sont de type `text` dans EspoCRM. Il faut envoyer le JSON **sous forme de string** (stringify), pas comme objet JSON.

### Rate limiting

- Maximum **1 requete par seconde** vers l'API EspoCRM
- Si erreur 403 : attendre 5 secondes puis reessayer
- Si erreur 400 : verifier le payload (champ invalide, enum incorrect)

---

## 5. PROCESSUS DE TRAVAIL

### Etape 1 : Creer le champ lotsDetails dans EspoCRM

Avant tout scraping, ajouter le champ via l'admin EspoCRM ou via le fichier metadata :

```bash
# Dans le container Docker EspoCRM
# Ajouter "lotsDetails" comme champ text dans CJeanbrunProgramme
```

Ou via l'interface admin EspoCRM : Administration > Entity Manager > CJeanbrunProgramme > Fields > Add Field > Type: Text > Name: lotsDetails

### Etape 2 : Lister les programmes a enrichir

```bash
# Recuperer les 153 programmes avec leurs IDs et urlExterne
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunProgramme?maxSize=200&select=id,name,urlExterne,prixMin,villeId,villeName&orderBy=name&order=asc" \
  -H "X-Api-Key: $ESPOCRM_API_KEY"
```

### Etape 3 : Pour chaque programme

1. **Acceder a la page Nexity** via `urlExterne`
2. **Scraper** : description, images, typologies, prix, nombre de lots, adresse, date livraison
3. **Telecharger les images** et les convertir en WebP
4. **Uploader sur R2** avec la convention de nommage
5. **Geocoder l'adresse** via `https://api-adresse.data.gouv.fr/search/?q={adresse}`
6. **Construire le payload** JSON
7. **PUT** vers EspoCRM

### Etape 4 : Nettoyage des programmes invalides

- Si `urlExterne` est morte (404) : mettre `statut` = `epuise`
- Si `prixMin` = 0 et impossible de trouver le vrai prix : mettre `statut` = `epuise`
- Si pas de `villeId` : essayer de retrouver la ville, sinon `statut` = `epuise`

**NE PAS supprimer les programmes.** Les passer en `epuise` pour garder l'historique.

### Etape 5 : Verification

Apres enrichissement, verifier :
- Chaque programme a `imagePrincipale` non null
- Chaque programme a `description` non null
- Chaque programme a `typesLots` non null
- Chaque programme a `prixMin` > 0
- Chaque programme a `nbLotsTotal` > 0
- Aucun `telephone`, `siteWeb` n'est rempli
- `promoteur` et `urlExterne` sont remplis mais ne seront PAS affiches cote UI

---

## 6. MAPPING VILLE POUR PARIS / MARSEILLE

### IDs des arrondissements Paris (slug → id)

| Slug | ID EspoCRM |
|------|-----------|
| paris-1 | 697dedf2b5db5c1c4 |
| paris-2 | 697dedf354b0325de |
| paris-3 | 697dedf3e71083ad0 |
| paris-4 | 697dedf48599bf2ee |
| paris-5 | 697dedf5247277a27 |
| paris-6 | 697dedf5b8341cea6 |
| paris-7 | 697dedf65737c13cf |
| paris-8 | 697dedf6e86f4c2d5 |
| paris-9 | 697dedf787f8b5e66 |
| paris-10 | 697dedf826e07f7e4 |
| paris-11 | 697dedf8ba8db3097 |
| paris-12 | 697dedf9595aeeeee |
| paris-13 | 697dedf9eaabe6320 |
| paris-14 | 697dedfa89003fb0c |
| paris-15 | 697dedfb257eb4406 |
| paris-16 | 697dedfbb5d874c0f |
| paris-17 | 697dedfc5427447de |
| paris-18 | 697dedfce56fec614 |
| paris-19 | 697dedfd837e8c4dc |
| paris-20 | 697dedfe213379021 |

### IDs des arrondissements Marseille

| Slug | ID EspoCRM |
|------|-----------|
| marseille-1 | 697dee989a47244cc |
| marseille-2 | 697dee993858f192c |
| marseille-3 | 697dee99ca2379e83 |
| marseille-4 | 697dee9a6843c1410 |
| marseille-5 | 697dee9b056883df2 |
| marseille-6 | 697dee9b97a1287ec |
| marseille-7 | 697dee9c347fa5742 |
| marseille-8 | 697dee9cc61a13d41 |
| marseille-9 | 697dee9d622221991 |
| marseille-10 | 697dee9df2edbf258 |
| marseille-11 | 697dee9e92ba4a1d5 |
| marseille-12 | 697dee9f2f7db0531 |
| marseille-13 | 697dee9fc43a4b9f9 |
| marseille-14 | 697deea0641a2bdad |
| marseille-15 | 697deea1011cffe3c |
| marseille-16 | 697deea19270ec46d |

### IDs metropoles Paris / Marseille (NE PAS utiliser comme villeId programme)

| Ville | ID | Usage |
|-------|-----|-------|
| Paris (metropole) | 698387baacfc39909 | Uniquement comme parent des arrondissements |
| Marseille (metropole) | 698386c61b3fcaaf5 | Uniquement comme parent des arrondissements |

**Regle :** Si un programme est a "Paris 15eme", le `villeId` doit etre `697dedfb257eb4406` (paris-15), PAS `698387baacfc39909` (Paris metropole).

---

## 7. CE QUE JE FAIS COTE CODE (apres enrichissement Tom)

Une fois que Tom a enrichi au moins 20+ programmes :

1. **Creer le champ `lotsDetails`** dans l'interface `EspoProgramme` (`src/lib/espocrm/types.ts`)
2. **Adapter `ProgrammeCard`** (`src/components/villes/ProgrammeCard.tsx`) :
   - Supprimer l'affichage promoteur (badge)
   - Supprimer le lien urlExterne
   - Ajouter l'affichage des prix par typologie (lotsDetails)
   - Masquer l'adresse
3. **Adapter la page `/programmes`** (`src/app/(app)/programmes/page.tsx`) :
   - Pagination (153 programmes sans pagination actuellement)
   - Filtres par ville/zone/typologie
4. **Optionnel : page detail `/programmes/[slug]`**

### Fichiers a modifier

| Fichier | Modification |
|---------|-------------|
| `src/lib/espocrm/types.ts` | Ajouter `lotsDetails` dans EspoProgramme, ajouter dans fromEspoProgramme() |
| `src/components/villes/ProgrammeCard.tsx` | Retirer promoteur/urlExterne, ajouter lotsDetails, masquer adresse |
| `src/app/(app)/programmes/page.tsx` | Pagination, filtres |

---

## 8. FAQ - REPONSES AUX QUESTIONS TOM (4 fevrier 2026)

### Q1. Qui cree lotsDetails dans EspoCRM ?
**FAIT.** Le champ `lotsDetails` (type text) a ete cree sur CJeanbrunProgramme le 4 fevrier 2026 via metadata Docker + rebuild. Il est pret a recevoir du JSON stringify.

### Q2. Upload images sur R2 - acces ?
**FAIT.** Les credentials R2 S3-compatible ont ete ajoutes dans :
- `/home/moltbot/.openclaw/workspace/.env`
- `/home/moltbot/.openclaw/openclaw.json` (env + sandbox docker env)

Variables disponibles :
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` : credentials S3
- `R2_ENDPOINT` : `https://5d4ee01059ff36bd168e883a8057fe8c.r2.cloudflarestorage.com`
- `R2_PUBLIC_DOMAIN` : `pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev`

**Bucket name a determiner** : lister les buckets via l'API S3 avec ces credentials pour identifier le nom exact du bucket associe au domaine public `pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev`. Convention d'upload : `programmes/{slug}/{image-name}.webp`

### Q3. Priorite d'execution ?
**Option B : test sur 10 programmes d'abord.**
Choisir 10 programmes varies :
- 2-3 dans des grandes villes (Lyon, Toulouse, Nantes)
- 1-2 a Paris (arrondissement)
- 1 a Marseille (arrondissement)
- 2-3 dans des villes moyennes
- 1 avec prixMin = 0 (a corriger)

### Q4. Programmes invalides (404) ?
- Mettre `statut` = `epuise`
- Generer le slug si manquant : `{nom-programme}-{ville}` (convention slugify)
- **Pas de description minimale** - on ne fabrique pas de fausses donnees
- Le programme reste en base mais invisible cote UI (filtre `statut=disponible`)

### Q5. lotsDetails vide ?
**`null`** (pas `"[]"`).
Si aucun detail de lots disponible sur la page Nexity, le champ reste `null`.
Le code gere les champs null avec des fallbacks.

### Q6. Geocodage - quand ?
**Phase 1 avec le reste.** L'API Adresse (`api-adresse.data.gouv.fr`) est gratuite, rapide, sans rate limit strict.
Workflow : scraper adresse → geocoder dans la foulee → sauvegarder lat/lon.

### Q7. Images - combien max ?
- `imagePrincipale` : 1 obligatoire
- `images` (array supplementaire) : **max 5**
- Privilegier : facade, interieur type, plan de masse, vue aerienne, amenagement
- Pas besoin des 15 photos Nexity, ca coute du stockage R2 pour rien
- Format obligatoire : WebP

### Q8. Rate limiting Nexity ?
**2 secondes entre chaque page Nexity.** Pas plus agressif.
Pour EspoCRM : 1 requete/seconde comme documente section 4.

### Q9. Timezone ?
**Europe/Paris confirme.** Toutes les dates et timestamps.

---

## 9. VERIFICATION FINALE

Le plan est complet quand :
- [x] Champ `lotsDetails` cree dans EspoCRM (FAIT 4 fev 2026)
- [x] Credentials R2 disponibles sur Boldbot (FAIT 4 fev 2026)
- [ ] Batch test 10 programmes reussi
- [ ] Tom a enrichi les 153 programmes (ou marque `epuise` les invalides)
- [ ] Chaque programme actif a : description, imagePrincipale, typesLots, prixMin>0, nbLotsTotal
- [ ] Images hebergees sur R2 (pas d'URLs Nexity directes)
- [ ] Aucun champ promoteur/telephone/siteWeb affiche cote utilisateur
- [ ] Paris/Marseille : villeId pointe vers l'arrondissement, pas la metropole
- [ ] Code adapte pour afficher les nouvelles donnees
