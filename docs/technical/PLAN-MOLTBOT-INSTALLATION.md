# Plan MoltBot - Installation et Scraping Enrichi

**Version:** 2.0
**Date:** 31 janvier 2026
**Objectif:** Configurer MoltBot pour scraper programmes, photos, et données villes avec optimisation SEO

---

## Vue d'ensemble Mission

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MISSION MOLTBOT V2                                │
│                                                                             │
│  1. PROGRAMMES IMMOBILIERS                                                  │
│     → Coordonnées GPS                                                       │
│     → Prix, lots, dates livraison                                           │
│     → Photos optimisées SEO                                                 │
│                                                                             │
│  2. PHOTOS VILLES                                                           │
│     → Un lieu emblématique par ville                                        │
│     → Renommage SEO (loi-jeanbrun-lyon.webp)                               │
│     → Compression (< 100Ko)                                                 │
│     → Format cercle-ready                                                   │
│                                                                             │
│  3. CONSTRUCTIONS EN COURS                                                  │
│     → État d'avancement                                                     │
│     → Nombre de lots restants                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Configuration EspoCRM

### Accès API

| Paramètre | Valeur |
|-----------|--------|
| **URL API** | `https://espocrm.expert-ia-entreprise.fr/api/v1` |
| **Méthode auth** | API Key (header `X-Api-Key`) |
| **API Key** | `1a97a8b3ca73fd5f1cdfed6c4f5341ec` |
| **Interface Admin** | `https://espocrm.expert-ia-entreprise.fr` |

### Entités disponibles

| Entité | Nombre actuel | Description |
|--------|---------------|-------------|
| `CJeanbrunVille` | 51 | Villes éligibles loi Jeanbrun |
| `CJeanbrunProgramme` | 153 | Programmes immobiliers neufs |
| `CJeanbrunBarometre` | 0 | Baromètres mensuels (à remplir) |

### Exemples requêtes API

```bash
# Lister les villes
curl -X GET "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunVille?maxSize=100" \
  -H "X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec"

# Lister les programmes
curl -X GET "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunProgramme?maxSize=200" \
  -H "X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec"

# Créer un baromètre
curl -X POST "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunBarometre" \
  -H "X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec" \
  -H "Content-Type: application/json" \
  -d '{
    "villeId": "ID_VILLE",
    "mois": "2026-01",
    "scoreAttractivite": 75,
    "prixM2": 4890,
    "evolutionPrixMois": 0.3,
    "loyerM2": 15.5,
    "rendementBrut": 3.8,
    "nbProgrammesActifs": 12
  }'

# Mettre à jour une ville (photo)
curl -X PUT "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunVille/ID_VILLE" \
  -H "X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec" \
  -H "Content-Type: application/json" \
  -d '{
    "photoVille": "https://cdn.../loi-jeanbrun-lyon.webp",
    "photoVilleAlt": "Investir avec la loi Jeanbrun à Lyon"
  }'
```

### Champs configurés (31 janvier 2026)

**CJeanbrunVille** (nouveaux champs) :
- `photoVille` (url) - URL photo lieu emblématique
- `photoVilleAlt` (varchar) - Texte alternatif SEO
- `contenuEditorial` (text) - Contenu généré par IA
- `metaTitle` (varchar) - Titre SEO
- `metaDescription` (text) - Description SEO

**CJeanbrunProgramme** (nouveaux champs) :
- `imagePrincipale` (url) - URL image principale
- `imageAlt` (varchar) - Texte alternatif SEO

**CJeanbrunBarometre** (nouvelle entité) :
- `villeId` (link) - Relation vers CJeanbrunVille
- `mois` (varchar) - Format YYYY-MM
- `scoreAttractivite` (int) - Score 0-100
- `prixM2` (float) - Prix moyen au m²
- `evolutionPrixMois` (float) - % évolution mensuelle
- `loyerM2` (float) - Loyer moyen au m²
- `rendementBrut` (float) - Rendement brut %
- `nbProgrammesActifs` (int) - Nombre de programmes
- `meilleureOpportunite` (link) - Lien vers meilleur programme
- `analyseIA` (text) - Analyse générée par IA

---

## Phase 1: Scraping Programmes (existant - enrichi)

### 1.1 Données à récupérer par programme

| Champ | Source | Obligatoire | Exemple |
|-------|--------|-------------|---------|
| name | Page programme | Oui | "Résidence Les Jardins" |
| promoteur | Page programme | Oui | "Nexity" |
| adresse | Page programme | Oui | "15 rue République, 69001 Lyon" |
| latitude | Géocodage | Oui | 45.7640 |
| longitude | Géocodage | Oui | 4.8357 |
| prixMin | Page programme | Oui | 185000 |
| prixMax | Page programme | Non | 420000 |
| nbLotsTotal | Page programme | Non | 45 |
| nbLotsDisponibles | Page programme | Oui | 12 |
| typesLots | Page programme | Oui | ["T2", "T3", "T4"] |
| dateLivraison | Page programme | Oui | "T4 2027" |
| images[] | Page programme | **Oui** | URLs optimisées |

### 1.2 Traitement des photos programmes

**Workflow obligatoire :**

```
1. Télécharger image originale
2. Renommer avec format SEO:
   programme-[nom-slug]-[promoteur]-[ville]-[index].webp
   Ex: programme-jardins-republique-nexity-lyon-1.webp
3. Compresser (< 100Ko, qualité 85%)
4. Convertir en WebP
5. Uploader vers stockage (Vercel Blob ou CDN)
6. Stocker URL finale dans EspoCRM
```

**Nommage SEO des images programmes :**

```
Format: programme-{nom-programme-slug}-{promoteur}-{ville}-{index}.webp

Exemples:
- programme-jardins-republique-nexity-lyon-1.webp
- programme-jardins-republique-nexity-lyon-2.webp
- programme-terrasses-confluence-bouygues-lyon-1.webp
```

**Script de traitement (référence) :**

```python
from PIL import Image
import io
import re

def optimize_programme_image(image_data, programme_name, promoteur, ville, index):
    """
    Optimise une image de programme pour le SEO
    """
    # Générer nom SEO
    slug = slugify(f"{programme_name}-{promoteur}-{ville}")
    filename = f"programme-{slug}-{index}.webp"

    # Ouvrir et redimensionner
    img = Image.open(io.BytesIO(image_data))

    # Redimensionner max 1200x800
    img.thumbnail((1200, 800), Image.LANCZOS)

    # Convertir en WebP avec compression
    output = io.BytesIO()
    img.save(output, format='WEBP', quality=85, optimize=True)

    # Vérifier taille < 100Ko
    if output.tell() > 100000:
        # Recompresser plus fort
        output = io.BytesIO()
        img.save(output, format='WEBP', quality=70, optimize=True)

    return {
        "filename": filename,
        "data": output.getvalue(),
        "alt": f"Programme immobilier neuf {programme_name} par {promoteur} à {ville}"
    }

def slugify(text):
    """Convertit un texte en slug SEO-friendly"""
    import unicodedata
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^a-z0-9]+', '-', text.lower())
    return text.strip('-')
```

---

## Phase 2: Photos Villes Emblématiques (NOUVEAU)

### 2.1 Concept

Chaque ville doit avoir une photo représentative affichée dans un cercle dans le header :

```
┌────────────────────────────────────────────────────────────┐
│  ┌──────┐                                                  │
│  │ 📷  │   Loi Jeanbrun à Lyon                            │
│  │ LYON │   Zone A • 4 890€/m² • 23 programmes neufs      │
│  └──────┘                                                  │
└────────────────────────────────────────────────────────────┘
     ↑
     Photo circulaire
     (lieu emblématique)
```

### 2.2 Sources pour photos villes

| Source | Méthode | Qualité |
|--------|---------|---------|
| **Unsplash API** | API gratuite | Haute |
| **Pexels API** | API gratuite | Haute |
| **Wikimedia Commons** | Scraping | Variable |
| **Google Images** | Scraping (attention droits) | Variable |

**Recherche par ville :**

```
Requête: "{ville} France monument landmark"
Exemples:
- "Lyon France Fourvière" → Basilique Notre-Dame de Fourvière
- "Paris France Eiffel" → Tour Eiffel
- "Marseille France Vieux Port" → Vieux Port
- "Bordeaux France Place Bourse" → Miroir d'eau
```

### 2.3 Critères de sélection photo ville

- [ ] Lieu emblématique reconnaissable
- [ ] Bonne luminosité (pas sombre)
- [ ] Cadrage centré (pour découpe cercle)
- [ ] Pas de personnes identifiables (RGPD)
- [ ] Libre de droits ou Creative Commons

### 2.4 Traitement photos villes

**Workflow obligatoire :**

```
1. Rechercher photo lieu emblématique
2. Télécharger meilleure option
3. Renommer format SEO:
   loi-jeanbrun-{ville-slug}.webp
   Ex: loi-jeanbrun-lyon.webp
4. Redimensionner carré 800x800
5. Compresser < 80Ko (qualité 80%)
6. Uploader vers CDN
7. Stocker URL dans CJeanbrunVille.photoVille
8. Stocker alt text: "Investir avec la loi Jeanbrun à {Ville}"
```

**Nommage SEO des photos villes :**

```
Format: loi-jeanbrun-{ville-slug}.webp

Exemples:
- loi-jeanbrun-lyon.webp
- loi-jeanbrun-paris.webp
- loi-jeanbrun-bordeaux.webp
- loi-jeanbrun-aix-en-provence.webp
```

**Script de traitement (référence) :**

```python
from PIL import Image
import io

def optimize_ville_image(image_data, ville_name):
    """
    Optimise une photo de ville pour affichage circulaire
    """
    # Générer nom SEO
    slug = slugify(ville_name)
    filename = f"loi-jeanbrun-{slug}.webp"

    # Ouvrir image
    img = Image.open(io.BytesIO(image_data))

    # Convertir en carré (crop central)
    width, height = img.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    top = (height - min_dim) // 2
    img = img.crop((left, top, left + min_dim, top + min_dim))

    # Redimensionner 800x800
    img = img.resize((800, 800), Image.LANCZOS)

    # Convertir en WebP
    output = io.BytesIO()
    img.save(output, format='WEBP', quality=80, optimize=True)

    # Vérifier taille < 80Ko
    if output.tell() > 80000:
        output = io.BytesIO()
        img.save(output, format='WEBP', quality=65, optimize=True)

    return {
        "filename": filename,
        "data": output.getvalue(),
        "alt": f"Investir avec la loi Jeanbrun à {ville_name}"
    }
```

### 2.5 Lieux emblématiques par ville (exemples)

| Ville | Lieu emblématique | Recherche suggérée |
|-------|-------------------|-------------------|
| Paris | Tour Eiffel | "paris eiffel tower" |
| Lyon | Fourvière | "lyon fourviere basilica" |
| Marseille | Vieux Port | "marseille vieux port" |
| Bordeaux | Place de la Bourse | "bordeaux miroir eau" |
| Toulouse | Capitole | "toulouse capitole" |
| Nantes | Machines de l'île | "nantes elephant" |
| Nice | Promenade des Anglais | "nice promenade anglais" |
| Lille | Grand Place | "lille grand place" |
| Strasbourg | Petite France | "strasbourg petite france" |
| Montpellier | Place de la Comédie | "montpellier comedie" |
| Rennes | Parlement de Bretagne | "rennes parlement" |
| Grenoble | Téléphérique Bastille | "grenoble bastille" |
| Dijon | Place de la Libération | "dijon liberation" |
| Angers | Château | "angers chateau" |
| Nîmes | Arènes | "nimes arenes" |
| Reims | Cathédrale | "reims cathedrale" |
| Le Havre | Oscar Niemeyer | "le havre volcan" |
| Tours | Place Plumereau | "tours plumereau" |

---

## Phase 3: Structure EspoCRM enrichie

### 3.1 Champs photos sur CJeanbrunVille

```json
{
  "photoVille": {
    "type": "url",
    "maxLength": 500,
    "comment": "URL photo lieu emblématique (format cercle)"
  },
  "photoVilleAlt": {
    "type": "varchar",
    "maxLength": 200,
    "comment": "Texte alternatif SEO"
  },
  "photoVilleCredits": {
    "type": "varchar",
    "maxLength": 200,
    "comment": "Crédits photo (si requis)"
  }
}
```

### 3.2 Champs photos sur CJeanbrunProgramme

```json
{
  "images": {
    "type": "text",
    "comment": "URLs images séparées par \\n (max 5)"
  },
  "imageAlt": {
    "type": "varchar",
    "maxLength": 200,
    "comment": "Alt text pour image principale"
  },
  "imagePrincipale": {
    "type": "url",
    "maxLength": 500,
    "comment": "URL image principale (première)"
  }
}
```

---

## Phase 4: Workflow Quotidien MoltBot

### 4.1 Cron Scraping Programmes (04:00)

```bash
# Workflow quotidien
1. Récupérer liste 50 CJeanbrunVille
2. Pour chaque ville:
   a. Scraper programmes Nexity, Bouygues, SeLoger
   b. Pour chaque programme:
      - Télécharger photos (max 5)
      - Optimiser et renommer SEO
      - Uploader vers CDN
      - Créer/Update dans EspoCRM
   c. Géocoder adresses manquantes
3. Rapport WhatsApp
```

### 4.2 Cron Photos Villes (hebdo dimanche 02:00)

```bash
# Workflow hebdomadaire
1. Récupérer villes sans photoVille
2. Pour chaque ville:
   a. Rechercher photo emblématique (Unsplash/Pexels)
   b. Télécharger meilleure option
   c. Optimiser (carré 800x800, WebP)
   d. Renommer SEO
   e. Uploader vers CDN
   f. Update CJeanbrunVille.photoVille
3. Rapport WhatsApp
```

---

## Phase 5: API Endpoints nécessaires

### 5.1 Endpoints Clawdbot Gateway (VPS CardImmo)

```javascript
// Endpoint upload image
POST /upload/image
Body: {
  "image_base64": "...",
  "filename": "loi-jeanbrun-lyon.webp",
  "folder": "villes|programmes"
}
Response: {
  "success": true,
  "url": "https://cdn.../villes/loi-jeanbrun-lyon.webp"
}

// Endpoint optimisation image
POST /optimize/image
Body: {
  "image_url": "https://...",
  "output_format": "webp",
  "max_size_kb": 100,
  "dimensions": { "width": 800, "height": 800, "mode": "crop_center" },
  "filename": "loi-jeanbrun-lyon.webp"
}
Response: {
  "success": true,
  "url": "https://cdn.../optimized/loi-jeanbrun-lyon.webp",
  "size_kb": 78
}
```

### 5.2 Stockage images

| Option | Coût | Avantages |
|--------|------|-----------|
| **Vercel Blob** | Gratuit (1GB) | Intégré, CDN automatique |
| **Cloudflare R2** | Gratuit (10GB) | CDN global, pas de frais egress |
| **S3 + CloudFront** | ~$5/mois | Fiable, scalable |
| **GitHub LFS** | Gratuit (1GB) | Simple, versioning |

**Recommandation:** Cloudflare R2 (gratuit, CDN global)

---

## Phase 6: Rapport WhatsApp Format

### 6.1 Rapport quotidien programmes

```
📦 Scraping Jeanbrun - 31/01/2026

Programmes:
✅ Trouvés: 127
✅ Créés: 23
✅ Mis à jour: 104
❌ Erreurs: 0

Photos programmes:
✅ Téléchargées: 456
✅ Optimisées: 456
📦 Taille totale: 34 Mo

Top villes:
1. Paris: 28 programmes
2. Lyon: 15 programmes
3. Bordeaux: 12 programmes
```

### 6.2 Rapport hebdo photos villes

```
📷 Photos Villes - 02/02/2026

Villes traitées: 50/50
✅ Photos trouvées: 48
⚠️ Manuel requis: 2 (Roubaix, Tourcoing)

Taille moyenne: 65 Ko/photo
Format: WebP 800x800

Exemples:
- loi-jeanbrun-paris.webp (72 Ko)
- loi-jeanbrun-lyon.webp (68 Ko)
- loi-jeanbrun-marseille.webp (71 Ko)
```

---

## Phase 7: Checklist avant lancement

### VPS CardImmo

- [ ] Endpoint `/upload/image` ajouté au Gateway
- [ ] Endpoint `/optimize/image` ajouté au Gateway
- [ ] Stockage Cloudflare R2 configuré
- [ ] Champs photos ajoutés dans EspoCRM

### VPS MoltBot

- [ ] Skill `programme-scraper` mis à jour avec photos
- [ ] Skill `ville-photo-finder` créé
- [ ] Variables d'env configurées (API keys)
- [ ] Test sur 3 villes réussi

### Tests

- [ ] Photo programme optimisée < 100 Ko
- [ ] Photo ville carrée 800x800
- [ ] Nommage SEO correct
- [ ] Upload vers CDN fonctionnel
- [ ] URL stockée dans EspoCRM

---

## Commandes WhatsApp

### Test photos programmes

```
Tom, scrape les programmes de Lyon avec photos (test)
```

### Test photos villes

```
Tom, trouve et optimise la photo emblématique de Lyon
```

### Scraping complet avec photos

```
Tom, lance le scraping complet Jeanbrun avec photos optimisées
```

### Vérification photos

```
Tom, combien de photos programmes sont dans EspoCRM ?
Tom, quelles villes n'ont pas de photo ?
```

---

## Annexe: Dimensions et formats

### Photos programmes

| Taille | Usage | Format |
|--------|-------|--------|
| 1200x800 | Page détail | WebP |
| 600x400 | Cards liste | WebP |
| 300x200 | Thumbnails | WebP |

### Photos villes (cercle)

| Taille | Usage | Format |
|--------|-------|--------|
| 800x800 | Header (cercle) | WebP |
| 400x400 | Mobile | WebP |
| 200x200 | Thumbnail | WebP |

### Compression cibles

| Type | Max taille | Qualité |
|------|------------|---------|
| Programme | 100 Ko | 85% |
| Ville | 80 Ko | 80% |
| Thumbnail | 30 Ko | 70% |

---

**Auteur:** Claude (Opus 4.5)
**Date:** 31 janvier 2026
**Version:** 2.0 (avec photos optimisées SEO)
