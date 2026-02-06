# REQUIREMENTS.md

**Feature:** page-programme
**Sprint:** 4 (SEO / Data)
**Priorite:** CRITIQUE
**Date:** 6 fevrier 2026

---

## Description

Page detail pour chaque programme immobilier neuf, inspiree de **monmarcheimmobilier.fr** (lots triables, detail expandable) et **valority.com** (KPIs investisseur, financement interactif, explication fiscale), adaptee au Simulateur Loi Jeanbrun.

Chaque page affiche :
- Un **hero avec KPIs investisseur** (loyer estime, economie impot/an, effort mensuel)
- Les **lots individuels** en tableau triable avec simulation par lot
- Une **section Financement** interactive avec sliders (duree, taux, apport)
- Une **section Fiscalite** expliquant la Loi Jeanbrun + DPE neuf
- Un **formulaire contact** pour generer des leads EspoCRM
- Une **navigation sticky** par onglets ancres

**Inspirations :** monmarcheimmobilier.fr + valority.com (analyses Chrome DevTools du 6 fev 2026)
**Donnees disponibles :** 291 programmes Bouygues dans EspoCRM, dont 107 avec lotsDetails

---

## Decisions prises

- **Stock :** MVP = tous les lots en mode "lead" (formulaire contact -> EspoCRM). Stock/vente directe plus tard
- **Simulation :** 2 niveaux : (1) **KPIs investisseur dans le hero** (loyer estime, economie impot/an, effort mensuel) calcules cote serveur, (2) **Section Financement interactive** avec sliders (duree credit, taux, apport) -> effort mensuel reel
- **Regions :** Deduites des villes existantes (codePostal -> departement -> region statique). Pas besoin de remplir EspoCRM
- **Contact :** Modal complet (email, tel, nom, message) -> Lead enrichi dans EspoCRM avec programme + lot
- **Pas de plans/plaquettes :** Pas de section "Documents a telecharger"
- **Navigation sticky :** Onglets ancres fixes en haut (Caracteristiques / Lots / Financement / Fiscalite / Ville)
- **DPE :** Tous les programmes neufs = DPE A ou B vise. Affiche comme argument de vente (pas besoin de data)
- **Economies neuf vs ancien :** Frais notaire reduits (3% vs 8%), 0 travaux, charges divisees par 3. Calculables sans data externe

## Inspirations (analyse Chrome DevTools 6 fev 2026)

### monmarcheimmobilier.fr
- Lots individuels en tableau triable (lot, surface, type, etage, prix, dispo)
- Detail lot expandable avec "Obtenir analyse detaillee" CTA
- Sidebar sticky reservation (stepper 3 etapes)

### valority.com (NOUVEAU - analyse 6 fev 2026)
- **Hero sidebar KPIs investisseur** : loyer estime (nue/meuble), credit impot/an, dispositif, zone
- **Prix barre + prix reduit** (TVA reduite visible)
- **Section Location** : scores quartier (/5), jauge tension locative
- **Section Financement** : cout total investissement + simulateur sliders (duree, taux, apport) -> "effort mensuel = X EUR"
- **Section Fiscalite** : explication dispositif, conditions en icones, avantages chiffres (economies notaire, 0 travaux)
- **DPE vise** : echelle A-G avec badge vert (argument neuf)
- **"Pourquoi investir a [ville]?"** : stats cles (habitants, connexions, atouts)
- **Navigation sticky** : onglets ancres qui suivent le scroll

---

## Exigences Fonctionnelles

### EF-1 : Page detail programme `/programmes/[slug]`

- Affiche hero (image + KPIs investisseur), description, lots, financement, fiscalite, ville
- **Navigation sticky** : barre d'onglets ancres fixee en haut au scroll (Caracteristiques / Lots / Financement / Fiscalite / Ville)
- Metadata SEO dynamique (title, description, OpenGraph)
- ISR avec `revalidate = 3600` (meme pattern que pages villes)
- Breadcrumb : Accueil > Programmes > {Ville} > {Nom}
- JSON-LD schema.org `RealEstateListing`
- 404 si slug inconnu

### EF-2 : Hero avec KPIs investisseur

- Image principale + galerie secondaire (si `images` disponible)
- **Sidebar KPIs** (calcules cote serveur via `calculerLoyerEstime()` + formules simples) :
  - Loyer estime mensuel (zoneFiscale + surface -> baremes Jeanbrun)
  - Economie impot estimee/an (basee sur TMI 30% par defaut, prixMin)
  - Effort mensuel estime (mensualite credit - loyer estime)
  - Zone fiscale (badge colore)
  - Dispositif : "Loi Jeanbrun"
  - Date livraison
- CTA principal "Contactez-nous" -> ouvre modal contact
- CTA secondaire "Simuler" -> scroll vers section Financement
- **Note :** Les KPIs sont des estimations (TMI 30% par defaut). Le simulateur avance donne le calcul personnalise

### EF-3 : Tableau des lots

- Affiche tous les lots du champ `lotsDetails` (JSON) en tableau triable
- Colonnes : Type, Surface (m2), Etage, Prix (EUR), Prestations, Actions
- Tri par colonne (click header), defaut par prix croissant
- Mobile : affichage en cards empilees (pas de tableau)
- 2 boutons par lot : "Simuler" (ouvre drawer) et "Infos" (ouvre modal contact)
- Compteur "X lots disponibles" en entete

### EF-4 : Mini-simulateur par lot (drawer)

- S'ouvre depuis la droite quand l'utilisateur clique "Simuler" sur un lot
- Donnees pre-remplies (non editables) : nom programme, ville, zone fiscale, lot (type, surface, prix, etage)
- 3 champs utilisateur : revenu net imposable, situation familiale (celibataire/marie/pacse), nombre de parts
- Calcul instantane via `orchestrerSimulation()` : TMI, economie annuelle, economie 9 ans, rendement brut
- CTA "Simulation complete" -> pre-remplit le wizard `/simulateur/avance`
- CTA "Recevoir l'analyse PDF" -> ouvre modal contact

### EF-5 : Modal contact "Recevoir les infos"

- Formulaire : nom (requis), prenom, email (requis), tel (requis), message (pre-rempli), checkbox RGPD (requis)
- Validation Zod
- POST vers `/api/leads/programme-contact` -> cree lead dans EspoCRM
- Toast confirmation "Votre demande a ete envoyee"

### EF-6 : Section Financement interactive (inspire Valority)

- **Cout total investissement** (bloc statique) :
  - Prix appartement (prixMin du programme)
  - Frais de notaire estimes (~3% du prix, argument neuf vs 8% ancien)
  - Total investissement
- **Simulateur financement** (bloc interactif avec sliders) :
  - Slider duree credit : 15-25 ans (defaut 20)
  - Slider taux credit : 2.5%-5.0% (defaut 3.4%)
  - Slider apport personnel : 0-30% du prix (defaut 10%)
  - **Resultats en temps reel :**
    - Mensualite credit (calcul amortissement)
    - Revenus locatifs mensuels (via `calculerLoyerEstime()`)
    - **Effort mensuel = Mensualite - Loyer** (le chiffre cle)
    - Donut chart optionnel (% loyer vs % epargne)
- Calcul 100% client-side (formule amortissement standard, pas besoin d'`orchestrerSimulation`)

### EF-7 : Section Fiscalite + DPE (inspire Valority)

- **Explication Loi Jeanbrun** : texte court + lien vers simulateur avance
- **Conditions eligibilite** en icones : logement neuf, zone eligible (A/A_bis/B1), engagement location 9 ans, plafonds loyers
- **Avantages chiffres** (calculables par lot/programme) :
  - Economies frais de notaire (~5% d'economie vs ancien)
  - 0 travaux (neuf = pas de renovation)
  - Charges reduites (neuf vs ancien, ratio ~3x)
  - Economie impot estimee (reprise du KPI hero)
- **DPE vise** : echelle visuelle A-G avec badge vert sur A ou B (tous programmes neufs)
- **CTA :** "Calculer mon economie d'impot exacte" -> lien vers simulateur avance

### EF-8 : Navigation par region (bas de page)

- Deduit region/departement depuis codePostal des villes ayant des programmes
- Accordeon : Region > Departement > Villes (avec nb programmes)
- Chaque ville = lien cliquable vers `/villes/{slug}`

### EF-9 : Adaptation ProgrammeCard + listing

- Les cards pointent vers `/programmes/{slug}` au lieu de `urlExterne`
- Badge lots visible + promoteur + zone fiscale
- Page listing `/programmes` : retirer filtre `isEnrichedProgramme`, ajouter filtres (ville, zone), pagination

---

## Exigences Non-Fonctionnelles

### ENF-1 : Performance

- Page detail : ISR (`revalidate = 3600`), pas de SSR pur
- KPIs hero : calcules cote serveur (pas de flash client)
- Section Financement : calcul client-side pur (formule amortissement, pas d'API)
- Drawer simulateur : calcul client-side via moteur existant
- Images : Next.js Image avec `sizes` responsive

### ENF-2 : SEO

- Metadata dynamique par programme
- JSON-LD `RealEstateListing`
- Breadcrumb schema.org
- Sections Fiscalite et Financement = contenu indexable (pas derriere un tab JS-only)

### ENF-3 : Accessibilite

- Alt text sur images
- ARIA labels sur boutons drawer/modal
- Tableau accessible (scope headers)
- Focus trap dans drawer et modal
- Sliders accessibles (aria-valuemin/max/now)

### ENF-4 : TypeScript strict

- Pas de `any`, tous les types explicites
- `noUncheckedIndexedAccess` respecte (handle `undefined`)

---

## Criteres d'Acceptation

- [ ] Page `/programmes/[slug]` affiche hero avec KPIs investisseur, description, lots, financement, fiscalite
- [ ] Navigation sticky fonctionne (onglets ancres fixes au scroll)
- [ ] KPIs hero affichent loyer estime, economie impot, effort mensuel (estimes)
- [ ] 404 retournee pour un slug inexistant
- [ ] Lots affiches en tableau triable desktop + cards mobile
- [ ] Bouton "Simuler" ouvre drawer avec calcul instantane correct
- [ ] Bouton "Infos" ouvre modal contact avec validation Zod
- [ ] Section Financement : sliders modifient l'effort mensuel en temps reel
- [ ] Section Fiscalite : explication Jeanbrun + conditions + avantages chiffres + DPE
- [ ] Soumission contact cree un lead dans EspoCRM (verificable via API)
- [ ] Navigation region affiche les programmes groupes par region > dept > ville
- [ ] ProgrammeCard pointe vers la page detail (plus urlExterne)
- [ ] `pnpm typecheck` et `pnpm lint` passent sans erreur
- [ ] Page fonctionne en responsive (mobile, tablette, desktop)

---

## Dependances

| Dependance | Statut | Description |
|------------|--------|-------------|
| CJeanbrunProgramme (EspoCRM) | OK | 291 programmes, 107 avec lotsDetails |
| CJeanbrunVille (EspoCRM) | OK | 313 villes avec zones fiscales |
| Moteur calculs (`src/lib/calculs/`) | OK | orchestrerSimulation(), calculerLoyerEstime(), calculerTMI() |
| Composants UI shadcn | PARTIEL | dialog, accordion, badge, button, input, select, table, checkbox, slider = OK. **sheet.tsx manquant** |
| EspoCRM client (`src/lib/espocrm/client.ts`) | OK | getProgrammes(), getVilleById() existants |

---

## Hors Scope

- Pages promoteurs `/promoteurs/[slug]`
- Sitemap dynamique pour les programmes
- Gestion stock/disponibilite en temps reel
- Plans et plaquettes PDF
- Geocoding automatique (Google Maps affiche seulement si lat/long en base)
- Scores quartier et tension locative (pas de source de donnees - V2)
- Section "Pourquoi investir a [ville]?" avec stats demographiques (V2)
- Kit meuble / gestion locative (specifique Valority, pas pertinent MVP)
