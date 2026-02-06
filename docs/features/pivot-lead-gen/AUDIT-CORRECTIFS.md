# Pivot Lead Generation — Audit & Plan de Correctifs

> **Date audit :** 6 fevrier 2026
> **Agents utilises :** 8 (monorepo, DB schema, results page, API security, admin dashboard, programme visibility, Next.js 16 best practices, RGPD compliance)
> **Score global :** 75/100
> **Statut :** A corriger avant mise en production

---

## Scores par domaine

| Domaine | Score | Statut |
|---------|-------|--------|
| Structure Monorepo | 95/100 | EXCELLENT |
| Schema Database | 95/100 | EXCELLENT |
| Page Resultats + Lead Gate | 65/100 | A CORRIGER |
| Securite API | 60/100 | A CORRIGER |
| Dashboard Admin | 70/100 | INCOMPLET |
| Visibilite Programmes | 98/100 | EXCELLENT |
| Conformite Next.js 16 | 70/100 | A MODERNISER |
| Conformite RGPD | 45/100 | CRITIQUE |

---

## P0 — CRITIQUES (Correction immediate)

### P0-01 : Mismatch noms de champs form vs API (BLOQUANT)

- **Impact :** TOUTES les soumissions de leads echouent avec 400 Validation Error
- **Fichier form :** `apps/jeanbrun/src/components/simulateur/resultats/LeadGateForm.tsx`
- **Fichier API :** `apps/jeanbrun/src/app/api/leads/route.ts`
- **Probleme :** Le formulaire envoie `consentPromoteur`/`consentCourtier` (francais) mais l'API attend `consentPromoter`/`consentBroker` (anglais). Meme probleme pour `prenom`/`nom` vs `firstName`/`lastName` potentiellement.
- **Correction :** Ajouter un mapping dans `onSubmit` du formulaire qui traduit les noms francais en noms anglais avant l'envoi, OU renommer les champs du schema Zod cote form pour matcher l'API.
- **Effort :** 30min
- **Validation :** Tester une soumission complete du formulaire et verifier que le lead apparait en base.

### P0-02 : Consentement RGPD non "libre" (JURIDIQUE)

- **Impact :** Article 7(4) RGPD — Le consentement peut etre invalide par la CNIL. Risque d'amende.
- **Fichier :** `apps/jeanbrun/src/components/simulateur/resultats/LeadGateForm.tsx` (ligne 31-34)
- **Probleme :** Le `.refine()` Zod force au moins 1 consentement partenaire pour acceder au rapport.
- **Correction :**
  1. Supprimer le `.refine((data) => data.consentPromoteur || data.consentCourtier, ...)`
  2. Permettre la soumission avec email seul (pour envoi rapport PDF)
  3. Les consentements promoteur/courtier restent disponibles mais 100% optionnels
  4. Cote API (`api/leads/route.ts`) : supprimer la validation equivalente si elle existe
- **Effort :** 30min
- **Validation :** Verifier qu'on peut soumettre le formulaire sans cocher aucun consentement partenaire.

### P0-03 : XSS dans templates email (SECURITE)

- **Impact :** Injection HTML dans les emails envoyes aux partenaires via donnees utilisateur non echappees.
- **Fichier :** `apps/jeanbrun/src/lib/email.ts` (lignes 226-679)
- **Probleme :** Templates email en doublon de `lead-dispatch.ts`, SANS la fonction `escapeHtml()`. Donnees utilisateur (nom, email, telephone) injectees brut dans le HTML.
- **Correction :** Supprimer entierement les fonctions de notification lead dans `email.ts` (dead code). Le fichier `lead-dispatch.ts` gere deja correctement les emails avec echappement HTML. Si `email.ts` contient d'autres fonctions utiles (envoi generique), les conserver mais supprimer : `sendPromoterLeadNotification`, `sendBrokerLeadNotification`, `sendProspectConfirmation`.
- **Effort :** 15min
- **Validation :** `grep -r "sendPromoterLeadNotification\|sendBrokerLeadNotification" apps/jeanbrun/src/` ne retourne aucun appel.

### P0-04 : Endpoint financement = stub non fonctionnel (DATA LOSS)

- **Impact :** Retourne HTTP 201 (succes) sans persister en base. Perte de leads. Le `console.log` affiche des PII (email) en clair.
- **Fichier :** `apps/jeanbrun/src/app/api/leads/financement/route.ts` (ligne 71)
- **Correction :**
  1. Implementer le stockage en base via Drizzle (insert dans table `leads` avec `platform: 'jeanbrun'` et `sourcePage: 'financement'`)
  2. Appeler `calculateLeadScore()` pour scorer le lead
  3. Appeler `dispatchLead()` en fire-and-forget (meme pattern que POST `/api/leads`)
  4. Supprimer le `console.log` avec PII (ligne 82)
  5. Utiliser le logger Pino structure (`@/lib/logger`) si log necessaire
- **Effort :** 2h
- **Validation :** Soumettre via le modal financement et verifier le lead en base + email dispatch.

### P0-05 : Politique de confidentialite incomplete (RGPD)

- **Impact :** Article 13(1)(e) RGPD — Pas d'information sur le partage avec promoteurs/courtiers. Consentement non eclaire.
- **Fichier :** `apps/jeanbrun/src/app/(app)/politique-confidentialite/page.tsx`
- **Correction :** Ajouter apres la section 5.2 "Sous-traitants" :
  - Section 5.3 "Partenaires commerciaux" :
    - "Promoteurs immobiliers partenaires" : categories de donnees transmises (nom, email, telephone, zone souhaitee, budget, TMI, economie fiscale estimee, rendement net)
    - "Courtiers en credit partenaires" : categories de donnees transmises (nom, email, telephone, revenu mensuel net, apport disponible, budget projet, capacite d'emprunt estimee, taux d'endettement)
    - Base legale : consentement explicite et specifique (checkbox distincte)
    - Droit de retrait : a tout moment via [lien]
  - Ajouter dans la table des finalites (section 4) :
    - "Mise en relation avec un promoteur immobilier" — Base legale : Consentement
    - "Mise en relation avec un courtier en credit" — Base legale : Consentement
  - Completer les placeholders : SIRET, DPO, Telephone
- **Effort :** 2h
- **Validation :** Relire la politique et verifier que tous les traitements de donnees sont documentes.

### P0-06 : Texte trompeur sous le formulaire lead (TRANSPARENCE)

- **Impact :** Article 5(1)(a) RGPD — Le texte dit "utilisees uniquement pour vous envoyer le rapport" alors que les donnees sont aussi transmises aux partenaires.
- **Fichier :** `apps/jeanbrun/src/components/simulateur/resultats/LeadGateForm.tsx` (ligne ~457-462)
- **Texte actuel :** "Vos donnees sont securisees et utilisees uniquement pour vous envoyer le rapport."
- **Correction :** Remplacer par : "Vos donnees sont securisees. Selon vos choix ci-dessus, elles peuvent etre transmises a nos partenaires. Consultez notre [politique de confidentialite](/politique-confidentialite)."
- **Effort :** 10min
- **Validation :** Verifier le rendu visuel et que le lien fonctionne.

### P0-07 : Aucun mecanisme de retrait du consentement (RGPD)

- **Impact :** Article 7(3) RGPD — Le retrait doit etre "aussi simple que l'octroi". Actuellement impossible techniquement.
- **Fichiers a creer/modifier :**
  1. **Nouveau endpoint :** `apps/jeanbrun/src/app/api/leads/unsubscribe/route.ts`
     - POST avec `email` + `token` (hash unique par lead)
     - Met a jour `consentPromoter`, `consentBroker`, `consentNewsletter` a `false`
     - Retourne confirmation
  2. **Nouveau champ schema :** Ajouter `unsubscribeToken varchar(64)` a la table `leads`
     - Genere avec `crypto.randomBytes(32).toString('hex')` a la creation
  3. **Page web :** `apps/jeanbrun/src/app/(app)/desinscription/page.tsx`
     - Formulaire simple : "Entrez votre email" + bouton "Se desinscrire"
     - OU lien direct avec token : `/desinscription?token=xxx`
  4. **Modifier `lead-dispatch.ts` :** Ajouter dans le footer de chaque email :
     - `<a href="${APP_URL}/desinscription?token=${lead.unsubscribeToken}">Gerer mes preferences / Se desinscrire</a>`
- **Effort :** 4h
- **Validation :** Cliquer sur le lien dans un email de test et verifier que les consentements passent a `false` en base.

---

## P1 — HAUTES (Correction sous 2 semaines)

### P1-01 : Validation transitions statut lead

- **Fichier :** `apps/jeanbrun/src/app/api/leads/[id]/route.ts` (PATCH)
- **Probleme :** N'importe quel statut accepte sans verifier la transition (ex: `converted` → `new`).
- **Correction :** Ajouter une map de transitions valides :
  ```typescript
  const VALID_TRANSITIONS: Record<string, string[]> = {
    new: ["dispatched", "lost"],
    dispatched: ["contacted", "lost"],
    contacted: ["converted", "lost"],
    converted: [],
    lost: ["new"],
  };
  ```
  Verifier avant update : si transition invalide, retourner 422.
- **Effort :** 1h

### P1-02 : Extraire `verifyAdminAuth` + timing-safe

- **Fichiers :** `api/leads/route.ts` ET `api/leads/[id]/route.ts`
- **Probleme :** Fonction dupliquee avec comparaison `===` (vulnerable timing attack).
- **Correction :**
  1. Creer `apps/jeanbrun/src/lib/admin-auth.ts`
  2. Utiliser `crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))`
  3. Importer dans les deux routes
- **Effort :** 1h

### P1-03 : Rate limit mismatch documentation

- **Fichier :** `apps/jeanbrun/src/app/api/leads/route.ts`
- **Probleme :** 5 req/minute en code, documente comme 5 req/heure. 60x plus permissif que prevu.
- **Correction :** Creer un rate limiter specifique avec window `"1 h"` pour le lead capture, OU documenter correctement 5/min.
- **Effort :** 30min

### P1-04 : Index composite manquant pour dashboard

- **Fichier :** `packages/database/src/schema.ts`
- **Correction :** Ajouter dans la definition de la table `leads` :
  ```typescript
  leadsCompositeIdx: index("leads_platform_status_created_idx")
    .on(leads.platform, leads.status, leads.createdAt),
  ```
  Puis generer et appliquer la migration : `pnpm db:generate && pnpm db:migrate`
- **Effort :** 15min

### P1-05 : Bug Zod v4 dans validation.ts

- **Fichier :** `packages/leads/src/validation.ts`
- **Probleme :** `z.email()` n'existe pas en Zod. Doit etre `z.string().email()`.
- **Correction :** Remplacer `z.email("Email invalide")` par `z.string().email("Email invalide")`.
- **Effort :** 5min

### P1-06 : IP et user-agent non stockes (preuve consentement)

- **Fichiers :** `packages/database/src/schema.ts` + `apps/jeanbrun/src/app/api/leads/route.ts`
- **Correction :**
  1. Ajouter au schema leads : `ipAddress: varchar("ip_address", { length: 45 })` et `userAgent: text("user_agent")`
  2. Dans POST `/api/leads` : extraire et stocker `request.headers.get("x-real-ip")` et `request.headers.get("user-agent")`
  3. Generer migration
- **Effort :** 30min

### P1-07 : Liens de desinscription dans les emails

- **Fichier :** `apps/jeanbrun/src/lib/lead-dispatch.ts`
- **Probleme :** Aucun lien de desinscription dans les 3 templates email (promoteur, courtier, prospect).
- **Correction :** Ajouter dans le footer HTML de chaque template :
  ```html
  <p style="font-size:12px;color:#999;">
    Pour gerer vos preferences ou vous desinscrire :
    <a href="${APP_URL}/desinscription?token=${unsubscribeToken}">
      Cliquez ici
    </a>
  </p>
  ```
  Note : Depend de P0-07 (creation du token et de l'endpoint).
- **Effort :** 1h (apres P0-07)

---

## P2 — MOYENNES (Correction sous 30 jours)

### P2-01 : Migration `middleware.ts` vers `proxy.ts` (Next.js 16)

- **Impact :** Breaking change Next.js 16 — `middleware.ts` est deprecie.
- **Correction :** Si un fichier `middleware.ts` existe a la racine de l'app, le renommer en `proxy.ts` et renommer l'export `middleware` en `proxy`.
- **Verification prealable :** `ls apps/jeanbrun/src/middleware.ts apps/jeanbrun/middleware.ts 2>/dev/null`
- **Effort :** 30min

### P2-02 : Verifier `params` async dans toutes les pages dynamiques

- **Impact :** Breaking change Next.js 16 — `params` et `searchParams` doivent etre `await`ed.
- **Correction :** Grep `params` dans tous les `page.tsx` et `route.ts` avec segments dynamiques `[...]`. Ajouter `await` si manquant.
- **Commande :** `grep -rn "params\." apps/jeanbrun/src/app/ --include="*.tsx" --include="*.ts" | grep -v "await"`
- **Effort :** 1h

### P2-03 : Activer React Compiler

- **Fichier :** `apps/jeanbrun/next.config.ts`
- **Correction :** Ajouter `reactCompiler: true` dans la config Next.js. Elimine le besoin de `useMemo`/`useCallback` manuels.
- **Effort :** 5min + verification build

### P2-04 : `transpilePackages` manquant dans stop-loyer

- **Fichier :** `apps/stop-loyer/next.config.ts`
- **Correction :** Ajouter `transpilePackages: ["@repo/ui", "@repo/database", "@repo/leads", "@repo/seo"]`
- **Effort :** 5min

### P2-05 : Detection doublons leads

- **Fichier :** `apps/jeanbrun/src/app/api/leads/route.ts`
- **Probleme :** Meme email peut soumettre plusieurs fois = leads en double + emails multiples aux partenaires.
- **Correction :** Avant insert, verifier si un lead avec le meme `email + platform` existe dans les 5 dernieres minutes. Si oui, retourner le lead existant au lieu d'en creer un nouveau.
- **Effort :** 1h

### P2-06 : `simulationData` non-type (accepts any JSON)

- **Fichier :** `apps/jeanbrun/src/app/api/leads/route.ts`
- **Probleme :** `z.record(z.string(), z.unknown())` accepte n'importe quoi.
- **Correction :** Definir un schema Zod pour les champs attendus de `simulationData` (revenuNet, prixAcquisition, zoneFiscale, dureeCredit, loyerMensuel, etc.). Accepter les champs inconnus avec `.passthrough()` pour la compatibilite.
- **Effort :** 1h

### P2-07 : `/api/leads/programme-contact` ne persiste pas localement

- **Fichier :** `apps/jeanbrun/src/app/api/leads/programme-contact/route.ts`
- **Probleme :** Cree le lead dans EspoCRM mais pas dans la table `leads` locale. Invisible dans le dashboard admin.
- **Correction :** Inserer egalement dans la table `leads` (meme pattern que POST `/api/leads`).
- **Effort :** 1h

### P2-08 : Table `consent_audit_log` manquante

- **Fichier :** `packages/database/src/schema.ts`
- **Probleme :** Si un lead est supprime, sa preuve de consentement disparait.
- **Correction :** Creer une table `consentAuditLog` avec : `id`, `leadId`, `email`, `ipAddress`, `userAgent`, `consentFormVersion`, `consentPromoter`, `consentBroker`, `consentNewsletter`, `action` (granted/revoked), `createdAt`. Cette table ne doit JAMAIS etre purgee avant 5 ans (recommandation CNIL).
- **Effort :** 1h

### P2-09 : Etat `leadSubmitted` pas persiste (refresh = re-soumission)

- **Fichier :** `apps/jeanbrun/src/app/resultats/[id]/resultat-client.tsx`
- **Probleme :** `useState(false)` reset a chaque refresh. Le prospect revoit le formulaire et peut re-soumettre.
- **Correction :** Stocker `leadSubmitted` dans `localStorage` avec cle `lead_submitted_${simulationId}`. Initialiser le state depuis localStorage.
- **Effort :** 30min

### P2-10 : Dashboard admin incomplet (70%)

- **Fichiers :** `apps/jeanbrun/src/app/admin/`
- **Fonctionnalites manquantes :**
  - Analytics revenus par partenaire (page `/admin/analytics`)
  - Historique/timeline actions sur un lead (composant timeline dans detail)
  - Bulk actions (export CSV, changement statut en masse)
  - UI gestion promoteurs/courtiers (`/admin/promoteurs`, `/admin/courtiers`)
  - Recherche par nom/email dans la liste leads
  - Tri des colonnes (actuellement fixe: `createdAt DESC`)
- **Effort :** 8-12h (peut etre split en sous-taches)

### P2-11 : Retention automatique 36 mois

- **Probleme :** La politique annonce 36 mois mais aucun mecanisme technique.
- **Correction :** Creer un script schedulable (cron ou API route) :
  1. Selectionner les leads avec `createdAt < NOW() - INTERVAL '36 months'` ET `status != 'converted'`
  2. Copier les preuves de consentement dans `consent_audit_log` (si pas deja fait)
  3. Anonymiser ou supprimer les leads
  4. Logger l'operation
- **Effort :** 2h

---

## P3 — BASSES (Ameliorations futures)

### P3-01 : Generation et envoi PDF rapport

- **Probleme :** La promesse "rapport detaille par email" n'est pas tenue. Pas de generation PDF.
- **Correction :** Utiliser `@react-pdf/renderer` (deja dans les deps) pour generer un PDF avec les resultats complets, et l'attacher a l'email de confirmation prospect.
- **Effort :** 4-6h

### P3-02 : Metrique TRI/ROI manquante dans le teaser

- **Probleme :** Le teaser montre le rendement net mais pas le TRI (taux de rendement interne).
- **Correction :** Implementer le calcul TRI dans `calculate-results.ts` et l'afficher dans `SyntheseCard`.
- **Effort :** 2h

### P3-03 : Comparatif Nue-propriete manquant

- **Probleme :** Le comparatif ne montre que Jeanbrun vs LMNP. La spec demande aussi Nue-propriete.
- **Correction :** Ajouter une 3e colonne au composant `ComparatifLMNP` (renommer en `ComparatifDispositifs`).
- **Effort :** 3h

### P3-04 : Comparatif derriere le lead gate au lieu du teaser

- **Probleme :** Le comparatif est cache derriere le lead gate. La spec dit qu'il doit etre dans le teaser visible.
- **Correction :** Deplacer le rendu du `ComparatifLMNP` avant le `LeadGateForm` dans `resultat-client.tsx`.
- **Effort :** 30min

### P3-05 : `autocomplete` et `inputMode` manquants

- **Fichier :** `LeadGateForm.tsx`
- **Correction :** Ajouter `autoComplete="given-name"`, `autoComplete="family-name"`, `autoComplete="email"`, `autoComplete="tel"` et `inputMode="tel"` sur le champ telephone.
- **Effort :** 10min

### P3-06 : Duplicate `ResultatClient` dans ancien path

- **Probleme :** Un ancien `ResultatClient` existe dans `/simulateur/resultat/[id]/` en plus du nouveau dans `/resultats/[id]/`.
- **Correction :** Supprimer le dossier `apps/jeanbrun/src/app/simulateur/resultat/[id]/` entier (le redirect `/simulateur/resultat` → `/resultats` est deja en place).
- **Effort :** 10min

### P3-07 : ESLint config manquant dans stop-loyer

- **Correction :** Copier `apps/jeanbrun/eslint.config.mjs` vers `apps/stop-loyer/eslint.config.mjs`.
- **Effort :** 5min

### P3-08 : `console.error` en production

- **Fichiers :** `resultats/error.tsx`, `LeadGateForm.tsx`, routes API
- **Correction :** Remplacer par le logger Pino structure ou supprimer.
- **Effort :** 30min

### P3-09 : Section "modele economique" manquante dans les CGV

- **Fichier :** `apps/jeanbrun/src/app/(app)/cgv/page.tsx`
- **Correction :** Ajouter une section expliquant que le service est gratuit pour l'utilisateur et remunere par les partenaires.
- **Effort :** 30min

---

## Ordre d'execution recommande

### Session 1 : Fixes critiques (P0) — ~9h

```
P0-01 → P0-02 → P0-03 → P0-06 → P0-04 → P0-05 → P0-07
```

Logique : D'abord debloquer les soumissions (P0-01), puis RGPD (P0-02, P0-06), securite (P0-03), data loss (P0-04), documentation (P0-05), et enfin le mecanisme de desinscription (P0-07).

### Session 2 : Securite et DB (P1) — ~5h

```
P1-05 → P1-06 → P1-04 → P1-02 → P1-01 → P1-03 → P1-07
```

Logique : Bug fix rapide (P1-05), schema DB (P1-06, P1-04), puis securite API (P1-02, P1-01, P1-03), et enfin emails (P1-07 depend de P0-07).

### Session 3 : Ameliorations moyennes (P2) — ~18h

```
P2-04 → P2-01 → P2-02 → P2-03 → P2-05 → P2-06 → P2-07 → P2-08 → P2-09 → P2-11 → P2-10
```

### Session 4 : Polish (P3) — ~14h

```
P3-05 → P3-06 → P3-07 → P3-04 → P3-08 → P3-09 → P3-02 → P3-03 → P3-01
```

---

## Checklist de validation post-correctifs

### Fonctionnel
- [ ] Formulaire lead se soumet sans erreur 400
- [ ] Lead apparait en base avec score calcule
- [ ] Dispatch email promoteur envoye si consentement donne
- [ ] Dispatch email courtier envoye si consentement donne (separe)
- [ ] Email confirmation prospect recu
- [ ] Rapport peut etre demande sans consentement partenaire
- [ ] Formulaire financement persiste le lead en base
- [ ] Programme non autorise retourne 404

### RGPD
- [ ] Politique de confidentialite mentionne promoteurs et courtiers
- [ ] Texte sous formulaire est transparent
- [ ] Lien de desinscription present dans chaque email
- [ ] Endpoint de desinscription fonctionne
- [ ] IP et user-agent stockes avec le lead
- [ ] Consentements 100% optionnels (aucun force)

### Securite
- [ ] `email.ts` ne contient plus de templates non echappes
- [ ] `verifyAdminAuth` centralise avec timing-safe comparison
- [ ] Pas de `console.log` avec PII
- [ ] Transitions de statut validees

### Technique
- [ ] Build `pnpm build:ci` passe sans erreur
- [ ] TypeScript `pnpm typecheck` passe
- [ ] ESLint `pnpm lint` passe

---

*Genere le 6 fevrier 2026 par audit multi-agents (8 agents specialises en parallele)*
