# Prompt Next Session - Etat au 4 fevrier 2026

## Ce qui a ete fait cette session (4 fev 2026)

### EspoCRM - Enrichissement programmes
- Cree champ `lotsDetails` (type text) sur CJeanbrunProgramme via metadata Docker + rebuild
- Teste PUT/GET lotsDetails avec JSON stringify : fonctionne
- Ajoute credentials R2 S3-compatible sur Boldbot (openclaw.json + workspace/.env)
- Repondu aux 9 questions de Tom dans les instructions scraping
- Mis a jour la checklist de verification (2 items coches)

### Nettoyage Sprint 4
- Verifie que header/footer Shadcn Studio est bien unifie sur toutes les pages (deja fait)
- Verifie que /programmes et /accessibilite existent (deja fait)
- Supprime `LandingHeader.tsx` et `LandingFooter.tsx` (obsoletes, plus importes)
- Mis a jour barrel export `components/landing/index.ts`
- Corrige commentaire dans `app/layout.tsx`
- Build propre : 0 erreurs, 227 warnings (console.log preexistants)

### Documentation
- Mis a jour `CHECKLIST.md` v2.1 avec Sprint 4 complete (95%)
- Mis a jour instructions Tom avec FAQ 9 questions

## En cours (Tom)

Tom demarre le batch test de 10 programmes varies :
- 2-3 grandes villes, 1-2 Paris, 1 Marseille, 2-3 moyennes, 1 avec prixMin=0
- Rate limit : 2s Nexity, 1s EspoCRM
- Images : max 5 supplementaires + 1 principale, WebP, upload R2
- Programmes 404 : statut=epuise
- Geocodage en meme temps via api-adresse.data.gouv.fr

## Ce qui reste a faire

### Apres enrichissement Tom (10+ programmes)
1. **Adapter types EspoCRM** : ajouter `lotsDetails` dans `EspoProgramme` (`src/lib/espocrm/types.ts`)
2. **Adapter ProgrammeCard** : retirer promoteur/urlExterne, ajouter prix par typologie, masquer adresse
3. **Pagination/filtres programmes** : la page `/programmes` n'a pas de pagination (153 items)
4. **Optionnel : page detail** `/programmes/[slug]`

### Sprint 3 - Wizard simulateur (prochain gros chantier)
- 6 etapes : profil fiscal, projet, financement, revenus, comparaison, resultats
- Validation Zod, persistance etat, responsive
- Le moteur de calcul est deja complet (Sprint 2 termine)

### Sprint 5 - Monetisation
- Stripe Checkout (Free/Pro)
- Export PDF rapport simulation
- Calendly RDV

### Sprint 6 - Deploy & Tests
- Tests E2E Playwright
- Monitoring Sentry + Analytics Plausible
- Domaine production

## Architecture fichiers cles

```
src/app/
  (landing)/page.tsx            # Landing page (Header + Footer Shadcn Studio)
  (app)/layout.tsx              # Layout pages internes (Header + Footer Shadcn Studio)
  (app)/villes/[slug]/page.tsx  # 382 pages villes (ISR 1h)
  (app)/programmes/page.tsx     # Liste programmes EspoCRM
  (app)/loi-jeanbrun/page.tsx   # Guide complet loi
  (app)/a-propos/page.tsx       # Page profil expert
  (app)/blog/page.tsx           # Index blog (10 articles)
  (app)/barometre/page.tsx      # Barometre mensuel
  (app)/accessibilite/page.tsx  # Declaration RGAA
  (auth)/login/page.tsx         # Connexion Better Auth

src/components/
  shadcn-studio/blocks/hero-section-18/header.tsx   # Header unifie
  shadcn-studio/blocks/footer-component-03/         # Footer unifie
  villes/ProgrammeCard.tsx                           # A adapter apres enrichissement Tom
  landing/                                           # Composants landing custom (FAQ, CTA, etc.)

src/lib/espocrm/
  client.ts                     # Client API EspoCRM
  types.ts                      # Types EspoVille, EspoProgramme (ajouter lotsDetails)
```
