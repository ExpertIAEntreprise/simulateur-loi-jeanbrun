# Configuration du Verrouillage de Compte (Account Lockout)

## Vue d'ensemble

Le système de verrouillage de compte protège contre les attaques par force brute en bloquant les tentatives de connexion après 5 échecs consécutifs dans une fenêtre de 15 minutes.

## Configuration

### 1. Serveur (Better Auth)

**Fichier:** `src/lib/auth.ts`

```typescript
rateLimit: {
  window: 60, // 60 secondes (fenêtre globale par défaut)
  max: 100, // 100 requêtes max (limite générale)
  enabled: true,

  // Règles personnalisées pour les endpoints d'authentification
  customRules: {
    "/sign-in/email": {
      window: 15 * 60, // 15 minutes
      max: 5, // 5 tentatives max = LOCKOUT
    },
    "/sign-up": {
      window: 60 * 60, // 1 heure
      max: 10, // 10 inscriptions max par IP
    },
  },
},

// Suivi par IP (empêche contournement par rotation d'adresses)
advanced: {
  ipAddress: {
    ipv6Subnet: 64, // Limite par subnet IPv6
  },
},
```

#### Configuration en détail

| Paramètre | Valeur | Explication |
|-----------|--------|------------|
| `window` | 15 * 60 = 900s | Fenêtre de 15 minutes |
| `max` | 5 | Max 5 tentatives avant lockout |
| `enabled` | true | Rate limiting actif en production |
| `ipv6Subnet` | 64 | Empêche les attaquants de contourner en changeant d'IP IPv6 |

#### Comportement

1. **Tentative 1-4:** Les 4 premiers échecs sont acceptés
2. **Tentative 5:** Lockout activé → Réponse HTTP 429
3. **15 minutes+:** Compteur réinitialisé, nouvelles tentatives possibles
4. **Connexion réussie:** Compteur réinitialisé immédiatement

### 2. Client (React)

**Fichier:** `src/components/auth/sign-in-button.tsx`

```typescript
// Détection d'erreur de lockout
const authError = parseAuthError(result.error)
setError(authError)

// Désactivation du formulaire si verrouillé
const isAccountLocked = error && shouldShowLockoutMessage(error)

// Affichage du message approprié
{error && (
  <div className={isAccountLocked ? LOCKOUT_ERROR_STYLES.container : ...}>
    {error.message}
  </div>
)}
```

### 3. Utilitaires (Parsing d'erreurs)

**Fichier:** `src/lib/auth-lockout.ts`

Fournit les fonctions essentielles:

| Fonction | Rôle |
|----------|------|
| `parseAuthError()` | Analyse l'erreur et retourne un objet `AuthError` structuré |
| `isRateLimitError()` | Détecte si l'erreur est un rate limit (429) |
| `formatLockoutMessage()` | Formate le message en français avec countdown |
| `shouldShowLockoutMessage()` | Détermine si le message de lockout doit s'afficher |

## Flux de Connexion avec Lockout

```
┌─────────────────────────────────────────────────────┐
│ Utilisateur remplit formulaire + clique "Se connecter"     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ signIn.email({ email, password })                  │
│ (Client-side hook from better-auth)                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ POST /api/auth/sign-in/email                        │
│ + Vérification rate limit Better Auth              │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴──────────┐
         │                      │
         ▼                      ▼
    [Succès]              [Erreur]
         │                      │
         │              ┌───────┴──────────┐
         │              │                  │
         │              ▼                  ▼
         │        Rate limit?    Invalid credentials?
         │         (429)              (Other error)
         │              │                  │
         │              ▼                  ▼
         │      formatLockoutMessage()   Standard error
         │      isAccountLocked = true    message
         │              │                  │
         └──────────────┴──────────────────┘
                        │
                        ▼
              setError(authError)

              if (isAccountLocked) {
                // Désactiver formulaire
                // Afficher message lockout (15 min)
              } else {
                // Afficher erreur standard
                // Formulaire reste actif
              }
```

## Messages d'Erreur

### Message de Lockout (EN FRANÇAIS)

**Quand:** HTTP 429 reçu du serveur

```
Compte verrouillé suite à trop de tentatives de connexion échouées.
Veuillez réessayer dans 15 minutes.
```

**Style:** Fond rouge + bordure rouge (sévérité CRITIQUE)

**Champs désactivés:**
- Email input
- Password input
- Submit button
- Lien "Mot de passe oublié"

### Message d'Erreur Standard

**Quand:** Credentials invalides

```
Email ou mot de passe incorrect.
```

**Style:** Fond jaune/ambre + bordure ambre (attention)

**Champs:** Restent actifs (utilisateur peut réessayer)

## Détection d'Erreurs

### Pattern Matching

`parseAuthError()` cherche les patterns suivants dans le message d'erreur:

#### Rate Limit
- `too many` | `rate limit` | `try again later`
- `locked` | `locked out` | `temporarily blocked`
- `trop de` | `verrouill` | `réessayer plus tard` (FR)
- Status code HTTP 429

#### Credentials Invalides
- `invalid` | `incorrect` | `not found`
- `invalid credentials`

#### Vérification Email
- `verify` | `verification` | `not verified`

#### Inconnu
- Toute autre erreur

## Cas de Test

### Test 1: Lockout Après 5 Tentatives

```bash
# Tentative 1-4
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'

# Réponses: 200 + { error: "Invalid credentials" }

# Tentative 5
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'

# Réponse: 429 Too Many Requests
# Message d'erreur: "Compte verrouillé..."
```

### Test 2: Message d'Erreur en Français

1. Ouvrir http://localhost:3000/login
2. Remplir credentials invalides
3. Cliquer "Se connecter" 5 fois rapidement
4. Vérifier que le message "Compte verrouillé..." s'affiche
5. Vérifier que le formulaire est désactivé

### Test 3: Réinitialisation Après Succès

1. Compte verrouillé (étapes du Test 2)
2. Attendre 15 minutes OU redémarrer le serveur
3. Entrer credentials valides
4. Connexion réussie
5. Compteur = réinitialisé
6. Prochaines tentatives échouées relancent le compte à 1

### Test 4: Messages d'Erreur Standard

1. Ouvrir http://localhost:3000/login
2. Email valide + Password invalide
3. Vérifier message: "Email ou mot de passe incorrect."
4. Vérifier que le formulaire reste actif

## Configuration Avancée

### Ajuster la Durée du Lockout

```typescript
// src/lib/auth.ts
customRules: {
  "/sign-in/email": {
    window: 10 * 60, // ← Changer à 10 minutes
    max: 5,
  },
}

// src/lib/auth-lockout.ts
export const LOCKOUT_CONFIG = {
  DURATION_SECONDS: 10 * 60, // ← Adapter aussi ici
  MAX_ATTEMPTS: 5,
  WINDOW_MINUTES: 10,
}
```

### Ajuster le Nombre de Tentatives

```typescript
// Permettre 10 tentatives avant lockout (moins strict)
customRules: {
  "/sign-in/email": {
    window: 15 * 60,
    max: 10, // ← Changer de 5 à 10
  },
}

// Ou 3 tentatives (plus strict)
customRules: {
  "/sign-in/email": {
    window: 15 * 60,
    max: 3, // ← Changer de 5 à 3
  },
}
```

### Désactiver le Lockout (Développement)

```typescript
// ⚠️ JAMAIS en production !
rateLimit: {
  enabled: false, // ← Désactiver
}
```

## Stockage des Données de Rate Limit

### Par Défaut: PostgreSQL

Better Auth stocke le rate limit dans PostgreSQL (même base que l'authentification).

**Table interne:** Gérée automatiquement par Better Auth

### Alternative: Redis (Production)

Pour les déploiements multi-instance:

```typescript
rateLimit: {
  window: 60,
  max: 100,
  storage: "redis", // ← Switch à Redis
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
}
```

**Avantage:** Synchronisé entre tous les serveurs

## Monitoring et Logs

### Détection d'Attaques

Les erreurs 429 doivent être loggées:

```typescript
// À ajouter dans la route API
if (result.error?.status === 429) {
  console.warn(`[SECURITY] Rate limit hit: ${clientIP}`)
  // Alert système ou métriques
}
```

### Métriques à Tracker

- Nombre d'erreurs 429 par jour
- Nombre d'erreurs 429 par IP
- Nombre de lockouts par utilisateur (optionnel)

## Sécurité

### Points Forts

✅ **Protection Multi-couches:**
- Rate limit côté serveur (Better Auth)
- Détection d'erreur côté client (React)
- Styles visuels clairs (UX)

✅ **IP-aware:**
- Suivi par IP directe
- Suivi par subnet IPv6
- Empêche contournement par rotation

✅ **Messages Localisés:**
- Erreurs en français
- Temps de countdown visible

### Points à Surveiller

⚠️ **Déploiement Multi-instance:**
- Sans Redis, chaque serveur a son propre compteur
- Impact: Attaquant peut contourner en changeant de serveur
- Solution: Utiliser Redis ou Azure CosmosDB

⚠️ **VPN/Proxy:**
- Les utilisateurs derrière le même proxy auront la même IP
- Peuvent avoir des lockouts non mérités
- Monitorer les faux positifs

## Documentation Connexe

- [Better Auth Rate Limit Docs](https://www.better-auth.com/docs/concepts/rate-limit)
- `src/lib/auth-lockout.ts` - Utilitaires et types
- `src/components/auth/sign-in-button.tsx` - Implémentation UI

## Support

Pour tester le lockout:

```bash
# Vérifier que Better Auth est bien configuré
pnpm db:studio  # Check tables d'authentification

# Vérifier les logs du serveur
# (Rechercher les réponses HTTP 429)

# Tester avec curl (cf. Test 1 ci-dessus)
```

---

**Version:** 1.0
**Date:** 30 janvier 2026
**Auteur:** Claude Code (Better Auth Implementation Enforcer)
