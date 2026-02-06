# Pivot Lead Generation — Requirements

> **Module :** Pivot Business Model - Lead Generation
> **Plateformes :** simuler-loi-jeanbrun.fr + stop-loyer.fr
> **Date :** 6 fevrier 2026
> **Statut :** Draft v1.0

---

## Description

CardImmo pivote d'un modele "vente de packs simulations" vers un modele **"apporteur d'affaires digital specialise en generation de leads qualifies"** pour promoteurs immobiliers et courtiers en credit.

Deux plateformes de simulation (Loi Jeanbrun pour investisseurs locatifs, PTZ pour primo-accedants) generent des leads ultra-qualifies revendus a deux types de partenaires :
1. **Promoteurs immobiliers** : leads avec simulation complete (TMI, budget, zone, ROI calcule)
2. **Courtiers en credit** : leads avec donnees financieres (revenus, apport, capacite d'emprunt)

**Avantage client :** Le prospect travaille en **direct avec le promoteur**, sans intermediaire. Il beneficie des **tarifs directs promoteurs**, des **offres speciales** (frais de notaire offerts, remises commerciales) et d'un accompagnement personnalise. La simulation gratuite lui donne une vision claire de son projet avant tout engagement.

**Cadre juridique :** Apporteur d'affaires (convention commerciale), pas d'intermediation immobiliere (pas de carte T requise). Convention d'apport d'affaires avec courtier IOBSP (pas de montage dossier, pas de recommandation bancaire).

**Architecture :** Monorepo Turborepo avec deux apps Next.js (jeanbrun + stop-loyer) partageant les packages communs (DB, leads, UI, SEO).

```
/monorepo
├── apps/
│   ├── jeanbrun/        → simuler-loi-jeanbrun.fr
│   └── stop-loyer/      → stop-loyer.fr
└── packages/
    ├── ui/              → Composants partages (shadcn, lead gate, wizard steps)
    ├── database/        → Drizzle schema (leads, promoters, brokers, programs)
    ├── leads/           → Logique metier leads (capture, dispatch, scoring)
    ├── seo/             → SEO partage (pages villes, metadata, sitemap)
    └── config/          → Config partagee (eslint, tsconfig, tailwind)
```

---

## Exigences Fonctionnelles

### EF-01 : Simulateur 2 temps (Simulation + Capture)

| # | Exigence |
|---|----------|
| 1 | Le simulateur Jeanbrun conserve ses 6 etapes de saisie (profil investisseur, projet immobilier, financement, strategie locative, duree/sortie, structure juridique) |
| 2 | Le simulateur PTZ (stop-loyer.fr) comporte 3 etapes : situation personnelle, projet immobilier, capacite financiere |
| 3 | La simulation est **100% gratuite** et ne necessite aucune inscription |
| 4 | Les resultats partiels (teaser) s'affichent immediatement apres simulation |
| 5 | Le rapport complet est conditionne a la capture du lead (email + telephone) |

### EF-02 : Page Resultats (Teaser + Lead Gate)

| # | Exigence |
|---|----------|
| 1 | **Resultats gratuits affiches :** economie d'impot annuelle estimee, ROI attendu (TRI), effort d'epargne mensuel, comparatif rapide Jeanbrun vs LMNP vs Nue-propriete, graphique synthetique annee par annee |
| 2 | **Lead gate :** formulaire inline (email, telephone, prenom, nom) avec 3 consentements distincts |
| 3 | **Rapport premium (envoye par email) :** PDF detaille avec tableau annee par annee, programmes eligibles dans la zone (si partenariat actif), estimation financement personnalisee |
| 4 | L'avantage client est clairement mis en avant : acces direct promoteur sans intermediaire, tarifs promoteurs directs, offres speciales (frais de notaire offerts le cas echeant) |

### EF-03 : Capture Lead et Consentements RGPD

| # | Exigence |
|---|----------|
| 1 | **Consentement promoteur** (checkbox distincte) : "J'accepte que mes donnees soient transmises a un promoteur partenaire pour une presentation de biens." |
| 2 | **Consentement courtier** (checkbox distincte et separee) : "J'accepte que mes donnees soient transmises a un courtier partenaire pour une proposition de financement personnalisee." |
| 3 | **Consentement newsletter** (checkbox distincte) : "J'accepte de recevoir la newsletter." |
| 4 | Les 3 consentements sont **independants** (le prospect peut cocher 1, 2 ou 3) |
| 5 | La date de consentement est enregistree en base |
| 6 | Le lead est stocke avec l'integralite des donnees de simulation (JSONB) |

### EF-04 : Double Monetisation (Promoteur + Courtier)

| # | Exigence |
|---|----------|
| 1 | **Donnees transmises au promoteur :** contact complet, resultats simulation, zone souhaitee, budget, TMI, type de bien recherche |
| 2 | **Donnees transmises au courtier :** contact complet, revenus mensuels nets, apport disponible, budget projet, zone, capacite d'emprunt estimee (Jeanbrun) ou eligibilite PTZ confirmee (Stop-Loyer), composition foyer |
| 3 | **Dispatch automatique :** email notification au promoteur ET/OU courtier selon consentements donnes |
| 4 | **Dispatch separe :** les leads promoteur et courtier sont traites independamment (API et notifications distinctes) |
| 5 | **Modeles tarifaires promoteur :** par lead (100-200EUR), commission conversion (2-4% HT), ou hybride (50EUR/lead + 1.5% conversion) |
| 6 | **Tarif courtier :** forfait par lead transmis (50-80EUR lead PTZ, 40-60EUR lead investisseur) |

### EF-05 : Avantage Client Direct Promoteur

| # | Exigence |
|---|----------|
| 1 | Le prospect est mis en relation **directe** avec le promoteur, sans intermediaire |
| 2 | Le prospect beneficie des **tarifs promoteurs directs** (prix catalogue sans marge d'intermediation) |
| 3 | Le prospect accede aux **offres speciales** : frais de notaire offerts, remises commerciales, prestations offertes (cuisine equipee, parking, etc.) quand elles existent |
| 4 | Cet avantage est explicitement communique sur la page resultats et dans le rapport PDF |
| 5 | Le promoteur est informe que le prospect attend un contact direct et personnalise |
| 6 | Aucune commission n'est prelevee sur le prix d'achat du client (la remuneration est a la charge du promoteur via la convention d'apport d'affaires) |

### EF-06 : Visibilite Programmes

| # | Exigence |
|---|----------|
| 1 | **Aucun programme affiche sans autorisation ecrite** du promoteur (convention signee) |
| 2 | Les programmes scrapes non autorises sont masques cote front |
| 3 | Un programme fictif de demonstration est disponible pour les prospects commerciaux |
| 4 | Chaque programme affiche les typologies, prix, surfaces, et eligibilite (Jeanbrun et/ou PTZ) |
| 5 | Un meme programme peut contenir des lots pour investisseurs (T1-T2) ET primo-accedants (T2-T4) |

### EF-07 : Dashboard Admin Leads

| # | Exigence |
|---|----------|
| 1 | Liste des leads avec filtres (plateforme, statut, date, score) |
| 2 | Detail lead avec historique des dispatches (promoteur, courtier) |
| 3 | Statuts : `new` → `dispatched` → `contacted` → `converted` / `lost` |
| 4 | Score qualite lead (0-100) base sur completude simulation |
| 5 | Suivi revenus par promoteur et par courtier |

---

## Exigences Non-Fonctionnelles

### RGPD et Conformite

| # | Exigence |
|---|----------|
| 1 | Politique de confidentialite dediee mentionnant explicitement les partenaires et types de transmission |
| 2 | Lien de desinscription dans chaque email + formulaire en ligne |
| 3 | Registre des traitements interne documentant les flux de donnees |
| 4 | Duree de retention maximale : **36 mois** apres dernier contact |
| 5 | Droit de retrait (suppression donnees) accessible a tout moment |
| 6 | Base legale : consentement explicite (pas d'interet legitime pour la transmission a des tiers) |

### Securite

| # | Exigence |
|---|----------|
| 1 | Donnees leads chiffrees au repos (Neon encryption at rest) |
| 2 | Transmission leads via HTTPS uniquement |
| 3 | API leads authentifiee (bearer token par partenaire) |
| 4 | Validation Zod de toutes les entrees utilisateur |
| 5 | Rate limiting sur les endpoints de simulation et capture |
| 6 | Aucun secret hardcode (env variables) |

### Performance

| # | Exigence |
|---|----------|
| 1 | Calcul simulation < 500ms |
| 2 | Page resultats (teaser) < 1s de chargement |
| 3 | Generation PDF rapport < 5s |
| 4 | Dispatch lead (email notification) < 10s apres soumission |

### UX

| # | Exigence |
|---|----------|
| 1 | Responsive mobile-first |
| 2 | Le lead gate ne bloque pas la visualisation du teaser |
| 3 | L'avantage "direct promoteur sans intermediaire" est mis en evidence visuellement |
| 4 | Les offres speciales (frais de notaire offerts, etc.) sont signalees par un badge ou tag |

---

## Criteres d'Acceptation

### Critiques

- [ ] Simulation complete executable sans inscription (6 etapes Jeanbrun, 3 etapes PTZ)
- [ ] Page resultats affiche le teaser gratuit immediatement
- [ ] Lead gate avec 3 consentements RGPD distincts et independants
- [ ] Lead stocke en base avec simulation_data JSONB complete
- [ ] Dispatch email promoteur declenche si consentement promoteur donne
- [ ] Dispatch email courtier declenche si consentement courtier donne (separe du promoteur)
- [ ] Aucun programme affiche sans convention signee
- [ ] Avantage client (direct promoteur, tarifs directs, offres speciales) visible sur la page resultats

### Importants

- [ ] Score qualite lead calcule automatiquement
- [ ] Dashboard admin leads fonctionnel avec filtres
- [ ] Rapport PDF genere et envoye par email au prospect
- [ ] Politique de confidentialite a jour avec mentions partenaires
- [ ] Donnees courtier et promoteur transmises separement (pas le meme payload)

### Souhaitables

- [ ] Tracking UTM (source, medium, campaign) sur chaque lead
- [ ] A/B testing sur le wording du lead gate
- [ ] Retargeting des leads non convertis

---

*Derniere mise a jour : 6 fevrier 2026*
