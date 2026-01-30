# Simulateur Wizard - Requirements

**Feature:** Simulateur Loi Jeanbrun 6 etapes
**Version:** 1.0
**Date:** 30 janvier 2026

---

## 1. Description

Le Simulateur Wizard est un formulaire multi-etapes permettant aux utilisateurs de simuler leur investissement immobilier sous le dispositif Loi Jeanbrun (PLF 2026). Le parcours guide l'utilisateur a travers 6 etapes pour collecter ses informations fiscales, son projet immobilier, et afficher les resultats de simulation.

### Objectifs business

- Convertir les visiteurs en leads qualifies (capture email)
- Demontrer la valeur du dispositif Jeanbrun avec des chiffres personnalises
- Generer des ventes Premium (9,90 EUR) et Pack Duo (14,90 EUR)

### Objectifs utilisateur

- Comprendre rapidement l'economie fiscale potentielle
- Parcours simple et rapide (< 5 minutes)
- Resultats clairs et actionnables

---

## 2. Exigences fonctionnelles

### 2.1 Etape 1 - Profil investisseur

**En tant qu'utilisateur**, je veux renseigner ma situation fiscale pour que le simulateur calcule mon TMI automatiquement.

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| Situation familiale | Select | Oui | celibataire, marie, pacse |
| Nombre de parts fiscales | Number | Oui | 1 - 10 |
| Revenu net imposable | Number | Oui | > 0 |
| Revenus fonciers existants | Number | Non | >= 0 |
| Objectif principal | Radio | Oui | reduire_impots, revenus, patrimoine, retraite |

**Criteres d'acceptation:**
- [ ] TMI affiche en temps reel des que revenus saisis
- [ ] Tooltip explicatif sur "revenu net imposable"
- [ ] Parts fiscales pre-calculees selon situation + enfants
- [ ] Badge colore selon TMI (11%, 30%, 41%, 45%)

### 2.2 Etape 2 - Projet immobilier

**En tant qu'utilisateur**, je veux definir mon projet pour que le simulateur verifie mon eligibilite Jeanbrun.

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| Type de bien | Card select | Oui | neuf, ancien |
| Ville | Autocomplete | Oui | API villes |
| Surface (m2) | Number | Oui | 9 - 500 |
| Prix acquisition | Number | Oui | > 0 |
| Montant travaux | Number | Si ancien | >= 30% prix |
| DPE actuel | Select | Si ancien | A - G |
| DPE apres travaux | Select | Si ancien | A ou B |

**Criteres d'acceptation:**
- [ ] Section travaux apparait uniquement si "ancien" selectionne
- [ ] Progress bar affiche pourcentage travaux/prix
- [ ] Alerte si travaux < 30% (non eligible)
- [ ] Zone fiscale affichee apres selection ville
- [ ] Prix au m2 calcule et compare au marche

### 2.3 Etape 3 - Financement

**En tant qu'utilisateur**, je veux configurer mon financement pour visualiser mon taux d'endettement.

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| Apport personnel | Number | Non | >= 0 |
| Duree credit | Slider | Oui | 10 - 25 ans |
| Taux interet | Number | Oui | 0.5 - 10% |
| Differe remboursement | Select | Non | 0, 12, 24 mois |
| Autres credits mensuels | Number | Non | >= 0 |

**Criteres d'acceptation:**
- [ ] Mensualite calculee en temps reel
- [ ] Jauge endettement avec 3 zones (vert < 30%, orange 30-35%, rouge > 35%)
- [ ] Alerte si endettement > 35%
- [ ] Option differe pour construction VEFA

### 2.4 Etape 4 - Strategie locative

**En tant qu'utilisateur**, je veux choisir mon niveau de loyer pour visualiser l'impact fiscal.

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| Niveau loyer | Card select | Oui | intermediaire, social, tres_social |
| Loyer mensuel | Number | Auto-calcule | <= plafond zone |
| Charges annuelles | Number | Oui | >= 0 |
| Taxe fonciere | Number | Oui | >= 0 |
| Vacance locative | Number | Oui | 0 - 12 mois |

**Criteres d'acceptation:**
- [ ] 3 cards avec loyer max, taux amortissement, avantages
- [ ] Loyer pre-rempli selon plafond zone et surface
- [ ] Visualisation Perte loyer vs Gain fiscal (balance)
- [ ] Coefficient surface applique automatiquement

### 2.5 Etape 5 - Duree et sortie

**En tant qu'utilisateur**, je veux definir ma strategie de sortie pour voir l'impact sur la plus-value.

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| Duree detention | Slider | Oui | 9 - 30 ans |
| Revalorisation annuelle | Number | Oui | 0 - 5% |
| Strategie sortie | Radio | Oui | revente, conservation, donation |

**Criteres d'acceptation:**
- [ ] Slider avec marqueurs 9, 15, 22, 30 ans
- [ ] Infos contextuelles selon duree (abattements PV)
- [ ] Alerte si duree < 9 ans (engagement minimum)
- [ ] Exoneration PV affichee a 22 ans (IR) et 30 ans (IR+PS)

### 2.6 Etape 6 - Structure juridique

**En tant qu'utilisateur**, je veux choisir ma structure de detention pour optimiser ma fiscalite.

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| Structure | Card select | Oui | nom_propre, sci_ir, sci_is |

**Criteres d'acceptation:**
- [ ] 3 cards avec avantages/inconvenients
- [ ] Structure recommandee selon profil (badge)
- [ ] Alerte si SCI IS (pas d'amortissement Jeanbrun)
- [ ] Comparatif detaille accessible

---

## 3. Exigences UX

### 3.1 Navigation

- Progress bar visible en permanence (header sticky)
- Navigation Retour/Continuer en footer sticky
- Bouton Continuer desactive tant que validation KO
- Possibilite de revenir aux etapes precedentes
- Sauvegarde automatique a chaque etape

### 3.2 Validation

- Validation en temps reel (onChange)
- Messages d'erreur contextuels sous chaque champ
- Indicateurs visuels (bordure rouge/verte)
- Tooltips explicatifs sur champs complexes

### 3.3 Responsive

| Breakpoint | Comportement |
|------------|--------------|
| Mobile (< 640px) | Cards empilees, boutons pleine largeur |
| Tablet (640-1024px) | 2 colonnes max |
| Desktop (> 1024px) | Layout optimal, 2-3 colonnes |

### 3.4 Performance

- INP < 200ms (Interaction to Next Paint)
- Pas de layout shift lors des validations
- Debounce 300ms sur autocomplete ville
- Lazy loading des composants lourds (graphiques)

---

## 4. Exigences design

Conformement au design system defini dans `docs/design/style-guide.md`.

### 4.1 Theme Dark Mode Premium

- **Background:** #0A0A0B (oklch 0.07)
- **Cards:** #18181B (oklch 0.14)
- **Texte principal:** #FAFAFA (oklch 0.98)
- **Texte secondaire:** #A1A1AA (oklch 0.70)

### 4.2 Accent dore signature

- **Primary:** #F5A623 (oklch 0.78 0.18 75)
- **Hover:** #FFB940 (oklch 0.82 0.16 80)
- **Glow:** 0 0 20px rgba(245, 166, 35, 0.3)

### 4.3 Bordures dashed dorees

Element visuel signature du simulateur:
- Bordure: 1px dashed rgba(245, 166, 35, 0.4)
- Utilisee sur: sections importantes, cards selectionnees, encadres info

### 4.4 Typographie distinctive

- **Titres:** DM Sans ou Space Grotesk - Bold
- **Corps:** System UI avec fallback Inter
- **Chiffres:** JetBrains Mono - font-variant-numeric: tabular-nums
- **Labels uppercase:** letter-spacing: 0.05em

### 4.5 Animations et micro-interactions

| Element | Animation |
|---------|-----------|
| Progress bar | width transition 300ms ease-out |
| Cards selection | border-color + scale(1.02) 200ms |
| TMI badge | fade-in + slide-up 200ms |
| Jauge endettement | width + color transition 300ms |
| Boutons | shadow-glow on hover |
| Erreurs | shake 200ms + border-red |

### 4.6 Etats interactifs

- **Hover:** border-accent/50, cursor-pointer
- **Selected:** border-2 border-accent, bg-accent/10
- **Focus:** ring-2 ring-accent ring-offset-2
- **Disabled:** opacity-50, cursor-not-allowed
- **Error:** border-destructive, text-destructive

---

## 5. Criteres d'acceptation globaux

### Fonctionnels

- [ ] Parcours 6 etapes complet de bout en bout
- [ ] Validation Zod coherente client/serveur
- [ ] Sauvegarde localStorage entre sessions
- [ ] API /api/simulation/avancee fonctionnelle
- [ ] Resultats corrects selon formules FORMULES.md

### Techniques

- [ ] TypeScript strict (noImplicitAny, strictNullChecks)
- [ ] Tests unitaires >= 70% coverage
- [ ] Accessibilite WCAG 2.1 AA
- [ ] Performance Lighthouse >= 90

### Design

- [ ] Conforme au style guide dark mode + or
- [ ] Responsive 375px - 1440px
- [ ] Animations fluides 60fps
- [ ] Focus visible pour navigation clavier

---

## 6. Hors scope (Phase 3)

- Export PDF (Sprint 5)
- Comparatif LMNP detaille (Sprint 5)
- Historique simulations (Sprint 5)
- Integration Calendly (Sprint 5)
- Integration EspoCRM leads (Sprint 4)

---

**References:**
- Wireframes: `docs/specs/WIREFRAMES.md`
- Design tokens: `docs/design/design-tokens.css`
- Style guide: `docs/design/style-guide.md`
- Formules: `docs/technical/FORMULES.md`
