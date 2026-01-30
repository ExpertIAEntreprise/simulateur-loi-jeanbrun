# Guide d'Installation EspoCRM - Simulateur Loi Jeanbrun

**Temps estimé:** 30-45 minutes
**Prérequis:** Accès administrateur EspoCRM

---

## 📋 Vue d'ensemble

Ce guide vous accompagne dans la création des 4 entités custom EspoCRM pour le projet Simulateur Loi Jeanbrun:

1. **cVille** - Données marché et plafonds Jeanbrun
2. **cProgramme** - Programmes immobiliers neufs
3. **cAgence** - Annuaire agences immobilières
4. **cSimulation** - Historique simulations utilisateurs

---

## 🔑 Étape 0: Obtenir la clé API

1. Se connecter à https://espocrm.expert-ia-entreprise.fr
2. Aller dans **Préférences utilisateur** (icône profil en haut à droite)
3. Onglet **API**
4. Générer une nouvelle clé API
5. Copier la clé et l'exporter:

```bash
export ESPOCRM_API_KEY='votre_clé_api_ici'
```

6. Tester la connexion:

```bash
cd /root/simulateur_loi_Jeanbrun
./scripts/espocrm-setup.sh test
```

---

## 🏗️ Étape 1: Créer l'entité cVille

### 1.1 Créer l'entité

1. **Administration** → **Entity Manager** → **Create Entity**
2. Remplir les champs:
   - **Name:** `cVille`
   - **Type:** `Base Plus`
   - **Label (Singular):** `Ville`
   - **Label (Plural):** `Villes`
   - **Stream:** ☑ Enabled
   - **Disabled:** ☐ (décoché)
3. Cliquer **Save**

### 1.2 Ajouter les champs

Pour chaque champ ci-dessous, aller dans **Fields** → **Add Field**:

#### Champs de base

| Name | Type | Label | Required | Indexed |
|------|------|-------|----------|---------|
| `cSlug` | Varchar | Slug URL | ☑ | ☑ |
| `cCodePostal` | Array | Codes postaux | ☐ | ☐ |
| `cDepartement` | Varchar | Département | ☑ | ☑ |
| `cRegion` | Varchar | Région | ☑ | ☑ |
| `cLatitude` | Float | Latitude | ☐ | ☐ |
| `cLongitude` | Float | Longitude | ☐ | ☐ |
| `cPopulation` | Integer | Population | ☐ | ☐ |

#### Champ Zone fiscale (Enum)

- **Name:** `cZoneFiscale`
- **Type:** Enum
- **Label:** Zone fiscale
- **Required:** ☑
- **Indexed:** ☑
- **Options:**
  - `A` → Zone A
  - `A_bis` → Zone A bis
  - `B1` → Zone B1
  - `B2` → Zone B2
  - `C` → Zone C

#### Champs marché (Currency EUR)

| Name | Type | Label |
|------|------|-------|
| `cPrixM2Moyen` | Currency | Prix m² moyen |
| `cPrixM2Median` | Currency | Prix m² médian |
| `cLoyerM2Moyen` | Currency | Loyer m² moyen |
| `cPlafondLoyerIntermediaire` | Currency | Plafond loyer intermédiaire |
| `cPlafondLoyerSocial` | Currency | Plafond loyer social |
| `cPlafondLoyerTresSocial` | Currency | Plafond loyer très social |

**Configuration Currency:**
- Currency: EUR (€)
- After Decimal Point: 2

#### Champ Évolution prix (Float)

- **Name:** `cEvolutionPrix1An`
- **Type:** Float
- **Label:** Évolution prix 1 an (%)
- **Decimal Places:** 2

#### Champ Tension locative (Enum)

- **Name:** `cTensionLocative`
- **Type:** Enum
- **Label:** Tension locative
- **Options:**
  - `faible` → Faible
  - `moyenne` → Moyenne
  - `forte` → Forte
  - `tres_forte` → Très forte

#### Champs texte

| Name | Type | Label |
|------|------|-------|
| `cPlafondRessources` | Text | Plafonds ressources (JSON) |
| `cContenuEditorial` | Text (WYSIWYG) | Contenu éditorial |
| `cMetaTitle` | Varchar(255) | Meta title SEO |
| `cMetaDescription` | Text | Meta description SEO |
| `cSourceDonnees` | Text | Source des données |

#### Champs compteurs

| Name | Type | Label |
|------|------|-------|
| `cNbProgrammesNeufs` | Integer | Nombre programmes neufs |
| `cNbAgences` | Integer | Nombre agences |

#### Champ Date de mise à jour

- **Name:** `dateMaj`
- **Type:** DateTime
- **Label:** Date mise à jour

### 1.3 Configurer les layouts

1. **Layouts** → **List**
   - Colonnes: name, cDepartement, cZoneFiscale, cPrixM2Moyen, cNbProgrammesNeufs

2. **Layouts** → **Detail**
   - Organiser les champs en sections:
     - Informations générales
     - Données marché
     - Plafonds Jeanbrun
     - SEO
     - Compteurs

3. **Layouts** → **Edit**
   - Même organisation que Detail

### 1.4 Formule (optionnel)

**Before Save Script** pour auto-générer le slug:

```
cSlug = string\toLowerCase(
  string\replace(
    string\replace(name, ' ', '-'),
    'é', 'e'
  )
);
cSlug = string\replace(cSlug, "'", '');
```

Aller dans **Formula** et coller le script ci-dessus.

---

## 🏢 Étape 2: Créer l'entité cProgramme

### 2.1 Créer l'entité

1. **Administration** → **Entity Manager** → **Create Entity**
2. Remplir:
   - **Name:** `cProgramme`
   - **Type:** `Base Plus`
   - **Label (Singular):** `Programme`
   - **Label (Plural):** `Programmes`
   - **Stream:** ☑ Enabled

### 2.2 Ajouter les champs

#### Champs de base

| Name | Type | Label | Required | Indexed |
|------|------|-------|----------|---------|
| `cSlug` | Varchar | Slug URL | ☑ | ☑ |
| `cPromoteur` | Varchar | Promoteur | ☑ | ☑ |
| `cAdresse` | Varchar | Adresse | ☐ | ☐ |
| `cLatitude` | Float | Latitude | ☐ | ☐ |
| `cLongitude` | Float | Longitude | ☐ | ☐ |

#### Relation avec Ville

- **Name:** `cVilleId`
- **Type:** Link
- **Label:** Ville
- **Entity:** `cVille`
- **Link Type:** `Many-to-One`
- **Required:** ☑
- **Indexed:** ☑

#### Champs prix

| Name | Type | Label | Indexed |
|------|------|-------|---------|
| `cPrixMin` | Currency | Prix minimum | ☑ |
| `cPrixMax` | Currency | Prix maximum | ☑ |
| `cPrixM2Moyen` | Currency | Prix m² moyen | ☑ |

#### Champs lots

| Name | Type | Label |
|------|------|-------|
| `cNbLotsTotal` | Integer | Nombre de lots total |
| `cNbLotsDisponibles` | Integer | Lots disponibles |

#### Champ Types de lots (Multi-Enum)

- **Name:** `cTypesLots`
- **Type:** Multi-Enum
- **Label:** Types de lots
- **Options:**
  - `T1` → T1
  - `T2` → T2
  - `T3` → T3
  - `T4` → T4
  - `T5` → T5

#### Champ Date de livraison

- **Name:** `cDateLivraison`
- **Type:** Date
- **Label:** Date de livraison
- **Indexed:** ☑

#### Champ Éligible Jeanbrun

- **Name:** `cEligibleJeanbrun`
- **Type:** Boolean
- **Label:** Éligible Jeanbrun
- **Required:** ☑
- **Indexed:** ☑

#### Champ Zone fiscale

- **Name:** `cZoneFiscale`
- **Type:** Enum
- **Label:** Zone fiscale
- **Options:** A, A_bis, B1, B2, C
- **Indexed:** ☑

#### Champs médias

- **Name:** `cImages`
- **Type:** Attachment Multiple
- **Label:** Images

#### Champs texte

| Name | Type | Label |
|------|------|-------|
| `description` | Text (WYSIWYG) | Description |
| `cSourceApi` | Varchar | Source API |
| `cIdExterne` | Varchar | ID externe |

#### Champ URL externe

- **Name:** `cUrlExterne`
- **Type:** Url
- **Label:** URL externe

#### Champ Statut (Enum)

- **Name:** `cStatut`
- **Type:** Enum
- **Label:** Statut
- **Required:** ☑
- **Indexed:** ☑
- **Options:**
  - `disponible` → Disponible
  - `epuise` → Épuisé
  - `livre` → Livré

#### Date de mise à jour

- **Name:** `dateMaj`
- **Type:** DateTime
- **Label:** Date mise à jour
- **Indexed:** ☑

---

## 🏛️ Étape 3: Créer l'entité cAgence

### 3.1 Créer l'entité

1. **Administration** → **Entity Manager** → **Create Entity**
2. Remplir:
   - **Name:** `cAgence`
   - **Type:** `Base Plus`
   - **Label (Singular):** `Agence`
   - **Label (Plural):** `Agences`
   - **Stream:** ☑ Enabled

### 3.2 Ajouter les champs

#### Champs de base

| Name | Type | Label | Required | Indexed |
|------|------|-------|----------|---------|
| `cSlug` | Varchar | Slug URL | ☑ | ☑ |
| `cAdresse` | Varchar | Adresse | ☐ | ☐ |
| `cLatitude` | Float | Latitude | ☐ | ☐ |
| `cLongitude` | Float | Longitude | ☐ | ☐ |

#### Relation avec Ville

- **Name:** `cVilleId`
- **Type:** Link
- **Label:** Ville
- **Entity:** `cVille`
- **Link Type:** `Many-to-One`
- **Required:** ☑
- **Indexed:** ☑

#### Champs contact

| Name | Type | Label | Indexed |
|------|------|-------|---------|
| `phoneNumber` | Phone | Téléphone | ☑ |
| `emailAddress` | Email | Email | ☑ |
| `cSiteWeb` | Url | Site web | ☐ |

#### Champ Enseigne (Enum)

- **Name:** `cEnseigne`
- **Type:** Enum
- **Label:** Enseigne/Réseau
- **Indexed:** ☑
- **Options:**
  - `Century21` → Century 21
  - `Laforet` → Laforêt
  - `Orpi` → Orpi
  - `Guy_Hoquet` → Guy Hoquet
  - `Era` → ERA Immobilier
  - `Foncia` → Foncia
  - `Independant` → Indépendant
  - `Autre` → Autre

#### Champ Horaires

- **Name:** `cHoraires`
- **Type:** Text
- **Label:** Horaires (JSON)

#### Champ Spécialités (Multi-Enum)

- **Name:** `cSpecialites`
- **Type:** Multi-Enum
- **Label:** Spécialités
- **Indexed:** ☑
- **Options:**
  - `Ancien` → Ancien
  - `Neuf` → Neuf
  - `Location` → Location
  - `Gestion` → Gestion locative
  - `Viager` → Viager
  - `Prestige` → Prestige

#### Champs Google

| Name | Type | Label | Indexed |
|------|------|-------|---------|
| `cNoteGoogle` | Float | Note Google | ☑ |
| `cNbAvisGoogle` | Integer | Nombre avis Google | ☐ |
| `cIdGooglePlace` | Varchar | Google Place ID | ☐ |

#### Champ Logo

- **Name:** `cLogo`
- **Type:** Attachment
- **Label:** Logo

#### Champ Description

- **Name:** `description`
- **Type:** Text (WYSIWYG)
- **Label:** Description

#### Champ Source (Enum)

- **Name:** `cSource`
- **Type:** Enum
- **Label:** Source données
- **Required:** ☑
- **Indexed:** ☑
- **Options:**
  - `scrapping` → Scrapping
  - `inscription` → Inscription
  - `partenaire` → Partenaire

#### Champ Vérifiée

- **Name:** `cVerifiee`
- **Type:** Boolean
- **Label:** Agence vérifiée
- **Required:** ☑
- **Indexed:** ☑

#### Champ Statut (Enum)

- **Name:** `cStatut`
- **Type:** Enum
- **Label:** Statut
- **Required:** ☑
- **Indexed:** ☑
- **Options:**
  - `active` → Active
  - `fermee` → Fermée
  - `suspendue` → Suspendue

#### Date de mise à jour

- **Name:** `dateMaj`
- **Type:** DateTime
- **Label:** Date mise à jour
- **Indexed:** ☑

---

## 🧮 Étape 4: Créer l'entité cSimulation

### 4.1 Créer l'entité

1. **Administration** → **Entity Manager** → **Create Entity**
2. Remplir:
   - **Name:** `cSimulation`
   - **Type:** `Base Plus`
   - **Label (Singular):** `Simulation`
   - **Label (Plural):** `Simulations`
   - **Stream:** ☑ Enabled

### 4.2 Ajouter les champs

#### Champs identité

| Name | Type | Label | Required | Indexed |
|------|------|-------|----------|---------|
| `cSessionId` | Varchar | Session ID | ☐ | ☑ |

#### Champ Type (Enum)

- **Name:** `cType`
- **Type:** Enum
- **Label:** Type simulation
- **Required:** ☑
- **Indexed:** ☑
- **Options:**
  - `rapide` → Rapide
  - `avancee` → Avancée

#### Relations

**Relation Ville:**
- **Name:** `cVilleId`
- **Type:** Link
- **Label:** Ville
- **Entity:** `cVille`
- **Link Type:** `Many-to-One`
- **Required:** ☑
- **Indexed:** ☑

**Relation Programme (optionnel):**
- **Name:** `cProgrammeId`
- **Type:** Link
- **Label:** Programme associé
- **Entity:** `cProgramme`
- **Link Type:** `Many-to-One`
- **Required:** ☐
- **Indexed:** ☑

**Relation Utilisateur (optionnel):**
- **Name:** `assignedUserId`
- **Type:** Link (déjà existant par défaut)
- Vérifier que le champ existe et est bien lié à `User`

#### Champs Inputs Projet (Currency)

| Name | Label | Required | Indexed |
|------|-------|----------|---------|
| `cMontantInvestissement` | Montant investissement | ☑ | ☑ |
| `cApport` | Apport personnel | ☐ | ☐ |
| `cFraisNotaire` | Frais de notaire | ☐ | ☐ |

#### Champs Inputs Emprunt

| Name | Type | Label |
|------|------|-------|
| `cDureeEmprunt` | Integer | Durée emprunt (années) |
| `cTauxEmprunt` | Float | Taux emprunt (%) |
| `cAssuranceEmprunt` | Float | Assurance emprunt (%) |

#### Champs Inputs Fiscal (Currency)

| Name | Label | Required | Indexed |
|------|-------|----------|---------|
| `cRevenusAnnuels` | Revenus annuels | ☑ | ☑ |
| `cAutresRevenusFonciers` | Autres revenus fonciers | ☐ | ☐ |

#### Champ TMI (Enum)

- **Name:** `cTMI`
- **Type:** Enum
- **Label:** TMI
- **Required:** ☑
- **Indexed:** ☑
- **Options:**
  - `0` → 0%
  - `11` → 11%
  - `30` → 30%
  - `41` → 41%
  - `45` → 45%

#### Champ Parts fiscales

- **Name:** `cPartsFiscales`
- **Type:** Float
- **Label:** Parts fiscales

#### Champ Niveau de loyer (Enum)

- **Name:** `cNiveauLoyer`
- **Type:** Enum
- **Label:** Niveau de loyer
- **Required:** ☑
- **Indexed:** ☑
- **Options:**
  - `intermediaire` → Intermédiaire
  - `social` → Social
  - `tres_social` → Très social

#### Champs Inputs Location

| Name | Type | Label |
|------|------|-------|
| `cSurfaceLogement` | Integer | Surface (m²) |
| `cChargesCopro` | Currency | Charges copro (€/mois) |
| `cTaxeFonciere` | Currency | Taxe foncière (€/an) |
| `cFraisGestion` | Float | Frais gestion (%) |

#### Champs Outputs Résultats (Currency)

| Name | Label | Indexed |
|------|-------|---------|
| `cLoyerMensuelEstime` | Loyer mensuel estimé | ☑ |
| `cAmortissementAnnuel` | Amortissement annuel | ☐ |
| `cEconomieImpotAnnuelle` | Économie impôt annuelle | ☑ |
| `cEconomieImpotTotale` | Économie impôt totale (9 ans) | ☑ |
| `cCashFlowMensuel` | Cash-flow mensuel | ☑ |
| `cDeficitFoncier` | Déficit foncier | ☐ |

#### Champs Rendements (Float)

| Name | Label | Indexed |
|------|-------|---------|
| `cRendementBrut` | Rendement brut (%) | ☑ |
| `cRendementNet` | Rendement net (%) | ☑ |

#### Champs Meta

| Name | Type | Label | Indexed |
|------|------|-------|---------|
| `cPdfGenere` | Boolean | PDF généré | ☑ |
| `cPdfUrl` | Url | URL du PDF | ☐ |
| `cPartage` | Boolean | Simulation partagée | ☑ |
| `cLienPartage` | Varchar | Lien de partage | ☐ |

---

## 🎯 Étape 5: Tester avec le script

### 5.1 Quick setup (3 villes de test)

```bash
cd /root/simulateur_loi_Jeanbrun
./scripts/espocrm-setup.sh quick-setup
```

Cela créera automatiquement:
- Lyon (Zone A)
- Paris (Zone A bis)
- Bordeaux (Zone A)

### 5.2 Vérifier les données

```bash
./scripts/espocrm-setup.sh list-villes
./scripts/espocrm-setup.sh stats
```

### 5.3 Créer un programme de test

```bash
# Récupérer l'ID de Lyon depuis la liste
LYON_ID="<id_de_lyon>"

# Créer un programme
./scripts/espocrm-setup.sh create-programme $LYON_ID
```

### 5.4 Créer une simulation de test

```bash
LYON_ID="<id_de_lyon>"
PROGRAMME_ID="<id_du_programme>"

./scripts/espocrm-setup.sh create-simulation $LYON_ID $PROGRAMME_ID
```

---

## ✅ Checklist finale

Vérifier que tout est en place:

- [ ] Entité `cVille` créée avec tous les champs
- [ ] Entité `cProgramme` créée avec relation vers cVille
- [ ] Entité `cAgence` créée avec relation vers cVille
- [ ] Entité `cSimulation` créée avec relations vers cVille, cProgramme, User
- [ ] Layouts configurés (List, Detail, Edit)
- [ ] Formules Before Save ajoutées (optionnel)
- [ ] Permissions configurées (Administration → Roles)
- [ ] 3 villes de test créées (quick-setup)
- [ ] 1 programme de test créé
- [ ] 1 simulation de test créée
- [ ] API testée avec succès (`./scripts/espocrm-setup.sh test`)

---

## 🚀 Prochaines étapes

Une fois le schéma installé:

1. **Import données villes (50 villes prioritaires)**
   - Créer un CSV avec les données DVF/INSEE
   - Import via Administration → Import

2. **Connexion API agrégateur programmes**
   - Configurer le workflow n8n de sync quotidien
   - Tester l'import d'un programme réel

3. **Scrapping agences**
   - Lancer le workflow n8n de scrapping Google Places
   - Vérifier la déduplication

4. **Intégration frontend Next.js**
   - Créer les endpoints API dans `/api/espocrm/`
   - Tester les requêtes depuis le simulateur

---

## 📚 Documentation

- [Schéma complet EspoCRM](./ESPOCRM-SCHEMA.md)
- [PRD Simulateur Loi Jeanbrun](../PRD_Simulateur_Loi_Jeanbrun.md)
- [EspoCRM Entity Manager Docs](https://docs.espocrm.com/administration/entity-manager/)

---

**Temps total estimé:** 30-45 minutes
**Niveau:** Intermédiaire

Pour toute question, consulter `/root/simulateur_loi_Jeanbrun/docs/ESPOCRM-SCHEMA.md`
