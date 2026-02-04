# Plan : Footer + Navigation - Simulateur Loi Jeanbrun

## Contexte

Le site a ~296 pages prevues (26 existantes + ~270 planifiees). Le footer actuel (`site-footer.tsx`) est basique et le header pointe vers des ancres `#` inexistantes. Il faut :
1. Remplacer le footer par un **Footer 3 Shadcn Studio** (5 colonnes + newsletter)
2. Corriger la navigation du header pour pointer vers les vraies pages
3. Conserver le maillage SEO des villes

---

## Phase 1 : Installer Footer Component 03

**Commande :**
```bash
cd /root/simulateur_loi_Jeanbrun
npx shadcn@latest add @ss-blocks/footer-component-03
```

Cela creera `src/components/shadcn-studio/blocks/footer-component-03/footer-component-03.tsx`

---

## Phase 2 : Personnaliser le Footer 3

**Fichier :** `src/components/shadcn-studio/blocks/footer-component-03/footer-component-03.tsx`

### Structure 5 colonnes :

| Colonne 1 | Colonne 2 | Colonne 3 | Colonne 4 | Colonne 5 |
|-----------|-----------|-----------|-----------|-----------|
| **Simulateur** | **Comprendre** | **Ressources** | **A propos** | **Legal** |
| Simulation gratuite | Loi Jeanbrun 2026 | Blog | Herve Voirin | Mentions legales |
| Simulation avancee | Zones eligibles | Barometre mensuel | Accompagnement | CGV |
| Resultats | Programmes neufs | FAQ | Prendre RDV | Confidentialite |
| Export PDF | Guide investisseur | Actualites | Contact | Accessibilite |

### Bandeau newsletter en haut :
- Reprendre le formulaire newsletter existant (email + bouton "M'inscrire")
- Texte : "Recevez les meilleures opportunites Loi Jeanbrun"

### Bande villes SEO sous les colonnes :
- Reutiliser `FooterVillesCompact` (top 10 villes + lien "Toutes les villes")
- Desktop : afficher par zone fiscale avec `FooterVilles` existant
- Mobile : version compacte inline

### Barre copyright en bas :
- Logo + "Simulateur Loi Jeanbrun"
- "(c) 2026 Expert IA Entreprise. Tous droits reserves."
- "Les simulations sont fournies a titre indicatif et ne constituent pas un conseil fiscal."

---

## Phase 3 : Remplacer le footer dans page.tsx

**Fichier :** `src/app/(landing)/page.tsx`

- Remplacer `<SiteFooter />` par le nouveau composant Footer 3 personnalise
- Supprimer l'import de `SiteFooter` si plus utilise

**Fichier :** `src/components/site-footer.tsx`

- Conserver ce fichier pour les pages internes (dashboard, profile, etc.) qui utilisent un layout different
- OU le remplacer aussi par le nouveau footer partout

---

## Phase 4 : Corriger la navigation du header

**Fichier :** `src/app/(landing)/page.tsx` - tableau `navigationData`

### Navigation avec dropdowns :

```typescript
const navigationData: NavigationSection[] = [
  {
    title: "Loi Jeanbrun",
    items: [
      { title: "Comprendre le dispositif", href: "/loi-jeanbrun" },
      { title: "Zones eligibles", href: "/villes" },
      { title: "Programmes neufs", href: "/programmes" },
    ]
  },
  {
    title: "Simulateur",
    href: "/simulateur",
  },
  {
    title: "Ressources",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Barometre", href: "/barometre" },
      { title: "FAQ", href: "/#faq" },
    ]
  },
  {
    title: "Accompagnement",
    href: "/a-propos",
  },
]
```

---

## Phase 5 : Corriger le lien Connexion du header

**Fichier :** `src/components/shadcn-studio/blocks/hero-section-18/header.tsx`

Actuellement le bouton "Connexion" pointe vers `#`. Le remplacer par `/login`.

---

## Fichiers concernes

| Fichier | Action |
|---------|--------|
| `src/components/shadcn-studio/blocks/footer-component-03/` | **NOUVEAU** - Installe via npx |
| `src/components/shadcn-studio/blocks/footer-component-03/footer-component-03.tsx` | Personnaliser contenu FR |
| `src/app/(landing)/page.tsx` | Remplacer SiteFooter + mettre a jour navigationData |
| `src/components/shadcn-studio/blocks/hero-section-18/header.tsx` | Corriger lien Connexion -> /login |
| `src/components/villes/FooterVilles.tsx` | Reutilise tel quel dans le nouveau footer |
| `src/components/site-footer.tsx` | Conserve pour pages internes (dashboard, etc.) |

---

## Verification

1. **Desktop (1440px)** : Verifier les 5 colonnes, newsletter, bande villes, copyright
2. **Mobile (393px)** : Verifier que les colonnes s'empilent, newsletter responsive, villes compactes
3. **Navigation header** : Tester chaque lien pointe vers la bonne page
4. **Bouton Connexion** : Verifie qu'il redirige vers /login
5. **SEO** : Verifier que les liens villes sont bien des `<a>` avec href (pas de JS-only)
6. **Build** : `pnpm build:ci` passe sans erreur
