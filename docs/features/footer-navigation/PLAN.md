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
