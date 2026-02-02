# Landing Page Simulateur Loi Jeanbrun

## Description

Landing page optimisee pour la conversion, le SEO et l'accessibilite du Simulateur Loi Jeanbrun. Positionne le dispositif comme le **produit d'excellence pour preparer la retraite** avec un chiffre d'ancrage de **50 000EUR d'economie d'impot** (TMI 45%).

## Contexte fiscal

### Calcul du chiffre d'ancrage (TMI 45%)

| Element | Valeur |
|---------|--------|
| Amortissement annuel max (tres social) | 12 000EUR/an |
| Duree engagement | 9 ans |
| Total amortissement | 108 000EUR |
| TMI maximum | 45% |
| **Economie IR totale** | **48 600EUR** (arrondi **50 000EUR**) |

**Note fiscale importante :**
- Les PS (17.2%) s'appliquent sur les revenus fonciers *positifs*, pas sur l'amortissement/deficit
- Le calcul TMI seul (45%) est le chiffre fiable et conservateur
- Formule du code : `economie = amortissement × TMI` (src/lib/calculs/tmi.ts:95)

### Avantages uniques Jeanbrun

- **Plafond deficit foncier DOUBLE** : 21 400EUR/an (vs 10 700EUR standard) jusqu'au 31/12/2027
- **Hors plafond niches fiscales** : Deficit foncier non soumis au plafond 10 750EUR des reductions d'impot
- **22 ans de detention** : Exoneration totale plus-value (IR 19%)
- **30 ans de detention** : Exoneration prelevements sociaux (17.2%)
- **Amortissements NON reintegres** a la revente (contrairement au LMNP)
- **Revenus complementaires a la retraite** : loyers + bien patrimonial

### Positionnement historique : Le retour d'un vrai dispositif genereux

| Critere | **Jeanbrun (2026)** | Robien (2003-2009) | Pinel (2014-2024) | Denormandie |
|---------|---------------------|-------------------|-------------------|-------------|
| **Type** | Amortissement | Amortissement | Reduction impot | Reduction impot |
| **Economie max (TMI 45%)** | **~50 000EUR** | ~60 000EUR | 63 000EUR | 63 000EUR |
| **Temps pour max** | **9 ans** | 15 ans | 12 ans | 12 ans |
| **Plafond annuel** | **21 400EUR** | Variable | 6 000EUR | 6 000EUR |
| **Hors plafond niches** | **OUI** | Oui | Non | Non |
| **Amortissements reintegres** | **NON** | Non | N/A | N/A |
| **Statut 2026** | **ACTIF** | Termine | Termine | Actif |

**Arguments marketing differenciants :**

1. **"Le retour de la loi Robien, en mieux"**
   - Premier dispositif d'amortissement aussi genereux depuis 2009
   - Meme logique que Robien avec les avantages modernes (retraite, non-reintegration)

2. **"Plafond DOUBLE vs deficit foncier classique"**
   - 21 400EUR/an deductible (vs 10 700EUR standard)
   - Bonus travaux energetiques jusqu'au 31/12/2027

3. **"Le seul dispositif neuf apres Pinel"**
   - Pinel termine au 31/12/2024
   - Jeanbrun = seule solution defiscalisation immobilier neuf 2026

4. **"Hors plafond des niches fiscales"**
   - Pinel/Denormandie soumis au plafond 10 750EUR/an
   - Jeanbrun genere du deficit foncier (mecanisme different)

Sources :
- [Investissement-locatif.com - Loi Finances 2026](https://www.investissement-locatif.com/loi-finances-2026-changements-immobiliers.html)
- [Trackstone - Alternatives Pinel 2026](https://www.trackstone.fr/blog/finance/les-dispositifs-fiscaux-immobiliers-en-2025)
- [Defiscalisation.immo - Loi Robien](https://www.defiscalisation.immo/lois/anciens-dispositifs/robien/)

---

## Reference : Comparatif complet des dispositifs fiscaux

### Tableau de synthese (pour ComparisonTable)

| Critere | Robien | Duflot | Pinel | **Jeanbrun** |
|---------|--------|--------|-------|--------------|
| **Mecanisme** | Amortissement | Reduction IR | Reduction IR | **Amortissement** |
| **Periode** | 2003-2009 | 2013-2014 | 2014-2024 | **2026+** |
| **Max economie/an** | Illimite | ~6 000EUR | ~6 300EUR | **5 400EUR** (TMI 45%) |
| **Plafond niches** | Non | Oui (10kEUR) | Oui (10kEUR) | **Non** |
| **Flexibilite** | 3/3 | 1/3 | 2/3 | **2/3** |

### Detail Jeanbrun

| Element | Valeur |
|---------|--------|
| Type | Amortissement (deduction revenus fonciers) |
| Base amortissable | 80% du prix (terrain exclu) |
| Taux intermediaire | 3.5% → plafond 8 000EUR/an |
| Taux social | 4.5% → plafond 10 000EUR/an |
| Taux tres social | 5.5% → plafond 12 000EUR/an |
| Duree engagement | 9 ans obligatoire |
| Plafond niches fiscales | Non concerne (amortissement) |
| PV immobiliere | Exoneration IR apres 22 ans, PS apres 30 ans |
| Reintegration amort. | Non (avantage vs LMNP) |

### Avantages cles Jeanbrun vs Pinel/Duflot

1. **Hors plafond niches** → Cumulable avec Sofica, FCPI, FIP, dons, etc.
2. **Effet levier TMI** → Plus la TMI est haute, plus c'est rentable
3. **Pas de reintegration** → Contrairement au LMNP a la revente
4. **Plus-value avantageuse** → Abattements classiques + amort. non deduits

### Inconvenients Jeanbrun (transparence)

1. **Plafond annuel** → Max 12 000EUR/an (vs illimite Robien)
2. **Engagement rigide** → 9 ans obligatoires
3. **Loyers contraints** → Inferieurs au marche (social/intermediaire)

---

## Exigences fonctionnelles

### EF-01 : Hero Section avec chiffre d'ancrage

- Titre principal : "Jusqu'a 50 000EUR d'economie d'impot avec la Loi Jeanbrun"
- Sous-titre : "Le produit d'excellence pour preparer votre retraite - Simulez en 60 secondes"
- CTA principal : "Je calcule mon economie d'impot"
- CTA secondaire : "Decouvrir les avantages retraite"
- Compteur anime de 0 a 50 000 (respect prefers-reduced-motion)

### EF-02 : Formulaire rapide (above-the-fold)

- 4 etapes maximum
- Champs : montant investissement, TMI, type bien (neuf/ancien), niveau loyer
- Resultat immediat sans rechargement
- Redirection vers simulateur complet pour details

### EF-03 : Trust Signals

4 badges de confiance :
1. "Jusqu'a 50 000EUR d'economie"
2. "Plafond DOUBLE jusqu'en 2027"
3. "0EUR impot apres 22 ans"
4. "Resultat en 60 sec"

### EF-03b : Bandeau Urgence (NOUVEAU)

Bandeau sticky ou highlight sous le hero :
- Texte : "Offre bonifiee : 21 400EUR/an deductibles jusqu'au 31/12/2027 (vs 10 700EUR standard)"
- Style : Background accent or avec icone horloge/calendrier
- CTA : "Profitez-en avant la fin"

### EF-04 : Section Avantages (angle retraite + urgence)

4 cards avec icones :
1. "50 000EUR d'economie" - Jusqu'a 12 000EUR/an d'amortissement deductible (TMI 45%)
2. "Plafond DOUBLE jusqu'en 2027" - 21 400EUR/an deductible (vs 10 700EUR apres) - **BADGE URGENCE**
3. "0EUR impot a 22 ans" - Exoneration plus-value IR + PS apres 30 ans
4. "Amortissements acquis" - Jamais reintegres a la revente (contrairement LMNP)

**Note UX :** La card #2 doit avoir un badge "Offre limitee" ou "Jusqu'au 31/12/2027" pour creer l'urgence.

### EF-05 : Section Retraite

- Timeline visuelle : 9 ans (fin engagement) → 22 ans (0% IR) → 30 ans (0% PS)
- Avantages retraite : revenus complementaires, capital protege, patrimoine transmissible
- Design dark premium avec accent or

### EF-06 : Tableau comparatif

| Critere | Jeanbrun | Pinel | LMNP |
|---------|----------|-------|------|
| Amortissement max/an | 12 000EUR | N/A | Variable |
| Plafond deficit foncier | **21 400EUR** | N/A | 10 700EUR |
| Economie sur 9 ans (TMI 45%) | **~50 000EUR** | 54 000EUR (12 ans) | Variable |
| Hors plafond niches (10 750EUR) | **Oui** | Non | Oui |
| Exoneration PV 22 ans | **Oui** | Oui | **Non** (reintegration) |
| Ideal retraite | **Excellence** | Bon | Moyen |

### EF-07 : Exemple calcul concret

**Profil :** Investisseur TMI 45%, revenus fonciers existants 30 000EUR/an
**Investissement :** 300 000EUR (neuf, zone tres sociale)

**Resultats :**
- Amortissement annuel : 12 000EUR/an × 9 ans = 108 000EUR
- Economie IR (TMI 45%) : 108 000EUR × 45% = **48 600EUR**
- Plafond deficit foncier bonifie : 21 400EUR/an
- Apres 22 ans : 0EUR d'impot sur plus-value (IR)
- Apres 30 ans : 0EUR de prelevements sociaux

### EF-08 : FAQ (8 questions)

1. Suis-je eligible a la Loi Jeanbrun ?
2. Combien puis-je economiser exactement ?
3. Quelle difference avec la loi Pinel ?
4. **Pourquoi investir avant le 31/12/2027 ?** ← NOUVEAU (urgence bonification)
5. Pourquoi Jeanbrun est ideal pour la retraite ?
6. Que se passe-t-il apres 22 ans de detention ?
7. Les amortissements sont-ils reintegres a la revente ?
8. La simulation est-elle vraiment gratuite ?

**Reponse FAQ #4 (bonification) :**
> "Jusqu'au 31 decembre 2027, le plafond de deficit foncier deductible est DOUBLE : 21 400EUR/an au lieu de 10 700EUR. Cela signifie que vous pouvez deduire deux fois plus de charges de vos revenus imposables chaque annee. Apres cette date, le plafond reviendra a 10 700EUR. C'est le moment ideal pour investir."

### EF-09 : CTA final

- Call-to-action avec effet glow pulse
- Angle retraite : "Preparez votre avenir fiscal maintenant"

---

## Exigences non-fonctionnelles

### ENF-01 : Performance

- Lighthouse mobile >= 90 (Performance, A11y, SEO, Best Practices)
- LCP < 2.5s
- CLS < 0.1
- INP < 100ms

### ENF-02 : Accessibilite WCAG 2.1 AA

- Formulaire : `role="progressbar"`, `aria-required`, `aria-describedby`, focus management
- Tableau : `aria-label`, `scope="col/row"`, icones avec `sr-only`
- FAQ Accordion : `aria-labelledby`, `aria-label`
- Navigation clavier complete
- Focus visible (ring gold)
- Respect `prefers-reduced-motion`

### ENF-03 : SEO Technique

- Metadata optimisees (title, description, keywords, OpenGraph, Twitter)
- JSON-LD : WebPage, FAQPage, SoftwareApplication, Organization
- Sitemap avec priority 1.0
- Image OG optimisee (1200x630)

### ENF-04 : Design

- Style : Dark premium (fond sombre #0A0A0B + accent or #F5A623)
- Typographie : DM Serif Display (titres) + Inter (corps) + JetBrains Mono (chiffres)
- Tokens CSS : OKLch pour couleurs
- Animations CSS (pas de Framer Motion)

---

## Criteres d'acceptation

### Build & Quality

- [ ] `pnpm check` passe sans erreur (lint + typecheck)
- [ ] `pnpm build:ci` genere le build production
- [ ] Pas de console.log dans le code

### Performance

- [ ] Lighthouse Performance >= 90 (mobile)
- [ ] Lighthouse Accessibility >= 90
- [ ] Lighthouse SEO >= 90
- [ ] Lighthouse Best Practices >= 90
- [ ] Core Web Vitals tous verts

### Accessibilite

- [ ] axe DevTools : 0 issues critiques/serieuses
- [ ] Navigation clavier complete (Tab, Enter, Escape)
- [ ] Screen reader test (VoiceOver/NVDA) valide
- [ ] Contraste AA sur tous les textes

### SEO

- [ ] Rich Results Test : FAQPage valide
- [ ] Rich Results Test : SoftwareApplication valide
- [ ] Mobile-Friendly Test : Pass
- [ ] Metadata complete (title < 60 chars, description < 160 chars)

### Fonctionnel

- [ ] Formulaire rapide fonctionne et calcule
- [ ] Compteur anime s'arrete a 50 000
- [ ] Tous les liens CTA pointent vers /simulateur
- [ ] FAQ accordion fonctionne au clavier
- [ ] prefers-reduced-motion respecte (pas d'animation)

---

*Derniere mise a jour : 1er fevrier 2026*
