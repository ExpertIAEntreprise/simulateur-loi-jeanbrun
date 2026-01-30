# Phase 3 - Interface Simulateur

**Sprint:** 3 | **Semaines:** S5-S6 | **Effort:** 18,5 jours
**Objectif:** Simulateur 6 etapes complet et responsive

---

## 1. Livrables

| Livrable | Critere de validation |
|----------|----------------------|
| Layout simulateur | Progress bar + navigation fluide |
| Etape 1: Profil | TMI auto-calcule |
| Etape 2: Projet | Seuil travaux 30% valide |
| Etape 3: Financement | Jauge endettement couleurs |
| Etape 4: Location | Visualisation gain/perte |
| Etape 5: Sortie | Slider duree interactif |
| Etape 6: Structure | Comparatif juridique |
| Page resultats | Synthese + graphiques |
| Mobile responsive | Utilisable sur 375px |

---

## 2. Architecture des fichiers

```
src/
├── app/simulateur/
│   ├── page.tsx                    # Simulateur rapide
│   ├── layout.tsx                  # Layout partage
│   ├── avance/
│   │   ├── page.tsx               # Etape 1
│   │   └── etape-[2-6]/page.tsx   # Etapes 2 a 6
│   └── resultat/[id]/page.tsx     # Page resultats
├── components/simulateur/
│   ├── SimulateurLayout.tsx       # Layout + progress
│   ├── StepNavigation.tsx         # Navigation bas
│   ├── ProgressBar.tsx            # Barre progression
│   ├── etape-1/                   # ProfilForm, TMICalculator, ObjectifSelector
│   ├── etape-2/                   # TypeBienSelector, VilleAutocomplete, TravauxValidator
│   ├── etape-3/                   # FinancementForm, JaugeEndettement, DiffereSelector
│   ├── etape-4/                   # NiveauLoyerCards, PerteGainVisualisation
│   ├── etape-5/                   # DureeSlider, RevalorisationInput
│   ├── etape-6/                   # StructureCards, ComparatifTable
│   └── resultats/                 # SyntheseCard, GraphiquePatrimoine, TableauAnnuel
└── lib/hooks/
    ├── useSimulation.ts           # State + localStorage
    ├── useLocalStorage.ts         # Persistance
    └── useVilleAutocomplete.ts    # API villes
```

---

## 3. Decisions techniques

### 3.1 Navigation multi-etapes

- **Pourquoi App Router:** Chaque etape = URL distincte pour analytics + partage
- **Pourquoi localStorage:** Sauvegarde brouillon automatique entre sessions
- **Pourquoi Zod:** Validation schema coherente client/serveur

### 3.2 Composants cles

| Composant | Responsabilite |
|-----------|----------------|
| `SimulateurLayout` | Header sticky + progress + footer navigation |
| `ProgressBar` | 6 dots + labels + pourcentage anime |
| `TMICalculator` | Calcul temps reel TMI selon revenus/parts |
| `TravauxValidator` | Verification seuil 30% avec progress bar |
| `JaugeEndettement` | Jauge 0-100% avec zones vert/orange/rouge |
| `NiveauLoyerCards` | 3 cards intermediaire/social/tres_social |
| `PerteGainVisualisation` | Balance perte loyer vs economie fiscale |
| `DureeSlider` | Slider 9-30 ans avec infos contextuelles |
| `StructureCards` | Cards nom propre/SCI IR/SCI IS avec pros/cons |
| `GraphiquePatrimoine` | Recharts AreaChart evolution patrimoine |

### 3.3 Design System

- **Theme:** Dark mode exclusif (ref: design-tokens.css)
- **Accent:** Or #F5A623 sur fond #0A0A0B
- **Bordures:** Dashed dorees signature
- **Typographie:** JetBrains Mono pour chiffres, sans-serif pour texte
- **Motion:** Transitions 200ms ease-out, progress bar animee

---

## 4. Regles de validation

### Par etape

| Etape | Champs requis | Validation |
|-------|---------------|------------|
| 1 | situation, revenus, objectif | TMI > 0 |
| 2 | typeBien, ville, surface, prix, (travaux si ancien) | travaux >= 30% si ancien |
| 3 | apport, dureeCredit, taux | endettement <= 35% |
| 4 | niveauLoyer, charges | loyer <= plafond zone |
| 5 | dureeDetention, revalorisation | duree >= 9 ans |
| 6 | structure | choix effectue |

### Criteres d'acceptation sprint

- [ ] 6 etapes navigables avec retour
- [ ] Validation temps reel tous champs
- [ ] TMI calcule automatiquement
- [ ] Seuil travaux 30% verifie (ancien)
- [ ] Jauge endettement avec couleurs
- [ ] Visualisation Perte/Gain locatif
- [ ] Page resultats avec synthese
- [ ] Sauvegarde localStorage fonctionnelle
- [ ] Tests composants >= 70% coverage
- [ ] Accessibilite WCAG 2.1 AA
- [ ] Responsive verifie (375px - 1440px)
- [ ] Performance INP < 200ms

---

## 5. Ressources

| Ressource | Chemin |
|-----------|--------|
| Wireframes | docs/specs/WIREFRAMES.md |
| Design tokens | docs/design/design-tokens.css |
| Style guide | docs/design/style-guide.md |
| Formules calcul | docs/technical/FORMULES.md |

---

**Auteur:** Equipe Claude Code
**Date:** 30 janvier 2026
