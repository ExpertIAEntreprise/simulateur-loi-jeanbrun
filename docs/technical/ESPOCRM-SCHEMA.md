# Schéma EspoCRM - Simulateur Loi Jeanbrun

**Version:** 1.0
**Date:** 30 janvier 2026
**Instance:** https://espocrm.expert-ia-entreprise.fr

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Entités custom](#entités-custom)
3. [Relations entre entités](#relations-entre-entités)
4. [Champs par entité](#champs-par-entité)
5. [Script d'installation](#script-dinstallation)
6. [Exemples d'API](#exemples-dapi)
7. [Workflows suggérés](#workflows-suggérés)

---

## Vue d'ensemble

### Architecture de données

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Ville     │◄────┤  Programme  │      │   Agence    │
│             │      │             │      │             │
│ cVille      │      │ cProgramme  │      │ cAgence     │
│             │      │             │      │             │
│ • Marché    │      │ • Promoteur │      │ • Réseau    │
│ • Plafonds  │      │ • Prix      │      │ • Contact   │
│ • SEO       │      │ • Lots      │      │ • Notes     │
└──────┬──────┘      └─────────────┘      └──────┬──────┘
       │                    │                     │
       │                    │                     │
       │             ┌──────┴──────┐              │
       │             │             │              │
       └────────────►│ Simulation  │◄─────────────┘
                     │             │
                     │ cSimulation │
                     │             │
                     │ • Inputs    │
                     │ • Résultats │
                     │ • PDF       │
                     └─────────────┘
```

### Convention de nommage

- **Préfixe "c"** pour tous les champs custom (ex: `cZoneFiscale`)
- **Préfixe "c"** pour tous les noms d'entités custom (ex: `cVille`)
- **CamelCase** pour les noms de champs (ex: `cPrixM2Moyen`)
- **Anglais** pour les noms techniques, **Français** pour les labels

---

## Entités custom

### 1. cVille (Ville)

**Objectif:** Stocker les données marché immobilier et les plafonds Jeanbrun par ville.

**Type:** Entity
**Label singulier:** Ville
**Label pluriel:** Villes
**Champ de tri par défaut:** `name`

#### Champs

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `name` | Nom de la ville | Varchar(255) | Oui | Oui | Ex: "Lyon" |
| `cSlug` | Slug URL | Varchar(255) | Oui | Oui | Ex: "lyon" |
| `cCodePostal` | Codes postaux | Array | Non | Non | ["69001", "69002"...] |
| `cDepartement` | Département | Varchar(3) | Oui | Oui | Ex: "69" |
| `cRegion` | Région | Varchar(100) | Oui | Oui | Ex: "Auvergne-Rhône-Alpes" |
| `cLatitude` | Latitude | Float | Non | Non | 45.764043 |
| `cLongitude` | Longitude | Float | Non | Non | 4.835659 |
| `cPopulation` | Population | Integer | Non | Non | Ex: 520000 |
| `cZoneFiscale` | Zone fiscale | Enum | Oui | Oui | A, A_bis, B1, B2, C |
| `cPrixM2Moyen` | Prix m² moyen | Currency(EUR) | Non | Non | Ex: 4850 |
| `cPrixM2Median` | Prix m² médian | Currency(EUR) | Non | Non | Ex: 4500 |
| `cEvolutionPrix1An` | Évolution prix 1 an | Float | Non | Non | Ex: 2.3 (%) |
| `cLoyerM2Moyen` | Loyer m² moyen | Currency(EUR) | Non | Non | Ex: 14.2 |
| `cTensionLocative` | Tension locative | Enum | Non | Oui | faible, moyenne, forte, tres_forte |
| `cPlafondLoyerIntermediaire` | Plafond loyer intermédiaire | Currency(EUR) | Non | Non | Ex: 12.80 (€/m²) |
| `cPlafondLoyerSocial` | Plafond loyer social | Currency(EUR) | Non | Non | Ex: 10.20 (€/m²) |
| `cPlafondLoyerTresSocial` | Plafond loyer très social | Currency(EUR) | Non | Non | Ex: 8.50 (€/m²) |
| `cPlafondRessources` | Plafonds ressources | Text (JSON) | Non | Non | JSON avec plafonds par composition |
| `cNbProgrammesNeufs` | Nombre programmes neufs | Integer | Non | Non | Compteur automatique |
| `cNbAgences` | Nombre agences | Integer | Non | Non | Compteur automatique |
| `cContenuEditorial` | Contenu éditorial | Text (WYSIWYG) | Non | Non | 400-600 mots uniques |
| `cMetaTitle` | Meta title SEO | Varchar(255) | Non | Non | 60 caractères max |
| `cMetaDescription` | Meta description SEO | Text | Non | Non | 160 caractères max |
| `cSourceDonnees` | Source des données | Text | Non | Non | DVF, INSEE, DataForSEO |
| `dateMaj` | Date mise à jour | DateTime | Non | Non | Mise à jour auto |

#### Relations

- **1-N:** Ville → Programmes (`cProgramme`)
- **1-N:** Ville → Agences (`cAgence`)
- **1-N:** Ville → Simulations (`cSimulation`)

---

### 2. cProgramme (Programme Immobilier Neuf)

**Objectif:** Catalogue des programmes neufs éligibles Jeanbrun (via API agrégateur).

**Type:** Entity
**Label singulier:** Programme
**Label pluriel:** Programmes
**Champ de tri par défaut:** `cDateLivraison`

#### Champs

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `name` | Nom du programme | Varchar(255) | Oui | Oui | Ex: "Les Terrasses du Parc" |
| `cSlug` | Slug URL | Varchar(255) | Oui | Oui | Ex: "terrasses-parc-lyon" |
| `cPromoteur` | Promoteur | Varchar(255) | Oui | Oui | Ex: "Nexity" |
| `cAdresse` | Adresse | Varchar(255) | Non | Non | Adresse complète |
| `cVilleId` | Ville | Link (cVille) | Oui | Oui | Relation N-1 |
| `cLatitude` | Latitude | Float | Non | Non | Géolocalisation |
| `cLongitude` | Longitude | Float | Non | Non | Géolocalisation |
| `cPrixMin` | Prix minimum | Currency(EUR) | Non | Oui | Ex: 150000 |
| `cPrixMax` | Prix maximum | Currency(EUR) | Non | Oui | Ex: 450000 |
| `cPrixM2Moyen` | Prix m² moyen | Currency(EUR) | Non | Oui | Ex: 4500 |
| `cNbLotsTotal` | Nombre de lots total | Integer | Non | Non | Ex: 120 |
| `cNbLotsDisponibles` | Lots disponibles | Integer | Non | Oui | Ex: 45 |
| `cTypesLots` | Types de lots | Multi-enum | Non | Non | T1, T2, T3, T4, T5 |
| `cDateLivraison` | Date de livraison | Date | Non | Oui | T3 2026 |
| `cEligibleJeanbrun` | Éligible Jeanbrun | Boolean | Oui | Oui | Oui/Non |
| `cZoneFiscale` | Zone fiscale | Enum | Non | Oui | A, A_bis, B1, B2, C |
| `cImages` | Images | Attachment-Multiple | Non | Non | Galerie photos |
| `description` | Description | Text (WYSIWYG) | Non | Non | Descriptif commercial |
| `cSourceApi` | Source API | Varchar(100) | Non | Non | Nom de l'agrégateur |
| `cIdExterne` | ID externe | Varchar(100) | Non | Oui | ID dans l'API |
| `cUrlExterne` | URL externe | Url | Non | Non | Page promoteur |
| `cStatut` | Statut | Enum | Oui | Oui | disponible, epuise, livre |
| `dateMaj` | Date mise à jour | DateTime | Non | Oui | Sync quotidien |

#### Relations

- **N-1:** Programme → Ville (`cVille`)
- **1-N:** Programme → Simulations (`cSimulation`)

---

### 3. cAgence (Agence Immobilière)

**Objectif:** Annuaire des agences immobilières (ancien) scrappées ou enregistrées.

**Type:** Entity
**Label singulier:** Agence
**Label pluriel:** Agences
**Champ de tri par défaut:** `name`

#### Champs

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `name` | Nom de l'agence | Varchar(255) | Oui | Oui | Ex: "Century 21 Part-Dieu" |
| `cSlug` | Slug URL | Varchar(255) | Oui | Oui | Ex: "century21-partdieu-lyon" |
| `cEnseigne` | Enseigne/Réseau | Enum | Non | Oui | Century21, Laforet, Orpi, Independant |
| `cAdresse` | Adresse | Varchar(255) | Non | Non | Adresse complète |
| `cVilleId` | Ville | Link (cVille) | Oui | Oui | Relation N-1 |
| `cLatitude` | Latitude | Float | Non | Non | Géolocalisation |
| `cLongitude` | Longitude | Float | Non | Non | Géolocalisation |
| `phoneNumber` | Téléphone | Phone | Non | Oui | Téléphone principal |
| `emailAddress` | Email | Email | Non | Oui | Contact |
| `cSiteWeb` | Site web | Url | Non | Non | URL agence |
| `cHoraires` | Horaires | Text (JSON) | Non | Non | JSON horaires ouverture |
| `cSpecialites` | Spécialités | Multi-enum | Non | Oui | Ancien, Neuf, Location, Gestion |
| `cNoteGoogle` | Note Google | Float | Non | Oui | Ex: 4.2 |
| `cNbAvisGoogle` | Nombre d'avis Google | Integer | Non | Non | Ex: 127 |
| `cLogo` | Logo | Attachment | Non | Non | Logo HD |
| `description` | Description | Text (WYSIWYG) | Non | Non | Présentation agence |
| `cSource` | Source données | Enum | Oui | Oui | scrapping, inscription, partenaire |
| `cVerifiee` | Agence vérifiée | Boolean | Oui | Oui | Oui si revendiquée |
| `cStatut` | Statut | Enum | Oui | Oui | active, fermee, suspendue |
| `cIdGooglePlace` | Google Place ID | Varchar(100) | Non | Non | Pour avis |
| `dateMaj` | Date mise à jour | DateTime | Non | Oui | Scrapping hebdo |

#### Relations

- **N-1:** Agence → Ville (`cVille`)

---

### 4. cSimulation (Simulation Utilisateur)

**Objectif:** Historique des simulations réalisées par les utilisateurs.

**Type:** Entity
**Label singulier:** Simulation
**Label pluriel:** Simulations
**Champ de tri par défaut:** `createdAt` (DESC)

#### Champs

##### Section : Identité

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `name` | Nom de la simulation | Varchar(255) | Oui | Oui | Auto-généré: "Simulation Lyon 2026-01-30" |
| `assignedUserId` | Utilisateur | Link (User) | Non | Oui | Contact si inscrit |
| `cSessionId` | Session ID | Varchar(100) | Non | Oui | Anonyme si non connecté |
| `cType` | Type simulation | Enum | Oui | Oui | rapide, avancee |

##### Section : Inputs Projet

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `cVilleId` | Ville | Link (cVille) | Oui | Oui | Relation N-1 |
| `cProgrammeId` | Programme associé | Link (cProgramme) | Non | Oui | Si simulation depuis fiche programme |
| `cMontantInvestissement` | Montant investissement | Currency(EUR) | Oui | Oui | Prix acquisition |
| `cApport` | Apport personnel | Currency(EUR) | Non | Non | Ex: 30000 |
| `cDureeEmprunt` | Durée emprunt (années) | Integer | Non | Non | Ex: 20 |
| `cTauxEmprunt` | Taux emprunt (%) | Float | Non | Non | Ex: 3.5 |
| `cAssuranceEmprunt` | Assurance emprunt (%) | Float | Non | Non | Ex: 0.36 |
| `cFraisNotaire` | Frais de notaire | Currency(EUR) | Non | Non | Auto-calculé 2-3% |

##### Section : Inputs Fiscal

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `cRevenusAnnuels` | Revenus annuels | Currency(EUR) | Oui | Oui | Revenus foyer fiscal |
| `cTMI` | TMI | Enum | Oui | Oui | 0, 11, 30, 41, 45 |
| `cPartsFiscales` | Parts fiscales | Float | Non | Non | Ex: 2.5 |
| `cAutresRevenusFonciers` | Autres revenus fonciers | Currency(EUR) | Non | Non | Revenus fonciers existants |

##### Section : Inputs Location

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `cNiveauLoyer` | Niveau de loyer | Enum | Oui | Oui | intermediaire, social, tres_social |
| `cSurfaceLogement` | Surface (m²) | Integer | Non | Non | Ex: 45 |
| `cChargesCopro` | Charges copro (€/mois) | Currency(EUR) | Non | Non | Ex: 150 |
| `cTaxeFonciere` | Taxe foncière (€/an) | Currency(EUR) | Non | Non | Ex: 800 |
| `cFraisGestion` | Frais gestion (%) | Float | Non | Non | Ex: 7 |

##### Section : Outputs Résultats

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `cLoyerMensuelEstime` | Loyer mensuel estimé | Currency(EUR) | Non | Oui | Calculé |
| `cAmortissementAnnuel` | Amortissement annuel | Currency(EUR) | Non | Non | Déduction fiscale |
| `cEconomieImpotAnnuelle` | Économie impôt annuelle | Currency(EUR) | Non | Oui | Gain fiscal |
| `cEconomieImpotTotale` | Économie impôt totale (9 ans) | Currency(EUR) | Non | Oui | Total |
| `cRendementBrut` | Rendement brut (%) | Float | Non | Oui | Loyers / Prix |
| `cRendementNet` | Rendement net (%) | Float | Non | Oui | Net de charges |
| `cCashFlowMensuel` | Cash-flow mensuel | Currency(EUR) | Non | Oui | Loyer - Mensualité - Charges |
| `cDeficitFoncier` | Déficit foncier | Currency(EUR) | Non | Non | Si applicable |

##### Section : Meta

| Nom technique | Label | Type | Requis | Index | Description |
|---------------|-------|------|--------|-------|-------------|
| `cPdfGenere` | PDF généré | Boolean | Non | Oui | Oui si exporté |
| `cPdfUrl` | URL du PDF | Url | Non | Non | Stockage S3 |
| `cPartage` | Simulation partagée | Boolean | Non | Oui | Lien unique généré |
| `cLienPartage` | Lien de partage | Varchar(255) | Non | Non | UUID |
| `createdAt` | Créé le | DateTime | Oui | Oui | Auto |
| `modifiedAt` | Modifié le | DateTime | Oui | Oui | Auto |

#### Relations

- **N-1:** Simulation → Ville (`cVille`)
- **N-1:** Simulation → Programme (`cProgramme`) [optionnel]
- **N-1:** Simulation → Contact (`Contact`) [si inscrit]

---

## Relations entre entités

### Schéma relationnel

```sql
-- Ville (hub central)
cVille {
  id: UUID PK
  name: VARCHAR
  ...
}

-- Programme (many-to-one avec Ville)
cProgramme {
  id: UUID PK
  cVilleId: UUID FK -> cVille.id
  ...
}

-- Agence (many-to-one avec Ville)
cAgence {
  id: UUID PK
  cVilleId: UUID FK -> cVille.id
  ...
}

-- Simulation (many-to-one avec Ville + Programme optionnel)
cSimulation {
  id: UUID PK
  cVilleId: UUID FK -> cVille.id
  cProgrammeId: UUID FK -> cProgramme.id [nullable]
  assignedUserId: UUID FK -> User.id [nullable]
  ...
}
```

### Configuration EspoCRM

Dans l'Entity Manager:

1. **cVille → cProgramme**: One-to-Many (Foreign Key dans `cProgramme.cVilleId`)
2. **cVille → cAgence**: One-to-Many (Foreign Key dans `cAgence.cVilleId`)
3. **cVille → cSimulation**: One-to-Many (Foreign Key dans `cSimulation.cVilleId`)
4. **cProgramme → cSimulation**: One-to-Many (Foreign Key dans `cSimulation.cProgrammeId`)
5. **User → cSimulation**: One-to-Many (Foreign Key dans `cSimulation.assignedUserId`)

---

## Script d'installation

### Prérequis

- Accès administrateur EspoCRM
- API Key avec permissions complètes
- EspoCRM version 7.0+

### Option 1: Installation manuelle via UI

#### Étape 1: Créer l'entité cVille

1. Administration → Entity Manager → Create Entity
2. Remplir:
   - Name: `cVille`
   - Label Singular: `Ville`
   - Label Plural: `Villes`
   - Type: `Base Plus`
   - Stream: ☑ Enabled
3. Créer tous les champs listés dans la section "cVille"

#### Étape 2: Créer l'entité cProgramme

1. Répéter le processus
2. Ajouter la relation N-1 vers cVille:
   - Fields → Add Field → Link
   - Name: `cVilleId`
   - Entity: `cVille`
   - Link Type: `Many-to-One`

#### Étape 3: Créer l'entité cAgence

1. Répéter le processus
2. Ajouter la relation N-1 vers cVille

#### Étape 4: Créer l'entité cSimulation

1. Répéter le processus
2. Ajouter les relations:
   - N-1 vers cVille
   - N-1 vers cProgramme (nullable)
   - N-1 vers User (nullable)

### Option 2: Installation via API

Créer le fichier `/root/simulateur_loi_Jeanbrun/scripts/espocrm-setup.sh`:

```bash
#!/bin/bash

# Script d'installation des entités EspoCRM pour Simulateur Loi Jeanbrun
# Usage: ./espocrm-setup.sh

set -e

API_URL="https://espocrm.expert-ia-entreprise.fr/api/v1"
API_KEY="${ESPOCRM_API_KEY}"

if [ -z "$API_KEY" ]; then
  echo "Erreur: Variable ESPOCRM_API_KEY non définie"
  exit 1
fi

echo "🚀 Installation du schéma EspoCRM Simulateur Loi Jeanbrun"
echo "========================================================="

# Note: L'API EspoCRM ne permet PAS de créer des entités via REST
# Cette fonctionnalité nécessite d'utiliser l'interface d'administration
# ou des extensions comme "Advanced Pack"

echo ""
echo "⚠️  IMPORTANT:"
echo "La création d'entités custom doit se faire manuellement via:"
echo "Administration → Entity Manager → Create Entity"
echo ""
echo "Suivre les instructions dans docs/ESPOCRM-SCHEMA.md"
echo ""

# On peut cependant créer des enregistrements de test

echo "✅ Création d'enregistrements de test (une fois les entités créées)..."

# Test Ville Lyon
echo "Création ville: Lyon..."
curl -X POST "$API_URL/cVille" \
  -H "X-Api-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lyon",
    "cSlug": "lyon",
    "cCodePostal": ["69001", "69002", "69003", "69004", "69005", "69006", "69007", "69008", "69009"],
    "cDepartement": "69",
    "cRegion": "Auvergne-Rhône-Alpes",
    "cLatitude": 45.764043,
    "cLongitude": 4.835659,
    "cPopulation": 520000,
    "cZoneFiscale": "A",
    "cPrixM2Moyen": 4850.00,
    "cPrixM2Median": 4500.00,
    "cEvolutionPrix1An": 2.3,
    "cLoyerM2Moyen": 14.20,
    "cTensionLocative": "forte",
    "cPlafondLoyerIntermediaire": 12.80,
    "cPlafondLoyerSocial": 10.20,
    "cPlafondLoyerTresSocial": 8.50,
    "cMetaTitle": "Investir en Loi Jeanbrun à Lyon : Simulation et Programmes 2026",
    "cMetaDescription": "Simulez votre investissement loi Jeanbrun à Lyon. Prix m² 4850€, programmes neufs éligibles, plafonds de loyers."
  }' 2>/dev/null && echo "✅ Ville Lyon créée" || echo "❌ Erreur création Lyon"

echo ""
echo "✅ Installation terminée"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Créer les entités manuellement via Entity Manager"
echo "2. Importer les données villes (CSV ou API)"
echo "3. Connecter l'API agrégateur pour les programmes"
echo "4. Configurer le scrapping des agences"
echo ""
```

### Option 3: Import JSON (Advanced Pack)

Si vous disposez du module "Advanced Pack", vous pouvez exporter/importer les définitions d'entités en JSON.

Créer `/root/simulateur_loi_Jeanbrun/config/espocrm-entities.json`:

```json
{
  "entities": [
    {
      "name": "cVille",
      "type": "BasePlus",
      "labelSingular": "Ville",
      "labelPlural": "Villes",
      "stream": true,
      "fields": [
        {
          "name": "cSlug",
          "type": "varchar",
          "maxLength": 255,
          "required": true,
          "index": true
        },
        {
          "name": "cZoneFiscale",
          "type": "enum",
          "options": ["A", "A_bis", "B1", "B2", "C"],
          "required": true,
          "index": true
        }
        // ... (liste complète dans un fichier séparé)
      ]
    }
  ]
}
```

---

## Exemples d'API

### 1. Créer une ville

```bash
curl -X POST "https://espocrm.expert-ia-entreprise.fr/api/v1/cVille" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lyon",
    "cSlug": "lyon",
    "cDepartement": "69",
    "cRegion": "Auvergne-Rhône-Alpes",
    "cZoneFiscale": "A",
    "cPrixM2Moyen": 4850.00,
    "cLoyerM2Moyen": 14.20,
    "cTensionLocative": "forte",
    "cPlafondLoyerIntermediaire": 12.80
  }'
```

### 2. Récupérer toutes les villes en zone A

```bash
curl -X GET "https://espocrm.expert-ia-entreprise.fr/api/v1/cVille" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" \
  --data-urlencode "where[0][type]=equals" \
  --data-urlencode "where[0][attribute]=cZoneFiscale" \
  --data-urlencode "where[0][value]=A" \
  --data-urlencode "maxSize=50" \
  --data-urlencode "orderBy=cPrixM2Moyen" \
  --data-urlencode "order=desc"
```

### 3. Créer un programme neuf

```bash
curl -X POST "https://espocrm.expert-ia-entreprise.fr/api/v1/cProgramme" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Les Terrasses du Parc",
    "cSlug": "terrasses-parc-lyon",
    "cPromoteur": "Nexity",
    "cVilleId": "VILLE_ID_LYON",
    "cPrixMin": 195000,
    "cPrixMax": 450000,
    "cPrixM2Moyen": 4500,
    "cNbLotsTotal": 85,
    "cNbLotsDisponibles": 32,
    "cTypesLots": ["T2", "T3", "T4"],
    "cDateLivraison": "2026-12-31",
    "cEligibleJeanbrun": true,
    "cZoneFiscale": "A",
    "description": "Résidence neuve au cœur du 3ème arrondissement...",
    "cStatut": "disponible"
  }'
```

### 4. Enregistrer une simulation

```bash
curl -X POST "https://espocrm.expert-ia-entreprise.fr/api/v1/cSimulation" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Simulation Lyon 2026-01-30",
    "cType": "avancee",
    "cVilleId": "VILLE_ID_LYON",
    "cProgrammeId": "PROGRAMME_ID",
    "cMontantInvestissement": 250000,
    "cApport": 50000,
    "cDureeEmprunt": 20,
    "cTauxEmprunt": 3.5,
    "cRevenusAnnuels": 60000,
    "cTMI": "30",
    "cNiveauLoyer": "intermediaire",
    "cSurfaceLogement": 55,
    "cLoyerMensuelEstime": 880,
    "cAmortissementAnnuel": 8000,
    "cEconomieImpotAnnuelle": 2400,
    "cEconomieImpotTotale": 21600,
    "cRendementBrut": 4.2,
    "cRendementNet": 2.8,
    "cCashFlowMensuel": -150
  }'
```

### 5. Rechercher les programmes dans une ville

```bash
curl -X GET "https://espocrm.expert-ia-entreprise.fr/api/v1/cProgramme" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" \
  --data-urlencode "where[0][type]=equals" \
  --data-urlencode "where[0][attribute]=cVilleId" \
  --data-urlencode "where[0][value]=VILLE_ID_LYON" \
  --data-urlencode "where[1][type]=equals" \
  --data-urlencode "where[1][attribute]=cEligibleJeanbrun" \
  --data-urlencode "where[1][value]=true" \
  --data-urlencode "where[2][type]=equals" \
  --data-urlencode "where[2][attribute]=cStatut" \
  --data-urlencode "where[2][attribute]=disponible" \
  --data-urlencode "orderBy=cPrixMin" \
  --data-urlencode "order=asc"
```

### 6. Récupérer les statistiques d'une ville

```bash
# Obtenir les compteurs de programmes et agences
VILLE_ID="VILLE_ID_LYON"

# Nombre de programmes
NB_PROGRAMMES=$(curl -s -X GET "https://espocrm.expert-ia-entreprise.fr/api/v1/cProgramme" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" \
  --data-urlencode "where[0][type]=equals" \
  --data-urlencode "where[0][attribute]=cVilleId" \
  --data-urlencode "where[0][value]=$VILLE_ID" | jq '.total')

# Mettre à jour le compteur
curl -X PUT "https://espocrm.expert-ia-entreprise.fr/api/v1/cVille/$VILLE_ID" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"cNbProgrammesNeufs\": $NB_PROGRAMMES}"
```

---

## Workflows suggérés

### 1. Mise à jour quotidienne des programmes (via n8n)

**Déclencheur:** Cron quotidien 3h du matin

**Étapes:**
1. Appeler l'API agrégateur de programmes
2. Pour chaque programme:
   - Chercher si existe dans EspoCRM (`cIdExterne`)
   - Si existe: UPDATE
   - Si nouveau: CREATE
3. Mettre à jour `dateMaj`
4. Recalculer `cNbLotsDisponibles`
5. Si `cNbLotsDisponibles = 0`: Changer `cStatut` à `epuise`

### 2. Scrapping hebdomadaire des agences

**Déclencheur:** Cron dimanche 2h du matin

**Sources:**
- Google Places API (par ville)
- Pages Jaunes
- Sites réseaux (Century21, Laforêt...)

**Étapes:**
1. Pour chaque ville dans `cVille`
2. Scrapper les agences (nom, adresse, tel, note)
3. Chercher si existe via `cIdGooglePlace` ou nom+adresse
4. Si nouvelle: CREATE avec `cSource=scrapping` et `cVerifiee=false`
5. Si existe: UPDATE note Google + avis
6. Mettre à jour compteur `cNbAgences` dans `cVille`

### 3. Mise à jour mensuelle des données marché

**Déclencheur:** Cron 1er du mois 1h du matin

**Sources:**
- DVF (data.gouv.fr)
- DataForSEO API
- Observatoires loyers

**Étapes:**
1. Pour chaque ville dans `cVille`
2. Récupérer prix m² moyen/médian
3. Calculer évolution prix 1 an
4. Récupérer loyer m² moyen
5. UPDATE `cVille` avec nouvelles données
6. Mettre à jour `dateMaj`

### 4. Génération PDF simulation

**Déclencheur:** Bouton "Exporter PDF" dans l'UI

**Étapes:**
1. Récupérer simulation par ID
2. Charger données ville associée
3. Charger programme si `cProgrammeId` présent
4. Générer PDF avec template (logo, disclaimer)
5. Upload PDF vers S3
6. Mettre à jour `cPdfGenere=true` et `cPdfUrl`
7. Envoyer email à l'utilisateur avec lien

### 5. Alerte nouveaux programmes

**Déclencheur:** After Create sur `cProgramme`

**Étapes:**
1. Récupérer ville du programme
2. Chercher utilisateurs ayant simulé dans cette ville (7 derniers jours)
3. Filtrer utilisateurs ayant consenti aux emails
4. Envoyer email personnalisé:
   - "Nouveau programme à [Ville] : [Nom]"
   - Lien vers fiche programme
   - CTA "Simuler ce programme"

---

## Formules EspoCRM

### Formule 1: Auto-génération du slug

**Entité:** cVille, cProgramme, cAgence
**Type:** Before Save Script

```
// Générer slug depuis le nom
cSlug = string\toLowerCase(
  string\replace(
    string\replace(name, ' ', '-'),
    'é', 'e'
  )
);

// Supprimer caractères spéciaux
cSlug = string\replace(cSlug, "'", '');
```

### Formule 2: Calcul automatique du rendement brut

**Entité:** cSimulation
**Type:** Before Save Script

```
// Rendement brut = (Loyer annuel / Prix acquisition) * 100
ifThen(
  cMontantInvestissement > 0 && cLoyerMensuelEstime > 0,
  cRendementBrut = (cLoyerMensuelEstime * 12 / cMontantInvestissement) * 100
);
```

### Formule 3: Calcul économie d'impôt

**Entité:** cSimulation
**Type:** Before Save Script

```
// Amortissement selon niveau de loyer
$tauxAmortissement = 0;
ifThen(cNiveauLoyer == 'intermediaire', $tauxAmortissement = 3.5);
ifThen(cNiveauLoyer == 'social', $tauxAmortissement = 4.5);
ifThen(cNiveauLoyer == 'tres_social', $tauxAmortissement = 5.5);

// Calcul amortissement annuel
cAmortissementAnnuel = cMontantInvestissement * ($tauxAmortissement / 100);

// Plafonnement
$plafond = 0;
ifThen(cNiveauLoyer == 'intermediaire', $plafond = 8000);
ifThen(cNiveauLoyer == 'social', $plafond = 10000);
ifThen(cNiveauLoyer == 'tres_social', $plafond = 12000);

ifThen(cAmortissementAnnuel > $plafond, cAmortissementAnnuel = $plafond);

// Économie d'impôt
$tmi = 0;
ifThen(cTMI == '11', $tmi = 0.11);
ifThen(cTMI == '30', $tmi = 0.30);
ifThen(cTMI == '41', $tmi = 0.41);
ifThen(cTMI == '45', $tmi = 0.45);

cEconomieImpotAnnuelle = cAmortissementAnnuel * $tmi;
cEconomieImpotTotale = cEconomieImpotAnnuelle * 9;
```

### Formule 4: Mise à jour compteurs ville

**Entité:** cVille
**Type:** Scheduled (quotidien)

```
// Cette formule est exécutée par un workflow externe (n8n)
// car EspoCRM ne permet pas les COUNT() directs dans les formules

// Voir workflow n8n "Update Ville Counters"
```

---

## Checklist de déploiement

- [ ] Créer les 4 entités custom dans Entity Manager
- [ ] Configurer tous les champs pour chaque entité
- [ ] Définir les relations (Links) entre entités
- [ ] Configurer les layouts (List, Detail, Edit)
- [ ] Ajouter les formules Before Save
- [ ] Définir les rôles et permissions
- [ ] Importer les données initiales (50 villes prioritaires)
- [ ] Connecter l'API agrégateur programmes
- [ ] Configurer le workflow scrapping agences (n8n)
- [ ] Tester les endpoints API
- [ ] Configurer les webhooks vers le site Next.js
- [ ] Documenter les API pour l'équipe dev frontend

---

## Support et maintenance

### Logs et monitoring

```bash
# Vérifier les logs EspoCRM
docker logs espocrm --tail 100 --follow

# Vérifier la base de données
docker exec -it espocrm-db mysql -u espocrm -p -e "SHOW TABLES LIKE 'c%';"

# Nombre d'enregistrements par entité
docker exec -it espocrm-db mysql -u espocrm -p espocrm -e "
  SELECT 'cVille' AS entity, COUNT(*) AS count FROM c_ville
  UNION ALL
  SELECT 'cProgramme', COUNT(*) FROM c_programme
  UNION ALL
  SELECT 'cAgence', COUNT(*) FROM c_agence
  UNION ALL
  SELECT 'cSimulation', COUNT(*) FROM c_simulation;
"
```

### Backup recommandé

Les entités custom sont incluses dans le backup quotidien EspoCRM existant:
- MySQL dump complet
- Fichiers attachments
- Configuration Entity Manager

Script: `/root/scripts/espocrm-backup.sh` (à créer)

---

## Ressources

- [EspoCRM Entity Manager Documentation](https://docs.espocrm.com/administration/entity-manager/)
- [EspoCRM REST API](https://docs.espocrm.com/development/api/)
- [EspoCRM Formula Reference](https://docs.espocrm.com/administration/formula/)
- PRD Simulateur Loi Jeanbrun: `/root/simulateur_loi_Jeanbrun/PRD_Simulateur_Loi_Jeanbrun.md`

---

**Document maintenu par:** Claude Code (EspoCRM Expert)
**Dernière mise à jour:** 30 janvier 2026
