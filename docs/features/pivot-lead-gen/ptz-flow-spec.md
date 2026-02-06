# Simulateur PTZ (stop-loyer.fr) — Specification Flow

> **Ref :** [requirements.md](./requirements.md) (EF-01)
> **Date :** 6 fevrier 2026
> **Statut :** Documentation Phase 3

---

## Vue d'ensemble

Le simulateur PTZ comporte **3 etapes** de saisie (vs 6 pour Jeanbrun).
Le flow est identique : simulation gratuite 100% → page resultats avec teaser → lead gate (Phase 4).

```
Etape 1              Etape 2              Etape 3              Resultats
Situation         →  Projet            →  Capacite          →  /resultats
personnelle          immobilier           financiere
```

---

## Etape 1 — Situation Personnelle

### Donnees collectees

| Champ | Type | Validation | Description |
|-------|------|-----------|-------------|
| `situationFamiliale` | enum | requis | `celibataire` / `couple` |
| `nombrePersonnesFoyer` | number | 1-10 | Nombre de personnes dans le foyer fiscal |
| `revenuFiscalReference` | number | > 0 | Revenu fiscal de reference (N-2) |
| `codePostal` | string | regex 5 digits | Code postal du logement actuel |
| `estPrimoAccedant` | boolean | requis | N'a pas ete proprietaire depuis 2 ans |
| `loyerActuel` | number | >= 0 | Loyer mensuel actuel (pour comparaison) |

### Composants reutilisables du wizard Jeanbrun

| Composant Jeanbrun | Reutilisable PTZ ? | Adaptations necessaires |
|--------------------|-------------------|------------------------|
| `ProfilForm` | **Partiellement** | Remplacer situation (celibataire/marie/pacse) par (celibataire/couple), ajouter nombre personnes foyer, remplacer revenu net par revenu fiscal reference |
| `TMICalculator` | **Non** | PTZ n'utilise pas la TMI mais les plafonds de ressources par zone |
| `ObjectifSelector` | **Non** | PTZ = un seul objectif (devenir proprietaire) |

### Composant specifique PTZ

- **PlafondsPTZCalculator** : Verifie si le foyer est eligible au PTZ selon les plafonds de ressources 2026 par zone (A bis, A, B1, B2, C) et composition du foyer.

---

## Etape 2 — Projet Immobilier

### Donnees collectees

| Champ | Type | Validation | Description |
|-------|------|-----------|-------------|
| `typeBien` | enum | requis | `neuf` uniquement pour PTZ (ou `ancien_avec_travaux` en zone B2/C) |
| `villeId` | string (UUID) | requis | Ville du projet (table `villes`) |
| `villeNom` | string | auto | Nom ville (affichage) |
| `zoneFiscale` | enum | auto | Zone determinee par la ville (A_BIS/A/B1/B2/C) |
| `surface` | number | >= 9 m2 | Surface habitable |
| `prixAcquisition` | number | > 0 | Prix du bien |
| `nombrePieces` | number | 1-6 | T1 a T6 |

### Composants reutilisables du wizard Jeanbrun

| Composant Jeanbrun | Reutilisable PTZ ? | Adaptations necessaires |
|--------------------|-------------------|------------------------|
| `TypeBienSelector` | **Oui** | Limiter aux options neuf + ancien_avec_travaux |
| `VilleAutocomplete` | **Oui (identique)** | Aucune adaptation, meme composant |
| `RecapProjet` | **Oui** | Adapter les labels |
| `TravauxValidator` | **Non** | PTZ ancien = travaux obligatoires (25% du cout), logique differente |

### Composant specifique PTZ

- **PlafondsPTZBien** : Verifie que le prix ne depasse pas le plafond PTZ par zone et type de bien.

---

## Etape 3 — Capacite Financiere

### Donnees collectees

| Champ | Type | Validation | Description |
|-------|------|-----------|-------------|
| `apport` | number | >= 0 | Apport personnel disponible |
| `dureeCredit` | number | 10-25 ans | Duree souhaitee du credit |
| `tauxCredit` | number | > 0, <= 10% | Taux nominal estime |
| `autresCredits` | number | >= 0 | Mensualites de credits en cours |
| `revenuMensuelNet` | number | > 0 | Revenus mensuels nets du foyer |

### Composants reutilisables du wizard Jeanbrun

| Composant Jeanbrun | Reutilisable PTZ ? | Adaptations necessaires |
|--------------------|-------------------|------------------------|
| `FinancementForm` | **Oui** | Memes champs (apport, duree, taux, autres credits) |
| `JaugeEndettement` | **Oui (identique)** | Meme calcul taux endettement |
| `AlerteEndettement` | **Oui (identique)** | Meme seuil 35% |
| `DiffereSelector` | **Non** | PTZ a son propre mecanisme de differe (5/10/15 ans selon zone) |

### Composant specifique PTZ

- **SimulationPTZ** : Calcule le montant PTZ eligible (quotite selon zone), duree du differe PTZ, mensualites avec et sans PTZ.

---

## Composants partages (candidats @repo/ui ou packages/leads)

### Layout et navigation (deja dans apps/jeanbrun, a extraire vers @repo/ui)

| Composant | Fichier | Partage ? |
|-----------|---------|-----------|
| `SimulateurLayout` | `components/simulateur/SimulateurLayout.tsx` | Oui → `@repo/ui` |
| `ProgressBar` | `components/simulateur/ProgressBar.tsx` | Oui → `@repo/ui` (parametrable nb etapes) |
| `StepNavigation` | `components/simulateur/StepNavigation.tsx` | Oui → `@repo/ui` |

### Composants d'etape reutilisables directement

| Composant | Reutilisabilite |
|-----------|----------------|
| `VilleAutocomplete` | **100%** - Meme base de villes, meme autocomplete |
| `FinancementForm` | **90%** - Memes champs sauf differe |
| `JaugeEndettement` | **100%** - Calcul identique |
| `AlerteEndettement` | **100%** - Meme seuil |
| `TypeBienSelector` | **80%** - Filtrer les options selon la plateforme |

### Composants resultats reutilisables

| Composant | Reutilisabilite PTZ |
|-----------|-------------------|
| `SyntheseCard` | **80%** - Adapter les 4 KPIs (economie PTZ, mensualite, taux endettement, reste a vivre) |
| `EncartFinancement` | **90%** - Meme structure, ajouter montant PTZ |
| `GraphiquePatrimoine` | **70%** - Adapter les courbes (pas d'avantage fiscal mais PTZ sans interets) |
| `TableauAnnuel` | **60%** - Colonnes differentes (mensualite PTZ, mensualite hors PTZ) |
| `ComparatifLMNP` | **Non** - Remplacer par comparatif Locataire vs Proprietaire |
| `LeadCourtierModal` | **100%** - Identique (memes champs) |

### Logique partagee (packages/leads)

| Module | Contenu partage |
|--------|----------------|
| `scoring.ts` | Scoring lead (deja partage) - adapter poids PTZ |
| `validation.ts` | Schemas Zod lead (deja partage) |
| `types.ts` | Types Lead, Promoter, Broker (deja partage) |

---

## Calcul PTZ — Specificites

### Parametres PLF 2026

| Zone | Quotite neuf | Quotite ancien | Montant max (4 pers.) | Differe |
|------|-------------|----------------|----------------------|---------|
| A bis | 50% | N/A | 150 000 EUR | 15 ans |
| A | 50% | N/A | 135 000 EUR | 15 ans |
| B1 | 50% | N/A | 110 000 EUR | 10 ans |
| B2 | 20% | 40% | 88 000 EUR | 5 ans |
| C | 20% | 40% | 77 000 EUR | 5 ans |

### Plafonds de ressources (revenu fiscal reference N-2)

| Zone | 1 pers. | 2 pers. | 3 pers. | 4 pers. | 5+ pers. |
|------|---------|---------|---------|---------|----------|
| A bis | 49 000 | 73 500 | 88 200 | 102 900 | +12 250/pers |
| A | 49 000 | 73 500 | 88 200 | 102 900 | +12 250/pers |
| B1 | 34 500 | 48 300 | 58 100 | 67 900 | +7 800/pers |
| B2 | 31 000 | 43 400 | 52 100 | 60 800 | +7 000/pers |
| C | 28 500 | 39 900 | 47 900 | 55 900 | +6 500/pers |

### Formule simplifiee

```
montant_ptz = min(prix_acquisition * quotite, montant_max_zone)
mensualite_sans_ptz = pmt(taux, duree, prix - apport)
mensualite_avec_ptz = pmt(taux, duree, prix - apport - montant_ptz) + ptz_rembursement
economie_mensuelle = mensualite_sans_ptz - mensualite_avec_ptz
```

---

## Plan d'implementation suggere

1. **Extraire les composants partages** du wizard Jeanbrun vers `@repo/ui` ou un dossier partage
2. **Creer le moteur de calcul PTZ** dans `packages/leads/src/ptz/` (plafonds, quotites, differe)
3. **Creer les 3 pages wizard PTZ** dans `apps/stop-loyer/src/app/simulateur/`
4. **Creer la page resultats PTZ** (reutiliser le maximum de composants)
5. **Adapter le lead gate** (memes 3 consentements, scoring adapte)

---

*Derniere mise a jour : 6 fevrier 2026*
