# Spécifications des Composants UI - Simulateur Loi Jeanbrun

**Version:** 1.0
**Date:** 30 janvier 2026
**Stack:** shadcn/ui + Tailwind CSS v4

---

## Table des Matières

1. [Boutons](#1-boutons)
2. [Inputs](#2-inputs)
3. [Cards](#3-cards)
4. [Progress Bar](#4-progress-bar)
5. [Sliders](#5-sliders)
6. [Jauges](#6-jauges)
7. [Alertes](#7-alertes)
8. [Badges](#8-badges)
9. [Navigation](#9-navigation)
10. [Modals](#10-modals)
11. [Trust Signals](#11-trust-signals)
12. [Composants Métier](#12-composants-métier)

---

## 1. Boutons

### 1.1 Button Primary (CTA)

Style signature avec effet glow doré.

```tsx
<Button variant="default" size="lg">
  SIMULER →
</Button>
```

**Specs:**
| Propriété | Valeur |
|-----------|--------|
| Background | `var(--accent)` (#F5A623) |
| Text | `var(--accent-foreground)` (dark) |
| Border Radius | `var(--radius-lg)` (8px) |
| Padding | `16px 32px` |
| Font Weight | 600 |
| Text Transform | uppercase |
| Letter Spacing | 0.05em |
| Hover | `var(--accent-hover)` + `shadow-glow` |
| Active | scale(0.98) |
| Focus | ring-2 ring-accent ring-offset-2 |

**Variantes de taille:**
| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 32px | 12px 16px | 14px |
| `md` | 40px | 14px 24px | 16px |
| `lg` | 48px | 16px 32px | 18px |
| `xl` | 56px | 20px 40px | 20px |

### 1.2 Button Secondary

```tsx
<Button variant="outline">
  ← Retour
</Button>
```

**Specs:**
| Propriété | Valeur |
|-----------|--------|
| Background | transparent |
| Border | 1px solid `var(--border)` |
| Text | `var(--foreground)` |
| Hover | border-color: `var(--accent)` |

### 1.3 Button Ghost

```tsx
<Button variant="ghost">
  En savoir plus
</Button>
```

**Specs:**
| Propriété | Valeur |
|-----------|--------|
| Background | transparent |
| Text | `var(--foreground-secondary)` |
| Hover | bg: `var(--muted)` |

---

## 2. Inputs

### 2.1 Input Text

```tsx
<Input
  type="text"
  placeholder="Entrez une valeur..."
/>
```

**Specs:**
| Propriété | Valeur |
|-----------|--------|
| Height | 44px |
| Background | `var(--background-secondary)` |
| Border | 1px solid `var(--border)` |
| Border Radius | `var(--radius-lg)` (8px) |
| Padding | 12px 16px |
| Font Size | 16px |
| Placeholder Color | `var(--muted-foreground)` |

**États:**
| État | Style |
|------|-------|
| Default | border: `var(--border)` |
| Hover | border: `var(--foreground-secondary)` |
| Focus | border: `var(--accent)`, ring-1 |
| Error | border: `var(--destructive)`, ring-1 |
| Disabled | opacity: 0.5, cursor: not-allowed |

### 2.2 Input avec Icône

```tsx
<div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2">
    <Euro className="h-4 w-4 text-muted-foreground" />
  </span>
  <Input className="pl-10" />
</div>
```

### 2.3 Input avec Suffixe

```tsx
<div className="relative">
  <Input className="pr-12" />
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
    €
  </span>
</div>
```

### 2.4 Select

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionner..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

**Specs:** Mêmes specs que Input avec chevron à droite.

---

## 3. Cards

### 3.1 Card Option (Sélection)

Utilisée pour les choix exclusifs (type de bien, objectif, structure).

```tsx
<Card
  className={cn(
    "cursor-pointer p-6 transition-all",
    "hover:border-accent/50",
    isSelected && "border-2 border-accent bg-accent/10"
  )}
  onClick={() => onChange(value)}
>
  <div className="flex flex-col items-center gap-4 text-center">
    <div className="rounded-full bg-accent/10 p-4">
      <Icon className="h-8 w-8 text-accent" />
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Badge variant="outline">{badge}</Badge>
  </div>
</Card>
```

**Specs:**
| Propriété | Valeur |
|-----------|--------|
| Background | `var(--card)` |
| Border | 1px solid `var(--border)` |
| Border Radius | `var(--radius-xl)` (12px) |
| Padding | 24px |
| Gap (interne) | 16px |

**États:**
| État | Style |
|------|-------|
| Default | border: `var(--border)` |
| Hover | border: `var(--accent)/50` |
| Selected | border-2 border-accent, bg: `var(--accent)/10` |

### 3.2 Card Info (Style Wireframe)

Card avec bordure dashed dorée signature.

```tsx
<Card className="border-dashed-gold p-4">
  <div className="flex items-center gap-2">
    <Info className="h-4 w-4 text-accent" />
    <p className="text-sm">{content}</p>
  </div>
</Card>
```

**Specs:**
| Propriété | Valeur |
|-----------|--------|
| Border | 1px dashed `var(--border-dashed)` |
| Background | transparent ou `var(--accent)/5` |
| Corner accents | optionnel (voir style-guide) |

### 3.3 Card Résultat

Pour afficher les KPIs sur la page résultats.

```tsx
<Card className="p-6">
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold text-success">{value}</p>
    </div>
    <div className="rounded-full bg-success/10 p-2">
      <Icon className="h-5 w-5 text-success" />
    </div>
  </div>
  <p className="mt-2 text-xs text-muted-foreground">{subtext}</p>
</Card>
```

---

## 4. Progress Bar

### 4.1 Progress Bar Étapes

Affiche la progression dans le simulateur (6 étapes).

```tsx
<div className="space-y-2">
  {/* Labels */}
  <div className="flex justify-between text-sm text-muted-foreground">
    <span>Étape {current}/{total}</span>
    <span>{stepLabels[current - 1]}</span>
  </div>

  {/* Barre */}
  <div className="h-2 overflow-hidden rounded-full bg-muted">
    <div
      className="h-full bg-accent transition-all duration-300"
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>

  {/* Points */}
  <div className="flex justify-between">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "h-3 w-3 rounded-full border-2 transition-colors",
          i < current
            ? "border-accent bg-accent"
            : i === current - 1
              ? "border-accent bg-background"
              : "border-muted bg-muted"
        )}
      />
    ))}
  </div>
</div>
```

**Specs:**
| Propriété | Valeur |
|-----------|--------|
| Bar Height | 8px |
| Bar Background | `var(--muted)` |
| Fill Color | `var(--accent)` |
| Border Radius | full |
| Dot Size | 12px |
| Transition | 300ms ease-out |

### 4.2 Progress Bar Simple

```tsx
<Progress value={percentage} className="h-2" />
```

---

## 5. Sliders

### 5.1 Slider Budget

```tsx
<div className="space-y-4">
  <div className="flex justify-between">
    <span className="text-sm">Budget estimé</span>
    <span className="font-bold text-accent">{formatEuros(value)}</span>
  </div>
  <Slider
    value={[value]}
    onValueChange={(v) => onChange(v[0])}
    min={50000}
    max={500000}
    step={5000}
  />
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>50 000 €</span>
    <span>500 000 €</span>
  </div>
</div>
```

**Specs:**
| Propriété | Valeur |
|-----------|--------|
| Track Height | 8px |
| Track Background | `var(--muted)` |
| Range Color | `var(--accent)` |
| Thumb Size | 20px |
| Thumb Color | `var(--accent)` |
| Thumb Border | 2px solid white |

### 5.2 Slider Durée

Avec info contextuelles selon la valeur.

```tsx
<DureeSlider
  value={duree}
  onChange={setDuree}
  min={9}
  max={30}
/>
```

Affiche des messages conditionnels :
- `9 ans` : "⚠️ Durée minimum d'engagement Jeanbrun"
- `≥ 22 ans` : "✅ Exonération totale d'IR sur la plus-value"
- `≥ 30 ans` : "✅ Exonération totale d'IR + prélèvements sociaux"

---

## 6. Jauges

### 6.1 Jauge Endettement

Affiche le taux d'endettement avec zones colorées.

```tsx
<JaugeEndettement
  revenuMensuel={4000}
  mensualiteCredit={857}
  autresCredits={0}
/>
```

**Zones colorées:**
| Zone | Taux | Couleur |
|------|------|---------|
| Safe | < 30% | `var(--gauge-safe)` (Vert) |
| Warning | 30-35% | `var(--gauge-warning)` (Orange) |
| Danger | > 35% | `var(--gauge-danger)` (Rouge) |

**Structure:**
```tsx
<div className="relative h-4 overflow-hidden rounded-full bg-muted">
  {/* Zones de couleur en fond */}
  <div className="absolute inset-y-0 left-0 w-[30%] bg-success/20" />
  <div className="absolute inset-y-0 left-[30%] w-[5%] bg-warning/20" />
  <div className="absolute inset-y-0 left-[35%] bg-destructive/20" />

  {/* Barre de progression */}
  <div
    className={cn("absolute inset-y-0 left-0 transition-all", colorClass)}
    style={{ width: `${Math.min(taux, 100)}%` }}
  />

  {/* Marqueurs */}
  <div className="absolute inset-y-0 w-0.5 bg-black/50" style={{ left: '30%' }} />
  <div className="absolute inset-y-0 w-0.5 bg-black/50" style={{ left: '35%' }} />
</div>
```

### 6.2 Jauge Travaux

Affiche le pourcentage travaux/prix avec seuil 30%.

```tsx
<TravauxValidator
  prixAcquisition={195000}
  montantTravaux={70000}
/>
```

---

## 7. Alertes

### 7.1 Alert Success

```tsx
<Alert className="border-success bg-success-background">
  <CheckCircle2 className="h-4 w-4 text-success" />
  <AlertTitle className="text-success-foreground">Éligible</AlertTitle>
  <AlertDescription className="text-success-foreground/80">
    Vos travaux respectent le seuil de 30%.
  </AlertDescription>
</Alert>
```

### 7.2 Alert Warning

```tsx
<Alert className="border-warning bg-warning-background">
  <AlertTriangle className="h-4 w-4 text-warning" />
  <AlertTitle className="text-warning-foreground">Attention</AlertTitle>
  <AlertDescription className="text-warning-foreground/80">
    Taux d'endettement limite.
  </AlertDescription>
</Alert>
```

### 7.3 Alert Error

```tsx
<Alert variant="destructive">
  <XCircle className="h-4 w-4" />
  <AlertTitle>Non éligible</AlertTitle>
  <AlertDescription>
    Travaux insuffisants pour le dispositif.
  </AlertDescription>
</Alert>
```

### 7.4 Alert Info (Style Wireframe)

```tsx
<div className="border border-dashed border-accent/40 bg-accent/5 p-4 rounded-lg">
  <div className="flex items-start gap-3">
    <Info className="h-5 w-5 text-accent mt-0.5" />
    <div>
      <p className="font-medium text-accent">Information</p>
      <p className="text-sm text-muted-foreground mt-1">{content}</p>
    </div>
  </div>
</div>
```

---

## 8. Badges

### 8.1 Badge Default

```tsx
<Badge>Recommandé</Badge>
```

### 8.2 Badge Outline

```tsx
<Badge variant="outline">Zone A</Badge>
```

### 8.3 Badge TMI

Affiche la TMI avec couleur conditionnelle.

```tsx
<Badge variant={tmi >= 30 ? "destructive" : "secondary"}>
  {tmi}%
</Badge>
```

### 8.4 Badge Sélectionné

```tsx
<Badge variant="default" className="bg-accent">
  Sélectionné
</Badge>
```

---

## 9. Navigation

### 9.1 Header Simulateur

```tsx
<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <Logo />
      <nav className="hidden md:flex gap-6">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
          Accueil
        </a>
        {/* ... */}
      </nav>
      <Button variant="outline" size="sm">
        <Phone className="h-4 w-4 mr-2" />
        Contact
      </Button>
    </div>
  </div>
</header>
```

### 9.2 Navigation Étapes (Footer)

```tsx
<footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={onBack} disabled={isFirstStep}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      <Button onClick={onNext} disabled={!canProceed}>
        {isLastStep ? 'Voir mes résultats' : 'Continuer'}
        {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
      </Button>
    </div>
  </div>
</footer>
```

**Responsive Mobile:**
- Boutons empilés verticalement
- Bouton principal en bas, pleine largeur

---

## 10. Modals

### 10.1 Modal Capture Email

```tsx
<Dialog>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-accent" />
        Recevez vos résultats
      </DialogTitle>
      <DialogDescription>
        Sauvegarder votre simulation et recevoir un récapitulatif.
      </DialogDescription>
    </DialogHeader>
    <form className="space-y-4">
      <Input type="email" placeholder="votre@email.com" />
      <Input type="text" placeholder="Prénom" />
      <Input type="tel" placeholder="Téléphone (optionnel)" />
      <div className="flex items-center gap-2">
        <Checkbox id="consent" />
        <label htmlFor="consent" className="text-sm">
          J'accepte de recevoir des informations
        </label>
      </div>
      <Button type="submit" className="w-full">
        Voir mes résultats →
      </Button>
    </form>
    <p className="text-xs text-muted-foreground text-center">
      <Lock className="h-3 w-3 inline mr-1" />
      Vos données sont protégées (RGPD)
    </p>
  </DialogContent>
</Dialog>
```

### 10.2 Modal Paiement

Structure similaire avec les options Premium / Pack Duo.

---

## 11. Trust Signals

### 11.1 Barre Trust Signals

Affichée sous le hero.

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
  {trustSignals.map((signal) => (
    <div
      key={signal.id}
      className="flex flex-col items-center gap-2 text-center p-4 border border-dashed border-accent/30 rounded-lg"
    >
      <span className="text-2xl">{signal.icon}</span>
      <span className="font-semibold">{signal.title}</span>
      <span className="text-sm text-muted-foreground">{signal.subtitle}</span>
    </div>
  ))}
</div>
```

**Données:**
```ts
const trustSignals = [
  { icon: "🏆", title: "N°1", subtitle: "Simulateur Jeanbrun" },
  { icon: "🔒", title: "100%", subtitle: "Gratuit Sans CB" },
  { icon: "⚡", title: "Résultat", subtitle: "en 2 min" },
  { icon: "📊", title: "Expert", subtitle: "CGP validé" },
]
```

### 11.2 Rating Stars

```tsx
<div className="flex items-center gap-2">
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn(
          "h-5 w-5",
          star <= rating ? "fill-amber-400 text-amber-400" : "text-muted"
        )}
      />
    ))}
  </div>
  <span className="font-semibold">{rating}/5</span>
  <span className="text-muted-foreground">({count} avis)</span>
</div>
```

---

## 12. Composants Métier

### 12.1 TMI Calculator

Affiche la TMI calculée automatiquement.

```tsx
<Card className="p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">
        Votre Tranche Marginale d'Imposition
      </span>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">
            La TMI est le taux d'imposition appliqué à la dernière tranche
            de vos revenus.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
    <Badge variant={tmi >= 30 ? 'destructive' : 'secondary'}>
      {tmi}%
    </Badge>
  </div>
  <p className="text-sm text-muted-foreground mt-2">
    Économie potentielle: {tmi}% de l'amortissement Jeanbrun
  </p>
</Card>
```

### 12.2 Ville Autocomplete

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-full justify-between">
      {selectedVille ? (
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {selectedVille.name} ({selectedVille.departement})
        </span>
      ) : (
        <span className="text-muted-foreground">Rechercher une ville...</span>
      )}
      <ChevronsUpDown className="h-4 w-4 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-full p-0">
    <Command>
      <CommandInput placeholder="Tapez le nom d'une ville..." />
      <CommandList>
        <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
        <CommandGroup>
          {suggestions.map((ville) => (
            <CommandItem
              key={ville.slug}
              onSelect={() => handleSelect(ville)}
            >
              <div className="flex flex-col">
                <span>{ville.name}</span>
                <span className="text-xs text-muted-foreground">
                  {ville.departement} - Zone {ville.zoneFiscale}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

### 12.3 Objectif Selector

Cards de sélection pour l'objectif principal.

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {objectifs.map((obj) => (
    <Card
      key={obj.id}
      className={cn(
        "cursor-pointer p-4 text-center",
        value === obj.id && "border-2 border-accent bg-accent/10"
      )}
      onClick={() => onChange(obj.id)}
    >
      <span className="text-3xl">{obj.icon}</span>
      <p className="mt-2 text-sm font-medium">{obj.label}</p>
      <Radio checked={value === obj.id} className="mt-2" />
    </Card>
  ))}
</div>
```

**Données:**
```ts
const objectifs = [
  { id: 'reduire_impots', icon: '💰', label: 'Réduire mes impôts' },
  { id: 'revenus', icon: '📈', label: 'Générer revenus' },
  { id: 'patrimoine', icon: '🏠', label: 'Constituer patrimoine' },
  { id: 'retraite', icon: '👴', label: 'Préparer retraite' },
]
```

### 12.4 Niveau Loyer Cards

```tsx
<div className="grid gap-4 md:grid-cols-3">
  {niveaux.map((niveau) => (
    <Card
      key={niveau.id}
      className={cn(
        "cursor-pointer p-4",
        value === niveau.id && `border-2 ${niveau.borderColor}`
      )}
      onClick={() => onChange(niveau.id)}
    >
      <h3 className="font-semibold">{niveau.label}</h3>
      <p className="text-sm text-muted-foreground">{niveau.description}</p>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Loyer max:</span>
          <span className="font-medium">{formatEuros(loyerMax)}/mois</span>
        </div>
        <div className="flex justify-between">
          <span>Amortissement:</span>
          <span className="font-medium text-accent">{niveau.taux}</span>
        </div>
      </div>
    </Card>
  ))}
</div>
```

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 30/01/2026 | Version initiale |
