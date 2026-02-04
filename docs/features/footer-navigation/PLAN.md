# Plan : Unification Header/Footer + Pages Manquantes

## Statut : COMPLETE

## Resume des changements

### Etape 1 : Extraire navigationData dans fichier partage - FAIT
- **Cree** `src/config/navigation.ts` avec navigationData + re-export du type NavigationSection
- **Modifie** `src/app/(landing)/page.tsx` pour importer depuis `@/config/navigation`

### Etape 2 : Remplacer SiteHeader/SiteFooter dans le layout (app) - FAIT
- **Modifie** `src/app/(app)/layout.tsx` : utilise Header Shadcn Studio + FooterComponent03 + `pt-16` sur main
- Navigation identique entre landing et pages app

### Etape 3 : Enrichir pages villes avec donnees manquantes - FAIT

**3a. DonneesInsee integre aux layouts**
- MetropoleLayout : ajout apres DonneesMarche dans la section marche
- PeripheriqueLayout : ajout dans la sidebar apres QuickDataCard

**3b. DonneesMarche enrichi**
- Ajout prixM2Median (affiche sous le prix moyen)
- Ajout loyerM2Moyen (nouvelle card avec icone KeyRound)
- Ajout tensionLocative en Badge (avec labels francais)
- Ajout niveauLoyer en Badge outline

**3c. BarometreSidebar enrichi**
- Ajout cPrixM2 (prix m2 du mois)
- Ajout cLoyerM2 (loyer m2 du mois)
- Ajout cMeilleureOpportuniteName (avec icone Trophy)
- Ajout cAnalyseIA en section expandable/collapsible (useState toggle)

**3d. ProgrammeCard enrichi**
- Fourchette prix (cPrixMin - cPrixMax) au lieu de juste "A partir de"
- Ajout cPrixM2Moyen sous le prix
- Ajout cTypesLots en badges (T1, T2, T3, T4)
- Lots affiches comme "5/12 lots disponibles" (cNbLotsDisponibles/cNbLotsTotal)
- Ajout cAdresse sous la localisation

**3e. Plafonds specifiques ville**
- PlafondsJeanbrun accepte desormais `plafondLoyerVille` et `plafondPrixVille`
- Affiche encadre bleu sous le tableau si plafonds renseignes dans EspoCRM
- Page villes/[slug] passe les plafonds de la ville au composant

### Etape 4 : CTA conversion sur pages villes - FAIT
- **Cree** `src/components/villes/cta-ville.tsx`
  - Card gradient subtil, titre dynamique avec nom de ville
  - Badge zone fiscale
  - 2 boutons : "Lancer ma simulation gratuite" + "Prendre RDV avec un expert"
- **Modifie** `src/app/(app)/villes/[slug]/page.tsx` : CTAVille insere apres le layout conditionnel

### Etape 5 : Page /accessibilite - FAIT
- **Cree** `src/app/(app)/accessibilite/page.tsx`
- Pattern identique a mentions-legales (Card + prose + Separator)
- Sections : Engagement, Etat de conformite, Technologies, Contenu non accessible, Ameliorations prevues, Contact, Voies de recours

### Etape 6 : Page /programmes - FAIT
- **Cree** `src/app/(app)/programmes/page.tsx`
- ISR revalidate = 3600 (1h)
- Recupere programmes via `getEspoCRMClient().getProgrammes()`
- Grille responsive (1/2/3 colonnes)
- Etat vide gracieux si EspoCRM indisponible
- JSON-LD ItemList pour SEO
- Hero avec badge compteur + titre + description

### Etape 7 : Nettoyage - FAIT
- **Supprime** `src/components/site-header.tsx` (ancien SiteHeader "Starter Kit")
- **Supprime** `src/components/site-footer.tsx` (ancien SiteFooter basique)
- **Nettoye** CSS hack dans globals.css (masquage SiteHeader sur blog)
- **Mis a jour** commentaire layout landing

## Fichiers modifies

| Fichier | Action |
|---------|--------|
| `src/config/navigation.ts` | CREE |
| `src/app/(app)/layout.tsx` | MODIFIE |
| `src/app/(landing)/page.tsx` | MODIFIE |
| `src/app/(landing)/layout.tsx` | MODIFIE (commentaire) |
| `src/app/globals.css` | MODIFIE (nettoyage) |
| `src/components/villes/DonneesMarche.tsx` | MODIFIE |
| `src/components/villes/BarometreSidebar.tsx` | MODIFIE |
| `src/components/villes/ProgrammeCard.tsx` | MODIFIE |
| `src/components/villes/PlafondsJeanbrun.tsx` | MODIFIE |
| `src/components/villes/MetropoleLayout.tsx` | MODIFIE |
| `src/components/villes/PeripheriqueLayout.tsx` | MODIFIE |
| `src/app/(app)/villes/[slug]/page.tsx` | MODIFIE |
| `src/components/villes/cta-ville.tsx` | CREE |
| `src/app/(app)/accessibilite/page.tsx` | CREE |
| `src/app/(app)/programmes/page.tsx` | CREE |
| `src/components/site-header.tsx` | SUPPRIME |
| `src/components/site-footer.tsx` | SUPPRIME |

### Etape 8 : Bugfixes post-test Vercel - FAIT

**8a. ProgrammeCard NaN/undefined**
- Remplace tous les checks `!== null` par `!= null` (couvre null ET undefined)
- Les donnees EspoCRM retournent `undefined` pour champs absents, pas `null`
- Corrige: prix NaN, surface "undefined m2", location vide

**8b. Zone fiscale hardcodee**
- `generateMetadata`: remplace `const zoneFiscale = "B1"` par `ville.zoneFiscale ?? "B1"`
- MetropoleLayout/PeripheriqueLayout: ZoneBadge et SimulateurPreRempli utilisent `ville.zoneFiscale`
- Avant: sidebar "Zone B1" mais CTA "Zone A" sur Lyon

**8c. Villes de la region (sidebar)**
- Ajout methode `getVillesByDepartementId()` dans le client EspoCRM
- `getVillesProches()`: fallback par departement quand regionId est null
- Avant: affichait Abbeville, Agde... (alphabetique) au lieu de villes proches

## Fichiers modifies

| Fichier | Action |
|---------|--------|
| `src/config/navigation.ts` | CREE |
| `src/app/(app)/layout.tsx` | MODIFIE |
| `src/app/(landing)/page.tsx` | MODIFIE |
| `src/app/(landing)/layout.tsx` | MODIFIE (commentaire) |
| `src/app/globals.css` | MODIFIE (nettoyage) |
| `src/components/villes/DonneesMarche.tsx` | MODIFIE |
| `src/components/villes/BarometreSidebar.tsx` | MODIFIE |
| `src/components/villes/ProgrammeCard.tsx` | MODIFIE (null checks) |
| `src/components/villes/PlafondsJeanbrun.tsx` | MODIFIE |
| `src/components/villes/MetropoleLayout.tsx` | MODIFIE |
| `src/components/villes/PeripheriqueLayout.tsx` | MODIFIE |
| `src/app/(app)/villes/[slug]/page.tsx` | MODIFIE (zone dynamique) |
| `src/components/villes/cta-ville.tsx` | CREE |
| `src/app/(app)/accessibilite/page.tsx` | CREE |
| `src/app/(app)/programmes/page.tsx` | CREE |
| `src/components/site-header.tsx` | SUPPRIME |
| `src/components/site-footer.tsx` | SUPPRIME |
| `src/lib/espocrm/client.ts` | MODIFIE (villes proches + dept) |

## Verification

- Build CI passe sans erreur (pnpm build:ci OK)
- TypeScript compile sans erreur (tsc --noEmit OK)
- Pages /accessibilite et /programmes generees
- Navigation coherente entre landing et pages app
- Zone fiscale dynamique sur toutes les pages villes
- ProgrammeCard robuste face aux champs undefined d'EspoCRM

---

## Etape 9 : Bugfixes session 2 - FAIT

### 9a. CRITIQUE - Mapping champs EspoCRM → ProgrammeCard - FAIT

**Cause racine:** Interface `EspoProgramme` utilisait prefixe "c" (`cPrixMin`, `cPromoteur`...) mais l'API retourne sans prefixe (`prixMin`, `promoteur`...).

**Corrections:**
- `src/lib/espocrm/types.ts` : Interface `EspoProgramme` alignee avec API (sans "c"). Ajout champs manquants (`statut`, `zoneFiscale`, `eligibleJeanbrun`, `slug`, `urlExterne`, `sourceApi`, `idExterne`)
- `fromEspoProgramme()` mis a jour pour les bons noms de champs
- `src/components/villes/ProgrammeCard.tsx` : Destructuration corrigee
- `src/app/(app)/programmes/page.tsx` : JSON-LD corrige (`villeName`, `prixMin`)

### 9b. CRITIQUE - Pages villes en 404 - FAIT

**Cause racine:** Paris et Marseille stockes par arrondissements dans EspoCRM (paris-10, marseille-1...), pas en entite unique. Boulogne-Billancourt inexistant.

**Corrections dans `src/components/villes/FooterVilles.tsx`:**
- Paris → Paris 15e (slug: `paris-15`)
- Marseille → Marseille 8e (slug: `marseille-8`)
- Boulogne-Billancourt → Argenteuil (slug: `argenteuil`, ville A bis confirmee)
- FooterVillesCompact mis a jour egalement

### 9c. MOYEN - Sidebar "Villes de la region" alphabetique - FAIT

**Cause racine:** `regionId` et `departementId` sont `null` pour Lyon et d'autres villes. Le fallback final `getMetropoles()` triait par `name ASC` → Abbeville en premier.

**Corrections dans `src/lib/espocrm/client.ts`:**
- Nouveau fallback par `zoneFiscale` : methode `getMetropolesByZoneFiscale()` (metropoles meme zone, triees par prixM2Moyen DESC)
- Fallback ultime : methode `getMetropolesByPrix()` (toutes metropoles triees par prixM2Moyen DESC)
- Cascade : metropole parent → region → departement → zone fiscale → prix

### 9d. MINEUR - 4 erreurs lint - FAIT

**Corrections:**
- `blog-component-06.tsx` : `<a>` → `<Link>` de next/link
- `hero-section-18/header.tsx` : `<a>` → `<Link>` (2 occurrences)
- `testimonial-content.tsx` : setState synchrone → `requestAnimationFrame`
- `TMICalculator.tsx` : setState synchrone → `requestAnimationFrame`
- Resultat : 0 erreurs lint (225 warnings pre-existants)

### 9e. MINEUR - Preload images - CONFIRME (non corrige)

10 images de la landing preloadees sur les pages app (warnings console). Confirme via DevTools.
Images concernees : loi-jeanbrun-2026.webp, couple-investisseur, fonctionnement-investissement, conditions-location, herve-voirin.avif, blog images, cdn.shadcnstudio.com/image-14.
Pas de `<link rel="preload">` explicite dans les layouts. Probablement genere par Next.js Image `priority` dans les composants landing charges via un layout partage.

---

## Etape 10 : Verification DevTools Vercel - PROBLEMES IDENTIFIES

### 10a. Page /programmes - PARTIELLEMENT CORRIGE

**Etat:** Les prix et villes s'affichent desormais (mapping 9a OK).

**Problemes restants:**
- Prix "0 € - 1 064 000 €" → certains programmes ont `prixMin: 0` ou `null` traite comme 0
- Aucune image (toutes les cards montrent l'icone placeholder)
- Certaines villes manquantes sur les cards (2e programme "280 prado" sans ville)
- 153 programmes affiches sans pagination
- Donnees globalement tres incompletes (pas de promoteur, pas de surface, pas de types lots...)

**Conclusion:** Le mapping code est correct mais les DONNEES EspoCRM sont lacunaires. Il faut rescraper les programmes avec des donnees completes.

### 10b. Pages arrondissements Paris/Marseille - 404 PERSISTENT

**Tests DevTools:**
- `/villes/paris-15` → 404
- `/villes/paris-10` → 404
- `/villes/paris-7` → 404
- `/villes/marseille-8` → 404
- `/villes/cannes` → OK (ISR on-demand fonctionne)
- `/villes/aix-en-provence` → OK
- `/villes/lyon` → OK
- `/villes/nantes` → OK

**Diagnostic:**
- Les slugs `paris-15`, `marseille-8` etc. EXISTENT dans EspoCRM (verifie via curl)
- L'API repond 200 pour ces slugs via les 2 URLs (crm.agent-ia.com et espocrm.expert-ia-entreprise.fr)
- Pas de middleware custom dans le projet
- `dynamicParams` non defini (default: true en Next.js App Router)
- Pas de conflit de routage (seuls fichiers sous villes/ : page.tsx et [slug]/page.tsx)

**Cause racine probable:** Les arrondissements ont ete ajoutes dans EspoCRM APRES un deploiement precedent. Un visiteur ou bot a tente d'acceder a `/villes/paris-15` → Vercel a genere un 404 via ISR → ce 404 a ete cache. La purge "Data Cache" Vercel ne purge PAS le cache ISR des pages 404.

**Solution:** Faire un **Redeploy complet** depuis le dashboard Vercel en DECOCHANT "Redeploy with existing Build Cache". Cela forcera :
1. Un nouveau `generateStaticParams()` qui inclura les 311 villes (y compris arrondissements)
2. La purge de tous les 404 caches

### 10c. Sidebar "Villes de la region" - CORRIGE

**Verifie via DevTools:**
- Lyon affiche maintenant "Cannes (Zone A), Marseille 7eme (Zone A), Antibes (Zone A)" au lieu de "Abbeville, Agde, Albert"
- Nantes affiche les memes villes Zone A (car regionId null, fallback zoneFiscale)
- Aix-en-Provence affiche aussi Cannes, Marseille 7eme, Antibes (meme zone A)

Le fallback par `zoneFiscale` fonctionne correctement.

### 10d. Donnees EspoCRM - ETAT ACTUEL

**Villes (311 total):**
- 20 arrondissements Paris (paris-1 a paris-20)
- 16 arrondissements Marseille (marseille-1 a marseille-16)
- ~275 autres villes
- `regionId` et `departementId` sont NULL pour la plupart des villes
- `population`, `revenuMedian`, `evolutionPrix1An`, `nbTransactions12Mois` souvent NULL

**Programmes (153 total):**
- Seuls champs remplis: `name`, `prixMin`, `prixMax`, `villeId`, `villeName`, `zoneFiscale`, `statut`, `sourceApi`
- Champs vides: `promoteur`, `adresse`, `imagePrincipale`, `prixM2Moyen`, `nbLotsTotal`, `nbLotsDisponibles`, `typesLots`, `dateLivraison`, `latitude`, `longitude`
- Source unique: "nexity" (via scraping)
- `prixMin` parfois 0 (donnee incorrecte)

**Barometres:**
- Non verifie en detail, probablement lacunaires aussi

---

## Etape 11 : Fix metropoleParentId orphelin - FAIT

### 11a. CRITIQUE - Diagnostic 404 arrondissements Paris/Marseille - FAIT

**Cause racine identifiee:**
Les arrondissements (paris-15, marseille-8, etc.) ont un `metropoleParentId` qui pointe vers des enregistrements **supprimes** d'EspoCRM.

| Ville | metropoleParentId | Statut API |
|-------|-------------------|------------|
| paris-15 | `697c88ab8a5c86ca3` | **404 - supprime** |
| marseille-8 | `697c88ac371df0759` | **404 - supprime** |

**Chaine de cause a effet:**
1. `getVilleBySlugEnriched('paris-15')` trouve la ville OK
2. `getVilleById(metropoleParentId)` appelle EspoCRM → 404
3. `EspoCRMError` lancee (erreur 4xx, pas de retry)
4. Le catch dans la page appelle `notFound()` → page 404 mise en cache ISR
5. Lyon/Nantes marchent car `isMetropole=true` → pas de requete parent

**Villes impactees:** Tous les arrondissements Paris (20) + Marseille (16) + potentiellement d'autres villes peripheriques dont le parent a ete supprime.

### 11b. Fix resilience getVilleBySlugEnriched - FAIT

**Correction dans `src/lib/espocrm/client.ts` ligne 360:**

Avant:
```typescript
ville.metropoleParentId
  ? this.getVilleById(ville.metropoleParentId)
  : Promise.resolve(null),
```

Apres:
```typescript
ville.metropoleParentId
  ? this.getVilleById(ville.metropoleParentId).catch(() => null)
  : Promise.resolve(null),
```

Si le parent metropole n'existe plus dans EspoCRM, la page s'affiche avec `metropoleParent = null` au lieu de crasher en 404. Le composant `LienMetropoleParent` n'est simplement pas affiche.

### 11c. Configuration Vercel verifiee - OK

Variables d'environnement presentes dans Vercel:
- `ESPOCRM_API_KEY` ✅ (All Environments)
- `POSTGRES_URL` ✅ (Production)
- `BETTER_AUTH_SECRET` ✅ (Production)
- `BETTER_AUTH_URL` ✅ (Production)
- `NEXT_PUBLIC_APP_URL` ✅ (Production)
- `ESPOCRM_BASE_URL` ❌ Absente mais defaut OK dans le code

Note: le code dans `src/lib/espocrm/index.ts` accepte `ESPOCRM_URL` OU `ESPOCRM_BASE_URL` avec fallback vers `https://espocrm.expert-ia-entreprise.fr/api/v1`.

---

## Prochaines etapes (Etape 12)

### 12a. FAIT - Recreer entites metropoles Paris/Marseille dans EspoCRM

**Contexte:** Les arrondissements (20 Paris + 16 Marseille) avaient un `metropoleParentId` pointant vers des enregistrements supprimes. Paris et Marseille n'existaient pas en tant que ville unique car Tom avait scrape par arrondissement (codes postaux distincts).

**Corrections appliquees (4 fevrier 2026):**

1. **Cree metropole Paris** : ID `698387baacfc39909`, slug=`paris`, zone=`A_BIS`, isMetropole=true, pop=2 161 000
2. **Cree metropole Marseille** : ID `698386c61b3fcaaf5`, slug=`marseille`, zone=`A`, isMetropole=true, pop=873 076
3. **Rattache 20 arrondissements Paris** (paris-1 a paris-20) → metropoleParentId = Paris
4. **Rattache 16 arrondissements Marseille** (marseille-1 a marseille-16) → metropoleParentId = Marseille
5. **Corrige zoneFiscale** : 61 villes Ile-de-France avaient `A_bis` (minuscule) au lieu de `A_BIS` (enum correct). Toutes corrigees.
6. **Diagnostic orphelins** : 46 parent IDs uniques verifies, 2 orphelins trouves (ancien Paris + ancien Marseille), 0 orphelin restant.

**Resultat:**
- Total villes EspoCRM : 311 → **313** (+Paris, +Marseille)
- Parents orphelins : 2 → **0**
- Aucune modification de code, uniquement donnees EspoCRM

**Note technique:** L'enum `zoneFiscale` dans EspoCRM accepte `A_BIS` (majuscules) en creation mais stockait `A_bis` pour les anciennes entrees. La recherche EspoCRM est case-insensitive mais le code TypeScript attend `A_BIS`.

**Verification requise:** Redeploy Vercel (sans build cache) pour que `/villes/paris` et `/villes/marseille` soient generes, et que les arrondissements affichent le lien "Voir la metropole".

### 12b. EN COURS - Enrichissement programmes EspoCRM (scraping Tom)

**Decisions validees (4 fevrier 2026) :**

- **Modele eco :** On vend des lots. Aucune reference promoteur (pas de tel, site, lien externe).
- **Images :** Re-hebergees sur R2, pas d'URLs Nexity directes.
- **lotsDetails :** Nouveau champ JSON avec prix par typologie (T2, T3, T4...). A creer dans EspoCRM.
- **Existants :** Enrichir les 153 programmes, pas purger. Marquer `epuise` les invalides.
- **Sources :** Nexity uniquement pour l'instant.

**Champs a remplir par Tom :**
description, imagePrincipale, imageAlt, images, typesLots, prixMin, prixMax, prixM2Moyen,
nbLotsTotal, nbLotsDisponibles, adresse (non affichee), dateLivraison, latitude, longitude,
promoteur (non affiche), urlExterne (non affiche), lotsDetails

**Champs interdits :** telephone, siteWeb (NE PAS remplir)

**Instructions detaillees :** `docs/features/pages-contenu/INSTRUCTIONS-TOM-SCRAPING-PROGRAMMES.md`

**Cote code (apres enrichissement Tom) :**
- `src/lib/espocrm/types.ts` : ajouter lotsDetails dans EspoProgramme
- `src/components/villes/ProgrammeCard.tsx` : retirer promoteur/urlExterne, ajouter lotsDetails
- `src/app/(app)/programmes/page.tsx` : pagination + filtres

### 12c. MOYEN - Enrichissement villes EspoCRM

**Contexte:** 311 villes dans EspoCRM mais donnees lacunaires.

**Champs a remplir (par priorite):**

1. **regionId / departementId** (PRIORITE 1)
   - Actuellement NULL pour la plupart des villes
   - Impact: la sidebar "Villes de la region" utilise le fallback par zoneFiscale au lieu de la region reelle
   - Source: fichier officiel INSEE (code commune → departement → region)
   - Action: script qui enrichit via l'API INSEE ou un CSV de mapping

2. **contenuEditorial / photoVille** (PRIORITE 2)
   - `contenuEditorial` rempli pour les villes peripheriques (genere par IA) mais vide pour les 52 metropoles
   - `photoVille` pointe vers des images R2 mais beaucoup utilisent la photo de la metropole parent
   - Action: generer du contenu editorial pour les metropoles, scraper des photos libres de droits

3. **population / revenuMedian** (PRIORITE 3)
   - Rempli pour certaines villes peripheriques, souvent NULL pour les metropoles
   - Source: API INSEE / data.gouv.fr
   - Action: script d'enrichissement en batch

4. **plafondLoyerJeanbrun / plafondPrixJeanbrun** (PRIORITE 3)
   - Plafonds specifiques ville (optionnel, les plafonds par zone existent dans le code)
   - Source: BOFiP / textes officiels PLF 2026

**Fichiers concernes:**
- `src/components/villes/DonneesMarche.tsx` : affiche les donnees marche
- `src/components/villes/DonneesInsee.tsx` : affiche population/revenu
- `src/components/villes/BarometreSidebar.tsx` : sidebar barometre
- `src/components/villes/ContenuEditorial.tsx` : contenu SEO
- Scripts enrichissement dans `/root/scripts/jeanbrun/` (a creer)

### 12d. MINEUR - Preload images landing

**Contexte:** 10 images de la landing sont preloadees sur TOUTES les pages app (warnings console).

**Images concernees:**
- `loi-jeanbrun-2026.webp`, `couple-investisseur`, `fonctionnement-investissement`
- `conditions-location`, `herve-voirin.avif`
- Images blog, `cdn.shadcnstudio.com/image-14`

**Cause probable:** Composants landing importes dans un layout partage, ou `next/image` avec `priority` dans des composants visibles sur toutes les pages.

**Action:**
1. Identifier quel layout charge ces images (probablement `src/app/(landing)/layout.tsx` ou un composant partage)
2. S'assurer que les composants landing ne sont importes QUE dans le layout `(landing)`, pas dans `(app)`
3. Verifier les `priority` sur les `<Image>` de la landing

**Fichiers a inspecter:**
- `src/app/(app)/layout.tsx` : layout pages app
- `src/app/(landing)/layout.tsx` : layout landing
- `src/components/shadcn-studio/blocks/hero-section-18/` : hero avec images
- `src/components/landing/` : wrappers landing

### 12e. MOYEN - Verification post-deploy

**Apres le deploy du fix 11b, verifier via DevTools:**
1. `/villes/paris-15` → doit retourner 200 (plus 404)
2. `/villes/marseille-8` → doit retourner 200
3. `/villes/paris-10` → doit retourner 200
4. Verifier que le header montre un NOUVEAU deployment ID (different de `dpl_EqqhTBcXimja3idePaLYdVKZwqZf`)
5. Verifier que `x-vercel-cache` n'est plus `HIT` sur un ancien 404
6. Verifier que les pages arrondissements affichent le contenu ville (meme sans lien metropole parent)
