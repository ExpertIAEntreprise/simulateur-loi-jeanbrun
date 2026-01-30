# Feature: Moteur de Calcul Fiscal

## Description

Module central de calculs fiscaux pour le simulateur Loi Jeanbrun. Implémente tous les calculs nécessaires : IR 2026, TMI, amortissement Jeanbrun (neuf/ancien), déficit foncier bonifié, crédit immobilier, plus-value, LMNP et rendements locatifs.

---

## Exigences Fonctionnelles

### EF-1: Calcul IR 2026

- Appliquer le barème progressif 2026 (5 tranches : 0%, 11%, 30%, 41%, 45%)
- Gérer le quotient familial avec plafonnement (1 759€/demi-part)
- Retourner : impôt brut, impôt net, TMI, taux moyen

### EF-2: Détermination TMI automatique

- Calculer la TMI depuis revenu net imposable + nombre de parts
- Indiquer les seuils de la tranche actuelle
- Calculer le revenu restant avant passage à la tranche supérieure

### EF-3: Amortissement Jeanbrun Neuf

- Base : 80% du prix d'acquisition (terrain exclu)
- Taux selon niveau de loyer :
  - Intermédiaire : 3.5%, plafond 8 000€
  - Social : 4.5%, plafond 10 000€
  - Très social : 5.5%, plafond 12 000€
- Durée engagement : 9 ans obligatoire

### EF-4: Amortissement Jeanbrun Ancien

- Condition d'éligibilité : travaux >= 30% du prix d'acquisition
- Base : 80% du prix total (acquisition + travaux)
- Taux selon niveau de loyer :
  - Intermédiaire : 3.0%, plafond 10 700€
  - Social : 3.5%, plafond 10 700€
  - Très social : 4.0%, plafond 10 700€

### EF-5: Déficit Foncier Bonifié

- Plafond bonifié : 21 400€ (vs 10 700€ normal)
- Période : jusqu'au 31/12/2027
- Conditions : travaux énergétiques + passage classe E/F/G → A/B/C/D
- Report sur revenus fonciers : 10 ans maximum

### EF-6: Calcul Crédit Immobilier

- Mensualité hors assurance (formule standard)
- Mensualité avec assurance
- Tableau d'amortissement complet
- TAEG estimé
- Capacité d'emprunt / Taux d'endettement

### EF-7: Plus-Value Immobilière

- Abattements IR : exonération totale après 22 ans
- Abattements PS : exonération totale après 30 ans
- Surtaxe si PV > 50 000€
- Prix de revient = acquisition + frais + travaux

### EF-8: Comparatif LMNP

- Calcul résultat fiscal LMNP (réel simplifié)
- Amortissements immo (25-30 ans) + mobilier (5-10 ans)
- Comparaison avantage Jeanbrun vs LMNP
- Recommandation automatique

### EF-9: Rendements Locatifs

- Rendement brut : loyer / prix
- Rendement net : (loyer - charges) / (prix + frais)
- Rendement net-net : après impôts (estimation TMI 30%)

### EF-10: Orchestrateur de Simulation

- Coordonner tous les modules pour une simulation complète
- Estimer le loyer selon zone fiscale et niveau de loyer
- Calculer le cash-flow mensuel
- Optionnel : comparatif LMNP + plus-value à la sortie

---

## Exigences Non-Fonctionnelles

### ENF-1: Performance

- Temps de calcul < 50ms pour une simulation complète
- Pas d'appels asynchrones inutiles
- Fonctions pures sans effets de bord

### ENF-2: Précision

- Résultats arrondis à l'euro près
- Tolérance de 1€ sur les cas de test de référence
- Barèmes exactement conformes au BOFiP 2026

### ENF-3: Maintenabilité

- Constantes fiscales centralisées dans `constants.ts`
- Chaque module dans son propre fichier
- Types TypeScript stricts pour tous les inputs/outputs

### ENF-4: Testabilité

- Couverture tests >= 90% sur `/lib/calculs/`
- Tests unitaires pour chaque fonction exportée
- Cas limites testés (seuils, plafonds, edge cases)

---

## Critères d'Acceptation

### CA-1: Module IR
- [ ] Calcul correct pour célibataire 30k€ → TMI 11%
- [ ] Calcul correct pour couple 2 parts 60k€ → TMI 11%
- [ ] Plafonnement QF appliqué correctement

### CA-2: Module Jeanbrun Neuf
- [ ] 200k€ intermédiaire → amort 5 600€/an
- [ ] 300k€ intermédiaire → plafonné à 8 000€/an
- [ ] 200k€ social → amort 7 200€/an

### CA-3: Module Jeanbrun Ancien
- [ ] Travaux 20% → inéligible avec message clair
- [ ] Travaux 33% → éligible avec calcul correct
- [ ] Plafond 10 700€ appliqué

### CA-4: Déficit Foncier
- [ ] Plafond bonifié 21 400€ avant 2028
- [ ] Report sur 10 ans fonctionnel

### CA-5: Crédit
- [ ] Mensualité correcte (formule vérifiée)
- [ ] Tableau amortissement cohérent (somme = capital)
- [ ] Taux endettement calculé

### CA-6: Plus-Value
- [ ] Abattement IR = 100% après 22 ans
- [ ] Abattement PS = 100% après 30 ans
- [ ] Surtaxe correcte si > 50k€

### CA-7: Comparatif LMNP
- [ ] Résultat fiscal LMNP calculé
- [ ] Recommandation Jeanbrun vs LMNP cohérente

### CA-8: Tests
- [ ] `pnpm test` passe à 100%
- [ ] Coverage >= 90%
- [ ] Build sans erreur TypeScript

---

## Dépendances

- Sprint 1 terminé (infrastructure Next.js + TypeScript)
- Formules validées : `formules_calcul_simulateur_jeanbrun.md`
- Barèmes IR 2026 officiels (PLF 2026 adopté)

---

## Structure des Fichiers

```
src/lib/calculs/
├── constants.ts        # Barèmes IR, plafonds Jeanbrun, taux
├── ir.ts               # Calcul IR + TMI
├── tmi.ts              # Calcul TMI détaillé
├── jeanbrun-neuf.ts    # Amortissement neuf
├── jeanbrun-ancien.ts  # Amortissement ancien + éligibilité
├── deficit-foncier.ts  # Déficit bonifié
├── credit.ts           # Crédit immobilier
├── plus-value.ts       # Plus-value avec abattements
├── lmnp.ts             # Comparatif LMNP
├── rendements.ts       # Rendements brut/net/net-net
├── orchestrateur.ts    # Coordination simulation
├── index.ts            # Exports publics
└── __tests__/          # Tests unitaires
    ├── ir.test.ts
    ├── jeanbrun-neuf.test.ts
    ├── jeanbrun-ancien.test.ts
    ├── credit.test.ts
    ├── plus-value.test.ts
    └── orchestrateur.test.ts
```

---

*Dernière mise à jour : 30 janvier 2026*
