# PLAN.MD

**Feature:** page-programme
**Effort:** 8 phases
**Statut:** Phase 1 en cours

---

## Phase 1 : Types + parsing + sheet.tsx + KPI helpers [EN COURS]

### Taches

- [x] 1.1 Installer composant `sheet.tsx` : `npx shadcn@latest add sheet`
- [x] 1.2 Ajouter interface `Lot` dans `src/lib/espocrm/types.ts`
- [x] 1.3 Ajouter champ `lotsDetails: string | null` a `EspoProgramme`
- [x] 1.4 Ajouter helper `parseLots(programme: EspoProgramme): Lot[]` (utilise `parseJsonField` existant)
- [x] 1.5 Ajouter `getProgrammeBySlug(slug)` + `getAllProgrammeSlugs()` dans `src/lib/espocrm/client.ts`
- [ ] 1.6 Creer `src/lib/geo/regions-mapping.ts` (mapping 101 departements -> 18 regions)
- [ ] 1.7 Creer `src/lib/calculs/investisseur-kpis.ts` : fonctions serveur pour KPIs hero
  - `calculerKPIsInvestisseur(programme, ville)` -> { loyerEstimeMensuel, economieImpotAnnuelle, effortMensuelEstime, mensualiteCredit }
  - Utilise `calculerLoyerEstime()` existant + formule amortissement simple + TMI 30% par defaut
- [ ] 1.8 Creer `src/lib/calculs/financement.ts` : formules pures pour section Financement
  - `calculerMensualiteCredit(montant, taux, dureeAnnees)` -> mensualite
  - `calculerFraisNotaireNeuf(prix)` -> ~3% du prix
  - `calculerEffortMensuel(mensualite, loyerEstime)` -> effort

### Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `src/lib/espocrm/types.ts` | +interface `Lot`, +champ `lotsDetails`, +helper `parseLots()` |
| `src/lib/espocrm/client.ts` | +`getProgrammeBySlug(slug)`, +`getAllProgrammeSlugs()` |
| `src/lib/espocrm/index.ts` | +exports `Lot`, `parseLots` |

### Fichiers crees

| Fichier | Description |
|---------|-------------|
| `src/components/ui/sheet.tsx` | Via `npx shadcn@latest add sheet` |
| `src/lib/geo/regions-mapping.ts` | Mapping statique departement -> region |
| `src/lib/calculs/investisseur-kpis.ts` | KPIs investisseur pour hero (server-side) |
| `src/lib/calculs/financement.ts` | Formules financement (mensualite, frais notaire, effort) |

### Validation

- [ ] `pnpm typecheck` passe
- [ ] `parseLots()` parse correctement le JSON d'un programme EspoCRM
- [ ] `calculerKPIsInvestisseur()` retourne des valeurs coherentes pour un programme test

### References code existant

- `parseJsonField<T>()` dans `src/lib/espocrm/types.ts:~ligne 400`
- `getVilleBySlug()` dans `src/lib/espocrm/client.ts:~ligne 266` (meme pattern pour `getProgrammeBySlug`)
- `EspoProgramme` interface dans `src/lib/espocrm/types.ts:~ligne 140`
- `calculerLoyerEstime()` dans `src/lib/calculs/orchestrateur.ts:58`

---

## Phase 2 : Page `/programmes/[slug]` + Hero KPIs investisseur + Navigation sticky [ ]

### Taches

- [ ] 2.1 Creer `src/app/(app)/programmes/[slug]/page.tsx`
- [ ] 2.2 Implementer `generateMetadata()` (titre, description, OpenGraph)
- [ ] 2.3 Implementer `generateStaticParams()` pour ISR
- [ ] 2.4 Creer `src/components/programmes/ProgrammeHero.tsx` :
  - Image principale (Next.js Image)
  - **Sidebar KPIs investisseur** : loyer estime, economie impot/an, effort mensuel, zone, dispositif, livraison
  - CTA "Contactez-nous" + CTA "Simuler" (scroll)
  - Utilise `calculerKPIsInvestisseur()` de Phase 1 (server-side)
- [ ] 2.5 Creer `src/components/programmes/StickyNavigation.tsx` :
  - Barre d'onglets fixee en haut au scroll (position: sticky)
  - Onglets : Caracteristiques / Lots / Financement / Fiscalite / Ville
  - Highlight actif basee sur IntersectionObserver
- [ ] 2.6 Sections statiques : breadcrumb, description, promoteur (nom + lien)
- [ ] 2.7 JSON-LD schema.org `RealEstateListing`
- [ ] 2.8 404 si slug inconnu (`notFound()`)

### Fichiers crees

| Fichier | Type |
|---------|------|
| `src/app/(app)/programmes/[slug]/page.tsx` | Server Component (~350 lignes) |
| `src/components/programmes/ProgrammeHero.tsx` | Server Component (~150 lignes) |
| `src/components/programmes/StickyNavigation.tsx` | Client Component (~80 lignes) |

### References code existant

- `src/app/(app)/villes/[slug]/page.tsx` - Pattern identique pour ISR + generateMetadata + generateStaticParams
- `src/components/villes/Breadcrumb.tsx` - Reutiliser pour le breadcrumb programme
- `src/components/villes/CarteVille.tsx` - Reutiliser pour Google Maps embed
- `src/components/villes/ProgrammeCard.tsx:27-52` - `formatPrice()` et `formatDeliveryDate()` a extraire dans un utilitaire partage
- `src/lib/calculs/investisseur-kpis.ts` - `calculerKPIsInvestisseur()` (cree Phase 1)

### Validation

- [ ] `/programmes/[slug-existant]` affiche la page avec hero + KPIs + description + navigation sticky
- [ ] KPIs affichent des valeurs coherentes (loyer ~500-800 EUR pour un T2 zone A)
- [ ] Navigation sticky suit le scroll et highlight la section active
- [ ] `/programmes/slug-inexistant` retourne 404
- [ ] `pnpm typecheck` et `pnpm lint` passent

---

## Phase 3 : LotsTable (client component) [ ]

### Taches

- [ ] 3.1 Creer `src/components/programmes/LotsTable.tsx`
- [ ] 3.2 Tableau desktop : colonnes Type, Surface, Etage, Prix, Prestations, Actions
- [ ] 3.3 Tri par colonne (state local `useState` pour sortKey + sortDir)
- [ ] 3.4 Mobile responsive : cards empilees (breakpoint `sm:`)
- [ ] 3.5 Compteur "X lots disponibles" en header
- [ ] 3.6 Boutons "Simuler" et "Infos" (callback props `onSimuler(lot)` et `onContact(lot)`)
- [ ] 3.7 Integrer dans `page.tsx` Phase 2 (section ancree `#lots`)

### Fichiers crees

| Fichier | Type |
|---------|------|
| `src/components/programmes/LotsTable.tsx` | Client Component (~200 lignes) |

### Composants UI reutilises

- `src/components/ui/table.tsx` - Table, TableHead, TableRow, TableCell
- `src/components/ui/badge.tsx` - Badge type lot
- `src/components/ui/button.tsx` - Boutons actions
- `src/components/ui/card.tsx` - Cards mobile

### Validation

- [ ] Lots affiches avec prix formates en EUR
- [ ] Tri par colonne fonctionne
- [ ] Responsive : tableau desktop, cards mobile
- [ ] `pnpm typecheck` passe

---

## Phase 4 : SimulateurLotDrawer (client component) [ ]

### Taches

- [ ] 4.1 Creer `src/components/programmes/SimulateurLotDrawer.tsx`
- [ ] 4.2 Donnees pre-remplies du lot (non editables) : type, surface, prix, etage, zone fiscale
- [ ] 4.3 Formulaire : revenu net imposable (input number), situation familiale (select), nb parts (select)
- [ ] 4.4 Calcul instantane via `orchestrerSimulation()` appele cote client
- [ ] 4.5 Affichage resultats : TMI, economie annuelle, economie 9 ans, rendement brut, cash-flow mensuel
- [ ] 4.6 CTA "Simulation complete" -> lien vers wizard pre-rempli
- [ ] 4.7 CTA "Recevoir l'analyse" -> ouvre modal contact (Phase 5)
- [ ] 4.8 Integrer dans `page.tsx` (callback `onSimuler` de LotsTable)

### Fichiers crees

| Fichier | Type |
|---------|------|
| `src/components/programmes/SimulateurLotDrawer.tsx` | Client Component (~250 lignes) |

### References code existant (CRITIQUE - reutiliser le moteur de calcul)

- `src/lib/calculs/orchestrateur.ts:243` - `orchestrerSimulation(input: SimulationCalculInput): SimulationCalculResult`
- `src/lib/calculs/types/simulation.ts:25` - `SimulationCalculInput` (revenuNetImposable, nombreParts, typeBien, prixAcquisition, surface, zoneFiscale, niveauLoyer)
- `src/lib/calculs/types/simulation.ts:219` - `SimulationCalculResult` (synthese.economieImpotsAnnuelle, synthese.economieImpots9ans, synthese.rendementBrut, synthese.cashflowMensuel)
- `src/lib/calculs/tmi.ts` - `calculerTMI()` pour afficher la TMI
- `src/lib/calculs/types/common.ts` - `ZoneFiscale` enum (A_BIS, A, B1)

### Composants UI

- `src/components/ui/sheet.tsx` - Sheet, SheetContent(side="right"), SheetHeader, SheetTitle
- `src/components/ui/input.tsx` - Input number
- `src/components/ui/select.tsx` - Select situation/parts
- `src/components/ui/separator.tsx` - Separation sections
- `src/components/ui/badge.tsx` - Badges resultats

### Validation

- [ ] Drawer s'ouvre avec donnees du lot pre-remplies
- [ ] Saisir revenu 50000, celibataire, 1 part -> affiche economie impot coherente
- [ ] Champs vides = pas de calcul affiche
- [ ] `pnpm typecheck` passe

---

## Phase 5 : ContactProgrammeModal + API route [ ]

### Taches

- [ ] 5.1 Creer `src/components/programmes/ContactProgrammeModal.tsx`
- [ ] 5.2 Formulaire avec validation Zod : nom, prenom, email, tel, message, checkbox RGPD
- [ ] 5.3 Message pre-rempli : "Je suis interesse par le lot {type} {surface}m2 du programme {name}"
- [ ] 5.4 Creer `src/app/api/leads/programme-contact/route.ts`
- [ ] 5.5 API route : validation Zod + creation lead EspoCRM (cSource: "simulateur-jeanbrun")
- [ ] 5.6 Toast confirmation via `sonner`
- [ ] 5.7 Integrer dans `page.tsx` (callback `onContact` de LotsTable + CTA hero)

### Fichiers crees

| Fichier | Type |
|---------|------|
| `src/components/programmes/ContactProgrammeModal.tsx` | Client Component (~200 lignes) |
| `src/app/api/leads/programme-contact/route.ts` | API Route (~80 lignes) |

### References code existant

- `src/lib/espocrm/client.ts` - `createLead()`
- `src/components/ui/dialog.tsx` - Dialog, DialogContent, DialogHeader, DialogTitle
- `src/components/ui/checkbox.tsx` - Checkbox RGPD
- `src/components/ui/textarea.tsx` - Message
- `sonner` - Toast (deja installe, cf `src/components/ui/sonner.tsx`)

### Validation

- [ ] Modal s'ouvre avec message pre-rempli
- [ ] Validation Zod bloque si champs requis vides
- [ ] Submit reussi = toast + lead cree dans EspoCRM (verifiable via curl)
- [ ] `pnpm typecheck` passe

---

## Phase 6 : Section Financement + Section Fiscalite [ ]

### Taches

- [ ] 6.1 Creer `src/components/programmes/SectionFinancement.tsx` (client component) :
  - Bloc statique "Cout total" : prix appart, frais notaire (~3%), total
  - Sliders interactifs : duree (15-25 ans), taux (2.5-5.0%), apport (0-30%)
  - Resultats temps reel : mensualite, loyer estime, **effort mensuel = mensualite - loyer**
  - Utilise `calculerMensualiteCredit()` et `calculerLoyerEstime()` de Phase 1
  - Formules 100% client-side (pas d'API call)
- [ ] 6.2 Creer `src/components/programmes/SectionFiscalite.tsx` (server component) :
  - Texte explication Loi Jeanbrun (contenu statique)
  - Conditions eligibilite en icones (logement neuf, zone eligible, location 9 ans, plafonds)
  - Avantages chiffres : economie frais notaire, 0 travaux, charges reduites, economie impot
  - Lien CTA "Calculer mon economie exacte" -> `/simulateur/avance`
- [ ] 6.3 Creer `src/components/programmes/DPEBadge.tsx` (server component) :
  - Echelle visuelle A-G (barre horizontale coloree)
  - Badge vert sur A ou B (tous neufs)
  - Texte "DPE vise : A - Performance energetique maximale"
- [ ] 6.4 Integrer dans `page.tsx` (sections ancrees `#financement` et `#fiscalite`)

### Fichiers crees

| Fichier | Type |
|---------|------|
| `src/components/programmes/SectionFinancement.tsx` | Client Component (~250 lignes) |
| `src/components/programmes/SectionFiscalite.tsx` | Server Component (~150 lignes) |
| `src/components/programmes/DPEBadge.tsx` | Server Component (~60 lignes) |

### Composants UI reutilises

- `src/components/ui/slider.tsx` - Sliders duree/taux/apport
- `src/components/ui/card.tsx` - Cards cout total + resultats
- `src/components/ui/badge.tsx` - Badges zone, DPE
- `src/components/ui/separator.tsx` - Separation sections

### References code existant

- `src/lib/calculs/financement.ts` (cree Phase 1) - `calculerMensualiteCredit()`, `calculerFraisNotaireNeuf()`
- `src/lib/calculs/orchestrateur.ts:58` - `calculerLoyerEstime(surface, zoneFiscale, niveauLoyer)`

### Validation

- [ ] Sliders modifient les resultats en temps reel
- [ ] Effort mensuel = mensualite - loyer (coherent)
- [ ] Fiscalite affiche les 4 conditions + avantages chiffres
- [ ] DPE affiche echelle A-G avec highlight sur A ou B
- [ ] `pnpm typecheck` passe

---

## Phase 7 : Navigation par region [ ]

### Taches

- [ ] 7.1 Creer `src/components/programmes/RegionNavigation.tsx`
- [ ] 7.2 Recuperer toutes les villes ayant des programmes (via getProgrammes ou getVilles)
- [ ] 7.3 Deduire departement (2 premiers chiffres CP) et region (mapping statique Phase 1)
- [ ] 7.4 Grouper : region > departement > villes avec nb programmes
- [ ] 7.5 Accordeon par region, sous-accordeon par departement, liens villes
- [ ] 7.6 Integrer en bas de `page.tsx` (section ancree `#ville`)

### Fichiers crees

| Fichier | Type |
|---------|------|
| `src/components/programmes/RegionNavigation.tsx` | Server Component (~150 lignes) |

### References code existant

- `src/lib/geo/regions-mapping.ts` (cree Phase 1)
- `src/components/ui/accordion.tsx` - Accordion, AccordionItem, AccordionTrigger, AccordionContent
- `src/components/ui/badge.tsx` - Compteurs

### Validation

- [ ] Regions affichees avec compteurs corrects
- [ ] Cliquer sur une ville redirige vers `/villes/{slug}`
- [ ] `pnpm typecheck` passe

---

## Phase 8 : Adaptation ProgrammeCard + listing [ ]

### Taches

- [ ] 8.1 Modifier `src/components/villes/ProgrammeCard.tsx` : lien vers `/programmes/{slug}` au lieu de `urlExterne`
- [ ] 8.2 Modifier `src/app/(app)/programmes/page.tsx` : retirer filtre `isEnrichedProgramme`
- [ ] 8.3 Ajouter filtres simples (select ville, zone fiscale) sur la page listing
- [ ] 8.4 Ajouter pagination si > 24 programmes

### Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `src/components/villes/ProgrammeCard.tsx` | Lien interne `/programmes/{slug}` + conditionnel fallback `urlExterne` si pas de slug |
| `src/app/(app)/programmes/page.tsx` | Retirer `isEnrichedProgramme`, ajouter filtres, pagination |

### Validation

- [ ] Cards pointent vers page detail
- [ ] Page listing montre tous les programmes (pas seulement ceux avec images)
- [ ] Filtres fonctionnent
- [ ] `pnpm typecheck` et `pnpm lint` passent

---

## Recapitulatif des fichiers

### Nouveaux fichiers (17)

| Fichier | Type | Phase |
|---------|------|-------|
| `docs/features/page-programme/requirements.md` | Documentation | 0 |
| `docs/features/page-programme/plan.md` | Documentation | 0 |
| `src/components/ui/sheet.tsx` | UI Component (shadcn) | 1 |
| `src/lib/geo/regions-mapping.ts` | Utilitaire | 1 |
| `src/lib/calculs/investisseur-kpis.ts` | Calculs server-side | 1 |
| `src/lib/calculs/financement.ts` | Formules financement | 1 |
| `src/app/(app)/programmes/[slug]/page.tsx` | Server Component | 2 |
| `src/components/programmes/ProgrammeHero.tsx` | Server Component | 2 |
| `src/components/programmes/StickyNavigation.tsx` | Client Component | 2 |
| `src/components/programmes/LotsTable.tsx` | Client Component | 3 |
| `src/components/programmes/SimulateurLotDrawer.tsx` | Client Component | 4 |
| `src/components/programmes/ContactProgrammeModal.tsx` | Client Component | 5 |
| `src/app/api/leads/programme-contact/route.ts` | API Route | 5 |
| `src/components/programmes/SectionFinancement.tsx` | Client Component | 6 |
| `src/components/programmes/SectionFiscalite.tsx` | Server Component | 6 |
| `src/components/programmes/DPEBadge.tsx` | Server Component | 6 |
| `src/components/programmes/RegionNavigation.tsx` | Server Component | 7 |

### Fichiers modifies (4)

| Fichier | Phase |
|---------|-------|
| `src/lib/espocrm/types.ts` | 1 |
| `src/lib/espocrm/client.ts` | 1 |
| `src/components/villes/ProgrammeCard.tsx` | 8 |
| `src/app/(app)/programmes/page.tsx` | 8 |

---

## Ordre d'implementation

```
Phase 1 (types + KPIs + financement helpers)
    |
Phase 2 (page route + hero KPIs + nav sticky)
    |
Phase 3 (lots table)
    |
    +-- Phase 4 (simulateur lot drawer) ---+
    |                                       |
    +-- Phase 5 (contact modal + API) -----+  <- paralleles
    |                                       |
    +---------------------------------------+
    |
Phase 6 (financement interactif + fiscalite + DPE)
    |
Phase 7 (navigation region)
    |
Phase 8 (adaptation listing)
```

Phase 4 et 5 sont independantes et peuvent etre developpees en parallele apres Phase 3.

---

## Verification finale

### Tests manuels

1. `/programmes` -> grille de programmes (tous, plus seulement les enrichis)
2. Cliquer programme -> page detail avec hero + **KPIs investisseur** + description
3. Navigation sticky visible au scroll, highlight section active
4. **KPIs hero** : loyer ~500-800 EUR, economie impot ~2000-4000 EUR/an, effort ~200-400 EUR/mois
5. Trier lots par prix -> tri fonctionne
6. "Simuler" sur un lot -> drawer avec donnees pre-remplies
7. Saisir revenu 50000, celibataire, 1 part -> economie impot affichee
8. "Simulation complete" -> redirige vers wizard pre-rempli
9. "Infos" sur un lot -> modal contact s'ouvre
10. Remplir et soumettre -> lead cree dans EspoCRM
11. **Section Financement** : deplacer sliders -> effort mensuel change en temps reel
12. **Section Fiscalite** : explication Jeanbrun + conditions icones + DPE badge vert
13. Scroller vers navigation region -> accordeons fonctionnent
14. Cliquer ville dans nav region -> redirige correctement

### Build

```bash
pnpm typecheck   # TypeScript strict
pnpm lint        # ESLint
pnpm build:ci    # Build complet
```

### Verification EspoCRM

```bash
# Verifier lead cree apres soumission contact
curl -s "https://espocrm.expert-ia-entreprise.fr/api/v1/CLeadJeanbrun?maxSize=1&orderBy=createdAt&order=desc" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" | python3 -m json.tool
```
