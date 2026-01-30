# Guide de Test - Account Lockout

Ce guide explique comment tester et vérifier que le système de verrouillage de compte fonctionne correctement.

## Prérequis

- Application en cours d'exécution: `pnpm dev`
- Better Auth configuré et la base de données connectée
- Compte de test créé ou registre fonctionnel

## Test 1: Message d'Erreur Standard (Invalid Credentials)

### Scénario

Tester que les credentials invalides affichent le message standard, pas le lockout.

### Étapes

1. Ouvrir http://localhost:3000/login
2. Entrer un email valide (ex: `test@example.com`)
3. Entrer un mot de passe INVALIDE
4. Cliquer "Se connecter"

### Résultats Attendus

✅ Message affiché:
```
Email ou mot de passe incorrect.
```

✅ Formulaire reste ACTIF:
- Champs email/password sont actifs
- Bouton "Se connecter" est cliquable

✅ Style: Fond jaune/ambre (attention, pas critique)

### Code Vérifié

**Fichier:** `src/lib/auth-lockout.ts` (ligne ~127-139)

```typescript
if (
  message.toLowerCase().includes("invalid") ||
  message.toLowerCase().includes("incorrect") ||
  ...
) {
  return {
    type: AuthErrorType.INVALID_CREDENTIALS,
    message: "Email ou mot de passe incorrect.",
    isLocked: false, // ← Reste actif
  };
}
```

---

## Test 2: Lockout Après 5 Tentatives

### Scénario

Tester que le compte se verrouille après 5 tentatives échouées et affiche le message de lockout.

### Étapes

1. Ouvrir http://localhost:3000/login
2. Remplir credentials INVALIDES:
   - Email: `test@example.com`
   - Password: `wrong-password`
3. Cliquer "Se connecter" rapidement **5 fois de suite**

### Résultats Attendus (Tentatives 1-4)

✅ Erreur standard: "Email ou mot de passe incorrect."
✅ Formulaire reste actif
✅ Utilisateur peut continuer à taper/cliquer

### Résultats Attendus (Tentative 5)

✅ Message de lockout affiché:
```
Compte verrouillé suite à trop de tentatives de connexion échouées.
Veuillez réessayer dans 15 minutes.
```

✅ **Formulaire désactivé:**
- Champs email/password: grisés, non-cliquables
- Bouton "Se connecter": grisé, non-cliquable
- Lien "Mot de passe oublié": inactif (optionnel)

✅ Style: Fond **ROUGE** (critique) vs jaune/ambre

✅ **Attributs ARIA:**
- `aria-invalid="true"` sur les inputs
- `role="alert"` sur le message
- `aria-live="polite"` pour l'accessibilité

### Code Vérifié

**Fichier:** `src/lib/auth.ts` (ligne ~35-43)

```typescript
customRules: {
  "/sign-in/email": {
    window: 15 * 60,  // 15 minutes
    max: 5,           // 5 tentatives MAX
  },
}
```

**Fichier:** `src/components/auth/sign-in-button.tsx` (ligne ~79-132)

```typescript
const isAccountLocked = error ? shouldShowLockoutMessage(error) : false

<Input disabled={isPending || isAccountLocked} />
{error && (
  <div className={isAccountLocked ? LOCKOUT_ERROR_STYLES.container : ...}>
    {error.message}
  </div>
)}
```

---

## Test 3: Lockout Dure 15 Minutes

### Scénario

Vérifier que le lockout persiste pendant exactement 15 minutes, puis que le compte est déverrouillé.

### Étapes (Version Rapide - Simulation)

1. Verrouiller le compte (Test 2, tentative 5)
2. **En développement:** Modifier temporairement `src/lib/auth-lockout.ts`:
   ```typescript
   export const LOCKOUT_CONFIG = {
     DURATION_SECONDS: 30,  // ← Changer à 30 secondes pour test rapide
     ...
   }
   ```
3. Attendre 30 secondes
4. Actualiser la page
5. Tenter une nouvelle connexion

### Résultats Attendus

✅ Après 30 secondes: Compte déverrouillé
✅ Nouvelle tentative possible
✅ Formulaire réactif

### Étapes (Version Production - 15 minutes)

1. Verrouiller le compte (Test 2)
2. Attendre 15 minutes
3. Tenter une nouvelle connexion avec credentials invalides
4. Devrait voir "Email ou mot de passe incorrect." (pas lockout)

### Code Vérifié

**Fichier:** `src/lib/auth.ts`

```typescript
customRules: {
  "/sign-in/email": {
    window: 15 * 60,  // 900 secondes = 15 minutes
  },
}
```

**Fichier:** `src/lib/auth-lockout.ts`

```typescript
export const LOCKOUT_CONFIG = {
  DURATION_SECONDS: 15 * 60,  // ← 900 secondes
}
```

---

## Test 4: Réinitialisation Après Connexion Réussie

### Scénario

Vérifier que le compteur de tentatives échouées est réinitialisé après une connexion réussie.

### Étapes

1. Tenter 2-3 fois avec credentials invalides
   - Message: "Email ou mot de passe incorrect."
2. Se connecter avec credentials **valides**
   - Redirigé vers /dashboard
3. Se reconnecter vers http://localhost:3000/login
   - Devrait pas être verrouillé
4. Tenter 3 fois avec credentials invalides
   - Pas de lockout (compteur réinitialisé)

### Résultats Attendus

✅ Connexion réussie: Compteur = 0
✅ Prochaines tentatives: Compteur repart de 1
✅ Besoin de 5 tentatives échouées pour lockout (pas 2+3=5)

### Code Vérifié

**Better Auth Feature:** Réinitialisation automatique du compteur

Lorsque `signIn.email()` réussit, Better Auth réinitialise le compteur IP automatiquement. Pas de code supplémentaire nécessaire.

---

## Test 5: Messages en Français

### Scénario

Vérifier que tous les messages sont en français.

### Tests

| Message | Français | Fichier | Ligne |
|---------|----------|---------|-------|
| Invalid credentials | "Email ou mot de passe incorrect." | sign-in-button.tsx | ~52 |
| Lockout message | "Compte verrouillé..." | sign-in-button.tsx | ~123 |
| Form label | "Email" | sign-in-button.tsx | ~89 |
| Form label | "Mot de passe" | sign-in-button.tsx | ~105 |
| Submit button | "Se connecter" | sign-in-button.tsx | ~135 |
| Forgot password | "Mot de passe oublié ?" | sign-in-button.tsx | ~140 |
| Sign up link | "S'inscrire" | sign-in-button.tsx | ~147 |

### Résultats Attendus

✅ Tous les messages affichés en français
✅ Aucun texte anglais visible
✅ Accents correctement encodés

---

## Test 6: Styles CSS

### Scénario

Vérifier que les styles CSS sont correctement appliqués.

### Test Erreur Standard

```
Fond: Jaune/ambre (bg-amber-50 dark:bg-amber-900/20)
Bordure: Ambre (border-amber-200 dark:border-amber-800)
Texte: Ambre (text-amber-800 dark:text-amber-400)
```

### Test Lockout

```
Fond: Rouge (bg-red-50 dark:bg-red-900/20)
Bordure: Rouge (border-red-200 dark:border-red-800)
Texte: Rouge (text-red-800 dark:text-red-400)
```

### Code Vérifié

**Fichier:** `src/lib/auth-lockout.ts` (ligne ~226-234)

```typescript
export const LOCKOUT_ERROR_STYLES = {
  container: "rounded-md p-3 text-sm bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800",
  standard: "rounded-md p-3 text-sm bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
}
```

---

## Test 7: Accessibilité (ARIA)

### Scénario

Vérifier que les attributs ARIA sont présents pour l'accessibilité.

### Tests

| Élément | Attribut | Valeur | Fichier | Ligne |
|---------|----------|--------|---------|-------|
| Input email | `aria-invalid` | true/false | sign-in-button.tsx | ~98 |
| Input password | `aria-invalid` | true/false | sign-in-button.tsx | ~114 |
| Input email | `aria-describedby` | "signin-error" (si erreur) | sign-in-button.tsx | ~98 |
| Message erreur | `role` | "alert" | sign-in-button.tsx | ~122 |
| Message erreur | `aria-live` | "polite" | sign-in-button.tsx | ~122 |
| Button submit | `aria-busy` | true/false (si pending) | sign-in-button.tsx | ~133 |

### Résultats Attendus

✅ Tous les attributs présents
✅ Lecteur d'écran détecte l'erreur
✅ Les inputs sont liés au message d'erreur
✅ Utilisateurs malvoyants peuvent naviguer

### Code Vérifié

**Fichier:** `src/components/auth/sign-in-button.tsx`

```typescript
<Input
  aria-describedby={error ? "signin-error" : undefined}
  aria-invalid={!!error}
/>

<div role="alert" aria-live="polite">
  {error.message}
</div>

<Button aria-busy={isPending} />
```

---

## Test 8: Rate Limit Detection (Développeur)

### Scénario

Vérifier que les erreurs HTTP 429 sont correctement détectées.

### Étapes (avec DevTools)

1. Ouvrir http://localhost:3000/login
2. Ouvrir DevTools (F12) → Network tab
3. Tenter 5 fois avec credentials invalides
4. Observer les réponses réseau

### Résultats Attendus

Tentatives 1-4:
```
POST /api/auth/sign-in/email
Status: 200 OK
Response: { error: { message: "Invalid credentials" } }
```

Tentative 5:
```
POST /api/auth/sign-in/email
Status: 429 Too Many Requests
Response: { error: { message: "..." } }
Headers: Retry-After: 900
```

### Code à Vérifier

**Fichier:** `src/lib/auth.ts` (ligne ~35-43)

```typescript
rateLimit: {
  customRules: {
    "/sign-in/email": {
      window: 15 * 60,
      max: 5,
    },
  },
}
```

---

## Test 9: Multi-tentatives Rapides

### Scénario

Tester que le lockout fonctionne même avec des clics très rapides.

### Étapes

1. Ouvrir http://localhost:3000/login
2. Remplir credentials invalides
3. **Cliquer 5 fois très rapidement** (ou mettre form en boucle)

### Résultats Attendus

✅ 5ème tentative = lockout
✅ Pas de race condition
✅ Formulaire bien désactivé

---

## Test 10: Edge Cases

### Erreur sans message

```typescript
parseAuthError({})
```

**Attendu:** Message générique "Une erreur inattendue s'est produite"

### Message null/undefined

```typescript
parseAuthError({ message: undefined })
```

**Attendu:** Pas de crash, message par défaut

### Status code seulement

```typescript
parseAuthError({ status: 429 })
```

**Attendu:** Détecté comme rate limit

---

## Checklist de Test Complète

- [ ] Test 1: Invalid credentials → message ambre
- [ ] Test 2: 5 tentatives → lockout rouge
- [ ] Test 3: Lockout dure 15 minutes
- [ ] Test 4: Connexion réussie → compteur reset
- [ ] Test 5: Tous les messages en français
- [ ] Test 6: Styles CSS corrects
- [ ] Test 7: Attributs ARIA présents
- [ ] Test 8: HTTP 429 reçu
- [ ] Test 9: Clics rapides OK
- [ ] Test 10: Edge cases gérés

---

## Debugging

### Issue: Lockout ne s'affiche pas après 5 tentatives

**Cause possible:** Better Auth rate limit désactivé

```typescript
// src/lib/auth.ts
rateLimit: {
  enabled: true,  // ← Vérifier que c'est à true
}
```

**Solution:**
1. Vérifier que `rateLimit.enabled = true`
2. Vérifier que `customRules["/sign-in/email"].max = 5`
3. Redémarrer `pnpm dev`

### Issue: Lockout dure trop longtemps

**Cause possible:** Durée configurée incorrectement

```typescript
// src/lib/auth.ts
customRules: {
  "/sign-in/email": {
    window: 15 * 60,  // ← Vérifier la durée
  },
}
```

**Solution:**
1. En dev: Réduire à `60` secondes pour tester rapidement
2. En prod: Garder `15 * 60` = 900 secondes

### Issue: Message d'erreur en anglais

**Cause possible:** Mauvaise détection d'erreur

**Solution:**
1. Vérifier `parseAuthError()` dans `src/lib/auth-lockout.ts`
2. Ajouter les patterns manquants à `isRateLimitError()`

### Issue: Formulaire ne se désactive pas

**Cause possible:** `isAccountLocked` mal calculé

```typescript
// src/components/auth/sign-in-button.tsx
const isAccountLocked = error ? shouldShowLockoutMessage(error) : false
                        ↑ Doit vérifier si error existe
```

**Solution:**
1. Vérifier que `error` est défini
2. Vérifier que `shouldShowLockoutMessage()` retourne `true`

---

## Ressources

- Better Auth Docs: https://www.better-auth.com/docs/concepts/rate-limit
- Code du lockout: `src/lib/auth-lockout.ts`
- Tests unitaires: `src/lib/__tests__/auth-lockout.test.ts`
- Documentation: `docs/ACCOUNT_LOCKOUT.md`

---

**Version:** 1.0
**Date:** 30 janvier 2026
**Auteur:** Claude Code
