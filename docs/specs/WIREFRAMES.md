# 🏠 WIREFRAMES COMPLETS - Simulateur Loi Jeanbrun

**Version:** 2.0  
**Date:** 30 janvier 2026  
**Projet:** Plateforme Simulateur Loi Jeanbrun  
**Changelog v2.0:** Corrections critiques + Améliorations UX/UI suite audit

---

## Table des matières

1. [Vue d'ensemble du parcours](#1-vue-densemble-du-parcours)
2. [Landing Page Simulateur](#2-landing-page-simulateur)
3. [Étape 1 : Profil Investisseur](#3-étape-1-profil-investisseur)
4. [Étape 2 : Projet Immobilier](#4-étape-2-projet-immobilier)
5. [Étape 3 : Financement](#5-étape-3-financement)
6. [Étape 4 : Stratégie Locative](#6-étape-4-stratégie-locative)
7. [Étape 5 : Durée et Sortie](#7-étape-5-durée-et-sortie)
8. [Étape 6 : Structure Juridique](#8-étape-6-structure-juridique)
9. [Résultats Simulation](#9-résultats-simulation)
10. [Comparatifs Détaillés](#10-comparatifs-détaillés)
11. [Capture Lead / Paiement](#11-capture-lead-paiement)
12. [Composants UI](#12-composants-ui)
13. [Responsive Mobile](#13-responsive-mobile)

---

## Changelog v2.0 - Corrections et Améliorations

| Type | Élément | Description |
|------|---------|-------------|
| 🔴 CRITIQUE | Étape 2 | Ajout champ "Montant travaux" pour immobilier ancien |
| 🔴 CRITIQUE | Annexe Formules | Correction base amortissement 80% |
| 🟠 IMPORTANT | Étape 1 | Ajout tooltip aide revenus |
| 🟠 IMPORTANT | Étape 3 | Ajout différé de remboursement |
| 🟠 IMPORTANT | Étape 3 | Jauge endettement avec couleurs |
| 🟠 IMPORTANT | Étape 4 | Visualisation Perte/Gain fiscal |
| 🟢 MOBILE | Résultats | Graphique simplifié mobile |
| 🟢 MOBILE | Comparatifs | Système Cards/Onglets |
| 💰 BUSINESS | Paiement | Pack Duo + Upsell Expert |

---

## 1. Vue d'ensemble du parcours

### 1.1 Flux utilisateur principal

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ LANDING  │ ───▶ │ PROFIL   │ ───▶ │ PROJET   │ ───▶ │FINANCEMENT│
│  PAGE    │      │INVESTISS.│      │IMMOBILIER│      │          │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                   Étape 1/6         Étape 2/6         Étape 3/6
                       │                 │                 │
                       ▼                 ▼                 ▼
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│RÉSULTATS │ ◀──── │STRUCTURE │ ◀──── │ DURÉE &  │ ◀──── │ STRATÉGIE│
│SIMULATION│      │JURIDIQUE │      │  SORTIE  │      │ LOCATIVE │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                   Étape 6/6         Étape 5/6         Étape 4/6
```

### 1.2 Modèle freemium (v2.0 - Mise à jour)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MODÈLE FREEMIUM v2.0                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  GRATUIT (1 simulation)        PREMIUM (9,90€)      PACK DUO (14,90€)  │
│  ─────────────────────         ────────────────     ─────────────────  │
│  ✓ Simulation complète         ✓ 3 simulations     ✓ Illimité 30 jours│
│  ✓ Résultats synthétiques      ✓ Comparatifs       ✓ Tout Premium     │
│  ✓ Graphique principal         ✓ Tous graphiques   ✓ Guide PDF Loi    │
│  ✗ Export PDF                  ✓ Export PDF          Jeanbrun inclus  │
│  ✗ Tableau année par année     ✓ Tableau 9 ans     ✓ Support priorité │
│  ✗ Comparatif SCI IR/IS        ✓ Comparatif struct.                   │
│  ✗ Sauvegarde simulation       ✓ Sauvegarde & hist.                   │
│                                                                         │
│  → Capture email obligatoire   → Paiement Stripe   → Paiement Stripe  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  💼 OPTION EXPERT : Mise en relation GRATUITE avec un CGP       │   │
│  │     certifié pour concrétiser votre projet (sur page résultats) │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Landing Page Simulateur

### 2.1 Wireframe Desktop (1440px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🏠 LOGO                    Accueil | Guide | Programmes | Contact  📞  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────┬───────────────────────────┐   │
│  │                                         │                           │   │
│  │  SIMULEZ VOTRE INVESTISSEMENT           │   ╔═══════════════════╗   │   │
│  │  LOI JEANBRUN EN 2 MINUTES              │   ║                   ║   │   │
│  │  ═══════════════════════════            │   ║   💰 SIMULATEUR   ║   │   │
│  │                                         │   ║      RAPIDE       ║   │   │
│  │  Découvrez gratuitement combien         │   ║                   ║   │   │
│  │  vous pouvez économiser avec le         │   ║  ┌─────────────┐  ║   │   │
│  │  nouveau dispositif de                  │   ║  │ Ville...    │  ║   │   │
│  │  défiscalisation 2026.                  │   ║  └─────────────┘  ║   │   │
│  │                                         │   ║                   ║   │   │
│  │  ✓ Sans engagement                      │   ║  Budget estimé    ║   │   │
│  │  ✓ Résultats instantanés               │   ║  ┌─────────────┐  ║   │   │
│  │  ✓ Comparatif LMNP inclus              │   ║  │ ●─────────── │  ║   │   │
│  │  ✓ Export PDF disponible               │   ║  │ 150 000 €   │  ║   │   │
│  │                                         │   ║  └─────────────┘  ║   │   │
│  │  ⭐⭐⭐⭐⭐ 4.9/5 (234 avis)              │   ║                   ║   │   │
│  │                                         │   ║  Revenus annuels  ║   │   │
│  │                                         │   ║  ┌─────────────┐  ║   │   │
│  │                                         │   ║  │ 40-60k €  ▼ │  ║   │   │
│  │                                         │   ║  └─────────────┘  ║   │   │
│  │                                         │   ║                   ║   │   │
│  │                                         │   ║  ┌─────────────┐  ║   │   │
│  │                                         │   ║  │  SIMULER →  │  ║   │   │
│  │                                         │   ║  └─────────────┘  ║   │   │
│  └─────────────────────────────────────────┴───╚═══════════════════╝───┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ 🏆 N°1      │  │ 🔒 100%     │  │ ⚡ Résultat  │  │ 📊 Expert   │       │
│  │ Simulateur  │  │ Gratuit     │  │ en 2 min    │  │ CGP validé  │       │
│  │ Jeanbrun    │  │ Sans CB     │  │             │  │             │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LES 3 NIVEAUX D'ÉCONOMIE JEANBRUN                                        │
│  ═══════════════════════════════                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   INTERMÉDIAIRE          SOCIAL              TRÈS SOCIAL           │   │
│  │   ──────────────          ──────              ───────────           │   │
│  │                                                                     │   │
│  │   Amortissement          Amortissement       Amortissement         │   │
│  │      3,5%/an               4,5%/an             5,5%/an             │   │
│  │                                                                     │   │
│  │   Plafond                Plafond             Plafond               │   │
│  │    8 000€/an             10 000€/an          12 000€/an            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Étape 1 : Profil Investisseur

### 3.1 Wireframe Desktop (v2.0 - Avec aide revenus)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🏠 LOGO        Étape 1/6 ●───────────────────────────────────────○  📞 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      VOTRE PROFIL INVESTISSEUR                              │
│                      ═══════════════════════════                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SITUATION FAMILIALE                                                │   │
│  │                                                                     │   │
│  │  Situation                    Nombre de parts fiscales             │   │
│  │  ┌───────────────────────┐    ┌───────────────────────┐            │   │
│  │  │ Célibataire       ▼  │    │  1                 ▼  │            │   │
│  │  └───────────────────────┘    └───────────────────────┘            │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  💡 AIDE : Comment calculer mes parts fiscales ?             │  │   │
│  │  │     Célibataire sans enfant = 1 part                         │  │   │
│  │  │     Couple marié/pacsé = 2 parts                             │  │   │
│  │  │     + 0,5 part par enfant (1 part à partir du 3ème)          │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  REVENUS (v2.0 - Avec aide contextuelle)                           │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  💡 Qu'est-ce que le revenu net imposable ?         [ⓘ]     │  │   │
│  │  │  ─────────────────────────────────────────────               │  │   │
│  │  │  C'est le montant inscrit sur votre avis d'imposition,      │  │   │
│  │  │  ligne "Revenu imposable" (après abattement 10%).           │  │   │
│  │  │                                                              │  │   │
│  │  │  📝 Exemple : Si vous gagnez 50 000€ brut/an                │  │   │
│  │  │     → Après abattement 10% = 45 000€ net imposable          │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  Mode de saisie :                                                  │   │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────┐ │   │
│  │  │  ○ Revenu net imposable     │  │  ○ Je calcule moi-même     │ │   │
│  │  │    (recommandé)             │  │    (brut - 10%)             │ │   │
│  │  └─────────────────────────────┘  └─────────────────────────────┘ │   │
│  │                                                                     │   │
│  │  Revenu net imposable annuel                                       │   │
│  │  ┌───────────────────────────────────────────────────────────┐    │   │
│  │  │  €  45 000                                                │    │   │
│  │  └───────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐ │   │
│  │  │  📊 Votre TMI estimé : 30%                                   │ │   │
│  │  │     Vous récupérez 30 centimes par euro déduit              │ │   │
│  │  └──────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │  Revenus fonciers existants (optionnel)                           │   │
│  │  ┌───────────────────────────────────────────────────────────┐    │   │
│  │  │  €  0                                                     │    │   │
│  │  └───────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  VOTRE OBJECTIF PRINCIPAL                                          │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │   │
│  │  │ 💰         │ │ 📈         │ │ 🏠         │ │ 👴         │  │   │
│  │  │ Réduire    │ │ Générer    │ │ Constituer │ │ Préparer   │  │   │
│  │  │ mes impôts │ │ revenus    │ │ patrimoine │ │ retraite   │  │   │
│  │  │     ●      │ │     ○      │ │     ○      │ │     ○      │  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │   │
│  │                                                                     │   │
│  │  ℹ️ Cet objectif personnalisera les conseils en fin de parcours.  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │    ← Retour                               Continuer →              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Calcul automatique TMI

```
Quotient familial = Revenus / Nb parts

Si QF ≤ 11 294€      → TMI = 0%
Si QF ≤ 28 797€      → TMI = 11%
Si QF ≤ 82 341€      → TMI = 30%
Si QF ≤ 177 106€     → TMI = 41%
Si QF > 177 106€     → TMI = 45%
```

---

## 4. Étape 2 : Projet Immobilier

### 4.1 Wireframe Desktop (v2.0 - Avec champ travaux)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🏠 LOGO        Étape 2/6 ●●──────────────────────────────────────○  📞 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      VOTRE PROJET IMMOBILIER                                │
│                      ═══════════════════════                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TYPE DE BIEN                                                       │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────┐  ┌───────────────────────────┐      │   │
│  │  │  🏗️  IMMOBILIER NEUF      │  │  🔨  ANCIEN + TRAVAUX     │      │   │
│  │  │                           │  │                           │      │   │
│  │  │  VEFA ou livré < 5 ans    │  │  Travaux ≥ 30% du prix   │      │   │
│  │  │                           │  │                           │      │   │
│  │  │  • Frais notaire réduits  │  │  • Déficit foncier        │      │   │
│  │  │  • Garanties promoteur    │  │    bonifié (21 400€)      │      │   │
│  │  │  • Normes RT2020          │  │  • Plus de choix          │      │   │
│  │  │                           │  │                           │      │   │
│  │  │          [●]              │  │          [ ]              │      │   │
│  │  └───────────────────────────┘  └───────────────────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LOCALISATION                                                       │   │
│  │                                                                     │   │
│  │  Ville ou code postal                                              │   │
│  │  ┌───────────────────────────────────────────────────────────┐     │   │
│  │  │  🔍 Lyon...                                            ▼  │     │   │
│  │  └───────────────────────────────────────────────────────────┘     │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  📍 LYON - Zone A                                            │  │   │
│  │  │  Prix m² moyen : 4 850 €                                     │  │   │
│  │  │  Plafond loyer Jeanbrun : 14,20 €/m²                        │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CARACTÉRISTIQUES DU BIEN                                          │   │
│  │                                                                     │   │
│  │  Surface (m²)                    Prix d'acquisition (€)            │   │
│  │  ┌─────────────────────┐         ┌─────────────────────┐           │   │
│  │  │  45                 │         │  195 000            │           │   │
│  │  └─────────────────────┘         └─────────────────────┘           │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  ✓ Prix au m² : 4 333 €/m² (conforme au marché)              │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║  🔨 SECTION TRAVAUX (v2.0 - NOUVEAU - Affichée si "ANCIEN" coché)  ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                     ║   │
│  ║  Montant estimé des travaux (€)                                    ║   │
│  ║  ┌───────────────────────────────────────────────────────────┐     ║   │
│  ║  │  €  70 000                                                │     ║   │
│  ║  └───────────────────────────────────────────────────────────┘     ║   │
│  ║                                                                     ║   │
│  ║  ┌──────────────────────────────────────────────────────────────┐  ║   │
│  ║  │  📊 VÉRIFICATION ÉLIGIBILITÉ JEANBRUN ANCIEN                 │  ║   │
│  ║  │  ─────────────────────────────────────────────               │  ║   │
│  ║  │  Seuil minimum requis (30% du prix) : 58 500 €              │  ║   │
│  ║  │  Vos travaux : 70 000 € (35,9% du prix)                     │  ║   │
│  ║  │                                                              │  ║   │
│  ║  │  ✅ ÉLIGIBLE - Vos travaux dépassent le seuil de 30%        │  ║   │
│  ║  └──────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                     ║   │
│  ║  ┌──────────────────────────────────────────────────────────────┐  ║   │
│  ║  │  ⚠️ ALERTE (si travaux < 30%) :                              │  ║   │
│  ║  │  Attention : vos travaux (50 000€) représentent 25,6%       │  ║   │
│  ║  │  du prix d'achat. Vous ne serez PAS éligible au dispositif  │  ║   │
│  ║  │  Jeanbrun dans l'ancien. Minimum requis : 58 500 €          │  ║   │
│  ║  └──────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                     ║   │
│  ║  DPE actuel                        DPE après travaux (objectif)   ║   │
│  ║  ┌─────────────────────┐           ┌─────────────────────┐        ║   │
│  ║  │  E                ▼ │           │  A ou B (requis)  ▼ │        ║   │
│  ║  └─────────────────────┘           └─────────────────────┘        ║   │
│  ║                                                                     ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  RÉCAPITULATIF PROJET                                              │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────┬──────────────────────────────────┐  │   │
│  │  │  NEUF                     │  ANCIEN + TRAVAUX               │  │   │
│  │  ├───────────────────────────┼──────────────────────────────────┤  │   │
│  │  │  Prix achat : 195 000 €   │  Prix achat : 195 000 €         │  │   │
│  │  │  Frais notaire : 5 850 €  │  Travaux : 70 000 €             │  │   │
│  │  │  (3%)                     │  Frais notaire : 15 575 €ᵃ      │  │   │
│  │  │  ────────────────────     │  ────────────────────           │  │   │
│  │  │  TOTAL : 200 850 €        │  TOTAL : 280 575 €              │  │   │
│  │  └───────────────────────────┴──────────────────────────────────┘  │   │
│  │  ᵃ Frais notaire ancien : ~8% du prix d'achat                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │    ← Retour                               Continuer →              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Logique de validation travaux

```javascript
// v2.0 - Validation éligibilité ancien
function verifierEligibiliteAncien(prixAchat, montantTravaux) {
    const seuilMinimum = prixAchat * 0.30;
    const pourcentageTravaux = (montantTravaux / prixAchat) * 100;
    
    return {
        eligible: montantTravaux >= seuilMinimum,
        seuilRequis: seuilMinimum,
        pourcentage: pourcentageTravaux.toFixed(1),
        manque: Math.max(0, seuilMinimum - montantTravaux)
    };
}
```

---

## 5. Étape 3 : Financement

### 5.1 Wireframe Desktop (v2.0 - Avec différé + jauge couleurs)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🏠 LOGO        Étape 3/6 ●●●─────────────────────────────────────○  📞 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      VOTRE FINANCEMENT                                      │
│                      ═════════════════                                      │
│                                                                             │
│  ┌─────────────────────────────────┬───────────────────────────────────┐   │
│  │  MONTANT DU PROJET              │                                   │   │
│  │                                  │   INVESTISSEMENT TOTAL            │   │
│  │  Coût total du projet           │   200 850 €                       │   │
│  │  ┌─────────────────────────┐    │                                   │   │
│  │  │  €  200 850             │    │   Apport : 40 000 € (20%)        │   │
│  │  │  Prix achat : 195 000 € │    │   Emprunt : 160 850 €            │   │
│  │  │  Frais notaire : 5 850 €│    │                                   │   │
│  │  └─────────────────────────┘    │   Mensualité : 857 €              │   │
│  │                                  │                                   │   │
│  │  Apport personnel               │   Coût total crédit :             │   │
│  │  ┌─────────────────────────┐    │   44 540 €                        │   │
│  │  │  €  40 000              │    │                                   │   │
│  │  └─────────────────────────┘    │                                   │   │
│  │  ●───────────────────── 20 %    │                                   │   │
│  │  ˘ Recommandé : 10-20%          │                                   │   │
│  └─────────────────────────────────┴───────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CONDITIONS DU PRÊT                                                 │   │
│  │                                                                     │   │
│  │  Durée de l'emprunt                                                │   │
│  │      10      15      20      [25] ans                              │   │
│  │      ─────────────────────────────●                                 │   │
│  │                                                                     │   │
│  │  Taux nominal annuel (TAEG)                                        │   │
│  │      3,0 %    3,2 %    [3,5 %]    3,8 %    4,0 %                  │   │
│  │      ───────────────────────●───────────────────────────            │   │
│  │      Taux moyen du marché (janv. 2026) : 3,48%                    │   │
│  │                                                                     │   │
│  │  Assurance emprunteur                     Frais de dossier         │   │
│  │  ┌─────────────────────┐                 ┌─────────────────────┐   │   │
│  │  │  0,30 % (40 €/mois) │                 │  €  1 000           │   │   │
│  │  └─────────────────────┘                 └─────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║  ⏳ DIFFÉRÉ DE REMBOURSEMENT (v2.0 - NOUVEAU)                       ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                     ║   │
│  ║  💡 Courant en VEFA ou travaux : remboursez uniquement les         ║   │
│  ║     intérêts pendant la période de différé.                        ║   │
│  ║                                                                     ║   │
│  ║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   ║   │
│  ║  │ Aucun       │ │ 12 mois     │ │ 24 mois     │ │ 36 mois     │   ║   │
│  ║  │    [●]      │ │    [ ]      │ │    [ ]      │ │    [ ]      │   ║   │
│  ║  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   ║   │
│  ║                                                                     ║   │
│  ║  ┌──────────────────────────────────────────────────────────────┐  ║   │
│  ║  │  📊 Impact du différé 24 mois :                              │  ║   │
│  ║  │  • Mensualité pendant différé : 469 € (intérêts seuls)      │  ║   │
│  ║  │  • Mensualité après différé : 892 € (+35 € vs sans différé) │  ║   │
│  ║  │  • Coût total supplémentaire : 8 400 €                       │  ║   │
│  ║  └──────────────────────────────────────────────────────────────┘  ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
│                                                                             │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║  ⚠️ TAUX D'ENDETTEMENT ESTIMÉ (v2.0 - Avec couleurs)               ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                     ║   │
│  ║      28 %                                                          ║   │
│  ║      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░ │ 35% (limite)       ║   │
│  ║      ████████████████████████████████                              ║   │
│  ║      [      VERT      ][  ORANGE  ][ ROUGE ]                       ║   │
│  ║           < 30%          30-35%      > 35%                         ║   │
│  ║                                                                     ║   │
│  ║  ✅ Excellent ! Votre projet est facilement finançable             ║   │
│  ║                                                                     ║   │
│  ║  ┌──────────────────────────────────────────────────────────────┐  ║   │
│  ║  │  🚦 LÉGENDE ENDETTEMENT :                                    │  ║   │
│  ║  │  🟢 < 30% : Excellent - Financement aisé                     │  ║   │
│  ║  │  🟠 30-35% : Acceptable - Financement possible               │  ║   │
│  ║  │  🔴 > 35% : Risqué - Financement difficile                   │  ║   │
│  ║  └──────────────────────────────────────────────────────────────┘  ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │    ← Retour                               Continuer →              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Logique calcul avec différé

```javascript
// v2.0 - Calcul avec différé de remboursement
function calculerMensualiteAvecDiffere(capital, tauxAnnuel, dureeMois, differeMois) {
    const tauxMensuel = tauxAnnuel / 100 / 12;
    
    // Pendant le différé : uniquement les intérêts
    const mensualiteDiffere = capital * tauxMensuel;
    
    // Après le différé : capital + intérêts sur durée restante
    const dureeRestante = dureeMois - differeMois;
    const mensualiteApres = (capital * tauxMensuel) / 
                           (1 - Math.pow(1 + tauxMensuel, -dureeRestante));
    
    // Coût total du différé
    const coutDiffere = mensualiteDiffere * differeMois;
    
    return {
        mensualiteDiffere: Math.round(mensualiteDiffere),
        mensualiteApres: Math.round(mensualiteApres),
        coutSupplementaire: Math.round(coutDiffere)
    };
}
```

---

## 6. Étape 4 : Stratégie Locative

### 6.1 Wireframe Desktop (v2.0 - Avec visualisation Perte/Gain)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🏠 LOGO        Étape 4/6 ●●●●────────────────────────────────────○  📞 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      STRATÉGIE LOCATIVE JEANBRUN                            │
│                      ═══════════════════════════                            │
│                                                                             │
│    La loi Jeanbrun propose 3 niveaux de loyers plafonnés.                  │
│    Plus le loyer est social, plus l'avantage fiscal est élevé.             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CHOISISSEZ VOTRE NIVEAU DE LOYER                                  │   │
│  │                                                                     │   │
│  │   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐            │   │
│  │   │ INTERMÉDIAIRE │ │    SOCIAL     │ │  TRÈS SOCIAL  │            │   │
│  │   │               │ │               │ │               │            │   │
│  │   │ Plafond loyer │ │ Plafond loyer │ │ Plafond loyer │            │   │
│  │   │ 13,56 €/m²    │ │ 10,85 €/m²    │ │  8,68 €/m²    │            │   │
│  │   │               │ │               │ │               │            │   │
│  │   │ Amortissement │ │ Amortissement │ │ Amortissement │            │   │
│  │   │    3,5%/an    │ │    4,5%/an    │ │    5,5%/an    │            │   │
│  │   │               │ │               │ │               │            │   │
│  │   │ Économie max  │ │ Économie max  │ │ Économie max  │            │   │
│  │   │  8 000 €/an   │ │ 10 000 €/an   │ │ 12 000 €/an   │            │   │
│  │   │               │ │               │ │               │            │   │
│  │   │ Loyer estimé  │ │ Loyer estimé  │ │ Loyer estimé  │            │   │
│  │   │   610 €/mois  │ │   488 €/mois  │ │   391 €/mois  │            │   │
│  │   │               │ │               │ │               │            │   │
│  │   │      [●]      │ │      [ ]      │ │      [ ]      │            │   │
│  │   │  RECOMMANDÉ   │ │               │ │  OPTIMAL      │            │   │
│  │   │  rendement    │ │               │ │  fiscalement  │            │   │
│  │   └───────────────┘ └───────────────┘ └───────────────┘            │   │
│  │                                                                     │   │
│  │  ˘ Plafonds calculés pour Lyon Zone A, 45 m²                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║  💡 VISUALISATION PERTE/GAIN (v2.0 - NOUVEAU)                       ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                     ║   │
│  ║  Comparez l'impact de chaque niveau sur votre budget :             ║   │
│  ║                                                                     ║   │
│  ║  ┌──────────────────────────────────────────────────────────────┐  ║   │
│  ║  │                    INTERMÉDIAIRE → SOCIAL                    │  ║   │
│  ║  │  ─────────────────────────────────────────────               │  ║   │
│  ║  │  📉 Perte de loyer :        -122 €/mois  (-1 464 €/an)      │  ║   │
│  ║  │  📈 Gain fiscal :           +167 €/mois  (+2 000 €/an)      │  ║   │
│  ║  │  ─────────────────────────────────────────────               │  ║   │
│  ║  │  ✅ BILAN NET :             +45 €/mois   (+536 €/an)        │  ║   │
│  ║  │                                                              │  ║   │
│  ║  │  💡 En passant au Social, vous perdez 122€ de loyer mais    │  ║   │
│  ║  │     gagnez 167€ d'économie d'impôt. Vous êtes GAGNANT !     │  ║   │
│  ║  └──────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                     ║   │
│  ║  ┌──────────────────────────────────────────────────────────────┐  ║   │
│  ║  │                    SOCIAL → TRÈS SOCIAL                      │  ║   │
│  ║  │  ─────────────────────────────────────────────               │  ║   │
│  ║  │  📉 Perte de loyer :        -97 €/mois   (-1 164 €/an)      │  ║   │
│  ║  │  📈 Gain fiscal :           +167 €/mois  (+2 000 €/an)      │  ║   │
│  ║  │  ─────────────────────────────────────────────               │  ║   │
│  ║  │  ✅ BILAN NET :             +70 €/mois   (+836 €/an)        │  ║   │
│  ║  └──────────────────────────────────────────────────────────────┘  ║   │
│  ║                                                                     ║   │
│  ║  ┌──────────────────────────────────────────────────────────────┐  ║   │
│  ║  │  🏆 COMPARATIF GLOBAL (sur 9 ans)                            │  ║   │
│  ║  │                                                              │  ║   │
│  ║  │             │ Intermédiaire │   Social    │ Très Social   │  ║   │
│  ║  │  ───────────┼───────────────┼─────────────┼───────────────│  ║   │
│  ║  │  Loyers     │   65 880 €    │  52 704 €   │   42 228 €    │  ║   │
│  ║  │  Économie   │   58 500 €    │  72 000 €   │   86 400 €    │  ║   │
│  ║  │  impôt      │               │             │               │  ║   │
│  ║  │  ───────────┼───────────────┼─────────────┼───────────────│  ║   │
│  ║  │  TOTAL NET  │  124 380 €    │ 124 704 €   │  128 628 €    │  ║   │
│  ║  │             │               │             │      🏆       │  ║   │
│  ║  └──────────────────────────────────────────────────────────────┘  ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CHARGES ET FRAIS                                                   │   │
│  │                                                                     │   │
│  │  Charges copropriété        Taxe foncière         Frais gestion    │   │
│  │  ┌───────────────┐         ┌───────────────┐     ┌───────────────┐ │   │
│  │  │  €  80 /mois  │         │  €  850 /an   │     │  ○ 0%  seul   │ │   │
│  │  └───────────────┘         └───────────────┘     │  ● 7%  léger  │ │   │
│  │                                                   │  ○ 10% complet│ │   │
│  │  Vacance locative estimée                        └───────────────┘ │   │
│  │  ○────────────────● 5%                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  RÉCAPITULATIF MENSUEL                                             │   │
│  │                                                                     │   │
│  │  Loyer brut                              +  610 €                  │   │
│  │  - Vacance locative (5%)                 -   30 €                  │   │
│  │  - Charges copropriété                   -   80 €                  │   │
│  │  - Taxe foncière (mensuel.)             -   71 €                  │   │
│  │  - Frais de gestion (7%)                 -   43 €                  │   │
│  │  ─────────────────────────────────────────────────────                 │   │
│  │  = Revenus nets mensuels                 =  386 €                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │    ← Retour                               Continuer →              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Étape 5 : Durée et Sortie

### 7.1 Wireframe Desktop (v2.0 - Avec toggle réforme PV)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🏠 LOGO        Étape 5/6 ●●●●●───────────────────────────────────○  📞 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      DURÉE ET STRATÉGIE DE SORTIE                           │
│                      ════════════════════════════                           │
│                                                                             │
│    Cette étape calcule votre plus-value potentielle à la revente.          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  DURÉE D'ENGAGEMENT                                                 │   │
│  │                                                                     │   │
│  │  La loi Jeanbrun impose 9 ans minimum. Vous pouvez conserver       │   │
│  │  votre bien au-delà pour optimiser la plus-value.                  │   │
│  │                                                                     │   │
│  │  Durée de détention prévue :                                       │   │
│  │      9       12       15       18       22       30 ans            │   │
│  │      ●────────────────────────────────────────────○                 │   │
│  │      ↑                                                              │   │
│  │   Minimum                                                          │   │
│  │   obligatoire                                                       │   │
│  │                                                                     │   │
│  │  Durée sélectionnée : 12 ans                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  HYPOTHÈSES DE REVALORISATION                                      │   │
│  │                                                                     │   │
│  │  Revalorisation annuelle estimée du bien                           │   │
│  │      0%       1%       [2%]      3%       4%                       │   │
│  │      ────────────────────●─────────────────                         │   │
│  │                                                                     │   │
│  │  Prix de vente estimé dans 12 ans : 247 100 €                      │   │
│  │  (+52 100 € soit +26,7%)                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  STRATÉGIE DE SORTIE                                               │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────┐  ┌───────────────────────────┐      │   │
│  │  │  🏷️  REVENTE              │  │  🏠  CONSERVATION         │      │   │
│  │  │                           │  │                           │      │   │
│  │  │  Récupérer le capital     │  │  Générer des revenus      │      │   │
│  │  │  et la plus-value         │  │  locatifs à long terme    │      │   │
│  │  │                           │  │                           │      │   │
│  │  │          [●]              │  │          [ ]              │      │   │
│  │  └───────────────────────────┘  └───────────────────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║  ⚙️ RÉGLAGES EXPERTS (v2.0 - NOUVEAU)                               ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                     ║   │
│  ║  📊 Régime de plus-value applicable :                              ║   │
│  ║                                                                     ║   │
│  ║  ┌─────────────────────────────────────────────────────────────┐   ║   │
│  ║  │  ○ Régime actuel (22 ans IR / 30 ans PS)                    │   ║   │
│  ║  │    Exonération IR après 22 ans, PS après 30 ans             │   ║   │
│  ║  │                                                             │   ║   │
│  ║  │  ○ Réforme envisagée (17 ans)                               │   ║   │
│  ║  │    ⚠️ Non encore votée - Simulation prévisionnelle          │   ║   │
│  ║  │    Exonération totale après 17 ans                          │   ║   │
│  ║  └─────────────────────────────────────────────────────────────┘   ║   │
│  ║                                                                     ║   │
│  ║  💡 Ce toggle permet de comparer l'impact d'une éventuelle        ║   │
│  ║     réforme de la fiscalité des plus-values immobilières.         ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │    ← Retour                               Continuer →              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Étape 6 : Structure Juridique

### 8.1 Wireframe Desktop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🏠 LOGO        Étape 6/6 ●●●●●●──────────────────────────────────○  📞 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      STRUCTURE JURIDIQUE                                    │
│                      ═══════════════════                                    │
│                                                                             │
│    Comparez les 3 principales options pour détenir votre bien.             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │   │
│  │  │   NOM PROPRE    │  │    SCI IR       │  │    SCI IS       │     │   │
│  │  │                 │  │                 │  │                 │     │   │
│  │  │  En votre nom   │  │  Société civile │  │  Société civile │     │   │
│  │  │  personnel      │  │  transparente   │  │  opaque         │     │   │
│  │  │                 │  │                 │  │                 │     │   │
│  │  │ ✓ Simple        │  │ ✓ Transmission  │  │ ✓ Amortissement │     │   │
│  │  │ ✓ Déficit       │  │   facilitée     │  │   comptable     │     │   │
│  │  │   foncier       │  │ ✓ Déficit       │  │ ✓ IS 15%/25%    │     │   │
│  │  │ ✓ Abattements PV│  │   foncier       │  │                 │     │   │
│  │  │                 │  │ ✓ Abattements PV│  │ ✗ PV taxée à    │     │   │
│  │  │ ✗ Pas de cumul  │  │                 │  │   la sortie     │     │   │
│  │  │   amortissement │  │ ✗ Gestion       │  │ ✗ Double        │     │   │
│  │  │                 │  │   + complexe    │  │   imposition    │     │   │
│  │  │                 │  │                 │  │                 │     │   │
│  │  │  COMPATIBLE     │  │  COMPATIBLE     │  │  NON COMPATIBLE │     │   │
│  │  │  JEANBRUN ✓     │  │  JEANBRUN ✓     │  │  JEANBRUN ✗     │     │   │
│  │  │                 │  │                 │  │                 │     │   │
│  │  │      [●]        │  │      [ ]        │  │      [ ]        │     │   │
│  │  │  RECOMMANDÉ     │  │                 │  │  (comparatif)   │     │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │   │
│  │                                                                     │   │
│  │  ⚠️ Si vous choisissez SCI IS, le simulateur calculera             │   │
│  │     l'amortissement comptable de droit commun (non Jeanbrun).      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  💡 COMPRENDRE LA DIFFÉRENCE                                        │   │
│  │                                                                     │   │
│  │  NOM PROPRE / SCI IR              │     SCI IS                      │   │
│  │  ─────────────────────            │     ──────                      │   │
│  │                                    │                                 │   │
│  │  Loyers → IR (TMI 30%)            │  Loyers → IS (15%/25%)         │   │
│  │  + PS 17,2%                       │  Dividendes → IR + PS          │   │
│  │                                    │                                 │   │
│  │  Déficit → Revenu global          │  Déficit → Reportable          │   │
│  │  (max 21 400€ Jeanbrun)           │  (sur bénéfices IS)             │   │
│  │                                    │                                 │   │
│  │  Plus-value → PV particuliers     │  PV → PV professionnelle       │   │
│  │  (abattements après 5 ans)        │  + réintégration amort.         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  COMPARER ÉGALEMENT AVEC :                                         │   │
│  │                                                                     │   │
│  │  ☑ LMNP (Location Meublée Non Professionnelle)                    │   │
│  │  ☑ Location nue classique (sans avantage fiscal)                  │   │
│  │                                                                     │   │
│  │  ˘ Ces comparaisons seront affichées dans les résultats.          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │    ← Retour                      CALCULER MES RÉSULTATS →          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Résultats Simulation

### 9.1 Wireframe Desktop - Vue principale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  🏠 LOGO                RÉSULTATS DE VOTRE SIMULATION       📞 Conseil │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🎉 FÉLICITATIONS !                                                        │
│                                                                             │
│  Votre investissement Loi Jeanbrun à Lyon pourrait vous faire              │
│  économiser jusqu'à :                                                      │
│                                                                             │
│         ╔═══════════════════════════════════════════╗                      │
│         ║          58 500 €                         ║                      │
│         ║          d'impôts sur 9 ans               ║                      │
│         ╚═══════════════════════════════════════════╝                      │
│                                                                             │
│  Soit 6 500 €/an ou 542 €/mois                                            │
│                                                                             │
│  ┌──────────────────────────────────┬──────────────────────────────────┐   │
│  │  📊 SYNTHÈSE INVESTISSEMENT      │  🔢 INDICATEURS CLÉS             │   │
│  │                                  │                                  │   │
│  │  Prix d'achat         195 000 € │  Rendement brut      3,75 %     │   │
│  │  Frais notaire          5 850 € │  Rendement net       2,31 %     │   │
│  │  TOTAL INVESTI        200 850 € │  Rendement net-net   4,87 %     │   │
│  │                                  │  (avec avantage fiscal)         │   │
│  │  Apport                40 000 € │                                  │   │
│  │  Emprunt              160 850 € │  ┌─────────────────────────────┐│   │
│  │  Mensualité crédit        857 € │  │ 💰 CASH-FLOW MENSUEL       ││   │
│  │                                  │  │ ────────────────────        ││   │
│  │  Loyer mensuel            610 € │  │ Effort d'épargne : -471 €  ││   │
│  │  Charges + TF             194 € │  │ (Loyer - Crédit - Charges) ││   │
│  │                                  │  │                             ││   │
│  │                                  │  │ Effort RÉEL :      +71 €   ││   │
│  │                                  │  │ (avec économie impôt/12)   ││   │
│  │                                  │  │                             ││   │
│  │                                  │  │ 💡 "Cet appartement ne     ││   │
│  │                                  │  │    vous coûte que 71€/mois ││   │
│  │                                  │  │    grâce à l'État"         ││   │
│  │                                  │  └─────────────────────────────┘│   │
│  └──────────────────────────────────┴──────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  📈 ÉVOLUTION DE VOTRE PATRIMOINE                                   │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │  VUE DESKTOP (12 points)                                      │ │   │
│  │  │                                                               │ │   │
│  │  │   300k€ ┤                                           ╭──────   │ │   │
│  │  │   250k€ ┤                                    ╭──────╯         │ │   │
│  │  │   200k€ ┤                      ╭──────╭──────╯                 │ │   │
│  │  │   150k€ ┤        ╭──────╭──────╯                               │ │   │
│  │  │   100k€ ┤─╭──────╯                                             │ │   │
│  │  │    50k€ ┤                                                      │ │   │
│  │  │      0€ ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────│ │   │
│  │  │         0    1    2    3    4    5    6    7    8    9   10  12│ │   │
│  │  │                                                               │ │   │
│  │  │   ███ Valeur bien    ─── Capital dû    ••• Patrimoine net     │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │  📱 VUE MOBILE SIMPLIFIÉE (v2.0 - NOUVEAU)                    │ │   │
│  │  │                                                               │ │   │
│  │  │   300k€ ┤                                    ╭─────           │ │   │
│  │  │   200k€ ┤              ╭─────────────────────╯                │ │   │
│  │  │   100k€ ┤──────────────╯                                      │ │   │
│  │  │      0€ ┼──────────┬──────────┬──────────┬──────────          │ │   │
│  │  │         An 1       An 5       An 9       An 12                │ │   │
│  │  │                                                               │ │   │
│  │  │   💡 4 points clés : Départ, Mi-parcours, Fin Jeanbrun, Exit │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Synthèse]  [Comparatifs]  [Tableau 9 ans]  [Plus-value]  [FAQ]   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ⚠️ DISCLAIMER : Cette simulation est indicative et ne constitue pas un   │
│  conseil en investissement. Consultez un professionnel.                    │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  📥 TÉLÉCHARGER  │  │  📅 PRENDRE RDV  │  │  🔄 MODIFIER     │         │
│  │  LE PDF (Premium)│  │  AVEC UN EXPERT  │  │  MA SIMULATION   │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                             │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║  💼 MISE EN RELATION EXPERT (v2.0 - NOUVEAU)                        ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                     ║   │
│  ║  🤝 Concrétisez votre projet avec un expert certifié               ║   │
│  ║                                                                     ║   │
│  ║  ┌─────────────────────────────────────────────────────────────┐   ║   │
│  ║  │  ✓ Mise en relation GRATUITE                                │   ║   │
│  ║  │  ✓ Conseiller en Gestion de Patrimoine certifié AMF         │   ║   │
│  ║  │  ✓ Sans engagement de votre part                            │   ║   │
│  ║  │  ✓ RDV téléphonique sous 48h                                │   ║   │
│  ║  │                                                             │   ║   │
│  ║  │  ┌───────────────────────────────────────────────────────┐  │   ║   │
│  ║  │  │         ÊTRE RAPPELÉ GRATUITEMENT →                   │  │   ║   │
│  ║  │  └───────────────────────────────────────────────────────┘  │   ║   │
│  ║  └─────────────────────────────────────────────────────────────┘   ║   │
│  ║                                                                     ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Comparatifs Détaillés

### 10.1 Onglet Comparatif Régimes (PREMIUM) - Version Mobile Cards (v2.0)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 COMPARATIF JEANBRUN vs ALTERNATIVES                        [PREMIUM]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ╔═════════════════════════════════════════════════════════════════════╗   │
│  ║  📱 VERSION MOBILE (v2.0 - Système Cards/Onglets)                   ║   │
│  ╠═════════════════════════════════════════════════════════════════════╣   │
│  ║                                                                     ║   │
│  ║  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐       ║   │
│  ║  │  JEANBRUN  │ │   LMNP     │ │  LOC NUE   │ │ COMPARER   │       ║   │
│  ║  │    [●]     │ │    [ ]     │ │    [ ]     │ │    [ ]     │       ║   │
│  ║  └────────────┘ └────────────┘ └────────────┘ └────────────┘       ║   │
│  ║                                                                     ║   │
│  ║  ┌─────────────────────────────────────────────────────────────┐   ║   │
│  ║  │  🏆 JEANBRUN INTERMÉDIAIRE                                  │   ║   │
│  ║  │  ═══════════════════════════                                │   ║   │
│  ║  │                                                             │   ║   │
│  ║  │  Économie impôt totale      58 500 €                       │   ║   │
│  ║  │  Cash-flow annuel            +852 €                        │   ║   │
│  ║  │  Rendement net-net            4,87%                        │   ║   │
│  ║  │                                                             │   ║   │
│  ║  │  ✓ Amortissement 3,5%/an sur 9 ans                        │   ║   │
│  ║  │  ✓ Déficit foncier imputable 21 400€/an                   │   ║   │
│  ║  │  ✓ Abattements PV après 5 ans                             │   ║   │
│  ║  │                                                             │   ║   │
│  ║  │  ┌─────────────────────────────────────────────────────┐   │   ║   │
│  ║  │  │          SWIPE POUR COMPARER →                      │   │   ║   │
│  ║  │  └─────────────────────────────────────────────────────┘   │   ║   │
│  ║  └─────────────────────────────────────────────────────────────┘   ║   │
│  ╚═════════════════════════════════════════════════════════════════════╝   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🖥️ VERSION DESKTOP (Tableau comparatif)                           │   │
│  │                                                                     │   │
│  │  ┌─────────────┬─────────────┬─────────────┬─────────────┐         │   │
│  │  │             │  JEANBRUN   │    LMNP     │  LOCATION   │         │   │
│  │  │             │ Interméd.   │   Réel      │  NUE        │         │   │
│  │  ├─────────────┼─────────────┼─────────────┼─────────────┤         │   │
│  │  │ Économie    │  58 500 €   │  42 000 €   │   8 500 €   │         │   │
│  │  │ impôt       │     🏆      │             │             │         │   │
│  │  │             │             │             │             │         │   │
│  │  │ Cash-flow   │   +852 €    │  +1 200 €   │  -2 100 €   │         │   │
│  │  │ annuel      │             │     🏆      │             │         │   │
│  │  │             │             │             │             │         │   │
│  │  │ Rendement   │    4,87%    │    4,12%    │    2,31%    │         │   │
│  │  │ net-net     │     🏆      │             │             │         │   │
│  │  │             │             │             │             │         │   │
│  │  │ Contraintes │  9 ans      │  Meublé     │  Aucune     │         │   │
│  │  │             │  plafonds   │  comptable  │             │         │   │
│  │  └─────────────┴─────────────┴─────────────┴─────────────┘         │   │
│  │                                                                     │   │
│  │  ✅ RECOMMANDATION : Jeanbrun optimal pour votre TMI de 30%        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Onglet Comparatif Structures (PREMIUM)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🏛️ COMPARATIF STRUCTURES JURIDIQUES                         [PREMIUM]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐                 │
│  │             │ NOM PROPRE  │   SCI IR    │   SCI IS    │                 │
│  │             │  + Jeanbrun │  + Jeanbrun │ (sans Jean.)│                 │
│  ├─────────────┼─────────────┼─────────────┼─────────────┤                 │
│  │ PHASE DÉTENTION (12 ans)                              │                 │
│  ├─────────────┼─────────────┼─────────────┼─────────────┤                 │
│  │ Imposition  │  IR (TMI)   │  IR (TMI)   │  IS 15%     │                 │
│  │ revenus     │   30%       │   30%       │  ou 25%     │                 │
│  │             │             │             │             │                 │
│  │ Avantage    │  6 825€/an  │  6 825€/an  │  6 825€/an  │                 │
│  │ fiscal      │ (Jeanbrun)  │ (Jeanbrun)  │ (comptable) │                 │
│  │             │             │             │             │                 │
│  │ Déficit     │  21 400€/an │  21 400€/an │  Report     │                 │
│  │ foncier     │             │             │  illimité   │                 │
│  │             │             │             │             │                 │
│  │ Économie    │   78 000€   │   78 000€   │   52 000€   │                 │
│  │ totale      │             │             │             │                 │
│  ├─────────────┼─────────────┼─────────────┼─────────────┤                 │
│  │ PHASE SORTIE (après 12 ans)                           │                 │
│  ├─────────────┼─────────────┼─────────────┼─────────────┤                 │
│  │ Plus-value  │  52 100€    │  52 100€    │  133 825€   │                 │
│  │ brute       │             │             │ (+réintég.) │                 │
│  │             │             │             │             │                 │
│  │ Abattement  │  42% IR     │  42% IR     │    0%       │                 │
│  │ durée       │  17% PS     │  17% PS     │             │                 │
│  │             │             │             │             │                 │
│  │ Impôt sur   │   8 240€    │   8 240€    │  33 456€    │                 │
│  │ plus-value  │             │             │             │                 │
│  ├─────────────┼─────────────┼─────────────┼─────────────┤                 │
│  │ BILAN GLOBAL                                          │                 │
│  ├─────────────┼─────────────┼─────────────┼─────────────┤                 │
│  │ Gain net    │  +69 760€   │  +69 760€   │  +18 544€   │                 │
│  │ total       │     🏆       │     🏆       │             │                 │
│  └─────────────┴─────────────┴─────────────┴─────────────┘                 │
│                                                                             │
│  ⚠️ SCI IS : Réintégration des amortissements à la revente                │
│  PV = Prix vente - (Prix achat - Amortissements cumulés)                  │
│  PV = 247 100€ - (195 000€ - 81 725€) = 133 825€                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Onglet Tableau 9 ans (PREMIUM)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📅 TABLEAU DÉTAILLÉ ANNÉE PAR ANNÉE                         [PREMIUM]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Année │ Loyers  │ Charges │ Intérêts│ Amort.  │ Économie│ Cash-flow       │
│        │ bruts   │ totales │ emprunt │Jeanbrun │ impôt   │                 │
│  ──────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────        │
│    1   │  7 320€ │  2 328€ │  5 512€ │  6 825€ │  6 500€ │  +852€         │
│    2   │  7 320€ │  2 328€ │  5 384€ │  6 825€ │  6 500€ │  +852€         │
│    3   │  7 320€ │  2 328€ │  5 248€ │  6 825€ │  6 500€ │  +852€         │
│    4   │  7 320€ │  2 328€ │  5 104€ │  6 825€ │  6 500€ │  +852€         │
│    5   │  7 320€ │  2 328€ │  4 952€ │  6 825€ │  6 500€ │  +852€         │
│    6   │  7 320€ │  2 328€ │  4 790€ │  6 825€ │  6 500€ │  +852€         │
│    7   │  7 320€ │  2 328€ │  4 618€ │  6 825€ │  6 500€ │  +852€         │
│    8   │  7 320€ │  2 328€ │  4 436€ │  6 825€ │  6 500€ │  +852€         │
│    9   │  7 320€ │  2 328€ │  4 244€ │  6 825€ │  6 500€ │  +852€         │
│  ──────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────        │
│ TOTAL  │ 65 880€ │ 20 952€ │ 44 288€ │ 61 425€ │ 58 500€ │ 7 668€         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Capture Lead / Paiement

### 11.1 Modal Capture Email (Freemium)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░  ╔═══════════════════════════════════════════════════╗  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║   📧 RECEVEZ VOS RÉSULTATS PAR EMAIL            ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ✓ Sauvegarder votre simulation                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ✓ Recevoir un récapitulatif                    ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ✓ Être informé des évolutions de la loi        ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ┌───────────────────────────────────────────┐  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │  votre@email.com                          │  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  └───────────────────────────────────────────┘  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ┌───────────────────────────────────────────┐  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │  Prénom                                   │  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  └───────────────────────────────────────────┘  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ┌───────────────────────────────────────────┐  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │  Téléphone (optionnel)                    │  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  └───────────────────────────────────────────┘  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ☑ J'accepte de recevoir des informations       ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ╔═══════════════════════════════════════════╗  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ║       VOIR MES RÉSULTATS →                ║  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ╚═══════════════════════════════════════════╝  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  🔒 Vos données sont protégées (RGPD)           ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ╚═══════════════════════════════════════════════╝  ░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Modal Paiement Premium (v2.0 - Avec Pack Duo + Upsell)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░  ╔═══════════════════════════════════════════════════╗  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║   🔓 DÉBLOQUEZ TOUTES LES FONCTIONNALITÉS       ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ┌─────────────────────┐ ┌─────────────────────┐║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │   PREMIUM           │ │   PACK DUO          │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │      9,90 €         │ │     14,90 €         │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │                     │ │      POPULAIRE ⭐    │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │ ✓ 3 simulations     │ │ ✓ Illimité 30 jours │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │ ✓ Export PDF        │ │ ✓ Tout Premium      │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │ ✓ Comparatifs       │ │ ✓ Guide PDF Loi     │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │ ✓ Tableau 9 ans     │ │   Jeanbrun (50p)    │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │ ✓ Sauvegarde        │ │ ✓ Support priorité  │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │                     │ │                     │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │       [ ]           │ │       [●]           │║  ░░░░░░░░░░░│
│░░░░░░░░  ║  └─────────────────────┘ └─────────────────────┘║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  Carte bancaire                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ┌───────────────────────────────────────────┐  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │  4242 4242 4242 4242                      │  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  └───────────────────────────────────────────┘  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ┌─────────────┐ ┌───────────────────────────┐  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  │ MM/AA       │ │ CVC                       │  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  └─────────────┘ └───────────────────────────┘  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ╔═══════════════════════════════════════════╗  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ║       PAYER 14,90 € →                     ║  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  ╚═══════════════════════════════════════════╝  ║  ░░░░░░░░░░░│
│░░░░░░░░  ║                                                 ║  ░░░░░░░░░░░│
│░░░░░░░░  ║  🔒 Paiement sécurisé par Stripe                ║  ░░░░░░░░░░░│
│░░░░░░░░  ╚═══════════════════════════════════════════════╝  ░░░░░░░░░░░│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Composants UI

### 12.1 Input Text

```
Default:
┌───────────────────────────────────────────────────────────┐
│  Placeholder...                                           │
└───────────────────────────────────────────────────────────┘

Focus:
┌═══════════════════════════════════════════════════════════┐
│  Valeur saisie                                            │
└═══════════════════════════════════════════════════════════┘
(bordure bleue + ombre légère)

Error:
┌───────────────────────────────────────────────────────────┐
│  Valeur invalide                                          │
└───────────────────────────────────────────────────────────┘
⚠️ Message d'erreur en rouge
```

### 12.2 Slider

```
Label                                              Valeur
┌───────────────────────────────────────────────────────────┐
│  ○─────────────────●─────────────────────────────────────○│
│  Min              Current                             Max │
└───────────────────────────────────────────────────────────┘
```

### 12.3 Card Option

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│   [ICON]                                                  │
│                                                           │
│   TITRE OPTION                                           │
│   ═══════════════                                        │
│                                                           │
│   • Avantage 1                                           │
│   • Avantage 2                                           │
│   • Avantage 3                                           │
│                                                           │
│           [●] ou [ ]                                      │
│                                                           │
│   [BADGE OPTIONNEL]                                       │
│                                                           │
└───────────────────────────────────────────────────────────┘

États:
- Default : Bordure grise
- Hover : Bordure bleue légère
- Selected : Bordure bleue, fond bleu clair
```

### 12.4 Progress Bar

```
Étape 3/6

●━━━━●━━━━●━━━━○━━━━○━━━━○
1    2    3    4    5    6

Profil  Projet  Financement  Stratégie  Durée  Structure
                    ↑
                Actif
```

### 12.5 Jauge Endettement (v2.0 - Avec couleurs)

```
Taux d'endettement : 28%

┌─────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░│ 35%              │
│  [        VERT       ][  ORANGE  ][ ROUGE ]                 │
│       < 30%             30-35%      > 35%                   │
└─────────────────────────────────────────────────────────────┘

Couleurs :
- 🟢 Vert (#22C55E) : < 30%
- 🟠 Orange (#F97316) : 30-35%
- 🔴 Rouge (#EF4444) : > 35%
```

### 12.6 Alerte Éligibilité (v2.0 - Nouveau)

```
État VALIDE :
┌──────────────────────────────────────────────────────────────┐
│  ✅ ÉLIGIBLE                                                 │
│  Vos travaux (70 000€) représentent 35,9% du prix d'achat.  │
│  Seuil requis : 30% minimum ✓                               │
└──────────────────────────────────────────────────────────────┘
Fond : vert clair (#DCFCE7), Bordure : vert (#22C55E)

État INVALIDE :
┌──────────────────────────────────────────────────────────────┐
│  ⚠️ NON ÉLIGIBLE                                             │
│  Vos travaux (50 000€) représentent 25,6% du prix d'achat.  │
│  Minimum requis : 58 500€ (+8 500€ nécessaires)             │
└──────────────────────────────────────────────────────────────┘
Fond : orange clair (#FFF7ED), Bordure : orange (#F97316)
```

---

## 13. Responsive Mobile

### 13.1 Wireframe Mobile (375px) - Étape 2 avec Travaux

```
┌─────────────────────────┐
│  🏠        Étape 2/6    │
│  ●●○○○○                 │
├─────────────────────────┤
│                         │
│  PROJET IMMOBILIER      │
│                         │
│  TYPE DE BIEN           │
│                         │
│  ┌───────────────────┐  │
│  │  🏗️ NEUF          │  │
│  │  VEFA ou < 5 ans  │  │
│  │       [●]         │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │  🔨 ANCIEN        │  │
│  │  Travaux ≥ 30%    │  │
│  │       [ ]         │  │
│  └───────────────────┘  │
│                         │
│  ╔═══════════════════╗  │
│  ║ TRAVAUX (v2.0)    ║  │
│  ║ Si ANCIEN coché   ║  │
│  ╠═══════════════════╣  │
│  ║ Montant travaux   ║  │
│  ║ ┌───────────────┐ ║  │
│  ║ │ €  70 000     │ ║  │
│  ║ └───────────────┘ ║  │
│  ║                   ║  │
│  ║ ✅ Éligible       ║  │
│  ║ 35,9% > 30% ✓     ║  │
│  ╚═══════════════════╝  │
│                         │
│  LOCALISATION           │
│                         │
│  ┌───────────────────┐  │
│  │  📍 Lyon...    ▼ │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ 📍 LYON - Zone A  │  │
│  │ Prix m² : 4 850 € │  │
│  │ Loyer m² : 14,20 €│  │
│  └───────────────────┘  │
│                         │
│  Surface (m²)           │
│  ┌───────────────────┐  │
│  │  45               │  │
│  └───────────────────┘  │
│                         │
│  Prix acquisition (€)   │
│  ┌───────────────────┐  │
│  │  195 000          │  │
│  └───────────────────┘  │
│                         │
│  4 333 €/m² ✓           │
│                         │
├─────────────────────────┤
│  ┌─────────────────┐    │
│  │  ← Retour       │    │
│  └─────────────────┘    │
│  ╔═════════════════╗    │
│  ║  Continuer →    ║    │
│  ╚═════════════════╝    │
└─────────────────────────┘
```

### 13.2 Breakpoints

| Breakpoint | Largeur | Usage |
|------------|---------|-------|
| Mobile | < 640px | 1 colonne |
| Tablet | 640-1024px | 2 colonnes |
| Desktop | 1024-1440px | Layout principal |
| Large | > 1440px | Centré max 1440px |

### 13.3 Adaptations Mobile Spécifiques (v2.0)

| Élément | Desktop | Mobile |
|---------|---------|--------|
| Graphique patrimoine | 12 points | 4 points (An 1, 5, 9, 12) |
| Tableau comparatif | Colonnes | Cards empilées + onglets |
| Jauge endettement | Horizontale | Horizontale (largeur 100%) |
| Visualisation Perte/Gain | Tableau | Cards empilées |

---

## Annexe : Formules de calcul (v2.0 - CORRIGÉES)

### Calcul TMI

```javascript
const calculTMI = (revenus, parts) => {
  const qf = revenus / parts;
  if (qf <= 11294) return 0;
  if (qf <= 28797) return 11;
  if (qf <= 82341) return 30;
  if (qf <= 177106) return 41;
  return 45;
};
```

### Calcul Amortissement Jeanbrun (v2.0 - CORRIGÉ avec base 80%)

```javascript
// ⚠️ CORRECTION v2.0 : Base d'amortissement = 80% du prix (terrain exclu)
const calculAmortissement = (prixAchat, niveau) => {
  // Base d'amortissement = 80% du prix (hors terrain estimé à 20%)
  const baseAmortissement = prixAchat * 0.80;  // ← CORRECTION CRITIQUE
  
  const taux = { 
    intermediaire: 0.035, 
    social: 0.045, 
    tresSocial: 0.055 
  };
  const plafond = { 
    intermediaire: 8000, 
    social: 10000, 
    tresSocial: 12000 
  };
  
  const amortBrut = baseAmortissement * taux[niveau];  // ← Appliqué sur 80%
  return Math.min(amortBrut, plafond[niveau]);
};

// Exemple : Bien à 250 000€, loyer intermédiaire
// Base = 250 000 × 0.80 = 200 000€
// Amortissement brut = 200 000 × 3,5% = 7 000€
// Amortissement net = MIN(7 000, 8 000) = 7 000€
```

### Calcul Mensualité Crédit

```javascript
const calculMensualite = (capital, tauxAnnuel, dureeMois) => {
  const tauxMensuel = tauxAnnuel / 100 / 12;
  return (capital * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -dureeMois));
};
```

### Calcul Mensualité avec Différé (v2.0 - NOUVEAU)

```javascript
const calculMensualiteAvecDiffere = (capital, tauxAnnuel, dureeMois, differeMois) => {
  const tauxMensuel = tauxAnnuel / 100 / 12;
  
  // Pendant le différé : uniquement les intérêts
  const mensualiteDiffere = capital * tauxMensuel;
  
  // Après le différé : capital + intérêts sur durée restante
  const dureeRestante = dureeMois - differeMois;
  const mensualiteApres = (capital * tauxMensuel) / 
                         (1 - Math.pow(1 + tauxMensuel, -dureeRestante));
  
  return {
    mensualiteDiffere: Math.round(mensualiteDiffere),
    mensualiteApres: Math.round(mensualiteApres),
    coutSupplementaire: Math.round(mensualiteDiffere * differeMois)
  };
};
```

### Calcul Plus-value

```javascript
const calculPlusValue = (prixVente, prixAchat, frais, anneesDetention) => {
  const pvBrute = prixVente - prixAchat - frais;
  
  // Abattement IR (6%/an de 6 à 21 ans, 4% la 22ème)
  let abattIR = 0;
  if (anneesDetention > 5) {
    abattIR = Math.min((anneesDetention - 5) * 6, 100);
  }
  
  // Abattement PS (1,65%/an de 6 à 21 ans, puis 9%/an jusqu'à 30 ans)
  let abattPS = 0;
  if (anneesDetention > 5) {
    abattPS = Math.min((anneesDetention - 5) * 1.65, 28);
  }
  if (anneesDetention > 22) {
    abattPS += (anneesDetention - 22) * 9;
    abattPS = Math.min(abattPS, 100);
  }
  
  const pvImposableIR = pvBrute * (1 - abattIR / 100);
  const pvImposablePS = pvBrute * (1 - abattPS / 100);
  
  const impotIR = pvImposableIR * 0.19;
  const impotPS = pvImposablePS * 0.172;
  
  return { pvBrute, impotIR, impotPS, total: impotIR + impotPS };
};
```

### Vérification Éligibilité Ancien (v2.0 - NOUVEAU)

```javascript
const verifierEligibiliteAncien = (prixAchat, montantTravaux) => {
  const seuilMinimum = prixAchat * 0.30;
  const pourcentageTravaux = (montantTravaux / prixAchat) * 100;
  
  return {
    eligible: montantTravaux >= seuilMinimum,
    seuilRequis: seuilMinimum,
    pourcentage: pourcentageTravaux.toFixed(1),
    manque: Math.max(0, seuilMinimum - montantTravaux)
  };
};
```

---

**Fin du document de wireframes v2.0**

*Document confidentiel - Simulateur Loi Jeanbrun v2.0*
*Changelog : Corrections critiques (travaux, base 80%) + Améliorations UX/UI/Mobile*
