# Phase 4 - Pages SEO + Enrichissement Données

**Sprint:** 4
**Semaines:** S7-S8 (17-28 Mars 2026)
**Effort estimé:** 18 jours (augmenté pour intégrer enrichissement)
**Objectif:** 50+ pages villes SEO-ready avec données hyper-locales + Baromètre mensuel

---

## 1. Vue d'ensemble enrichie

### 1.1 Changements vs version initiale

| Élément | Version initiale | Version enrichie |
|---------|------------------|------------------|
| Pages villes | 50 basiques | 50+ avec quartiers, POI, historique prix |
| Données marché | Statique | DVF API + INSEE (temps réel) |
| Contenu | 400-600 mots/ville | + Baromètre mensuel auto-généré |
| Sources | EspoCRM seul | DVF + INSEE + geo.api + scraping promoteurs |
| Programmes | Nexity seul | Multi-promoteurs (Bouygues, Kaufman, Icade...) |

### 1.2 APIs Gratuites Confirmées

| API | URL | Données | Limite |
|-----|-----|---------|--------|
| [DVF (CEREMA)](https://api.gouv.fr/les-api/api-donnees-foncieres) | api-datafoncier.cerema.fr | Transactions immo depuis 2010 | Gratuit, illimité |
| [INSEE Données Locales](https://api.gouv.fr/les-api/api_donnees_locales) | api.insee.fr | Population, revenus, emploi | Gratuit, 30 req/min |
| [geo.api.gouv.fr](https://geo.api.gouv.fr/) | geo.api.gouv.fr | Géocodage, communes | Gratuit, illimité |

### 1.3 Livrables attendus

| Livrable | Description | Critère de validation |
|----------|-------------|----------------------|
| Template page ville | Page dynamique SSG | Build OK 50+ pages |
| Données DVF | Historique prix 12 mois | API fonctionnelle |
| Données INSEE | Population, revenus | Enrichissement OK |
| Programmes multi-promoteurs | Scraping 5+ promoteurs | 200+ programmes |
| Baromètre Jeanbrun | Page mensuelle auto-générée | 51 baromètres/mois |
| Contenu IA | Paragraphes uniques quartiers | 50 textes validés |
| JSON-LD enrichi | Place + LocalBusiness | Rich Results Test OK |
| Sitemap.xml | Dynamique (villes + baromètres) | Toutes URLs listées |
| Maillage interne | Villes proches + quartiers | Liens automatiques |

---

## 2. Architecture des données enrichies

### 2.1 Nouvelles entités EspoCRM

#### CJeanbrunRegion (13 records)
```
id, name, slug, code
```

#### CJeanbrunDepartement (101 records)
```
id, name, slug, code, regionId (link)
```

#### CJeanbrunVille enrichie (51+ records)
```
// Champs existants
id, name, slug, zoneFiscale, population

// Nouveaux champs géo
departementId (link), regionId (link)
latitude, longitude, codeInsee

// Nouveaux champs marché (DVF)
prixM2Moyen, prixM2Median
prixM2Q1, prixM2Q3  // Quartiles pour range
evolutionPrix1An, evolutionPrix3Ans, evolutionPrix5Ans
nbTransactions12Mois

// Nouveaux champs INSEE
populationCommune, populationAireUrbaine
revenuMedian, tauxChomage, tauxProprio

// Nouveaux champs qualité vie
scoreVieQuotidienne (0-100)
scoreTransport (0-100)
scoreEducation (0-100)

// Contenu
description, contenuEditorial
metaTitle, metaDescription
```

#### CJeanbrunQuartier (nouveau - ~200 records)
```
id, name, slug, villeId (link)
prixM2Moyen, evolutionPrix1An
scoreAttractivite (0-100)
description  // Généré IA
```

#### CJeanbrunBarometre (nouveau - 51/mois)
```
id, villeId (link), mois (date YYYY-MM-01)
scoreAttractivite (0-100)
prixM2, evolutionPrixMois
loyerM2, rendementBrut
nbProgrammesActifs
meilleureOpportuniteId (link programme)
analyseIA (text ~300 mots)
createdAt
```

#### CJeanbrunProgramme enrichi
```
// Champs existants
id, name, slug, villeId, promoteur, urlExterne

// Nouveaux champs (scraping)
adresseComplete, latitude, longitude
prixMin, prixMax, prixM2Moyen
nbLotsTotal, nbLotsDisponibles
typesLots[]  // T1, T2, T3, T4+
dateLivraison (date)
images[]  // URLs
description

// Source
sourcePromoteur  // nexity, bouygues, kaufman, icade, vinci, cogedim
dateScrap
```

### 2.2 Schéma de flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOURCES DE DONNÉES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DVF API (CEREMA)      INSEE API         geo.api.gouv.fr       │
│  - Prix m² par commune  - Population      - Géocodage          │
│  - Historique 5 ans     - Revenus         - Coordonnées        │
│  - Nb transactions      - Emploi          - Code INSEE         │
│                                                                 │
│  Scraping Promoteurs (Firecrawl)                               │
│  - Nexity (existant)                                           │
│  - Bouygues Immobilier (nouveau)                               │
│  - Kaufman & Broad (nouveau)                                   │
│  - Icade (nouveau)                                             │
│  - Vinci Immobilier (nouveau)                                  │
│  - Cogedim (nouveau - Cloudflare)                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SCRIPTS D'ENRICHISSEMENT                     │
│                    /root/scripts/jeanbrun/                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  enrich_villes_geo.py       # Phase 1: Géocodage + liens       │
│  import_dvf_historique.py   # Phase 2: Prix DVF 12 mois        │
│  import_insee_data.py       # Phase 3: Population, revenus     │
│  scrape_promoteurs.py       # Phase 4: Multi-promoteurs        │
│  generate_barometre.py      # Phase 5: Baromètre mensuel       │
│  generate_contenu_ia.py     # Phase 6: Contenu IA quartiers    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         EspoCRM                                 │
│                    (stockage centralisé)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CJeanbrunVille (51+)     CJeanbrunProgramme (200+)            │
│  CJeanbrunQuartier (200+) CJeanbrunBarometre (51/mois)         │
│  CJeanbrunRegion (13)     CJeanbrunDepartement (101)           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION NEXT.JS                          │
│                    (simulateur-loi-jeanbrun)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /villes/[slug]           → Page ville enrichie                │
│  /villes/[slug]/[quartier]→ Page quartier (optionnel)          │
│  /barometre/[ville]/[mois]→ Baromètre mensuel                  │
│  /programmes/[slug]       → Fiche programme détaillée          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Phases d'enrichissement

### Phase 3.1 : Données Géographiques (2h)

**Objectif:** Enrichir les 51 villes avec coordonnées et liens département/région

**Script:** `/root/scripts/jeanbrun/enrich_villes_geo.py`

```python
#!/usr/bin/env python3
"""
Enrichissement géographique des villes Jeanbrun
- Géocodage via geo.api.gouv.fr (gratuit, illimité)
- Liaison département/région
"""

import requests
import time
from typing import Optional, Dict, Any

ESPOCRM_URL = "https://espocrm.expert-ia-entreprise.fr/api/v1"
ESPOCRM_API_KEY = "1a97a8b3ca73fd5f1cdfed6c4f5341ec"
GEO_API_URL = "https://geo.api.gouv.fr"

def geocode_ville(nom_ville: str) -> Optional[Dict[str, Any]]:
    """Récupère coordonnées et code INSEE via geo.api.gouv.fr"""
    try:
        response = requests.get(
            f"{GEO_API_URL}/communes",
            params={"nom": nom_ville, "fields": "nom,code,codesPostaux,centre,departement,region", "limit": 1},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()

        if data:
            commune = data[0]
            return {
                "codeInsee": commune.get("code"),
                "latitude": commune.get("centre", {}).get("coordinates", [None, None])[1],
                "longitude": commune.get("centre", {}).get("coordinates", [None, None])[0],
                "departementCode": commune.get("departement", {}).get("code"),
                "departementNom": commune.get("departement", {}).get("nom"),
                "regionNom": commune.get("region", {}).get("nom"),
            }
        return None
    except Exception as e:
        print(f"Erreur géocodage {nom_ville}: {e}")
        return None

def update_ville_espocrm(ville_id: str, data: Dict[str, Any]) -> bool:
    """Met à jour une ville dans EspoCRM"""
    try:
        response = requests.put(
            f"{ESPOCRM_URL}/CJeanbrunVille/{ville_id}",
            headers={"X-Api-Key": ESPOCRM_API_KEY, "Content-Type": "application/json"},
            json=data,
            timeout=10
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Erreur update {ville_id}: {e}")
        return False

def get_all_villes() -> list:
    """Récupère toutes les villes Jeanbrun"""
    response = requests.get(
        f"{ESPOCRM_URL}/CJeanbrunVille",
        headers={"X-Api-Key": ESPOCRM_API_KEY},
        params={"maxSize": 100},
        timeout=10
    )
    return response.json().get("list", [])

def main():
    villes = get_all_villes()
    print(f"Enrichissement de {len(villes)} villes...")

    success = 0
    for ville in villes:
        geo_data = geocode_ville(ville["name"])
        if geo_data:
            if update_ville_espocrm(ville["id"], geo_data):
                print(f"✓ {ville['name']}: {geo_data['latitude']}, {geo_data['longitude']}")
                success += 1
            else:
                print(f"✗ {ville['name']}: Erreur update")
        else:
            print(f"✗ {ville['name']}: Non trouvée")

        time.sleep(0.1)  # Rate limiting doux

    print(f"\nTerminé: {success}/{len(villes)} villes enrichies")

if __name__ == "__main__":
    main()
```

**Exécution:** `python3 /root/scripts/jeanbrun/enrich_villes_geo.py`
**Durée estimée:** ~2 minutes (51 villes × 0.1s)

---

### Phase 3.2 : Import DVF Historique (4h)

**Objectif:** Importer 12 mois d'historique prix via DVF API CEREMA

**Script:** `/root/scripts/jeanbrun/import_dvf_historique.py`

```python
#!/usr/bin/env python3
"""
Import historique DVF (Demandes de Valeurs Foncières)
Source: API CEREMA (gratuit, illimité)
Documentation: https://api-datafoncier.cerema.fr/
"""

import requests
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from statistics import median, mean

ESPOCRM_URL = "https://espocrm.expert-ia-entreprise.fr/api/v1"
ESPOCRM_API_KEY = "1a97a8b3ca73fd5f1cdfed6c4f5341ec"

# API DVF CEREMA (flux ouvert, pas de clé requise)
DVF_API_URL = "https://api-datafoncier.cerema.fr/dvf_opendata/geomutations"

def get_dvf_data(code_insee: str, date_debut: str, date_fin: str) -> List[Dict]:
    """
    Récupère les mutations DVF pour une commune
    Filtré sur les appartements et maisons
    """
    try:
        params = {
            "code_commune": code_insee,
            "date_mutation_min": date_debut,
            "date_mutation_max": date_fin,
            "nature_mutation": "Vente",
            "type_local": ["Appartement", "Maison"],
            "page_size": 500,
        }

        response = requests.get(
            DVF_API_URL,
            params=params,
            timeout=30
        )
        response.raise_for_status()
        return response.json().get("results", [])
    except Exception as e:
        print(f"Erreur DVF {code_insee}: {e}")
        return []

def calculate_prix_m2(mutations: List[Dict]) -> Dict[str, Optional[float]]:
    """Calcule les statistiques de prix au m² depuis les mutations"""
    prix_m2_list = []

    for mutation in mutations:
        valeur = mutation.get("valeur_fonciere")
        surface = mutation.get("surface_reelle_bati")

        if valeur and surface and surface > 10:  # Filtrer aberrations
            prix_m2 = valeur / surface
            if 500 < prix_m2 < 20000:  # Plage réaliste
                prix_m2_list.append(prix_m2)

    if not prix_m2_list:
        return {"prixM2Moyen": None, "prixM2Median": None, "nbTransactions": 0}

    prix_m2_list.sort()
    n = len(prix_m2_list)

    return {
        "prixM2Moyen": round(mean(prix_m2_list)),
        "prixM2Median": round(median(prix_m2_list)),
        "prixM2Q1": round(prix_m2_list[n // 4]) if n >= 4 else None,
        "prixM2Q3": round(prix_m2_list[3 * n // 4]) if n >= 4 else None,
        "nbTransactions12Mois": n,
    }

def calculate_evolution(prix_actuel: float, prix_ancien: float) -> Optional[float]:
    """Calcule l'évolution en pourcentage"""
    if prix_ancien and prix_ancien > 0:
        return round(((prix_actuel - prix_ancien) / prix_ancien) * 100, 1)
    return None

def enrich_ville_dvf(ville: Dict) -> Dict:
    """Enrichit une ville avec les données DVF"""
    code_insee = ville.get("codeInsee")
    if not code_insee:
        return {}

    now = datetime.now()

    # Période actuelle (12 derniers mois)
    date_fin = now.strftime("%Y-%m-%d")
    date_debut_12m = (now - timedelta(days=365)).strftime("%Y-%m-%d")

    # Période N-1 (12 mois précédents)
    date_fin_n1 = date_debut_12m
    date_debut_n1 = (now - timedelta(days=730)).strftime("%Y-%m-%d")

    # Période N-3 (3 ans)
    date_debut_3ans = (now - timedelta(days=1095)).strftime("%Y-%m-%d")

    # Récupération données actuelles
    mutations_12m = get_dvf_data(code_insee, date_debut_12m, date_fin)
    stats_12m = calculate_prix_m2(mutations_12m)

    # Récupération données N-1 pour évolution
    mutations_n1 = get_dvf_data(code_insee, date_debut_n1, date_fin_n1)
    stats_n1 = calculate_prix_m2(mutations_n1)

    # Récupération données N-3 pour évolution longue
    mutations_3ans = get_dvf_data(code_insee, date_debut_3ans, date_fin)

    # Calcul évolutions
    evolution_1an = None
    if stats_12m["prixM2Moyen"] and stats_n1["prixM2Moyen"]:
        evolution_1an = calculate_evolution(stats_12m["prixM2Moyen"], stats_n1["prixM2Moyen"])

    return {
        **stats_12m,
        "evolutionPrix1An": evolution_1an,
        "dateMajDVF": now.strftime("%Y-%m-%d"),
    }

def update_ville_espocrm(ville_id: str, data: Dict) -> bool:
    """Met à jour une ville dans EspoCRM"""
    try:
        response = requests.put(
            f"{ESPOCRM_URL}/CJeanbrunVille/{ville_id}",
            headers={"X-Api-Key": ESPOCRM_API_KEY, "Content-Type": "application/json"},
            json=data,
            timeout=10
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Erreur update {ville_id}: {e}")
        return False

def get_all_villes() -> List[Dict]:
    """Récupère toutes les villes avec code INSEE"""
    response = requests.get(
        f"{ESPOCRM_URL}/CJeanbrunVille",
        headers={"X-Api-Key": ESPOCRM_API_KEY},
        params={"maxSize": 100, "where[0][type]": "isNotNull", "where[0][attribute]": "codeInsee"},
        timeout=10
    )
    return response.json().get("list", [])

def main():
    villes = get_all_villes()
    print(f"Import DVF pour {len(villes)} villes...")

    success = 0
    for i, ville in enumerate(villes):
        print(f"[{i+1}/{len(villes)}] {ville['name']}...", end=" ")

        dvf_data = enrich_ville_dvf(ville)
        if dvf_data.get("prixM2Moyen"):
            if update_ville_espocrm(ville["id"], dvf_data):
                print(f"✓ {dvf_data['prixM2Moyen']}€/m² ({dvf_data['nbTransactions12Mois']} transactions)")
                success += 1
            else:
                print("✗ Erreur update")
        else:
            print("✗ Pas de données")

        time.sleep(1)  # Rate limiting DVF API

    print(f"\nTerminé: {success}/{len(villes)} villes enrichies DVF")

if __name__ == "__main__":
    main()
```

**Exécution:** `python3 /root/scripts/jeanbrun/import_dvf_historique.py`
**Durée estimée:** ~2 minutes (51 villes × 2 requêtes × 1s)

---

### Phase 3.3 : Import INSEE (2h)

**Objectif:** Enrichir avec population, revenus, emploi

**Script:** `/root/scripts/jeanbrun/import_insee_data.py`

```python
#!/usr/bin/env python3
"""
Import données INSEE (population, revenus, emploi)
Source: API INSEE Données Locales (gratuit, 30 req/min)
Documentation: https://api.insee.fr/catalogue/
"""

import requests
import time
from typing import Dict, Optional

ESPOCRM_URL = "https://espocrm.expert-ia-entreprise.fr/api/v1"
ESPOCRM_API_KEY = "1a97a8b3ca73fd5f1cdfed6c4f5341ec"

# API INSEE (pas de clé pour données ouvertes)
INSEE_GEO_URL = "https://geo.api.gouv.fr/communes"

def get_insee_data(code_insee: str) -> Optional[Dict]:
    """
    Récupère données INSEE via geo.api.gouv.fr
    (proxy simplifié vers données INSEE)
    """
    try:
        response = requests.get(
            f"{INSEE_GEO_URL}/{code_insee}",
            params={"fields": "nom,population,surface,codesPostaux,siren"},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()

        return {
            "populationCommune": data.get("population"),
            "surface": data.get("surface"),  # en hectares
        }
    except Exception as e:
        print(f"Erreur INSEE {code_insee}: {e}")
        return None

def update_ville_espocrm(ville_id: str, data: Dict) -> bool:
    """Met à jour une ville dans EspoCRM"""
    try:
        response = requests.put(
            f"{ESPOCRM_URL}/CJeanbrunVille/{ville_id}",
            headers={"X-Api-Key": ESPOCRM_API_KEY, "Content-Type": "application/json"},
            json=data,
            timeout=10
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Erreur update {ville_id}: {e}")
        return False

def get_all_villes() -> list:
    """Récupère toutes les villes avec code INSEE"""
    response = requests.get(
        f"{ESPOCRM_URL}/CJeanbrunVille",
        headers={"X-Api-Key": ESPOCRM_API_KEY},
        params={"maxSize": 100},
        timeout=10
    )
    return response.json().get("list", [])

def main():
    villes = get_all_villes()
    print(f"Import INSEE pour {len(villes)} villes...")

    success = 0
    for i, ville in enumerate(villes):
        code_insee = ville.get("codeInsee")
        if not code_insee:
            print(f"[{i+1}/{len(villes)}] {ville['name']}: ✗ Pas de code INSEE")
            continue

        print(f"[{i+1}/{len(villes)}] {ville['name']}...", end=" ")

        insee_data = get_insee_data(code_insee)
        if insee_data and insee_data.get("populationCommune"):
            if update_ville_espocrm(ville["id"], insee_data):
                print(f"✓ Pop: {insee_data['populationCommune']:,}")
                success += 1
            else:
                print("✗ Erreur update")
        else:
            print("✗ Pas de données")

        time.sleep(2)  # Rate limiting INSEE (30 req/min)

    print(f"\nTerminé: {success}/{len(villes)} villes enrichies INSEE")

if __name__ == "__main__":
    main()
```

**Exécution:** `python3 /root/scripts/jeanbrun/import_insee_data.py`
**Durée estimée:** ~2 minutes (51 villes × 2s)

---

### Phase 3.4 : Scraping Multi-Promoteurs (8h)

**Objectif:** Scraper 5+ promoteurs pour atteindre 200+ programmes

**Promoteurs cibles:**

| Promoteur | URL Pattern | Difficulté | Protection |
|-----------|-------------|------------|------------|
| Nexity | nexity.fr/immobilier-neuf | ✅ Fait | Aucune |
| Bouygues Immobilier | bouygues-immobilier.com | Moyenne | Rate limiting |
| Kaufman & Broad | kaufmanbroad.fr | Moyenne | Aucune |
| Icade | icade-immobilier.com | Facile | Aucune |
| Vinci Immobilier | vinci-immobilier.com | Moyenne | Rate limiting |
| Cogedim | cogedim.com | Difficile | Cloudflare |

**Script:** `/root/scripts/jeanbrun/scrape_promoteurs.py`

```python
#!/usr/bin/env python3
"""
Scraping multi-promoteurs via Firecrawl
- Nexity (existant, à adapter)
- Bouygues Immobilier
- Kaufman & Broad
- Icade
- Vinci Immobilier
- Cogedim (Cloudflare - mode stealth)

Points de vigilance:
- Rate limiting: 5 secondes entre requêtes par promoteur
- Retry avec backoff exponentiel
- Rotation user-agent
- Logging complet pour debug
"""

import requests
import time
import json
import hashlib
from datetime import datetime
from typing import Dict, List, Optional
import logging

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/jeanbrun-scraping.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration
FIRECRAWL_URL = "http://127.0.0.1:3003/v1"
ESPOCRM_URL = "https://espocrm.expert-ia-entreprise.fr/api/v1"
ESPOCRM_API_KEY = "1a97a8b3ca73fd5f1cdfed6c4f5341ec"

# Délai entre requêtes par promoteur (secondes)
RATE_LIMIT_DELAY = 5

# Configuration par promoteur
PROMOTEURS_CONFIG = {
    "bouygues": {
        "name": "Bouygues Immobilier",
        "base_url": "https://www.bouygues-immobilier.com",
        "search_url": "https://www.bouygues-immobilier.com/recherche?type=neuf",
        "selectors": {
            "programme_list": ".property-card",
            "name": ".property-card__title",
            "price": ".property-card__price",
            "location": ".property-card__location",
            "link": ".property-card__link",
        },
        "cloudflare": False,
    },
    "kaufman": {
        "name": "Kaufman & Broad",
        "base_url": "https://www.kaufmanbroad.fr",
        "search_url": "https://www.kaufmanbroad.fr/programmes-neufs",
        "selectors": {
            "programme_list": ".program-card",
            "name": ".program-card__title",
            "price": ".program-card__price",
            "location": ".program-card__city",
            "link": "a.program-card__link",
        },
        "cloudflare": False,
    },
    "icade": {
        "name": "Icade",
        "base_url": "https://www.icade-immobilier.com",
        "search_url": "https://www.icade-immobilier.com/programmes-immobiliers-neufs",
        "selectors": {
            "programme_list": ".program-item",
            "name": ".program-item__name",
            "price": ".program-item__price",
            "location": ".program-item__location",
            "link": "a.program-item__link",
        },
        "cloudflare": False,
    },
    "vinci": {
        "name": "Vinci Immobilier",
        "base_url": "https://www.vinci-immobilier.com",
        "search_url": "https://www.vinci-immobilier.com/programmes-immobiliers-neufs",
        "selectors": {
            "programme_list": ".program-card",
            "name": ".program-card__title",
            "price": ".program-card__price",
            "location": ".program-card__city",
            "link": "a.program-card__cta",
        },
        "cloudflare": False,
    },
    "cogedim": {
        "name": "Cogedim",
        "base_url": "https://www.cogedim.com",
        "search_url": "https://www.cogedim.com/programmes-immobiliers-neufs",
        "selectors": {
            "programme_list": ".residence-card",
            "name": ".residence-card__title",
            "price": ".residence-card__price",
            "location": ".residence-card__city",
            "link": "a.residence-card__link",
        },
        "cloudflare": True,  # Nécessite mode stealth
    },
}

def scrape_with_firecrawl(url: str, use_stealth: bool = False) -> Optional[Dict]:
    """
    Scrape une page via Firecrawl
    use_stealth=True pour sites avec Cloudflare
    """
    try:
        payload = {
            "url": url,
            "formats": ["markdown", "html"],
            "onlyMainContent": True,
            "waitFor": 3000,  # Attendre le JS
        }

        if use_stealth:
            payload["headers"] = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "fr-FR,fr;q=0.9",
            }

        response = requests.post(
            f"{FIRECRAWL_URL}/scrape",
            json=payload,
            timeout=60
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Erreur Firecrawl {url}: {e}")
        return None

def extract_programmes_from_html(html: str, selectors: Dict, promoteur: str) -> List[Dict]:
    """
    Extrait les programmes depuis le HTML
    Utilise BeautifulSoup pour parsing
    """
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, 'html.parser')
    programmes = []

    cards = soup.select(selectors["programme_list"])
    logger.info(f"Trouvé {len(cards)} cartes programmes pour {promoteur}")

    for card in cards:
        try:
            name_el = card.select_one(selectors["name"])
            price_el = card.select_one(selectors["price"])
            location_el = card.select_one(selectors["location"])
            link_el = card.select_one(selectors["link"])

            if name_el and location_el:
                programmes.append({
                    "name": name_el.get_text(strip=True),
                    "price_text": price_el.get_text(strip=True) if price_el else None,
                    "location": location_el.get_text(strip=True),
                    "url": link_el.get("href") if link_el else None,
                    "promoteur": promoteur,
                })
        except Exception as e:
            logger.warning(f"Erreur extraction carte: {e}")
            continue

    return programmes

def parse_price(price_text: str) -> Optional[int]:
    """Parse un prix depuis texte (ex: 'À partir de 250 000 €')"""
    if not price_text:
        return None

    import re
    # Extraire les chiffres
    numbers = re.findall(r'[\d\s]+', price_text.replace(' ', ''))
    if numbers:
        try:
            return int(numbers[0].replace(' ', ''))
        except:
            pass
    return None

def generate_slug(name: str, ville: str) -> str:
    """Génère un slug unique pour le programme"""
    import unicodedata
    import re

    text = f"{name}-{ville}".lower()
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')

    # Ajouter hash court pour unicité
    hash_short = hashlib.md5(f"{name}{ville}".encode()).hexdigest()[:6]
    return f"{text}-{hash_short}"

def find_ville_id(ville_name: str) -> Optional[str]:
    """Trouve l'ID de la ville dans EspoCRM"""
    try:
        response = requests.get(
            f"{ESPOCRM_URL}/CJeanbrunVille",
            headers={"X-Api-Key": ESPOCRM_API_KEY},
            params={
                "where[0][type]": "contains",
                "where[0][attribute]": "name",
                "where[0][value]": ville_name,
                "maxSize": 1,
            },
            timeout=10
        )
        data = response.json()
        if data.get("list"):
            return data["list"][0]["id"]
        return None
    except Exception as e:
        logger.error(f"Erreur recherche ville {ville_name}: {e}")
        return None

def save_programme_espocrm(programme: Dict) -> bool:
    """Sauvegarde un programme dans EspoCRM"""
    try:
        # Vérifier si existe déjà (par URL)
        check_response = requests.get(
            f"{ESPOCRM_URL}/CJeanbrunProgramme",
            headers={"X-Api-Key": ESPOCRM_API_KEY},
            params={
                "where[0][type]": "equals",
                "where[0][attribute]": "urlExterne",
                "where[0][value]": programme.get("urlExterne"),
                "maxSize": 1,
            },
            timeout=10
        )

        existing = check_response.json().get("list", [])

        if existing:
            # Update
            response = requests.put(
                f"{ESPOCRM_URL}/CJeanbrunProgramme/{existing[0]['id']}",
                headers={"X-Api-Key": ESPOCRM_API_KEY, "Content-Type": "application/json"},
                json=programme,
                timeout=10
            )
        else:
            # Create
            response = requests.post(
                f"{ESPOCRM_URL}/CJeanbrunProgramme",
                headers={"X-Api-Key": ESPOCRM_API_KEY, "Content-Type": "application/json"},
                json=programme,
                timeout=10
            )

        return response.status_code in [200, 201]
    except Exception as e:
        logger.error(f"Erreur save programme: {e}")
        return False

def scrape_promoteur(promoteur_key: str) -> int:
    """Scrape un promoteur et retourne le nombre de programmes trouvés"""
    config = PROMOTEURS_CONFIG.get(promoteur_key)
    if not config:
        logger.error(f"Promoteur inconnu: {promoteur_key}")
        return 0

    logger.info(f"=== Scraping {config['name']} ===")

    # Scrape page liste
    result = scrape_with_firecrawl(
        config["search_url"],
        use_stealth=config.get("cloudflare", False)
    )

    if not result or not result.get("data", {}).get("html"):
        logger.error(f"Échec scraping {config['name']}")
        return 0

    # Extraire programmes
    programmes_raw = extract_programmes_from_html(
        result["data"]["html"],
        config["selectors"],
        config["name"]
    )

    logger.info(f"Trouvé {len(programmes_raw)} programmes bruts")

    # Traiter chaque programme
    saved = 0
    for prog in programmes_raw:
        # Trouver ville
        ville_id = find_ville_id(prog["location"])

        # Construire objet programme
        programme = {
            "name": prog["name"],
            "slug": generate_slug(prog["name"], prog["location"]),
            "promoteur": prog["promoteur"],
            "urlExterne": prog["url"],
            "prixMin": parse_price(prog["price_text"]),
            "villeId": ville_id,
            "sourcePromoteur": promoteur_key,
            "dateScrap": datetime.now().isoformat(),
        }

        if save_programme_espocrm(programme):
            logger.info(f"  ✓ {prog['name']} ({prog['location']})")
            saved += 1
        else:
            logger.warning(f"  ✗ {prog['name']}")

        time.sleep(0.5)  # Rate limiting interne

    return saved

def main():
    logger.info("=== DÉBUT SCRAPING MULTI-PROMOTEURS ===")

    total_saved = 0

    for promoteur_key in PROMOTEURS_CONFIG.keys():
        try:
            saved = scrape_promoteur(promoteur_key)
            total_saved += saved
            logger.info(f"{PROMOTEURS_CONFIG[promoteur_key]['name']}: {saved} programmes sauvegardés")
        except Exception as e:
            logger.error(f"Erreur promoteur {promoteur_key}: {e}")

        # Rate limiting entre promoteurs
        time.sleep(RATE_LIMIT_DELAY)

    logger.info(f"=== TERMINÉ: {total_saved} programmes au total ===")

if __name__ == "__main__":
    main()
```

**Dépendances:** `pip install beautifulsoup4`
**Exécution:** `python3 /root/scripts/jeanbrun/scrape_promoteurs.py`
**Durée estimée:** ~30 minutes (6 promoteurs × 5s delay)

---

### Phase 3.5 : Baromètre Jeanbrun Mensuel (4h)

**Objectif:** Générer automatiquement un "Baromètre Jeanbrun" mensuel pour chaque ville

**Concept:**
- Page auto-générée chaque 1er du mois
- Contenu frais = Google adore
- Partageable = backlinks naturels
- Score d'attractivité calculé

**Script:** `/root/scripts/jeanbrun/generate_barometre.py`

```python
#!/usr/bin/env python3
"""
Génération du Baromètre Jeanbrun mensuel
- Score d'attractivité calculé
- Analyse IA générée
- Meilleure opportunité du mois

Cron: 0 8 1 * * (1er du mois à 8h)
"""

import requests
import time
from datetime import datetime
from typing import Dict, List, Optional
import os

ESPOCRM_URL = "https://espocrm.expert-ia-entreprise.fr/api/v1"
ESPOCRM_API_KEY = "1a97a8b3ca73fd5f1cdfed6c4f5341ec"

# OpenRouter pour génération IA
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_MODEL = "anthropic/claude-3-haiku-20240307"

def calculate_score_attractivite(ville: Dict) -> int:
    """
    Calcule le score d'attractivité Jeanbrun (0-100)

    Critères:
    - Prix m² vs moyenne nationale (30 points)
    - Évolution prix (20 points)
    - Tension locative (20 points)
    - Rendement estimé (20 points)
    - Nb programmes disponibles (10 points)
    """
    score = 0

    # 1. Prix m² (moins cher = mieux pour investissement)
    prix_m2 = ville.get("prixM2Moyen", 5000)
    if prix_m2 < 3000:
        score += 30
    elif prix_m2 < 4000:
        score += 25
    elif prix_m2 < 5000:
        score += 20
    elif prix_m2 < 6000:
        score += 15
    elif prix_m2 < 8000:
        score += 10
    else:
        score += 5

    # 2. Évolution prix (hausse modérée = bien)
    evolution = ville.get("evolutionPrix1An", 0)
    if 2 <= evolution <= 5:
        score += 20  # Hausse saine
    elif 0 <= evolution < 2:
        score += 15  # Stable
    elif 5 < evolution <= 10:
        score += 10  # Hausse forte
    elif -5 <= evolution < 0:
        score += 12  # Légère baisse (opportunité)
    else:
        score += 5

    # 3. Tension locative
    tension = ville.get("tensionLocative", "moyenne")
    tension_scores = {"tres_forte": 20, "forte": 18, "moyenne": 12, "faible": 5}
    score += tension_scores.get(tension, 10)

    # 4. Rendement estimé
    prix = ville.get("prixM2Moyen", 5000)
    loyer = ville.get("loyerM2Moyen", 12)
    if prix > 0 and loyer > 0:
        rendement = (loyer * 12) / prix * 100
        if rendement >= 6:
            score += 20
        elif rendement >= 5:
            score += 16
        elif rendement >= 4:
            score += 12
        elif rendement >= 3:
            score += 8
        else:
            score += 4

    # 5. Programmes disponibles
    nb_prog = ville.get("nbProgrammesActifs", 0)
    if nb_prog >= 10:
        score += 10
    elif nb_prog >= 5:
        score += 8
    elif nb_prog >= 2:
        score += 5
    elif nb_prog >= 1:
        score += 3

    return min(100, max(0, score))

def get_best_programme(ville_id: str) -> Optional[Dict]:
    """Trouve le programme avec le meilleur rapport qualité/prix"""
    try:
        response = requests.get(
            f"{ESPOCRM_URL}/CJeanbrunProgramme",
            headers={"X-Api-Key": ESPOCRM_API_KEY},
            params={
                "where[0][type]": "equals",
                "where[0][attribute]": "villeId",
                "where[0][value]": ville_id,
                "orderBy": "prixMin",
                "order": "asc",
                "maxSize": 1,
            },
            timeout=10
        )
        data = response.json()
        if data.get("list"):
            return data["list"][0]
        return None
    except Exception as e:
        return None

def generate_analyse_ia(ville: Dict, score: int) -> str:
    """Génère l'analyse IA du baromètre (300 mots)"""
    if not OPENROUTER_API_KEY:
        return f"Analyse automatique pour {ville['name']} - Score: {score}/100"

    prompt = f"""Génère une analyse immobilière de 250-300 mots pour le Baromètre Jeanbrun de {ville['name']}.

Données:
- Ville: {ville['name']} ({ville.get('departement', 'N/A')})
- Zone fiscale: {ville.get('zoneFiscale', 'N/A')}
- Prix m² moyen: {ville.get('prixM2Moyen', 'N/A')}€
- Évolution 1 an: {ville.get('evolutionPrix1An', 'N/A')}%
- Loyer m² moyen: {ville.get('loyerM2Moyen', 'N/A')}€
- Tension locative: {ville.get('tensionLocative', 'N/A')}
- Score attractivité: {score}/100
- Nb programmes actifs: {ville.get('nbProgrammesActifs', 0)}

Structure:
1. Contexte du marché local (2-3 phrases)
2. Analyse des prix et tendances (2-3 phrases)
3. Opportunité Jeanbrun spécifique (2-3 phrases)
4. Recommandation investisseur (1-2 phrases)

Ton: professionnel, factuel, engageant.
Ne pas inventer de données non fournies.
"""

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Erreur génération IA: {e}")
        return f"Le marché immobilier de {ville['name']} présente un score d'attractivité de {score}/100 ce mois-ci."

def create_barometre(ville: Dict) -> Dict:
    """Crée un baromètre pour une ville"""
    mois = datetime.now().replace(day=1).strftime("%Y-%m-%d")

    # Calculer score
    score = calculate_score_attractivite(ville)

    # Trouver meilleure opportunité
    best_prog = get_best_programme(ville["id"])

    # Générer analyse IA
    analyse = generate_analyse_ia(ville, score)

    # Calculer rendement
    prix = ville.get("prixM2Moyen", 5000)
    loyer = ville.get("loyerM2Moyen", 12)
    rendement = round((loyer * 12) / prix * 100, 2) if prix > 0 else 0

    return {
        "villeId": ville["id"],
        "mois": mois,
        "scoreAttractivite": score,
        "prixM2": ville.get("prixM2Moyen"),
        "evolutionPrixMois": ville.get("evolutionPrix1An"),  # Approximation
        "loyerM2": ville.get("loyerM2Moyen"),
        "rendementBrut": rendement,
        "nbProgrammesActifs": ville.get("nbProgrammesActifs", 0),
        "meilleureOpportuniteId": best_prog["id"] if best_prog else None,
        "analyseIA": analyse,
    }

def save_barometre(barometre: Dict) -> bool:
    """Sauvegarde le baromètre dans EspoCRM"""
    try:
        # Vérifier si existe déjà pour ce mois
        check_response = requests.get(
            f"{ESPOCRM_URL}/CJeanbrunBarometre",
            headers={"X-Api-Key": ESPOCRM_API_KEY},
            params={
                "where[0][type]": "equals",
                "where[0][attribute]": "villeId",
                "where[0][value]": barometre["villeId"],
                "where[1][type]": "equals",
                "where[1][attribute]": "mois",
                "where[1][value]": barometre["mois"],
                "maxSize": 1,
            },
            timeout=10
        )

        existing = check_response.json().get("list", [])

        if existing:
            response = requests.put(
                f"{ESPOCRM_URL}/CJeanbrunBarometre/{existing[0]['id']}",
                headers={"X-Api-Key": ESPOCRM_API_KEY, "Content-Type": "application/json"},
                json=barometre,
                timeout=10
            )
        else:
            response = requests.post(
                f"{ESPOCRM_URL}/CJeanbrunBarometre",
                headers={"X-Api-Key": ESPOCRM_API_KEY, "Content-Type": "application/json"},
                json=barometre,
                timeout=10
            )

        return response.status_code in [200, 201]
    except Exception as e:
        print(f"Erreur save baromètre: {e}")
        return False

def get_all_villes() -> List[Dict]:
    """Récupère toutes les villes"""
    response = requests.get(
        f"{ESPOCRM_URL}/CJeanbrunVille",
        headers={"X-Api-Key": ESPOCRM_API_KEY},
        params={"maxSize": 100},
        timeout=10
    )
    return response.json().get("list", [])

def main():
    print(f"=== GÉNÉRATION BAROMÈTRE JEANBRUN - {datetime.now().strftime('%B %Y')} ===")

    villes = get_all_villes()
    print(f"Génération pour {len(villes)} villes...")

    success = 0
    for i, ville in enumerate(villes):
        print(f"[{i+1}/{len(villes)}] {ville['name']}...", end=" ")

        barometre = create_barometre(ville)
        if save_barometre(barometre):
            print(f"✓ Score: {barometre['scoreAttractivite']}/100")
            success += 1
        else:
            print("✗ Erreur")

        time.sleep(2)  # Rate limiting pour IA

    print(f"\n=== TERMINÉ: {success}/{len(villes)} baromètres générés ===")

if __name__ == "__main__":
    main()
```

**Cron à ajouter:**
```bash
# Génération Baromètre Jeanbrun (1er du mois à 8h)
0 8 1 * * /usr/bin/python3 /root/scripts/jeanbrun/generate_barometre.py >> /var/log/jeanbrun-barometre.log 2>&1
```

---

## 4. Tâches détaillées Sprint 4

### 4.1 Récapitulatif des tâches

| ID | Tâche | Effort | Dépendances | Livrable |
|----|-------|--------|-------------|----------|
| 4.1 | Créer entités EspoCRM (Region, Dept, Quartier, Barometre) | 1j | - | Entités créées |
| 4.2 | Script enrichissement géo | 0,5j | 4.1 | 51 villes géocodées |
| 4.3 | Script import DVF | 0,5j | 4.2 | Historique prix 12 mois |
| 4.4 | Script import INSEE | 0,5j | 4.2 | Population, revenus |
| 4.5 | Script scraping multi-promoteurs | 1j | 4.1 | 200+ programmes |
| 4.6 | Script génération Baromètre | 0,5j | 4.3, 4.4 | 51 baromètres |
| 4.7 | Template page ville enrichie | 2j | 4.3, 4.4 | /villes/[slug] |
| 4.8 | Template page Baromètre | 1j | 4.6 | /barometre/[ville]/[mois] |
| 4.9 | Composant DonneesMarche enrichi | 1j | 4.7 | DVF + INSEE |
| 4.10 | Composant PlafondsJeanbrun | 0,5j | 4.7 | 3 niveaux |
| 4.11 | Composant ProgrammesList | 1j | 4.5, 4.7 | Multi-promoteurs |
| 4.12 | Composant SimulateurPreRempli | 1j | 4.7 | Ville injectée |
| 4.13 | Contenu éditorial 50 villes (IA) | 2j | 4.7 | 400-600 mots uniques |
| 4.14 | JSON-LD enrichi | 1j | 4.7 | Place + LocalBusiness |
| 4.15 | Sitemap.xml dynamique | 0,5j | 4.7, 4.8 | Villes + Baromètres |
| 4.16 | Maillage interne automatique | 1j | 4.7 | Villes proches |
| 4.17 | Page index villes avec filtres | 1j | 4.7 | /villes |
| 4.18 | SSG build toutes pages | 1j | 4.7-4.17 | Static generation |
| 4.19 | Crons automatisation | 0,5j | 4.2-4.6 | Refresh données |

**Total Sprint 4:** 18 jours

---

## 5. Composants Next.js enrichis

### 5.1 Page ville enrichie

**Fichier:** `src/app/villes/[slug]/page.tsx`

```tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { espocrm } from '@/lib/api/espocrm'

// Composants
import { DonneesMarche } from '@/components/villes/DonneesMarche'
import { HistoriquePrix } from '@/components/villes/HistoriquePrix'
import { DonneesInsee } from '@/components/villes/DonneesInsee'
import { PlafondsJeanbrun } from '@/components/villes/PlafondsJeanbrun'
import { ProgrammesList } from '@/components/villes/ProgrammesList'
import { SimulateurPreRempli } from '@/components/villes/SimulateurPreRempli'
import { VillesProches } from '@/components/villes/VillesProches'
import { BarometreResume } from '@/components/villes/BarometreResume'
import { ContenuEditorial } from '@/components/villes/ContenuEditorial'
import { JsonLdVille } from '@/components/common/JsonLd'

interface PageProps {
  params: { slug: string }
}

// Génération statique
export async function generateStaticParams() {
  const { list } = await espocrm.getJeanbrunVilles({ maxSize: 100 })
  return list.map((ville) => ({ slug: ville.slug }))
}

// Métadonnées dynamiques
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ville = await espocrm.getJeanbrunVilleBySlug(params.slug)

  if (!ville) {
    return { title: 'Ville non trouvée' }
  }

  const title = `Loi Jeanbrun à ${ville.name} - Simulation défiscalisation ${new Date().getFullYear()}`
  const description = `Investissez avec la loi Jeanbrun à ${ville.name} (Zone ${ville.zoneFiscale}). ` +
    `Prix m²: ${ville.prixM2Moyen?.toLocaleString()}€. ` +
    `${ville.nbProgrammesActifs || 0} programmes neufs éligibles.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'fr_FR',
      images: [`/og/ville/${params.slug}.png`],
    },
    alternates: {
      canonical: `https://simuler-loi-fiscale-jeanbrun.fr/villes/${params.slug}`,
    },
  }
}

export default async function VillePage({ params }: PageProps) {
  const ville = await espocrm.getJeanbrunVilleBySlug(params.slug)

  if (!ville) {
    notFound()
  }

  // Récupérations parallèles
  const [
    { list: programmes },
    { list: villesProches },
    barometre,
  ] = await Promise.all([
    espocrm.getJeanbrunProgrammes({
      villeId: ville.id,
      maxSize: 6,
    }),
    espocrm.getJeanbrunVilles({
      where: [
        { type: 'equals', attribute: 'region', value: ville.region },
        { type: 'notEquals', attribute: 'id', value: ville.id },
      ],
      maxSize: 5,
    }),
    espocrm.getLatestBarometre(ville.id),
  ])

  return (
    <>
      <JsonLdVille ville={ville} programmes={programmes} />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-muted-foreground">
          <a href="/villes" className="hover:underline">Villes</a>
          <span className="mx-2">/</span>
          <span>{ville.departement}</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">{ville.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold">
              Loi Jeanbrun à {ville.name}
            </h1>
            {barometre && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-bold">{barometre.scoreAttractivite}</span>
                <span className="text-sm">/100</span>
              </div>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            Zone {ville.zoneFiscale} • {ville.departement} • {ville.region}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="space-y-8 lg:col-span-2">
            {/* Données marché DVF */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Marché immobilier à {ville.name}
              </h2>
              <DonneesMarche ville={ville} />
            </section>

            {/* Historique prix */}
            {ville.prixM2Moyen && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold">
                  Évolution des prix
                </h2>
                <HistoriquePrix ville={ville} />
              </section>
            )}

            {/* Données INSEE */}
            {ville.populationCommune && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold">
                  Portrait de la ville
                </h2>
                <DonneesInsee ville={ville} />
              </section>
            )}

            {/* Plafonds Jeanbrun */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Plafonds de loyer Jeanbrun
              </h2>
              <PlafondsJeanbrun ville={ville} />
            </section>

            {/* Contenu éditorial */}
            <section>
              <ContenuEditorial ville={ville} />
            </section>

            {/* Programmes */}
            {programmes.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">
                    Programmes neufs éligibles
                  </h2>
                  <a href={`/programmes?ville=${ville.slug}`} className="text-primary hover:underline">
                    Voir tous →
                  </a>
                </div>
                <ProgrammesList programmes={programmes} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Baromètre résumé */}
            {barometre && (
              <BarometreResume barometre={barometre} ville={ville} />
            )}

            {/* Simulateur */}
            <div className="sticky top-4">
              <h2 className="mb-4 text-xl font-semibold">
                Simuler mon investissement
              </h2>
              <SimulateurPreRempli ville={ville} />
            </div>
          </aside>
        </div>

        {/* Villes proches */}
        {villesProches.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">
              Villes proches en {ville.region}
            </h2>
            <VillesProches villes={villesProches} />
          </section>
        )}
      </main>
    </>
  )
}

export const revalidate = 86400 // 24h
```

### 5.2 Page Baromètre

**Fichier:** `src/app/barometre/[ville]/[mois]/page.tsx`

```tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { espocrm } from '@/lib/api/espocrm'

// Composants
import { ScoreAttractivite } from '@/components/barometre/ScoreAttractivite'
import { AnalyseIA } from '@/components/barometre/AnalyseIA'
import { MeilleureOpportunite } from '@/components/barometre/MeilleureOpportunite'
import { IndicateursMarche } from '@/components/barometre/IndicateursMarche'
import { BarometreHistorique } from '@/components/barometre/BarometreHistorique'

interface PageProps {
  params: { ville: string; mois: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ville = await espocrm.getJeanbrunVilleBySlug(params.ville)
  const moisFormate = formatMois(params.mois)

  if (!ville) {
    return { title: 'Baromètre non trouvé' }
  }

  return {
    title: `Baromètre Jeanbrun ${ville.name} - ${moisFormate}`,
    description: `Analyse mensuelle du marché immobilier Jeanbrun à ${ville.name}. Score d'attractivité, prix, opportunités.`,
  }
}

export default async function BarometrePage({ params }: PageProps) {
  const ville = await espocrm.getJeanbrunVilleBySlug(params.ville)

  if (!ville) {
    notFound()
  }

  const barometre = await espocrm.getBarometre(ville.id, params.mois)

  if (!barometre) {
    notFound()
  }

  const [meilleureOpp, historique] = await Promise.all([
    barometre.meilleureOpportuniteId
      ? espocrm.getJeanbrunProgramme(barometre.meilleureOpportuniteId)
      : null,
    espocrm.getBarometreHistorique(ville.id, 6), // 6 derniers mois
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <p className="text-sm text-muted-foreground mb-2">
          Baromètre Jeanbrun • {formatMois(params.mois)}
        </p>
        <h1 className="text-4xl font-bold">
          {ville.name} - Analyse du marché
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Score principal */}
          <ScoreAttractivite score={barometre.scoreAttractivite} />

          {/* Indicateurs */}
          <IndicateursMarche barometre={barometre} />

          {/* Analyse IA */}
          <AnalyseIA analyse={barometre.analyseIA} />

          {/* Historique */}
          <BarometreHistorique historique={historique} />
        </div>

        <aside className="space-y-6">
          {/* Meilleure opportunité */}
          {meilleureOpp && (
            <MeilleureOpportunite programme={meilleureOpp} />
          )}

          {/* CTA simulation */}
          <div className="p-6 bg-primary text-primary-foreground rounded-lg">
            <h3 className="font-semibold mb-2">Simulez votre investissement</h3>
            <p className="text-sm mb-4 opacity-90">
              Calculez votre économie fiscale Jeanbrun à {ville.name}
            </p>
            <a
              href={`/simulateur?ville=${ville.slug}`}
              className="block w-full text-center py-2 bg-white text-primary rounded font-medium"
            >
              Lancer la simulation
            </a>
          </div>
        </aside>
      </div>
    </main>
  )
}

function formatMois(mois: string): string {
  const date = new Date(mois + '-01')
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export const revalidate = 86400
```

---

## 6. Stratégie Backlinks Locaux

### 6.1 Actions recommandées

| Cible | Action | Priorité |
|-------|--------|----------|
| **Presse locale** | Communiqué "Baromètre immobilier [ville]" avec données DVF | Haute |
| **CCI** | Inscription annuaire entreprises + partenariat info logement | Moyenne |
| **Blogs immo locaux** | Guest posts avec données exclusives (extraits Baromètre) | Haute |
| **Mairies** | Proposition widget "Prix immobilier commune" | Basse |
| **Notaires** | Partenariat données (eux ont DVF brut, nous l'analyse) | Moyenne |

### 6.2 Template communiqué presse

```markdown
# Baromètre Jeanbrun [VILLE] - [MOIS] [ANNÉE]

## Le marché immobilier [VILLE] en chiffres

- **Prix m² moyen:** [X] € (+[Y]% sur 1 an)
- **Score attractivité Jeanbrun:** [Z]/100
- **Programmes neufs éligibles:** [N]

## Analyse du mois

[Extrait analyseIA - 100 mots]

## Méthodologie

Les données proviennent des sources officielles DVF (Direction Générale des Finances Publiques)
et INSEE, analysées par l'algorithme du Simulateur Loi Jeanbrun.

---

Contact presse: [email]
Plus d'infos: https://simuler-loi-fiscale-jeanbrun.fr/barometre/[ville]/[mois]
```

---

## 7. Crons et automatisation

### 7.1 Planning des crons

```bash
# Crontab VPS CardImmo - Scripts Jeanbrun

# Enrichissement géo (hebdomadaire, dimanche 2h) - Nouvelles villes uniquement
0 2 * * 0 /usr/bin/python3 /root/scripts/jeanbrun/enrich_villes_geo.py >> /var/log/jeanbrun-geo.log 2>&1

# Import DVF (hebdomadaire, dimanche 3h)
0 3 * * 0 /usr/bin/python3 /root/scripts/jeanbrun/import_dvf_historique.py >> /var/log/jeanbrun-dvf.log 2>&1

# Import INSEE (mensuel, 1er du mois 2h)
0 2 1 * * /usr/bin/python3 /root/scripts/jeanbrun/import_insee_data.py >> /var/log/jeanbrun-insee.log 2>&1

# Scraping promoteurs (quotidien 4h)
0 4 * * * /usr/bin/python3 /root/scripts/jeanbrun/scrape_promoteurs.py >> /var/log/jeanbrun-scraping.log 2>&1

# Génération Baromètre (mensuel, 1er du mois 8h)
0 8 1 * * /usr/bin/python3 /root/scripts/jeanbrun/generate_barometre.py >> /var/log/jeanbrun-barometre.log 2>&1
```

### 7.2 Monitoring

```bash
# Vérification santé scripts
/root/scripts/jeanbrun/health_check.py

# Alertes si:
# - DVF n'a pas tourné depuis 8 jours
# - Scraping < 50 programmes trouvés
# - Baromètre pas généré ce mois
```

---

## 8. Checklist de fin de sprint

### 8.1 Données

- [ ] 51+ villes géocodées (lat, lon, codeInsee)
- [ ] Historique DVF 12 mois importé
- [ ] Données INSEE (population, revenus)
- [ ] 200+ programmes multi-promoteurs
- [ ] 51 baromètres mensuels générés
- [ ] Entités EspoCRM créées (Region, Dept, Quartier, Barometre)

### 8.2 SEO

- [ ] 50+ pages villes générées statiquement
- [ ] Pages Baromètre générées
- [ ] Contenu éditorial unique par ville (400-600 mots)
- [ ] JSON-LD valide (Rich Results Test)
- [ ] Sitemap.xml complet (villes + baromètres + programmes)
- [ ] robots.txt correct
- [ ] Maillage interne automatique

### 8.3 Performance

- [ ] Core Web Vitals >= 90 mobile
- [ ] TTFB < 200ms (pages SSG)
- [ ] Build production < 5 minutes
- [ ] ISR revalidation 24h configurée

### 8.4 Automatisation

- [ ] Crons configurés (DVF, INSEE, scraping, baromètre)
- [ ] Logs centralisés
- [ ] Alertes monitoring

---

## 9. Ressources

| Ressource | URL |
|-----------|-----|
| DVF API CEREMA | https://api-datafoncier.cerema.fr/ |
| INSEE API | https://api.insee.fr/catalogue/ |
| geo.api.gouv.fr | https://geo.api.gouv.fr/ |
| Google Rich Results Test | https://search.google.com/test/rich-results |
| PageSpeed Insights | https://pagespeed.web.dev |
| Schema.org Place | https://schema.org/Place |
| Next.js SSG | https://nextjs.org/docs/app/building-your-application/data-fetching |

---

**Auteur:** Équipe Claude Code + Moldbot
**Date:** 30 janvier 2026
**Version:** 2.0 (enrichie)
