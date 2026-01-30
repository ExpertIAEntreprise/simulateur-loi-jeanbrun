# Formules de Calcul - Simulateur Loi Jeanbrun

**Version :** 1.0  
**Date :** 30 janvier 2026  
**Statut :** PLF 2026 en cours d'adoption (49.3 engagÃ©)

---

## Table des matiÃ¨res

1. [Dispositif Jeanbrun (PLF 2026)](#1-dispositif-jeanbrun-plf-2026)
2. [LMNP - Location MeublÃ©e Non Professionnelle](#2-lmnp---location-meublÃ©e-non-professionnelle)
3. [LMP - Location MeublÃ©e Professionnelle](#3-lmp---location-meublÃ©e-professionnelle)
4. [DÃ©ficit Foncier - Location Nue](#4-dÃ©ficit-foncier---location-nue)
5. [ImpÃ´t sur le Revenu 2026](#5-impÃ´t-sur-le-revenu-2026)
6. [Plus-Value ImmobiliÃ¨re](#6-plus-value-immobiliÃ¨re)
7. [PrÃ©lÃ¨vements Sociaux](#7-prÃ©lÃ¨vements-sociaux)
8. [Financement](#8-financement)
9. [Rendements et Indicateurs](#9-rendements-et-indicateurs)
10. [Sources et RÃ©fÃ©rences](#10-sources-et-rÃ©fÃ©rences)

---

## 1. Dispositif Jeanbrun (PLF 2026)

### 1.1 CaractÃ©ristiques gÃ©nÃ©rales

| ParamÃ¨tre | Valeur |
|-----------|--------|
| DurÃ©e d'engagement | **9 ans minimum** |
| Zonage | **Aucun** (toute la France) |
| Type de location | RÃ©sidence principale du locataire |
| PÃ©riode d'application | 01/01/2026 au 31/12/2028 |
| Type de bien | Logements collectifs uniquement (maisons exclues) |
| Base d'amortissement | **80% de la valeur du bien** (terrain exclu) |

### 1.2 Immobilier NEUF

#### Taux d'amortissement annuel

| Niveau de loyer | Taux | Plafond annuel |
|-----------------|------|----------------|
| IntermÃ©diaire | **3,5%** | 8 000 â‚¬ |
| Social | **4,5%** | 10 000 â‚¬ |
| TrÃ¨s social | **5,5%** | 12 000 â‚¬ |

#### Formules de calcul

```javascript
// ============================================
// CALCUL AMORTISSEMENT JEANBRUN - NEUF
// ============================================

function calculAmortissementJeanbrunNeuf(prixAcquisition, niveauLoyer) {
    // Base d'amortissement = 80% du prix (hors terrain)
    const baseAmortissement = prixAcquisition * 0.80;
    
    // DÃ©finition des paramÃ¨tres selon niveau de loyer
    const parametres = {
        'intermediaire': { taux: 0.035, plafond: 8000 },
        'social':        { taux: 0.045, plafond: 10000 },
        'tres_social':   { taux: 0.055, plafond: 12000 }
    };
    
    const { taux, plafond } = parametres[niveauLoyer];
    
    // Calcul de l'amortissement brut
    const amortissementBrut = baseAmortissement * taux;
    
    // Application du plafond
    const amortissementNet = Math.min(amortissementBrut, plafond);
    
    return {
        baseAmortissement,
        amortissementBrut,
        amortissementNet,
        plafondApplique: amortissementBrut > plafond
    };
}

// Exemple : Bien Ã  250 000â‚¬, loyer intermÃ©diaire
// Base = 250 000 Ã— 0.80 = 200 000â‚¬
// Amortissement brut = 200 000 Ã— 3,5% = 7 000â‚¬
// Amortissement net = MIN(7 000, 8 000) = 7 000â‚¬
```

### 1.3 Immobilier ANCIEN

#### Conditions d'Ã©ligibilitÃ©

- Travaux â‰¥ **30% du prix d'achat**
- DPE final : **classe A ou B** aprÃ¨s travaux
- Norme RE2020 ou Ã©quivalent aprÃ¨s rÃ©novation

#### Taux d'amortissement annuel

| Niveau de loyer | Taux | Plafond annuel |
|-----------------|------|----------------|
| IntermÃ©diaire | **3,0%** | 10 700 â‚¬ |
| Social | **3,5%** | 10 700 â‚¬ |
| TrÃ¨s social | **4,0%** | 10 700 â‚¬ |

> **Note :** Plafond unique de 10 700â‚¬/an pour l'ancien (contrairement au neuf)

#### Formules de calcul

```javascript
// ============================================
// CALCUL AMORTISSEMENT JEANBRUN - ANCIEN
// ============================================

function calculAmortissementJeanbrunAncien(prixAchat, montantTravaux, niveauLoyer) {
    // VÃ©rification Ã©ligibilitÃ© : travaux â‰¥ 30% du prix
    const seuilTravaux = prixAchat * 0.30;
    const eligible = montantTravaux >= seuilTravaux;
    
    if (!eligible) {
        return { eligible: false, message: "Travaux insuffisants (< 30% du prix)" };
    }
    
    // Base d'amortissement = 80% du prix total (achat + travaux)
    const prixTotal = prixAchat + montantTravaux;
    const baseAmortissement = prixTotal * 0.80;
    
    // DÃ©finition des taux selon niveau de loyer
    const tauxParNiveau = {
        'intermediaire': 0.030,
        'social':        0.035,
        'tres_social':   0.040
    };
    
    const PLAFOND_ANCIEN = 10700; // Plafond unique pour l'ancien
    
    const taux = tauxParNiveau[niveauLoyer];
    const amortissementBrut = baseAmortissement * taux;
    const amortissementNet = Math.min(amortissementBrut, PLAFOND_ANCIEN);
    
    return {
        eligible: true,
        seuilTravauxRequis: seuilTravaux,
        prixTotal,
        baseAmortissement,
        amortissementBrut,
        amortissementNet,
        plafondApplique: amortissementBrut > PLAFOND_ANCIEN
    };
}
```

### 1.4 DÃ©ficit Foncier BonifiÃ©

```javascript
// ============================================
// DÃ‰FICIT FONCIER BONIFIÃ‰ JEANBRUN
// ============================================

const PLAFOND_DEFICIT_STANDARD = 10700;  // Plafond de droit commun
const PLAFOND_DEFICIT_BONIFIE = 21400;   // Plafond bonifiÃ© jusqu'au 31/12/2027

function calculDeficitFoncierJeanbrun(loyersPercus, chargesDeductibles, interetsEmprunt, dateApplication) {
    // Le plafond bonifiÃ© s'applique jusqu'au 31/12/2027
    const dateLimite = new Date('2027-12-31');
    const plafondApplicable = dateApplication <= dateLimite 
        ? PLAFOND_DEFICIT_BONIFIE 
        : PLAFOND_DEFICIT_STANDARD;
    
    // Calcul du revenu foncier net
    const revenuFoncierBrut = loyersPercus - chargesDeductibles;
    
    // Si revenu positif, pas de dÃ©ficit
    if (revenuFoncierBrut >= 0) {
        return {
            deficitTotal: 0,
            imputationRevenuGlobal: 0,
            reportRevenusFonciers: 0
        };
    }
    
    const deficitTotal = Math.abs(revenuFoncierBrut);
    
    // DÃ©ficit hors intÃ©rÃªts d'emprunt imputable sur revenu global
    const deficitHorsInterets = Math.abs(loyersPercus - (chargesDeductibles - interetsEmprunt));
    const imputationRevenuGlobal = Math.min(deficitHorsInterets, plafondApplicable);
    
    // Le reste est reportable sur les revenus fonciers (10 ans)
    const reportRevenusFonciers = deficitTotal - imputationRevenuGlobal;
    
    return {
        deficitTotal,
        plafondApplicable,
        imputationRevenuGlobal,
        reportRevenusFonciers,
        dureeReport: 10 // annÃ©es
    };
}
```

### 1.5 Ã‰conomie d'impÃ´t Jeanbrun

```javascript
// ============================================
// CALCUL Ã‰CONOMIE D'IMPÃ”T JEANBRUN
// ============================================

function calculEconomieImpotJeanbrun(amortissementAnnuel, deficitImputable, tmi) {
    // L'amortissement rÃ©duit le revenu foncier imposable
    // Le dÃ©ficit est imputable sur le revenu global
    
    // Ã‰conomie sur l'amortissement (rÃ©duction du revenu foncier)
    const economieAmortissement = amortissementAnnuel * tmi;
    
    // Ã‰conomie sur le dÃ©ficit foncier (imputation revenu global)
    const economieDeficit = deficitImputable * tmi;
    
    // Ã‰conomie totale annuelle
    const economieTotaleAnnuelle = economieAmortissement + economieDeficit;
    
    // Ã‰conomie sur 9 ans (durÃ©e d'engagement)
    const economieTotale9ans = economieTotaleAnnuelle * 9;
    
    return {
        economieAmortissement,
        economieDeficit,
        economieTotaleAnnuelle,
        economieTotale9ans
    };
}

// Exemple : TMI 30%, amortissement 8000â‚¬, dÃ©ficit 5000â‚¬
// Ã‰conomie amortissement = 8 000 Ã— 30% = 2 400â‚¬
// Ã‰conomie dÃ©ficit = 5 000 Ã— 30% = 1 500â‚¬
// Total annuel = 3 900â‚¬
// Total 9 ans = 35 100â‚¬
```

### 1.6 Plafonds de Loyers Jeanbrun (indicatifs)

> **âš ï¸ Attention :** Les plafonds dÃ©finitifs seront fixÃ©s par dÃ©cret. Valeurs indicatives basÃ©es sur Loc'Avantages.

| Zone | IntermÃ©diaire (â‚¬/mÂ²) | Social (â‚¬/mÂ²) | TrÃ¨s social (â‚¬/mÂ²) |
|------|---------------------|---------------|-------------------|
| A bis | 18,89 | 15,11 | 12,09 |
| A | 14,03 | 11,22 | 8,98 |
| B1 | 11,31 | 9,05 | 7,24 |
| B2 | 9,83 | 7,86 | 6,29 |
| C | 9,83 | 7,86 | 6,29 |

```javascript
// ============================================
// PLAFONDS DE LOYERS JEANBRUN (indicatifs)
// ============================================

const PLAFONDS_LOYERS_M2 = {
    'A_bis': { intermediaire: 18.89, social: 15.11, tres_social: 12.09 },
    'A':     { intermediaire: 14.03, social: 11.22, tres_social: 8.98 },
    'B1':    { intermediaire: 11.31, social: 9.05,  tres_social: 7.24 },
    'B2':    { intermediaire: 9.83,  social: 7.86,  tres_social: 6.29 },
    'C':     { intermediaire: 9.83,  social: 7.86,  tres_social: 6.29 }
};

function calculLoyerMaximal(zone, niveauLoyer, surface) {
    const plafondM2 = PLAFONDS_LOYERS_M2[zone][niveauLoyer];
    
    // Coefficient de surface (pondÃ©ration pour petites surfaces)
    // Formule Loc'Avantages : coef = 0.7 + 19/surface (plafonnÃ© Ã  1.2)
    const coeffSurface = Math.min(0.7 + (19 / surface), 1.2);
    
    const loyerMaxMensuel = plafondM2 * surface * coeffSurface;
    
    return {
        plafondM2,
        coeffSurface,
        loyerMaxMensuel: Math.round(loyerMaxMensuel * 100) / 100,
        loyerMaxAnnuel: Math.round(loyerMaxMensuel * 12 * 100) / 100
    };
}
```

---

## 2. LMNP - Location MeublÃ©e Non Professionnelle

### 2.1 RÃ©gime Micro-BIC

#### Seuils et abattements (depuis 2025/2026)

| Type de location | Plafond recettes | Abattement |
|------------------|------------------|------------|
| **Longue durÃ©e** (rÃ©sidence principale) | 77 700 â‚¬ | **50%** |
| **Tourisme classÃ©** | 77 700 â‚¬ | **50%** |
| **Tourisme non classÃ©** | **15 000 â‚¬** | **30%** |
| **Chambres d'hÃ´tes** | 77 700 â‚¬ | 71% |

> **âš ï¸ RÃ©forme 2025-2026 (Loi Le Meur)** : Les meublÃ©s de tourisme non classÃ©s voient leur plafond rÃ©duit de 77 700â‚¬ Ã  15 000â‚¬ et l'abattement passer de 50% Ã  30%.

```javascript
// ============================================
// CALCUL MICRO-BIC LMNP
// ============================================

function calculMicroBicLMNP(recettesAnnuelles, typeLocation) {
    const regimes = {
        'longue_duree':      { plafond: 77700, abattement: 0.50 },
        'tourisme_classe':   { plafond: 77700, abattement: 0.50 },
        'tourisme_non_classe': { plafond: 15000, abattement: 0.30 },
        'chambres_hotes':    { plafond: 77700, abattement: 0.71 }
    };
    
    const regime = regimes[typeLocation];
    
    // VÃ©rification Ã©ligibilitÃ© micro-BIC
    if (recettesAnnuelles > regime.plafond) {
        return {
            eligible: false,
            message: `Recettes > ${regime.plafond}â‚¬ : passage obligatoire au rÃ©gime rÃ©el`
        };
    }
    
    // Calcul du bÃ©nÃ©fice imposable
    const abattementMontant = recettesAnnuelles * regime.abattement;
    const beneficeImposable = recettesAnnuelles - abattementMontant;
    
    return {
        eligible: true,
        recettes: recettesAnnuelles,
        abattementTaux: regime.abattement,
        abattementMontant,
        beneficeImposable
    };
}
```

### 2.2 RÃ©gime RÃ©el - Amortissement par Composants

```javascript
// ============================================
// AMORTISSEMENT LMNP - RÃ‰GIME RÃ‰EL
// ============================================

const COMPOSANTS_AMORTISSEMENT = {
    'terrain':        { taux: 0,      duree: null }, // Non amortissable
    'gros_oeuvre':    { taux: 0.025,  duree: 40 },   // 2,5% sur 40 ans
    'facade':         { taux: 0.04,   duree: 25 },   // 4% sur 25 ans
    'equipements':    { taux: 0.0667, duree: 15 },   // 6,67% sur 15 ans
    'agencements':    { taux: 0.05,   duree: 20 },   // 5% sur 20 ans
    'mobilier':       { taux: 0.1429, duree: 7 },    // 14,29% sur 7 ans
    'electromenager': { taux: 0.20,   duree: 5 }     // 20% sur 5 ans
};

// RÃ©partition type d'un bien immobilier
const REPARTITION_TYPE = {
    terrain: 0.15,      // 15% - Non amortissable
    gros_oeuvre: 0.50,  // 50%
    facade: 0.10,       // 10%
    equipements: 0.10,  // 10%
    agencements: 0.10,  // 10%
    mobilier: 0.05      // 5% (ou valeur rÃ©elle du mobilier)
};

function calculAmortissementLMNP(prixAcquisition, fraisNotaire, montantMobilier, repartition = REPARTITION_TYPE) {
    const prixTotal = prixAcquisition + fraisNotaire;
    let amortissementAnnuelTotal = 0;
    const details = {};
    
    for (const [composant, pourcentage] of Object.entries(repartition)) {
        if (composant === 'terrain') continue; // Terrain non amortissable
        
        const valeurComposant = prixTotal * pourcentage;
        const tauxAmortissement = COMPOSANTS_AMORTISSEMENT[composant]?.taux || 0;
        const amortissementAnnuel = valeurComposant * tauxAmortissement;
        
        details[composant] = {
            valeur: valeurComposant,
            taux: tauxAmortissement,
            amortissementAnnuel
        };
        
        amortissementAnnuelTotal += amortissementAnnuel;
    }
    
    // Ajout mobilier sÃ©parÃ© si fourni
    if (montantMobilier > 0) {
        const amortMobilier = montantMobilier * 0.1429; // 7 ans
        details.mobilier_reel = {
            valeur: montantMobilier,
            taux: 0.1429,
            amortissementAnnuel: amortMobilier
        };
        amortissementAnnuelTotal += amortMobilier;
    }
    
    return {
        prixTotal,
        terrainNonAmortissable: prixTotal * repartition.terrain,
        baseAmortissable: prixTotal * (1 - repartition.terrain),
        amortissementAnnuelTotal,
        details
    };
}
```

### 2.3 RÃ©intÃ©gration des Amortissements (RÃ©forme 2025)

> **âš ï¸ IMPORTANT** : Depuis le 01/01/2025, les amortissements dÃ©duits sont rÃ©intÃ©grÃ©s dans le calcul de la plus-value Ã  la revente.
> **Exception** : Les rÃ©sidences services (Ã©tudiantes, seniors, EHPAD) sont exemptÃ©es.

```javascript
// ============================================
// PLUS-VALUE LMNP AVEC RÃ‰INTÃ‰GRATION
// ============================================

function calculPlusValueLMNP(prixAchat, prixVente, amortissementsCumules, dureeDetention, residenceServices = false) {
    // Plus-value brute classique
    const plusValueBrute = prixVente - prixAchat;
    
    // RÃ©intÃ©gration des amortissements (sauf rÃ©sidences services)
    let amortissementsReintegres = 0;
    if (!residenceServices && dureeDetention < 22) {
        // Les amortissements augmentent la base imposable
        amortissementsReintegres = amortissementsCumules;
    }
    
    // Plus-value imposable = PV brute + amortissements rÃ©intÃ©grÃ©s
    const plusValueAvantAbattement = plusValueBrute + amortissementsReintegres;
    
    // Application des abattements pour durÃ©e de dÃ©tention
    const abattementIR = calculAbattementDureeDetentionIR(dureeDetention);
    const abattementPS = calculAbattementDureeDetentionPS(dureeDetention);
    
    const plusValueImposableIR = plusValueAvantAbattement * (1 - abattementIR);
    const plusValueImposablePS = plusValueAvantAbattement * (1 - abattementPS);
    
    // Taux LMNP : 19% IR + 17,2% PS
    const tauxPS = 0.172;
    
    const impotIR = plusValueImposableIR * 0.19;
    const impotPS = plusValueImposablePS * tauxPS;
    
    return {
        plusValueBrute,
        amortissementsReintegres,
        plusValueAvantAbattement,
        abattementIR,
        abattementPS,
        plusValueImposableIR,
        plusValueImposablePS,
        impotIR,
        impotPS,
        impotTotal: impotIR + impotPS
    };
}
```

### 2.4 DÃ©ficit BIC LMNP

```javascript
// ============================================
// DÃ‰FICIT BIC LMNP
// ============================================

function calculDeficitBicLMNP(recettes, charges, amortissements) {
    // RÃ©sultat BIC = Recettes - Charges - Amortissements
    const resultatBIC = recettes - charges - amortissements;
    
    if (resultatBIC >= 0) {
        return {
            benefice: resultatBIC,
            deficit: 0,
            report: 0
        };
    }
    
    const deficit = Math.abs(resultatBIC);
    
    // âš ï¸ Le dÃ©ficit LMNP n'est PAS imputable sur le revenu global
    // Il est reportable uniquement sur les bÃ©nÃ©fices BIC futurs pendant 10 ans
    
    return {
        benefice: 0,
        deficit,
        imputationRevenuGlobal: 0, // Toujours 0 en LMNP
        reportBICFutur: deficit,
        dureeReport: 10 // annÃ©es
    };
}
```

---

## 3. LMP - Location MeublÃ©e Professionnelle

### 3.1 Conditions d'accÃ¨s au statut LMP

```javascript
// ============================================
// VÃ‰RIFICATION STATUT LMP
// ============================================

function verifierStatutLMP(recettesLocationMeublee, revenusProfessionnels, revenusGlobalFoyer) {
    // Condition 1 : Recettes > 23 000â‚¬
    const condition1 = recettesLocationMeublee > 23000;
    
    // Condition 2 : Recettes > revenus d'activitÃ© professionnelle
    // (salaires, BIC, BNC, BA du foyer fiscal)
    const condition2 = recettesLocationMeublee > revenusProfessionnels;
    
    // Les DEUX conditions doivent Ãªtre remplies
    const estLMP = condition1 && condition2;
    
    return {
        estLMP,
        condition1_recettes: condition1,
        condition2_preponderance: condition2,
        recettes: recettesLocationMeublee,
        seuilRecettes: 23000,
        revenusProfessionnels
    };
}
```

### 3.2 Avantages fiscaux LMP

```javascript
// ============================================
// DÃ‰FICIT LMP (imputable sur revenu global)
// ============================================

function calculDeficitLMP(recettes, charges, amortissements) {
    const resultatBIC = recettes - charges - amortissements;
    
    if (resultatBIC >= 0) {
        return {
            benefice: resultatBIC,
            deficit: 0
        };
    }
    
    const deficit = Math.abs(resultatBIC);
    
    // âœ… Le dÃ©ficit LMP EST imputable sur le revenu global SANS PLAFOND
    return {
        benefice: 0,
        deficit,
        imputationRevenuGlobal: deficit, // IntÃ©gralitÃ© imputable
        reportEventuel: 0,
        dureeReport: 6 // annÃ©es si non imputÃ©
    };
}
```

### 3.3 Plus-Value LMP (rÃ©gime professionnel)

```javascript
// ============================================
// PLUS-VALUE LMP (rÃ©gime professionnel)
// ============================================

function calculPlusValueLMP(prixAchat, prixVente, amortissementsCumules, dureeActivite, recettesMoyennes) {
    // Plus-value Ã  court terme = amortissements dÃ©duits
    const pvCourtTerme = amortissementsCumules;
    
    // Plus-value Ã  long terme = PV brute - PV court terme
    const pvBrute = prixVente - prixAchat;
    const pvLongTerme = Math.max(0, pvBrute - pvCourtTerme);
    
    // ExonÃ©ration possible si activitÃ© > 5 ans ET recettes < seuils
    let exonerationPossible = false;
    let tauxExoneration = 0;
    
    if (dureeActivite >= 5) {
        if (recettesMoyennes <= 90000) {
            // ExonÃ©ration totale
            exonerationPossible = true;
            tauxExoneration = 1;
        } else if (recettesMoyennes <= 126000) {
            // ExonÃ©ration partielle dÃ©gressive
            exonerationPossible = true;
            tauxExoneration = (126000 - recettesMoyennes) / 36000;
        }
    }
    
    // PV court terme = imposÃ©e au barÃ¨me IR + PS
    // PV long terme = 12,8% + 17,2% PS = 30% (ou exonÃ©rÃ©e)
    
    const pvCourtTermeImposable = pvCourtTerme;
    const pvLongTermeImposable = pvLongTerme * (1 - tauxExoneration);
    
    return {
        pvBrute,
        pvCourtTerme,
        pvLongTerme,
        exonerationPossible,
        tauxExoneration,
        pvCourtTermeImposable,
        pvLongTermeImposable,
        regimeFiscal: 'professionnel'
    };
}
```

---

## 4. DÃ©ficit Foncier - Location Nue

### 4.1 RÃ©gime Micro-Foncier

```javascript
// ============================================
// RÃ‰GIME MICRO-FONCIER
// ============================================

const PLAFOND_MICRO_FONCIER = 15000;
const ABATTEMENT_MICRO_FONCIER = 0.30;

function calculMicroFoncier(loyersBrutsAnnuels) {
    if (loyersBrutsAnnuels > PLAFOND_MICRO_FONCIER) {
        return {
            eligible: false,
            message: `Loyers > ${PLAFOND_MICRO_FONCIER}â‚¬ : micro-foncier non applicable`
        };
    }
    
    const abattement = loyersBrutsAnnuels * ABATTEMENT_MICRO_FONCIER;
    const revenuFoncierImposable = loyersBrutsAnnuels - abattement;
    
    return {
        eligible: true,
        loyersBruts: loyersBrutsAnnuels,
        abattement,
        revenuFoncierImposable
    };
}
```

### 4.2 RÃ©gime RÃ©el - DÃ©ficit Foncier

```javascript
// ============================================
// DÃ‰FICIT FONCIER - RÃ‰GIME RÃ‰EL
// ============================================

const PLAFOND_DEFICIT_FONCIER = 10700;
const PLAFOND_DEFICIT_BONIFIE = 21400; // Jusqu'au 31/12/2027 pour rÃ©novation Ã©nergÃ©tique

function calculDeficitFoncierReel(loyers, chargesDeductibles, interetsEmprunt, travauxRenovationEnergetique = false, annee = 2026) {
    // Charges dÃ©ductibles en location nue :
    // - Frais de gestion (20â‚¬ par local ou frais rÃ©els)
    // - Primes d'assurance
    // - DÃ©penses d'entretien et rÃ©paration
    // - Charges de copropriÃ©tÃ© non rÃ©cupÃ©rables
    // - Taxe fonciÃ¨re
    // - IntÃ©rÃªts d'emprunt
    // - Travaux d'amÃ©lioration
    
    const revenuFoncierBrut = loyers - chargesDeductibles;
    
    if (revenuFoncierBrut >= 0) {
        return {
            revenuFoncierNet: revenuFoncierBrut,
            deficitTotal: 0,
            imputationRevenuGlobal: 0,
            reportRevenusFonciers: 0
        };
    }
    
    const deficitTotal = Math.abs(revenuFoncierBrut);
    
    // Le dÃ©ficit liÃ© aux intÃ©rÃªts d'emprunt ne peut PAS Ãªtre imputÃ© sur le revenu global
    const deficitHorsInterets = Math.max(0, deficitTotal - interetsEmprunt);
    
    // Plafond applicable (bonifiÃ© jusqu'en 2027 pour rÃ©novation Ã©nergÃ©tique)
    const plafond = (travauxRenovationEnergetique && annee <= 2027) 
        ? PLAFOND_DEFICIT_BONIFIE 
        : PLAFOND_DEFICIT_FONCIER;
    
    const imputationRevenuGlobal = Math.min(deficitHorsInterets, plafond);
    const reportRevenusFonciers = deficitTotal - imputationRevenuGlobal;
    
    return {
        revenuFoncierNet: 0,
        deficitTotal,
        deficitHorsInterets,
        plafondApplicable: plafond,
        imputationRevenuGlobal,
        reportRevenusFonciers,
        dureeReport: 10 // annÃ©es
    };
}
```

---

## 5. ImpÃ´t sur le Revenu 2026

### 5.1 BarÃ¨me progressif (revenus 2025)

> **Note :** Le barÃ¨me 2026 est partiellement gelÃ©. Seule la 1Ã¨re tranche est revalorisÃ©e de 1%.

| Tranche | Revenus (par part) | Taux |
|---------|-------------------|------|
| 1 | 0 â‚¬ Ã  11 612 â‚¬ | **0%** |
| 2 | 11 613 â‚¬ Ã  29 315 â‚¬ | **11%** |
| 3 | 29 316 â‚¬ Ã  83 823 â‚¬ | **30%** |
| 4 | 83 824 â‚¬ Ã  180 294 â‚¬ | **41%** |
| 5 | Au-delÃ  de 180 294 â‚¬ | **45%** |

```javascript
// ============================================
// CALCUL IMPÃ”T SUR LE REVENU 2026
// ============================================

const BAREME_IR_2026 = [
    { min: 0,      max: 11612,  taux: 0.00 },
    { min: 11613,  max: 29315,  taux: 0.11 },
    { min: 29316,  max: 83823,  taux: 0.30 },
    { min: 83824,  max: 180294, taux: 0.41 },
    { min: 180295, max: Infinity, taux: 0.45 }
];

function calculImpotRevenu(revenuNetImposable, nombreParts) {
    // Calcul du quotient familial
    const quotientFamilial = revenuNetImposable / nombreParts;
    
    // Calcul de l'impÃ´t par tranche
    let impotParPart = 0;
    let tmi = 0;
    
    for (const tranche of BAREME_IR_2026) {
        if (quotientFamilial > tranche.min) {
            const montantDansTranche = Math.min(quotientFamilial, tranche.max) - tranche.min;
            impotParPart += montantDansTranche * tranche.taux;
            if (quotientFamilial >= tranche.min) {
                tmi = tranche.taux;
            }
        }
    }
    
    // ImpÃ´t brut = impÃ´t par part Ã— nombre de parts
    let impotBrut = impotParPart * nombreParts;
    
    // Application du plafonnement du quotient familial
    const plafonnement = calculPlafonnementQF(revenuNetImposable, nombreParts, impotBrut);
    impotBrut = plafonnement.impotApresPlafonnement;
    
    // Application de la dÃ©cote
    const decote = calculDecote(impotBrut, nombreParts);
    const impotApresDecote = Math.max(0, impotBrut - decote);
    
    return {
        quotientFamilial,
        tmi,
        impotParPart,
        impotBrut,
        plafonnementApplique: plafonnement.plafonnementApplique,
        decote,
        impotNet: impotApresDecote
    };
}
```

### 5.2 Plafonnement du Quotient Familial

```javascript
// ============================================
// PLAFONNEMENT DU QUOTIENT FAMILIAL
// ============================================

const PLAFOND_DEMI_PART_2026 = 1791; // â‚¬ par demi-part supplÃ©mentaire
const PLAFOND_QUART_PART_2026 = 896; // â‚¬ par quart de part

function calculPlafonnementQF(revenuNetImposable, nombreParts, impotAvantPlafonnement) {
    // Nombre de parts de base (cÃ©libataire = 1, couple = 2)
    const partsBase = nombreParts >= 2 ? 2 : 1;
    const demiPartsSup = (nombreParts - partsBase) * 2; // En demi-parts
    
    // Calcul de l'impÃ´t avec les seules parts de base
    const impotSansEnfants = calculImpotSansEnfants(revenuNetImposable, partsBase);
    
    // Avantage maximal = plafond Ã— nombre de demi-parts sup
    const avantageMaximal = demiPartsSup * PLAFOND_DEMI_PART_2026;
    
    // L'avantage rÃ©el ne peut excÃ©der l'avantage maximal
    const avantageReel = impotSansEnfants - impotAvantPlafonnement;
    
    if (avantageReel > avantageMaximal) {
        const impotApresPlafonnement = impotSansEnfants - avantageMaximal;
        return {
            plafonnementApplique: true,
            avantageReel,
            avantageMaximal,
            supplement: avantageReel - avantageMaximal,
            impotApresPlafonnement
        };
    }
    
    return {
        plafonnementApplique: false,
        impotApresPlafonnement: impotAvantPlafonnement
    };
}

function calculImpotSansEnfants(revenuNetImposable, partsBase) {
    const quotient = revenuNetImposable / partsBase;
    let impot = 0;
    
    for (const tranche of BAREME_IR_2026) {
        if (quotient > tranche.min) {
            const montant = Math.min(quotient, tranche.max) - tranche.min;
            impot += montant * tranche.taux;
        }
    }
    
    return impot * partsBase;
}
```

### 5.3 DÃ©cote

```javascript
// ============================================
// DÃ‰COTE 2026
// ============================================

const DECOTE_2026 = {
    celibataire: { seuil: 1964, montantBase: 889 },
    couple:      { seuil: 3249, montantBase: 1470 }
};

function calculDecote(impotBrut, nombreParts) {
    const regime = nombreParts >= 2 ? 'couple' : 'celibataire';
    const { seuil, montantBase } = DECOTE_2026[regime];
    
    // La dÃ©cote s'applique si l'impÃ´t brut < seuil
    if (impotBrut >= seuil) {
        return 0;
    }
    
    // Formule : dÃ©cote = montantBase - (impÃ´t Ã— 45,25%)
    const decote = montantBase - (impotBrut * 0.4525);
    
    // La dÃ©cote ne peut pas Ãªtre nÃ©gative ni supÃ©rieure Ã  l'impÃ´t
    return Math.max(0, Math.min(decote, impotBrut));
}
```

### 5.4 DÃ©termination du TMI

```javascript
// ============================================
// DÃ‰TERMINATION DU TMI
// ============================================

function determinerTMI(revenuNetImposable, nombreParts) {
    const quotientFamilial = revenuNetImposable / nombreParts;
    
    for (let i = BAREME_IR_2026.length - 1; i >= 0; i--) {
        if (quotientFamilial > BAREME_IR_2026[i].min) {
            return {
                tmi: BAREME_IR_2026[i].taux,
                tranche: i + 1,
                quotientFamilial
            };
        }
    }
    
    return { tmi: 0, tranche: 1, quotientFamilial };
}
```

---

## 6. Plus-Value ImmobiliÃ¨re

### 6.1 Calcul de la plus-value brute

```javascript
// ============================================
// CALCUL PLUS-VALUE BRUTE
// ============================================

function calculPlusValueBrute(prixVente, prixAchat, fraisAcquisition, travaux, fraisVente) {
    // Prix d'acquisition majorÃ©
    // Option 1 : Frais rÃ©els (si > forfait 7,5%)
    // Option 2 : Forfait 7,5% du prix d'achat
    const forfaitFrais = prixAchat * 0.075;
    const fraisRetenus = Math.max(forfaitFrais, fraisAcquisition);
    
    // Travaux (si > 5 ans de dÃ©tention)
    // Option 1 : Forfait 15% du prix d'achat (si dÃ©tention > 5 ans)
    // Option 2 : Frais rÃ©els avec justificatifs
    
    const prixAcquisitionMajore = prixAchat + fraisRetenus + travaux;
    
    // Prix de cession diminuÃ© des frais de vente
    const prixCessionNet = prixVente - fraisVente;
    
    const plusValueBrute = prixCessionNet - prixAcquisitionMajore;
    
    return {
        prixAchat,
        fraisAcquisition: fraisRetenus,
        travaux,
        prixAcquisitionMajore,
        prixVente,
        fraisVente,
        prixCessionNet,
        plusValueBrute: Math.max(0, plusValueBrute)
    };
}
```

### 6.2 Abattements pour durÃ©e de dÃ©tention

#### ImpÃ´t sur le Revenu (IR) - ExonÃ©ration Ã  22 ans (ou 17 ans si rÃ©forme)

```javascript
// ============================================
// ABATTEMENT DURÃ‰E DÃ‰TENTION - IR
// ============================================

// Version actuelle (22 ans) - Peut Ã©voluer vers 17 ans en 2026
function calculAbattementDureeDetentionIR(anneesDetention, reforme17ans = false) {
    if (reforme17ans) {
        // Nouvelle grille si rÃ©forme adoptÃ©e (17 ans)
        if (anneesDetention >= 17) return 1; // 100%
        if (anneesDetention < 6) return 0;
        // Abattement de 8% par an de la 6Ã¨me Ã  la 16Ã¨me annÃ©e
        return Math.min((anneesDetention - 5) * 0.08, 1);
    }
    
    // Grille actuelle (22 ans)
    if (anneesDetention >= 22) return 1; // 100%
    if (anneesDetention < 6) return 0;
    
    // 6% par an de la 6Ã¨me Ã  la 21Ã¨me annÃ©e
    let abattement = (Math.min(anneesDetention, 21) - 5) * 0.06;
    
    // 4% supplÃ©mentaire la 22Ã¨me annÃ©e
    if (anneesDetention >= 22) {
        abattement += 0.04;
    }
    
    return Math.min(abattement, 1);
}
```

#### PrÃ©lÃ¨vements Sociaux (PS) - ExonÃ©ration Ã  30 ans

```javascript
// ============================================
// ABATTEMENT DURÃ‰E DÃ‰TENTION - PS
// ============================================

function calculAbattementDureeDetentionPS(anneesDetention) {
    if (anneesDetention >= 30) return 1; // 100%
    if (anneesDetention < 6) return 0;
    
    let abattement = 0;
    
    // 1,65% par an de la 6Ã¨me Ã  la 21Ã¨me annÃ©e
    if (anneesDetention >= 6) {
        const anneesPhase1 = Math.min(anneesDetention, 21) - 5;
        abattement += anneesPhase1 * 0.0165;
    }
    
    // 1,60% la 22Ã¨me annÃ©e
    if (anneesDetention >= 22) {
        abattement += 0.016;
    }
    
    // 9% par an de la 23Ã¨me Ã  la 30Ã¨me annÃ©e
    if (anneesDetention >= 23) {
        const anneesPhase3 = Math.min(anneesDetention, 30) - 22;
        abattement += anneesPhase3 * 0.09;
    }
    
    return Math.min(abattement, 1);
}
```

### 6.3 Calcul de l'impÃ´t sur la plus-value

```javascript
// ============================================
// CALCUL IMPÃ”T PLUS-VALUE IMMOBILIÃˆRE
// ============================================

const TAUX_IR_PV = 0.19;
const TAUX_PS_PV = 0.172;

function calculImpotPlusValue(plusValueBrute, anneesDetention, reforme17ans = false, tauxPS = 0.172) {
    // Calcul des abattements
    const abattementIR = calculAbattementDureeDetentionIR(anneesDetention, reforme17ans);
    const abattementPS = calculAbattementDureeDetentionPS(anneesDetention);
    
    // Plus-values imposables aprÃ¨s abattements
    const pvImposableIR = plusValueBrute * (1 - abattementIR);
    const pvImposablePS = plusValueBrute * (1 - abattementPS);
    
    // Calcul des impÃ´ts
    const impotIR = pvImposableIR * TAUX_IR_PV;
    const impotPS = pvImposablePS * tauxPS;
    
    // Surtaxe si PV imposable IR > 50 000â‚¬
    const surtaxe = calculSurtaxePV(pvImposableIR);
    
    const impotTotal = impotIR + impotPS + surtaxe;
    
    return {
        plusValueBrute,
        anneesDetention,
        abattementIR: (abattementIR * 100).toFixed(2) + '%',
        abattementPS: (abattementPS * 100).toFixed(2) + '%',
        pvImposableIR,
        pvImposablePS,
        impotIR,
        impotPS,
        surtaxe,
        impotTotal,
        tauxEffectif: (impotTotal / plusValueBrute * 100).toFixed(2) + '%'
    };
}
```

### 6.4 Surtaxe sur les plus-values Ã©levÃ©es

```javascript
// ============================================
// SURTAXE PLUS-VALUES > 50 000â‚¬
// ============================================

function calculSurtaxePV(pvImposableIR) {
    if (pvImposableIR <= 50000) return 0;
    
    let surtaxe = 0;
    
    if (pvImposableIR > 50000 && pvImposableIR <= 60000) {
        surtaxe = (pvImposableIR - 50000) * 0.02;
    } else if (pvImposableIR > 60000 && pvImposableIR <= 100000) {
        surtaxe = pvImposableIR * 0.02 - 200;
    } else if (pvImposableIR > 100000 && pvImposableIR <= 110000) {
        surtaxe = (pvImposableIR - 100000) * 0.03 + 1800;
    } else if (pvImposableIR > 110000 && pvImposableIR <= 150000) {
        surtaxe = pvImposableIR * 0.03 - 1100;
    } else if (pvImposableIR > 150000 && pvImposableIR <= 160000) {
        surtaxe = (pvImposableIR - 150000) * 0.04 + 3400;
    } else if (pvImposableIR > 160000 && pvImposableIR <= 200000) {
        surtaxe = pvImposableIR * 0.04 - 2800;
    } else if (pvImposableIR > 200000 && pvImposableIR <= 210000) {
        surtaxe = (pvImposableIR - 200000) * 0.05 + 5200;
    } else if (pvImposableIR > 210000 && pvImposableIR <= 250000) {
        surtaxe = pvImposableIR * 0.05 - 5300;
    } else if (pvImposableIR > 250000 && pvImposableIR <= 260000) {
        surtaxe = (pvImposableIR - 250000) * 0.06 + 7200;
    } else if (pvImposableIR > 260000) {
        surtaxe = pvImposableIR * 0.06 - 8400;
    }
    
    return Math.max(0, surtaxe);
}
```

### 6.5 ExonÃ©rations de plus-value

```javascript
// ============================================
// EXONÃ‰RATIONS PLUS-VALUE IMMOBILIÃˆRE
// ============================================

function verifierExonerationPV(typeBien, prixVente, dureeDetention, situationVendeur) {
    const exonerations = [];
    
    // 1. RÃ©sidence principale
    if (typeBien === 'residence_principale') {
        return { exonere: true, motif: 'RÃ©sidence principale' };
    }
    
    // 2. DÃ©tention > 22 ans (IR) / > 30 ans (IR + PS)
    if (dureeDetention >= 30) {
        return { exonere: true, motif: 'DÃ©tention > 30 ans' };
    }
    
    // 3. Prix de cession â‰¤ 15 000â‚¬
    if (prixVente <= 15000) {
        return { exonere: true, motif: 'Prix de cession â‰¤ 15 000â‚¬' };
    }
    
    // 4. PremiÃ¨re cession (sous conditions)
    if (situationVendeur.premiereCession && situationVendeur.remployPrix24mois) {
        return { exonere: true, motif: 'PremiÃ¨re cession avec remploi' };
    }
    
    // 5. Cession Ã  un organisme HLM
    if (situationVendeur.cessionHLM) {
        return { exonere: true, motif: 'Cession Ã  organisme HLM' };
    }
    
    return { exonere: false, exonerationsPartielles: exonerations };
}
```

---

## 7. PrÃ©lÃ¨vements Sociaux

### 7.1 Taux 2026

| Type de revenu | Taux |
|----------------|------|
| Revenus fonciers | **17,2%** |
| Plus-value immobiliÃ¨re (aprÃ¨s abattement) | **17,2%** |
| Plus-values mobiliÃ¨res, dividendes, intÃ©rÃªts | **18,6%** (avec CFA) |
| BIC location meublÃ©e | **17,2%** |

```javascript
// ============================================
// PRÃ‰LÃˆVEMENTS SOCIAUX 2026
// ============================================

const PRELEVEMENTS_SOCIAUX = {
    CSG: 0.092,           // 9,2%
    CRDS: 0.005,          // 0,5%
    PS: 0.045,            // 4,5%
    CASA: 0.003,          // 0,3%
    SOLIDARITE: 0.02,     // 2%
    TOTAL: 0.172          // 17,2%
};

function calculPrelevementsSociaux(montantImposable, typeRevenu) {
    const tauxApplicable = ['dividendes', 'interets', 'pv_mobiliere'].includes(typeRevenu)
        ? 0.186  // Avec CFA
        : 0.172; // Standard
    
    return {
        montantImposable,
        taux: tauxApplicable,
        montantPS: montantImposable * tauxApplicable
    };
}
```

---

## 8. Financement

### 8.1 Calcul de la mensualitÃ© de crÃ©dit

```javascript
// ============================================
// MENSUALITÃ‰ DE CRÃ‰DIT IMMOBILIER
// ============================================

function calculMensualiteCredit(capitalEmprunte, tauxAnnuel, dureeMois) {
    // Formule : M = C Ã— t / (1 - (1 + t)^-n)
    const tauxMensuel = tauxAnnuel / 12;
    
    if (tauxMensuel === 0) {
        return capitalEmprunte / dureeMois;
    }
    
    const mensualite = capitalEmprunte * tauxMensuel / 
        (1 - Math.pow(1 + tauxMensuel, -dureeMois));
    
    return Math.round(mensualite * 100) / 100;
}

// Exemple : 200 000â‚¬ Ã  3% sur 20 ans
// mensualitÃ© = 1 109,20â‚¬
```

### 8.2 Tableau d'amortissement

```javascript
// ============================================
// TABLEAU D'AMORTISSEMENT
// ============================================

function genererTableauAmortissement(capitalEmprunte, tauxAnnuel, dureeMois) {
    const tauxMensuel = tauxAnnuel / 12;
    const mensualite = calculMensualiteCredit(capitalEmprunte, tauxAnnuel, dureeMois);
    
    const tableau = [];
    let capitalRestant = capitalEmprunte;
    let totalInterets = 0;
    
    for (let mois = 1; mois <= dureeMois; mois++) {
        const interets = capitalRestant * tauxMensuel;
        const capital = mensualite - interets;
        capitalRestant -= capital;
        totalInterets += interets;
        
        tableau.push({
            mois,
            mensualite,
            capital: Math.round(capital * 100) / 100,
            interets: Math.round(interets * 100) / 100,
            capitalRestant: Math.max(0, Math.round(capitalRestant * 100) / 100)
        });
    }
    
    return {
        mensualite,
        coutTotalCredit: mensualite * dureeMois,
        totalInterets: Math.round(totalInterets * 100) / 100,
        tableau
    };
}
```

### 8.3 Taux d'endettement

```javascript
// ============================================
// TAUX D'ENDETTEMENT
// ============================================

const SEUIL_ENDETTEMENT_RECOMMANDE = 0.33;
const SEUIL_ENDETTEMENT_MAXIMAL = 0.35;

function calculTauxEndettement(revenus, chargesExistantes, nouvelleMensualite) {
    const chargesApres = chargesExistantes + nouvelleMensualite;
    const tauxEndettement = chargesApres / revenus;
    const resteAVivre = revenus - chargesApres;
    
    return {
        revenus,
        chargesApres,
        tauxEndettement,
        tauxEndettementPourcent: (tauxEndettement * 100).toFixed(2) + '%',
        resteAVivre,
        acceptable: tauxEndettement <= SEUIL_ENDETTEMENT_MAXIMAL,
        recommande: tauxEndettement <= SEUIL_ENDETTEMENT_RECOMMANDE
    };
}
```

### 8.4 CapacitÃ© d'emprunt

```javascript
// ============================================
// CAPACITÃ‰ D'EMPRUNT
// ============================================

function calculCapaciteEmprunt(revenus, chargesExistantes, tauxAnnuel, dureeMois, tauxEndettementCible = 0.33) {
    const mensualiteMax = (revenus * tauxEndettementCible) - chargesExistantes;
    
    if (mensualiteMax <= 0) {
        return { capaciteEmprunt: 0, message: 'Endettement existant trop Ã©levÃ©' };
    }
    
    const tauxMensuel = tauxAnnuel / 12;
    
    let capacite;
    if (tauxMensuel === 0) {
        capacite = mensualiteMax * dureeMois;
    } else {
        capacite = mensualiteMax * (1 - Math.pow(1 + tauxMensuel, -dureeMois)) / tauxMensuel;
    }
    
    return {
        mensualiteMax: Math.round(mensualiteMax * 100) / 100,
        capaciteEmprunt: Math.round(capacite)
    };
}
```

---

## 9. Rendements et Indicateurs

### 9.1 Rendement brut

```javascript
function calculRendementBrut(loyerAnnuel, prixAcquisition) {
    return (loyerAnnuel / prixAcquisition) * 100;
}
// Exemple : 9 600â‚¬ loyers / 200 000â‚¬ = 4,8%
```

### 9.2 Rendement net de charges

```javascript
function calculRendementNet(loyerAnnuel, chargesAnnuelles, prixAcquisition) {
    const loyerNet = loyerAnnuel - chargesAnnuelles;
    return (loyerNet / prixAcquisition) * 100;
}
```

### 9.3 Rendement net-net (aprÃ¨s fiscalitÃ©)

```javascript
function calculRendementNetNet(loyerAnnuel, charges, impots, ps, prixAcquisition) {
    const loyerNetNet = loyerAnnuel - charges - impots - ps;
    return (loyerNetNet / prixAcquisition) * 100;
}
```

### 9.4 Cash-flow mensuel

```javascript
function calculCashFlow(loyerMensuel, mensualiteCredit, assurance, charges, economieImpot = 0) {
    const entrees = loyerMensuel + economieImpot;
    const sorties = mensualiteCredit + assurance + charges;
    return entrees - sorties;
}
```

### 9.5 TRI (Taux de RentabilitÃ© Interne)

```javascript
// ============================================
// TRI - TAUX DE RENTABILITÉ INTERNE
// Méthode Newton-Raphson avec fonction de dérivée
// ============================================

function calculTRI(investissementInitial, fluxAnnuels, valeurRevente) {
    // Construction du vecteur de flux de trésorerie
    // Année 0 : investissement initial (négatif)
    // Années 1 à n : flux annuels (loyers nets, économies d'impôt...)
    // Dernière année : ajout de la valeur de revente
    const flux = [-investissementInitial, ...fluxAnnuels];
    flux[flux.length - 1] += valeurRevente;
    
    /**
     * Calcul de la Valeur Actuelle Nette (VAN)
     * VAN(t) = Σ F_i / (1+t)^i
     * @param {number} taux - Le taux d'actualisation
     * @returns {number} - La VAN calculée
     */
    function VAN(taux) {
        return flux.reduce((acc, f, i) => acc + f / Math.pow(1 + taux, i), 0);
    }
    
    /**
     * Calcul de la dérivée de la VAN par rapport au taux
     * dVAN/dt = Σ -i × F_i / (1+t)^(i+1)
     * Nécessaire pour l'algorithme de Newton-Raphson
     * @param {number} taux - Le taux d'actualisation
     * @returns {number} - La dérivée de la VAN
     */
    function deriveeVAN(taux) {
        return flux.reduce((acc, f, i) => {
            if (i === 0) return acc; // La dérivée du terme i=0 est 0
            return acc - i * f / Math.pow(1 + taux, i + 1);
        }, 0);
    }
    
    // Algorithme de Newton-Raphson pour trouver le TRI
    // Le TRI est le taux t tel que VAN(t) = 0
    let tri = 0.10; // Estimation initiale : 10%
    const maxIterations = 100;
    const tolerance = 0.0001;
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        const van = VAN(tri);
        
        // Convergence atteinte
        if (Math.abs(van) < tolerance) break;
        
        const derivee = deriveeVAN(tri);
        
        // Protection contre la division par zéro
        if (Math.abs(derivee) < 1e-10) {
            console.warn('TRI: Dérivée proche de zéro, arrêt de l\'algorithme');
            break;
        }
        
        // Mise à jour Newton-Raphson : t_n+1 = t_n - f(t_n) / f'(t_n)
        tri = tri - van / derivee;
        
        // Protection contre les valeurs aberrantes
        if (tri < -0.99) tri = -0.99; // Taux minimum -99%
        if (tri > 10) tri = 10;       // Taux maximum 1000%
    }
    
    return Math.round(tri * 10000) / 100; // Résultat en % avec 2 décimales
}

// ============================================
// Exemple d'utilisation
// ============================================
// Investissement : 200 000€
// Flux annuels (loyers nets + économies d'impôt) : 8 000€/an pendant 9 ans
// Revente : 220 000€ (année 9)
//
// calculTRI(200000, [8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000], 220000)
// => Résultat attendu : environ 5.5%
```

---

## 10. Sources et RÃ©fÃ©rences

### Sources officielles

| Source | URL |
|--------|-----|
| **Service Public** | service-public.gouv.fr |
| **Impots.gouv.fr** | impots.gouv.fr |
| **LÃ©gifrance** | legifrance.gouv.fr |
| **AssemblÃ©e Nationale** | assemblee-nationale.fr |

### Sources dispositif Jeanbrun (PLF 2026)

| Source | Date |
|--------|------|
| **Journal de l'Agence** | 28/01/2026 |
| **MySweetImmo** | 24/01/2026 |
| **Selexium** | 26/01/2026 |
| **PAP** | 25/01/2026 |

### Statut du PLF 2026

> **âš ï¸ ATTENTION** : Informations basÃ©es sur le PLF 2026 (49.3 engagÃ©). Ã€ confirmer aprÃ¨s promulgation dÃ©finitive.

**Calendrier :**
- âœ… Vote AssemblÃ©e nationale (49.3) : Janvier 2026
- â³ Examen SÃ©nat : Fin janvier 2026
- ðŸ“… Application : RÃ©troactive au 01/01/2026

### Avertissements

1. **Plafonds loyers Jeanbrun** : FixÃ©s par dÃ©cret (valeurs indicatives)
2. **RÃ©forme plus-value 17 ans** : Non dÃ©finitivement adoptÃ©e
3. **PrÃ©lÃ¨vements sociaux 18,6%** : Ne s'applique pas aux revenus fonciers
4. **LMNP rÃ©intÃ©gration** : Depuis 2025 (hors rÃ©sidences services)
5. **BarÃ¨me IR** : Seule la 1Ã¨re tranche revalorisÃ©e en 2026

---

*Document gÃ©nÃ©rÃ© le 30 janvier 2026*
