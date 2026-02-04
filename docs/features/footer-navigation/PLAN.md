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

## Etape 9 : Bugs restants identifies (A FAIRE - prochaine session)

### 9a. CRITIQUE - Mapping champs EspoCRM → ProgrammeCard

**Probleme:** La page /programmes affiche 153 programmes mais AUCUNE donnee (pas de prix, pas de surface, pas d'image, pas de ville, pas de promoteur). Seul le `name` apparait.

**Cause racine:** Desynchronisation entre les noms de champs EspoCRM et le type TypeScript `EspoProgramme`.

- L'entite EspoCRM `CJeanbrunProgramme` stocke les champs SANS prefixe "c" : `prixMin`, `promoteur`, `adresse`, `dateLivraison`, etc.
  (voir `docs/technical/PLAN-MOLTBOT-SCRAPING-PROGRAMMES.md` ligne 126-152)
- Mais le type TypeScript `EspoProgramme` dans `src/lib/espocrm/types.ts` attend les champs AVEC prefixe "c" : `cPrixMin`, `cPromoteur`, `cAdresse`, `cDateLivraison`, etc.
  (voir `src/lib/espocrm/types.ts` lignes 127-158)
- L'API EspoCRM retourne les noms de champs tels qu'ils sont dans l'entite (sans "c")
- Resultat : tous les champs sont `undefined` → masques par le fix != null

**Action:** Verifier les noms de champs reels retournes par l'API EspoCRM :
```bash
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunProgramme?maxSize=1" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" | jq '.list[0] | keys'
```
Puis aligner le type `EspoProgramme` ou ajouter un mapping dans `client.ts`.

**Fichiers concernes:**
- `src/lib/espocrm/types.ts` (type EspoProgramme)
- `src/lib/espocrm/client.ts` (methode getProgrammes, mapping response)
- `src/components/villes/ProgrammeCard.tsx` (destructuration des champs)

### 9b. CRITIQUE - Pages villes en 404 (Paris, Marseille, Boulogne-Billancourt)

**Probleme:** Plusieurs villes majeures listees dans le footer retournent 404 :
- /villes/paris → 404
- /villes/marseille → 404
- /villes/boulogne-billancourt → 404

Les pages qui fonctionnent: /villes/lyon, /villes/nantes

**Cause probable:** `generateStaticParams()` appelle `client.getAllVilleSlugs()` au build time. Si EspoCRM ne retourne pas ces slugs (entite manquante, slug different, ou erreur API au build), les pages ne sont pas generees.

**Action:**
1. Verifier les slugs dans EspoCRM :
```bash
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunVille?where[0][type]=equals&where[0][attribute]=name&where[0][value]=Paris&maxSize=1" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" | jq '.list[0].slug'
```
2. Comparer avec les liens du footer dans `src/config/navigation.ts`
3. Ajouter les villes manquantes dans EspoCRM ou corriger les slugs

### 9c. MOYEN - Sidebar "Villes de la region" toujours alphabetique

**Probleme:** Meme apres le fix departementId, la sidebar affiche Abbeville, Agde, Albert sur Lyon et Nantes. Le cache ISR (1h) peut expliquer partiellement, mais il est probable que `regionId` ET `departementId` soient tous les deux null dans EspoCRM pour ces villes.

**Action:**
1. Verifier les donnees EspoCRM pour Lyon :
```bash
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunVille?where[0][type]=equals&where[0][attribute]=slug&where[0][value]=lyon&maxSize=1" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" | jq '.list[0] | {regionId, departementId, regionName, departementName}'
```
2. Si null: enrichir les villes EspoCRM avec regionId/departementId
3. Sinon: attendre expiration cache ISR et re-tester

### 9d. MINEUR - 4 erreurs lint pre-existantes

**Fichiers:**
- `src/app/simulateur/avance/error.tsx` : `<a>` au lieu de `<Link />`
- `src/app/simulateur/resultat/error.tsx` : `<a>` au lieu de `<Link />`
- 2 fichiers avec setState synchrone dans un effet

**Action:** Corriger pour passer `pnpm check` a 0 erreurs.

### 9e. MINEUR - Preload images inutiles sur pages app

**Probleme:** ~10 images de la landing sont preloadees sur les pages app (warnings console).

**Action:** Verifier si le preload vient du layout partage ou des metadata. Limiter le preload aux images reellement utilisees par page.

## Priorite prochaine session

1. **9a** en premier (mapping champs programmes) → impact maximal, 153 programmes vides
2. **9b** ensuite (404 villes majeures) → Paris, Marseille, Boulogne dans le footer mais 404
3. **9c** si les donnees EspoCRM sont corrigeables rapidement
4. **9d** et **9e** en bonus si le temps le permet
