# Registre des Traitements de Données Personnelles

**Conformité RGPD - Article 30**
**Document:** REGISTRE-RGPD.md
**Version:** 1.0
**Date de création:** 30 janvier 2026
**Dernière mise à jour:** 30 janvier 2026
**Statut:** En vigueur

---

## 1. Identification du Responsable de Traitement

| Information | Valeur |
|-------------|--------|
| **Raison sociale** | EXPERT IA ENTREPRISE SOLUTIONS |
| **Forme juridique** | SASU (Société par Actions Simplifiée à associé unique) |
| **Capital social** | 1 000,00 € |
| **RCS** | Nancy 988 031 225 |
| **SIRET** | 988 031 225 00010 |
| **TVA intracommunautaire** | FR85 988 031 225 |
| **Adresse** | 10 rue Saint Thiébaut, 54000 Nancy, France |
| **Représentant légal** | M. Hervé VOIRIN (Président) |
| **Email contact** | contact@expert-ia-entreprise.fr |
| **Téléphone** | +33 9 55 14 17 42 |
| **Site web** | https://simuler-loi-fiscale-jeanbrun.fr |

### 1.1 Délégué à la Protection des Données (DPO)

| Information | Valeur |
|-------------|--------|
| **DPO désigné** | Non (< 250 salariés, pas de traitement à grande échelle) |
| **Contact RGPD** | contact@expert-ia-entreprise.fr |

---

## 2. Registre des Traitements

### 2.1 TRAIT-001 : Simulation fiscale gratuite

| Champ | Description |
|-------|-------------|
| **Finalité** | Permettre aux utilisateurs de réaliser une simulation fiscale Loi Jeanbrun |
| **Base légale** | **Intérêt légitime** (Art. 6.1.f) - Service gratuit d'information fiscale |
| **Catégories de personnes** | Visiteurs du site (investisseurs potentiels) |
| **Catégories de données** | |
| | - Données de simulation : ville, budget, revenus (tranche), niveau de loyer |
| | - Données techniques : IP, user-agent, horodatage |
| **Source des données** | Collecte directe (formulaire) |
| **Destinataires** | Interne uniquement |
| **Transfert hors UE** | Non |
| **Durée de conservation** | **3 ans** après dernière interaction |
| **Mesures de sécurité** | HTTPS, pas de stockage nominatif sans email |

---

### 2.2 TRAIT-002 : Simulation avancée avec compte

| Champ | Description |
|-------|-------------|
| **Finalité** | Fournir une simulation détaillée et permettre la sauvegarde/reprise |
| **Base légale** | **Consentement** (Art. 6.1.a) - Capture email explicite |
| **Catégories de personnes** | Utilisateurs ayant fourni leur email |
| **Catégories de données** | |
| | - Email |
| | - Données de simulation complètes (6 étapes) |
| | - Historique des simulations |
| **Source des données** | Collecte directe (formulaire multi-étapes) |
| **Destinataires** | Interne, Stripe (si paiement) |
| **Transfert hors UE** | Oui (Stripe US - clauses contractuelles types) |
| **Durée de conservation** | **3 ans** après dernière activité |
| **Mesures de sécurité** | HTTPS, chiffrement email hashé, accès authentifié |

---

### 2.3 TRAIT-003 : Paiement et facturation

| Champ | Description |
|-------|-------------|
| **Finalité** | Traiter les paiements des packs de simulations |
| **Base légale** | **Exécution du contrat** (Art. 6.1.b) |
| **Catégories de personnes** | Clients ayant acheté un pack |
| **Catégories de données** | |
| | - Email |
| | - Données de paiement (via Stripe, non stockées localement) |
| | - Historique d'achat (montant, date, produit) |
| | - Factures |
| **Source des données** | Collecte directe + Stripe |
| **Destinataires** | Stripe (sous-traitant paiement) |
| **Transfert hors UE** | Oui (Stripe US - DPA signé, clauses contractuelles types) |
| **Durée de conservation** | **10 ans** (obligation légale comptable) |
| **Mesures de sécurité** | Pas de stockage CB, Stripe PCI-DSS, webhooks signés |

---

### 2.4 TRAIT-004 : Découverte patrimoniale (Accompagnement)

| Champ | Description |
|-------|-------------|
| **Finalité** | Qualifier les prospects pour un accompagnement personnalisé |
| **Base légale** | **Consentement explicite** (Art. 6.1.a) + **Mesures précontractuelles** (Art. 6.1.b) |
| **Catégories de personnes** | Prospects souhaitant être accompagnés |
| **Catégories de données** | |
| | **Identité** : Nom, prénom, email, téléphone |
| | **Situation professionnelle** : Statut, ancienneté |
| | **Données financières sensibles** : |
| | - Revenus mensuels nets |
| | - Revenus fonciers existants |
| | - Valeur patrimoine immobilier |
| | - Épargne disponible |
| | - Crédits en cours (montant, durée) |
| | **Projet** : Budget, objectif, horizon |
| **Source des données** | Collecte directe (formulaire découverte patrimoniale) |
| **Destinataires** | Interne, EspoCRM (CRM), Calendly (RDV) |
| **Transfert hors UE** | Oui (Calendly US - DPA) |
| **Durée de conservation** | **3 ans** prospect, **10 ans** si client |
| **Mesures de sécurité** | **Chiffrement column-level** données financières, accès restreint |

#### Données sensibles - Mesures renforcées

Les données financières (revenus, patrimoine, endettement) sont considérées comme sensibles et bénéficient de :
- Chiffrement AES-256 au repos (column-level encryption)
- Accès journalisé
- Pas de stockage en clair dans les logs
- Pseudonymisation pour analytics

---

### 2.5 TRAIT-005 : Prise de rendez-vous (Calendly)

| Champ | Description |
|-------|-------------|
| **Finalité** | Permettre la prise de RDV pour l'accompagnement |
| **Base légale** | **Mesures précontractuelles** (Art. 6.1.b) |
| **Catégories de personnes** | Prospects éligibles à l'accompagnement |
| **Catégories de données** | |
| | - Nom, prénom, email |
| | - Date/heure du RDV |
| | - Motif (pré-rempli) |
| **Source des données** | Transfert depuis formulaire découverte |
| **Destinataires** | Calendly (sous-traitant) |
| **Transfert hors UE** | Oui (Calendly US - DPA, clauses contractuelles types) |
| **Durée de conservation** | **1 an** après le RDV |
| **Mesures de sécurité** | HTTPS, webhook signé, données minimales transmises |

---

### 2.6 TRAIT-006 : Revente de leads à CGP partenaires

| Champ | Description |
|-------|-------------|
| **Finalité** | Transmettre les coordonnées à des conseillers en gestion de patrimoine locaux |
| **Base légale** | **Consentement explicite et distinct** (Art. 6.1.a) |
| **Catégories de personnes** | Prospects ayant donné leur accord explicite |
| **Catégories de données** | |
| | - Nom, prénom, email, téléphone |
| | - Ville du projet |
| | - Budget envisagé |
| | - Score de qualification |
| **Source des données** | Formulaire découverte patrimoniale |
| **Destinataires** | CGP partenaires (liste contractualisée) |
| **Transfert hors UE** | Non (CGP français uniquement) |
| **Durée de conservation** | **Jusqu'au retrait du consentement** |
| **Mesures de sécurité** | Contrat avec CGP, opt-out facile, traçabilité transmissions |

#### Consentement spécifique requis

```
☐ J'accepte que mes coordonnées soient transmises à des conseillers
   en gestion de patrimoine partenaires susceptibles de me contacter
   pour me proposer leurs services.

   Liste des partenaires : [Lien vers liste]
   Je peux retirer ce consentement à tout moment.
```

**IMPORTANT** : Ce consentement est :
- **Séparé** du consentement principal
- **Non pré-coché**
- **Facultatif** (refus n'empêche pas l'accès au service)
- **Retirable** à tout moment

---

### 2.7 TRAIT-007 : Newsletter et communications commerciales

| Champ | Description |
|-------|-------------|
| **Finalité** | Envoyer des informations sur la Loi Jeanbrun et les services |
| **Base légale** | **Consentement explicite** (Art. 6.1.a) |
| **Catégories de personnes** | Abonnés à la newsletter |
| **Catégories de données** | |
| | - Email |
| | - Préférences de communication |
| | - Historique d'ouverture (analytics email) |
| **Source des données** | Collecte directe (opt-in) |
| **Destinataires** | Mailjet (sous-traitant emailing) |
| **Transfert hors UE** | Non (Mailjet - serveurs UE) |
| **Durée de conservation** | **Jusqu'à désinscription** + 3 ans blocklist |
| **Mesures de sécurité** | Double opt-in recommandé, lien désinscription obligatoire |

---

### 2.8 TRAIT-008 : Analytics et mesure d'audience

| Champ | Description |
|-------|-------------|
| **Finalité** | Mesurer l'audience et améliorer le service |
| **Base légale** | **Intérêt légitime** (Art. 6.1.f) pour analytics exemptés CNIL |
| **Catégories de personnes** | Tous les visiteurs |
| **Catégories de données** | |
| | - Pages visitées |
| | - Durée de session |
| | - Source de trafic |
| | - Type d'appareil |
| | - Données agrégées (pas d'identification individuelle) |
| **Source des données** | Collecte automatique |
| **Destinataires** | Plausible Analytics (cookie-less, RGPD-compliant) |
| **Transfert hors UE** | Non (Plausible - serveurs UE) |
| **Durée de conservation** | **25 mois** (données agrégées) |
| **Mesures de sécurité** | Pas de cookies, pas d'IP stockée, données agrégées |

#### Alternative avec consentement (GA4)

Si Google Analytics 4 est utilisé en complément :
- **Base légale** : Consentement (cookies)
- **Bandeau cookies** obligatoire avec refus possible
- **Durée cookies** : 13 mois max

---

## 3. Sous-traitants

### 3.1 Liste des sous-traitants

| Sous-traitant | Finalité | Localisation | DPA signé | Garanties |
|---------------|----------|--------------|-----------|-----------|
| **Vercel** | Hébergement site | US (Edge EU) | Oui | Clauses contractuelles types |
| **Neon** | Base de données | EU (Frankfurt) | Oui | Données en UE |
| **Hostinger** | Hébergement VPS | LT (Lituanie - UE) | Oui | Données en UE |
| **Stripe** | Paiement | US | Oui | PCI-DSS, clauses contractuelles |
| **Calendly** | Prise de RDV | US | Oui | Clauses contractuelles types |
| **EspoCRM** | CRM (self-hosted) | FR (VPS Hostinger) | N/A | Hébergement interne |
| **Mailjet** | Emailing | FR/UE | Oui | Serveurs UE |
| **Plausible** | Analytics | UE | Oui | Cookie-less, RGPD-native |

### 3.2 Contrats de sous-traitance (DPA)

Chaque sous-traitant dispose d'un Data Processing Agreement couvrant :
- [ ] Objet et durée du traitement
- [ ] Nature et finalité du traitement
- [ ] Types de données personnelles
- [ ] Catégories de personnes concernées
- [ ] Obligations du sous-traitant (Art. 28 RGPD)
- [ ] Mesures de sécurité
- [ ] Notification des violations
- [ ] Audit possible

---

## 4. Transferts hors Union Européenne

### 4.1 Transferts identifiés

| Destinataire | Pays | Mécanisme de transfert | Évaluation risque |
|--------------|------|------------------------|-------------------|
| Stripe | États-Unis | Clauses contractuelles types (2021) | Acceptable |
| Calendly | États-Unis | Clauses contractuelles types | Acceptable |
| Vercel | États-Unis | Clauses contractuelles types + Edge EU | Acceptable |

### 4.2 Mesures supplémentaires

Pour les transferts vers les États-Unis (post-Schrems II) :
- Chiffrement des données en transit et au repos
- Minimisation des données transférées
- Pseudonymisation quand possible
- Évaluation périodique des risques

---

## 5. Mesures de Sécurité

### 5.1 Mesures techniques

| Mesure | Implémentation |
|--------|----------------|
| **Chiffrement en transit** | TLS 1.3 obligatoire (HTTPS) |
| **Chiffrement au repos** | Neon encryption at-rest + column-level pour données sensibles |
| **Authentification** | Tokens JWT, sessions sécurisées |
| **Contrôle d'accès** | Principe du moindre privilège |
| **Journalisation** | Logs accès données sensibles (90 jours) |
| **Sauvegarde** | Backup quotidien Neon, rétention 7 jours |
| **Webhooks** | Vérification signature (Stripe, Calendly) |

### 5.2 Mesures organisationnelles

| Mesure | Implémentation |
|--------|----------------|
| **Formation** | Sensibilisation RGPD équipe |
| **Accès limité** | Seul le responsable accède aux données brutes |
| **Procédure violation** | Notification CNIL < 72h si risque élevé |
| **Revue annuelle** | Audit annuel du registre |

### 5.3 Chiffrement des données sensibles

Les données financières (TRAIT-004) sont chiffrées avec :

```typescript
// Exemple conceptuel - Ne pas utiliser tel quel en production
import { encrypt, decrypt } from '@/lib/crypto'

// Stockage
const encryptedPatrimoine = encrypt(JSON.stringify({
  revenusMensuels: 5000,
  epargne: 50000,
  credits: [{ montant: 800, duree: 120 }]
}), process.env.ENCRYPTION_KEY)

// Table leads - colonne patrimoine_data chiffrée
```

---

## 6. Droits des Personnes

### 6.1 Droits applicables

| Droit | Article RGPD | Délai réponse | Procédure |
|-------|--------------|---------------|-----------|
| **Accès** | Art. 15 | 1 mois | Formulaire ou email |
| **Rectification** | Art. 16 | 1 mois | Formulaire ou email |
| **Effacement** | Art. 17 | 1 mois | Formulaire ou email |
| **Limitation** | Art. 18 | 1 mois | Email motivé |
| **Portabilité** | Art. 20 | 1 mois | Export JSON/CSV |
| **Opposition** | Art. 21 | Immédiat | Lien désinscription |
| **Retrait consentement** | Art. 7.3 | Immédiat | Interface compte |

### 6.2 Formulaire d'exercice des droits

Page dédiée : `/politique-confidentialite#droits`

```
Exercer mes droits RGPD

Email : [________________]
Type de demande :
  ○ Accès à mes données
  ○ Rectification
  ○ Effacement ("droit à l'oubli")
  ○ Export de mes données
  ○ Opposition au traitement
  ○ Retrait de consentement

Précisions : [________________]

[Envoyer ma demande]
```

### 6.3 Procédure de traitement

1. **Réception** : Accusé de réception sous 48h
2. **Vérification identité** : Demande de justificatif si doute
3. **Traitement** : Exécution sous 1 mois (extensible à 3 mois si complexe)
4. **Réponse** : Notification par email avec actions réalisées
5. **Archivage** : Conservation de la demande 3 ans

---

## 7. Politique de Conservation

### 7.1 Tableau récapitulatif

| Catégorie de données | Durée active | Archive | Suppression |
|---------------------|--------------|---------|-------------|
| Simulations anonymes | 3 ans | - | Suppression |
| Simulations avec email | 3 ans inactivité | - | Anonymisation |
| Données prospects | 3 ans inactivité | - | Suppression |
| Données clients | Durée relation | 10 ans (légal) | Archivage puis suppression |
| Factures | - | 10 ans (légal) | Suppression |
| Consentements | Durée du consentement | 5 ans après retrait | Suppression |
| Logs techniques | 90 jours | - | Suppression |
| Analytics | 25 mois | - | Agrégation |

### 7.2 Procédure de purge automatique

```sql
-- Exécution mensuelle (cron)

-- 1. Anonymiser simulations > 3 ans
UPDATE simulations
SET email = NULL, input_data = jsonb_strip_nulls(input_data - 'personalInfo')
WHERE updated_at < NOW() - INTERVAL '3 years';

-- 2. Supprimer leads non convertis > 3 ans
DELETE FROM leads
WHERE statut NOT IN ('converti', 'accompagne')
AND updated_at < NOW() - INTERVAL '3 years';

-- 3. Supprimer quotas expirés > 1 an
DELETE FROM quotas
WHERE date_expiration < NOW() - INTERVAL '1 year';
```

---

## 8. Gestion des Violations de Données

### 8.1 Procédure de notification

| Étape | Délai | Action |
|-------|-------|--------|
| **Détection** | H+0 | Identification de la violation |
| **Évaluation** | H+4 | Analyse impact et risque |
| **Confinement** | H+6 | Mesures correctives immédiates |
| **Notification CNIL** | H+72 max | Si risque pour les droits et libertés |
| **Notification personnes** | Sans délai | Si risque élevé |
| **Documentation** | H+168 | Rapport complet |

### 8.2 Critères de notification

**Notification CNIL obligatoire si :**
- Données sensibles (financières) compromises
- Volume significatif de personnes affectées
- Risque d'usurpation d'identité
- Données non chiffrées exposées

**Notification personnes obligatoire si :**
- Risque élevé pour droits et libertés
- Impossible de mitiger le risque rapidement

### 8.3 Registre des violations

| Date | Description | Personnes affectées | Mesures | Notification |
|------|-------------|---------------------|---------|--------------|
| - | Aucune violation à ce jour | - | - | - |

---

## 9. Cookies et Traceurs

### 9.1 Liste des cookies

| Cookie | Finalité | Durée | Consentement |
|--------|----------|-------|--------------|
| `session` | Authentification | Session | Exempté (strictement nécessaire) |
| `simulation_draft` | Sauvegarde brouillon | 7 jours | Exempté (fonctionnel) |
| `consent` | Préférences cookies | 13 mois | Exempté |
| `_ga` (si GA4) | Analytics Google | 13 mois | **Consentement requis** |

### 9.2 Bandeau cookies

Utilisation de Tarteaucitron.js ou équivalent avec :
- Refus aussi simple que l'acceptation
- Granularité par finalité
- Conservation du choix 13 mois
- Pas de mur de cookies (accès sans acceptation)

---

## 10. Analyse d'Impact (AIPD)

### 10.1 Nécessité d'une AIPD

Une Analyse d'Impact relative à la Protection des Données est **recommandée** pour le traitement TRAIT-004 (découverte patrimoniale) car :
- Données financières sensibles
- Profilage (scoring qualification)
- Décision automatisée (éligibilité)

### 10.2 Résumé de l'analyse

| Risque identifié | Probabilité | Gravité | Mesures |
|-----------------|-------------|---------|---------|
| Fuite données financières | Faible | Élevée | Chiffrement, accès restreint |
| Discrimination (scoring) | Faible | Moyenne | Critères objectifs, recours humain |
| Transfert non autorisé CGP | Moyenne | Élevée | Consentement explicite, traçabilité |
| Accès non autorisé | Faible | Élevée | Authentification, journalisation |

### 10.3 Conclusion AIPD

Le niveau de risque résiduel est **acceptable** compte tenu des mesures de sécurité mises en place. L'AIPD complète est disponible sur demande.

---

## 11. Annexes

### A. Modèle de consentement (découverte patrimoniale)

```
Avant de soumettre ce formulaire, veuillez lire et accepter :

☑ J'ai lu et j'accepte la politique de confidentialité [lien] (obligatoire)

☑ J'accepte que mes données soient traitées pour évaluer mon éligibilité
  et être accompagné dans mon projet d'investissement (obligatoire)

☐ J'accepte que mes coordonnées soient transmises à des conseillers en
  gestion de patrimoine partenaires (optionnel)

☐ J'accepte de recevoir des informations et actualités sur la Loi Jeanbrun
  par email (optionnel)

[Soumettre]
```

### B. Texte bandeau cookies

```
Ce site utilise des cookies pour assurer son bon fonctionnement.

[Tout accepter] [Personnaliser] [Tout refuser]

En cliquant sur "Tout accepter", vous consentez à l'utilisation de cookies
analytiques pour mesurer l'audience. Vous pouvez modifier vos préférences
à tout moment.

[En savoir plus]
```

### C. Clause CGP partenaires

Les CGP partenaires s'engagent contractuellement à :
1. Utiliser les données uniquement pour contacter le prospect
2. Ne pas revendre ou transférer les données
3. Supprimer les données sur demande
4. Respecter le RGPD
5. Notifier toute violation de données

---

## 12. Historique des modifications

| Version | Date | Auteur | Modifications |
|---------|------|--------|---------------|
| 1.0 | 30/01/2026 | Équipe Claude Code | Création initiale |

---

## 13. Validation

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| Responsable de traitement | M. Hervé VOIRIN (Président) | ___/___/2026 | ____________ |
| DPO (si applicable) | N/A | - | - |

---

**Document confidentiel - Usage interne**
**Prochaine revue programmée :** Janvier 2027
