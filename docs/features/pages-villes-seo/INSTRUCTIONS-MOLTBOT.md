# Instructions MoltBot : Villes Périphériques

**Date:** 31 janvier 2026
**Contexte:** SEO pages villes - structure hiérarchique métropole → périphériques
**Modèle:** [Glass Pro 49](https://glasspro49.fr/villes/)

---

## Résumé de la mission

Créer ~250 pages de villes périphériques pour multiplier les points d'entrée SEO.
Chaque ville périphérique sera une "mini landing page" avec simulateur pré-rempli.

---

## 1. Entités et champs EspoCRM créés (Phase 1 - 31/01/2026)

### Nouvelles entités créées

| Entité | Description | Champs principaux |
|--------|-------------|-------------------|
| `CJeanbrunRegion` | 13 régions françaises | name, slug, code |
| `CJeanbrunDepartement` | 101 départements | name, slug, code, regionId (link) |

### Champs ajoutés sur `CJeanbrunVille`

| Champ | Type | Description |
|-------|------|-------------|
| `isMetropole` | Boolean | `true` pour les 51 métropoles, `false` pour les périphériques |
| `metropoleParent` | Link → CJeanbrunVille | Référence vers la métropole parente (null pour métropoles) |
| `departement` | Link → CJeanbrunDepartement | Lien vers le département |
| `region` | Link → CJeanbrunRegion | Lien vers la région |
| `argumentsInvestissement` | Text (JSON) | Arguments personnalisés pour la ville |
| `faqItems` | Text (JSON) | Questions/réponses FAQ pour JSON-LD |
| `villesProches` | Link-Multiple → CJeanbrunVille | Relation many-to-many pour maillage SEO |

### Tables SQL créées

- `c_jeanbrun_region`
- `c_jeanbrun_departement`
- `c_jeanbrun_ville_ville_proche` (table de liaison many-to-many)

**Note:** Les 51 métropoles existantes doivent être marquées `isMetropole: true`.

---

## 2. Tâche : Importer les villes périphériques

### Critères de sélection

Pour chaque métropole, identifier **5-8 villes périphériques** selon :

| Critère | Valeur |
|---------|--------|
| Population | > 8 000 habitants |
| Distance | < 25 km de la métropole |
| Département | Même département (préféré) |
| Zone fiscale | Même zone ou adjacente (A_bis, A, B1) |

### Exemple : Nancy

```
Métropole: Nancy (ID existant)
Périphériques à créer:
├── Vandœuvre-lès-Nancy (pop: 29 000)
├── Laxou (pop: 15 000)
├── Villers-lès-Nancy (pop: 14 500)
├── Maxéville (pop: 9 800)
├── Malzéville (pop: 8 200)
├── Saint-Max (pop: 10 000)
└── Essey-lès-Nancy (pop: 8 500)
```

### Données à renseigner pour chaque ville périphérique

```json
{
  "name": "Villeurbanne",
  "slug": "villeurbanne",
  "codePostal": "69100",
  "codeInsee": "69266",
  "departement": "Rhône",
  "region": "Auvergne-Rhône-Alpes",
  "zoneFiscale": "A",
  "population": 152000,
  "latitude": 45.7676,
  "longitude": 4.8799,
  "isMetropole": false,
  "metropoleParentId": "[ID de Lyon]",
  "photoVille": "[URL photo de Lyon - réutilisée]",
  "photoVilleAlt": "Investir avec la loi Jeanbrun près de Lyon - Villeurbanne",
  "contenuEditorial": "[300-400 mots - voir section 3]",
  "metaTitle": "Loi Jeanbrun à Villeurbanne | Simulation Gratuite",
  "metaDescription": "Simulez votre investissement loi Jeanbrun à Villeurbanne. Zone A, proche Lyon. Calculez votre réduction d'impôt en 2 minutes.",
  "argumentsInvestissement": "[JSON - voir section 4]",
  "faqItems": "[JSON - voir section 5]"
}
```

---

## 3. Tâche : Générer le contenu éditorial (Claude Max)

**Utiliser Claude (forfait Max) pour générer le contenu unique par ville.**

### Prompt à utiliser

```
Rédige un texte de 300-400 mots pour une page web sur l'investissement immobilier
avec la loi Jeanbrun à [VILLE], ville périphérique de [METROPOLE].

Données locales :
- Population : [POPULATION] habitants
- Zone fiscale : [ZONE] (plafond loyer : [PLAFOND]€/m²)
- Prix m² moyen : [PRIX]€
- Département : [DEPARTEMENT]

Le texte doit :
1. Présenter brièvement la ville (1-2 phrases)
2. Expliquer pourquoi investir en loi Jeanbrun à [VILLE]
3. Mentionner la proximité avec [METROPOLE]
4. Donner des chiffres concrets (rendement estimé, économie d'impôt possible)
5. Conclure avec un appel à l'action vers le simulateur

Ton : professionnel mais accessible, orienté investisseur.
Ne pas utiliser de bullet points, rédiger en paragraphes fluides.
```

### Exemple de contenu généré

```
Villeurbanne, deuxième ville du Rhône avec plus de 150 000 habitants,
représente une opportunité d'investissement en loi Jeanbrun particulièrement
attractive. Située aux portes de Lyon, elle bénéficie de tous les avantages
d'une grande métropole tout en conservant des prix au m² plus accessibles.

Classée en zone A, Villeurbanne vous permet de pratiquer des loyers jusqu'à
14,03€/m², offrant un excellent équilibre entre rentabilité et sécurité
locative. Le campus de La Doua, qui accueille plus de 40 000 étudiants,
génère une demande locative constante et soutenue.

Avec un prix moyen de 3 850€/m², un investissement type de 200 000€ en loi
Jeanbrun à Villeurbanne peut générer une réduction d'impôt allant jusqu'à
24 000€ sur 12 ans, tout en constituant un patrimoine dans une ville en
pleine croissance.

Les lignes de métro A et les tramways T1 et T4 connectent Villeurbanne au
centre de Lyon en moins de 15 minutes, un atout majeur pour attirer des
locataires. Simulez dès maintenant votre projet d'investissement à
Villeurbanne avec notre calculateur gratuit.
```

---

## 4. Tâche : Générer les arguments d'investissement (Claude Max)

**Utiliser Claude pour générer des arguments personnalisés et chiffrés.**

### Format JSON

```json
[
  "Campus La Doua : 40 000 étudiants",
  "Métro A direct Lyon Part-Dieu",
  "Zone A : plafond loyer 14,03€/m²",
  "Prix m² 15% sous Lyon centre",
  "Carré de Soie : pôle commercial majeur",
  "Gratte-Ciel : cœur de ville dynamique"
]
```

### Règles de génération

- **4 à 6 arguments** par ville
- **Personnalisés** : pas de générique "bonne desserte transports"
- **Chiffrés** quand possible : "40 000 étudiants", "15 min du centre"
- **Locaux** : mentionner des lieux/quartiers spécifiques

### Arguments types à adapter

| Catégorie | Exemples |
|-----------|----------|
| Éducation | "Campus X : Y étudiants", "Écoles d'ingénieurs" |
| Transport | "Métro ligne X", "Gare TGV à Y min", "Tramway T1" |
| Économie | "Technopôle Y", "Zone d'activité Z", "Siège de X" |
| Cadre de vie | "Parc de X hectares", "Centre historique" |
| Prix | "Prix m² X% sous métropole", "Meilleur rendement zone" |

---

## 5. Tâche : Générer les FAQ (Claude Max + JSON-LD SEO)

**Utiliser Claude pour générer 3-4 questions/réponses personnalisées.**

### Format JSON

```json
[
  {
    "question": "Villeurbanne est-elle éligible à la loi Jeanbrun ?",
    "answer": "Oui, Villeurbanne est située en zone A et est pleinement éligible au dispositif Jeanbrun. Les investisseurs peuvent bénéficier d'une réduction d'impôt de 6%, 9% ou 12% selon la durée d'engagement."
  },
  {
    "question": "Quel est le plafond de loyer Jeanbrun à Villeurbanne ?",
    "answer": "En zone A, le plafond de loyer Jeanbrun à Villeurbanne est de 14,03€/m². Ce plafond est actualisé chaque année par décret."
  },
  {
    "question": "Quel rendement espérer à Villeurbanne ?",
    "answer": "Avec un prix moyen de 3 850€/m² et un loyer plafonné à 14,03€/m², le rendement brut à Villeurbanne se situe autour de 4,3%, ce qui est excellent pour une zone A proche de Lyon."
  },
  {
    "question": "Quels programmes neufs sont disponibles à Villeurbanne ?",
    "answer": "Plusieurs promoteurs proposent des programmes neufs éligibles Jeanbrun à Villeurbanne, notamment dans les quartiers Gratte-Ciel, Tonkin et Carré de Soie. Consultez notre liste de programmes pour plus de détails."
  }
]
```

### Questions obligatoires (à adapter)

1. "[Ville] est-elle éligible à la loi Jeanbrun ?"
2. "Quel est le plafond de loyer Jeanbrun à [Ville] ?"
3. "Quel rendement espérer à [Ville] ?"
4. (Optionnel) "Quels programmes neufs à [Ville] ?"
5. (Optionnel) Question spécifique locale

---

## 6. Photos : réutiliser la métropole parent

Pour économiser du temps et des ressources :

| Champ | Valeur |
|-------|--------|
| `photoVille` | Même URL que la métropole parent |
| `photoVilleAlt` | "Investir avec la loi Jeanbrun près de [Métropole] - [Ville]" |

Exemple pour Villeurbanne :
```json
{
  "photoVille": "https://pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev/villes/loi-jeanbrun-lyon.webp",
  "photoVilleAlt": "Investir avec la loi Jeanbrun près de Lyon - Villeurbanne"
}
```

---

## 7. API EspoCRM - Création d'une ville

### Endpoint

```
POST https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunVille
```

### Headers

```
X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec
Content-Type: application/json
```

### Body exemple

```json
{
  "name": "Villeurbanne",
  "slug": "villeurbanne",
  "codePostal": "69100",
  "codeInsee": "69266",
  "departement": "Rhône",
  "region": "Auvergne-Rhône-Alpes",
  "zoneFiscale": "A",
  "population": 152000,
  "latitude": 45.7676,
  "longitude": 4.8799,
  "isMetropole": false,
  "metropoleParentId": "697c88ae71a3e8xxx",
  "photoVille": "https://pub-e2440c233e004aa1b0bea8d0bd8a67f3.r2.dev/villes/loi-jeanbrun-lyon.webp",
  "photoVilleAlt": "Investir avec la loi Jeanbrun près de Lyon - Villeurbanne",
  "contenuEditorial": "Villeurbanne, deuxième ville du Rhône...",
  "metaTitle": "Loi Jeanbrun à Villeurbanne | Simulation Gratuite",
  "metaDescription": "Simulez votre investissement loi Jeanbrun à Villeurbanne...",
  "argumentsInvestissement": "[\"Campus La Doua : 40 000 étudiants\",\"Métro A direct Lyon\"]",
  "faqItems": "[{\"question\":\"Villeurbanne éligible ?\",\"answer\":\"Oui...\"}]"
}
```

### Récupérer l'ID d'une métropole

```bash
curl -X GET "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunVille?where[0][type]=equals&where[0][attribute]=name&where[0][value]=Lyon" \
  -H "X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec" | jq '.list[0].id'
```

---

## 8. Checklist par métropole

Pour chaque métropole (51 total) :

- [ ] Identifier 5-8 villes périphériques
- [ ] Récupérer données INSEE (population, code postal, code Insee)
- [ ] Récupérer coordonnées GPS (geo.api.gouv.fr)
- [ ] Déterminer zone fiscale (même que métropole généralement)
- [ ] Générer contenu éditorial (300-400 mots)
- [ ] Générer arguments investissement (4-6 points)
- [ ] Générer FAQ (3-4 questions)
- [ ] Créer entrée via API EspoCRM
- [ ] Vérifier lien metropoleParentId correct

---

## 9. Estimation volume

| Élément | Quantité |
|---------|----------|
| Métropoles existantes | 51 |
| Périphériques par métropole | 5-8 (moyenne 6) |
| **Total villes périphériques** | **~300** |
| **Total pages villes** | **~350** |

---

## 10. Questions fréquentes

### Comment trouver les villes périphériques ?

1. geo.api.gouv.fr : `/communes?codePostal=69&boost=population`
2. Wikipedia : liste des communes de l'unité urbaine
3. INSEE : aire d'attraction des villes

### Comment déterminer la zone fiscale ?

Généralement, les périphériques ont la même zone que la métropole.
Vérifier sur : https://www.service-public.fr/simulateur/calcul/zonage-abc

### Quelles métropoles ont le plus de potentiel ?

Priorité aux zones tendues (A bis, A) :
- Paris (Île-de-France) - nombreuses périphériques
- Lyon (Rhône) - Villeurbanne, Vénissieux, etc.
- Marseille (Bouches-du-Rhône)
- Bordeaux (Gironde)
- Toulouse (Haute-Garonne)
- Nantes (Loire-Atlantique)
- Lille (Nord)

---

---

## 11. Tâches préliminaires (avant villes périphériques)

### 11.1 Peupler les régions (13)

```bash
# Script disponible sur le VPS
/root/scripts/phase2-setup-jeanbrun.sh
```

Les 13 régions métropolitaines à insérer :

| Code | Nom |
|------|-----|
| ARA | Auvergne-Rhône-Alpes |
| BFC | Bourgogne-Franche-Comté |
| BRE | Bretagne |
| CVL | Centre-Val de Loire |
| COR | Corse |
| GES | Grand Est |
| HDF | Hauts-de-France |
| IDF | Île-de-France |
| NOR | Normandie |
| NAQ | Nouvelle-Aquitaine |
| OCC | Occitanie |
| PDL | Pays de la Loire |
| PAC | Provence-Alpes-Côte d'Azur |

### 11.2 Peupler les départements (101)

Utiliser l'API geo.api.gouv.fr :
```bash
curl "https://geo.api.gouv.fr/departements" | jq '.[] | {code, nom, codeRegion}'
```

### 11.3 Marquer les 51 métropoles existantes

```sql
UPDATE c_jeanbrun_ville SET is_metropole = 1 WHERE id IN (SELECT id FROM c_jeanbrun_ville);
```

Ou via API pour chaque ville :
```bash
curl -X PUT "https://espocrm.expert-ia-entreprise.fr/api/v1/CJeanbrunVille/[ID]" \
  -H "X-Api-Key: 1a97a8b3ca73fd5f1cdfed6c4f5341ec" \
  -H "Content-Type: application/json" \
  -d '{"isMetropole": true}'
```

---

## 12. Validation des entités

Script de validation disponible :
```bash
/root/scripts/validate-jeanbrun-entities.sh
```

Ce script vérifie :
- ✅ Existence des 3 entités (Region, Departement, Ville)
- ✅ Champs sur CJeanbrunVille
- ✅ Relations fonctionnelles
- ✅ Accessibilité API

---

**Contact:** Claude (VPS CardImmo)
**Dernière mise à jour:** 31 janvier 2026 (Phase 1 terminée)
