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

### 12a. MOYEN - Recreer entites metropoles Paris/Marseille dans EspoCRM
Les arrondissements affichent la page mais sans lien vers la metropole parent.
Action: creer "Paris" et "Marseille" comme CJeanbrunVille isMetropole=true, puis mettre a jour les metropoleParentId des arrondissements.

### 12b. CRITIQUE - Strategie scraping programmes
Les 153 programmes actuels sont quasi vides. Il faut definir :
1. Quelles donnees exactes on veut sur une fiche programme
2. Quelles sources scraper (Nexity seul ne suffit pas)
3. Comment enrichir les programmes existants
4. Frequence de re-scraping

### 12c. MOYEN - Enrichissement villes EspoCRM
- Remplir regionId/departementId pour toutes les villes
- Remplir population, revenuMedian, evolutionPrix1An
- Ajouter contenuEditorial, photoVille pour le SEO

### 12d. MINEUR - Preload images landing
Identifier le composant qui cause le preload et le limiter au layout landing
