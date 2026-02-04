# Analyse : Enrichissement Programmes EspoCRM

**Date :** 4 février 2026  
**Objectif :** Proposer des enrichissements pour avoir une présentation programme vraiment complète et attractive sur le site Simulateur Loi Jeanbrun

---

## 📊 État actuel des programmes

### Champs remplis (153 programmes)

✅ **Données de base :**
- `name` : Nom du programme ✅
- `prixMin`, `prixMax` : Fourchette de prix ✅
- `eligibleJeanbrun` : Éligibilité calculée ✅
- `zoneFiscale` : Zone fiscale ✅
- `sourceApi` : Source de données ✅
- `idExterne`, `urlExterne` : Identifiants ✅

❌ **Champs vides (à enrichir) :**
- `promoteur` : ❌ NULL
- `adresse` : ❌ NULL
- `latitude`, `longitude` : ❌ NULL
- `description` : ❌ NULL
- `images` : ❌ NULL (JSON array)
- `typesLots` : ❌ NULL (T1, T2, T3, etc.)
- `dateLivraison` : ❌ NULL
- `nbLotsTotal`, `nbLotsDisponibles` : ❌ NULL
- `prixM2Moyen` : ❌ NULL
- `telephone`, `siteWeb` : ❌ NULL

**Score de complétude actuel : 30% seulement !**

---

## 🎯 Propositions d'enrichissement

### 1. Données extraites du scraping (Niveau 1 - Prioritaire)

**Source :** Pages programmes Nexity, Bouygues, SeLoger

| Champ | Exemple | Comment extraire |
|-------|---------|------------------|
| **promoteur** | "Nexity", "Bouygues Immobilier" | Hardcodé selon la source |
| **adresse** | "15 rue de la République, 69001 Lyon" | `.neo-product-card__location` |
| **description** | "À l'abri de l'agitation urbaine..." | Scraper page détail `/neuf/{id}` |
| **images** | `["url1.jpg", "url2.jpg"]` | Scraper galerie photos page détail |
| **typesLots** | `["T2", "T3", "T4"]` | Extraire "Du 2 au 4 pièces" → `["T2", "T3", "T4"]` |
| **dateLivraison** | "T4 2027", "2027" | Scraper "Livraison : T4 2027" |
| **nbLotsTotal** | 45 | Scraper "45 appartements" |
| **nbLotsDisponibles** | 12 | Scraper "12 lots disponibles" |
| **prixM2Moyen** | 4500 | Calculé si surface disponible |
| **telephone** | "04 XX XX XX XX" | Scraper page détail (bouton contact) |
| **siteWeb** | URL page programme | `urlExterne` |

**Impact :** ⭐⭐⭐⭐⭐ (Essentiel)  
**Effort :** 🔧🔧 Moyen (2-3h développement)  
**Score complétude visé :** 70%

---

### 2. Géolocalisation et proximité (Niveau 1 - Prioritaire)

**Source :** API Gouvernement (gratuite) + Google Maps API

| Champ | Exemple | Comment obtenir |
|-------|---------|-----------------|
| **latitude** | 45.7640 | Geocoding depuis adresse |
| **longitude** | 4.8357 | Geocoding depuis adresse |
| **distanceMetro** | "350m du métro Saxe-Gambetta" | Google Maps Nearby Search |
| **distanceTram** | "200m du tram T1" | Google Maps Nearby Search |
| **distanceEcoles** | "École primaire à 400m" | data.gouv.fr (base écoles) |
| **quartier** | "Montchat, Lyon 3ème" | Depuis adresse ou API commune |

**APIs gratuites :**
- 🆓 **API Adresse (data.gouv.fr)** : `https://api-adresse.data.gouv.fr/search/?q={adresse}`
- 🆓 **Base Nationale Établissements** : Écoles, crèches
- 💰 **Google Maps Nearby** : Métro, commerces (limites gratuites)

**Impact :** ⭐⭐⭐⭐ (Très important pour SEO local)  
**Effort :** 🔧 Facile (API call simple)  
**Score complétude visé :** 80%

---

### 3. Performance énergétique et labels (Niveau 2 - Important)

**Source :** Scraping page détail ou mention légale

| Champ | Exemple | Comment obtenir |
|-------|---------|-----------------|
| **dpe** | "A", "B", "C" | Scraper mention DPE |
| **ges** | "A", "B" | Scraper mention GES |
| **labelEnergie** | "RT 2020", "RE 2020" | Scraper mention norme |
| **certifications** | `["NF Habitat", "BBC"]` | Scraper logos certifications |

**Impact :** ⭐⭐⭐ (Différenciant)  
**Effort :** 🔧🔧 Moyen (parsing HTML complexe)  
**Score complétude visé :** 85%

---

### 4. Équipements et prestations (Niveau 2 - Important)

**Source :** Scraping page détail (section "Prestations")

| Champ | Exemple | Comment obtenir |
|-------|---------|-----------------|
| **equipements** | `["Parking", "Cave", "Balcon", "Terrasse"]` | Scraper liste équipements |
| **prestations** | `["Cuisine équipée", "Domotique", "VMC double flux"]` | Scraper section prestations |
| **espacesCommuns** | `["Local vélos", "Jardin partagé", "Salle fitness"]` | Scraper résidence |
| **securite** | `["Digicode", "Interphone vidéo", "Gardien"]` | Scraper mentions sécurité |

**Impact :** ⭐⭐⭐ (Différenciant)  
**Effort :** 🔧🔧 Moyen  
**Score complétude visé :** 90%

---

### 5. Données financières et fiscales (Niveau 1 - Prioritaire)

**Source :** Calcul automatique + données marché

| Champ | Exemple | Comment obtenir |
|-------|---------|-----------------|
| **rendementEstime** | "4.2%" | Calculé : (loyerAnnuel / prixAchat) * 100 |
| **loyerEstime** | 1200 | Calculé depuis `loyerM2Moyen` ville × surface |
| **fraisNotaire** | "2-3% (neuf)" | Hardcodé neuf = 2-3% |
| **economieJeanbrun** | "12 000€/an max" | Calculé selon zone + typologie |
| **deficitFoncier** | "10 700€/an" | Hardcodé Jeanbrun |
| **ptzEligible** | true/false | Calculé selon prix + zone |

**Impact :** ⭐⭐⭐⭐⭐ (Essentiel pour simulateur)  
**Effort :** 🔧 Facile (calculs automatiques)  
**Score complétude visé :** 95%

---

### 6. Informations promoteur (Niveau 2 - Important)

**Source :** Scraping + base de données promoteurs

| Champ | Exemple | Comment obtenir |
|-------|---------|-----------------|
| **promoteurLogo** | "nexity-logo.png" | CDN logos promoteurs |
| **promoteurDescription** | "Leader de l'immobilier neuf..." | Base locale ou scraping |
| **promoteurAnneeCreation** | 1971 | Base promoteurs |
| **promoteurNbProgrammes** | 150 | Compter depuis EspoCRM |
| **promoteurNote** | 4.2/5 | Scraper avis Google/TrustPilot |

**Impact :** ⭐⭐ (Nice to have)  
**Effort :** 🔧🔧🔧 Élevé  
**Score complétude visé :** 98%

---

### 7. Contexte ville et quartier (Niveau 2 - SEO)

**Source :** Depuis `CJeanbrunVille` + APIs externes

| Champ | Exemple | Comment obtenir |
|-------|---------|-----------------|
| **villePrixM2** | 4500 | Depuis `CJeanbrunVille.prixM2Moyen` |
| **villePopulation** | 522 679 | Depuis `CJeanbrunVille.population` |
| **villeTensionLocative** | "Forte" | Depuis `CJeanbrunVille.tensionLocative` |
| **quartierDescription** | "Quartier Montchat, résidentiel..." | Scraping ou base locale |

**Impact :** ⭐⭐⭐ (SEO local)  
**Effort :** 🔧 Facile (déjà en base ville)  
**Score complétude visé :** 100%

---

## 🎨 Présentation enrichie - Mockup

### Page programme `/programmes/[slug]`

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏢 KARA - Lyon 3ème (Montchat)                     Nexity [logo]│
│                                                                  │
│ [Carrousel 5 photos]                                             │
│                                                                  │
│ 📍 15 rue de la République, 69003 Lyon                          │
│    • 350m du métro Saxe-Gambetta (Ligne D)                      │
│    • École primaire à 400m                                       │
│    • Commerces à 200m                                            │
│                                                                  │
│ 💰 Prix : 481 000 € (du T3 au T5)                               │
│    • Prix au m² : 4 850 € (moyenne Lyon : 4 500 €)             │
│    • Frais de notaire : 2-3% (neuf)                             │
│    • Rendement estimé : 4.2%                                     │
│                                                                  │
│ 🏡 Programme                                                     │
│    • 45 appartements (3 disponibles)                            │
│    • Livraison : T4 2027                                         │
│    • DPE : A · GES : A · Norme RE 2020                          │
│                                                                  │
│ ✅ Éligible Loi Jeanbrun                                         │
│    • Amortissement : 4,5%/an (social)                           │
│    • Économie fiscale : jusqu'à 10 000€/an                      │
│    • Déficit foncier : 10 700€/an reportable                    │
│    [Simuler mon investissement →]                                │
│                                                                  │
│ 📝 Description                                                   │
│ À l'abri de l'agitation urbaine, à la frontière entre Montchat  │
│ et Grange Blanche, la résidence KARA incarne une vision rare... │
│                                                                  │
│ 🛠️ Équipements                                                   │
│ • Parking sous-sol   • Cave          • Balcon/Terrasse          │
│ • Cuisine équipée    • Domotique     • VMC double flux          │
│                                                                  │
│ 🏘️ Espaces communs                                               │
│ • Local vélos  • Jardin partagé  • Digicode  • Interphone vidéo│
│                                                                  │
│ 🗺️ Quartier Montchat                                             │
│ Quartier résidentiel recherché de Lyon 3ème, bien desservi...   │
│                                                                  │
│ 📞 Contact promoteur                                             │
│ Nexity - 04 XX XX XX XX                                         │
│ [Demander une documentation]  [Prendre RDV]                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Plan de mise en œuvre

### Phase 1 : Scraping amélioré (Semaine 1)

**Scripts à créer :**
1. `scrape_programme_detail.py` - Page détail complète
2. `extract_images.py` - Galerie photos
3. `extract_equipements.py` - Liste équipements

**Champs enrichis :**
- `promoteur`, `adresse`, `description`
- `images` (JSON array)
- `typesLots`, `dateLivraison`
- `nbLotsTotal`, `nbLotsDisponibles`

**Livrable :** Score complétude 70%

---

### Phase 2 : Géolocalisation (Semaine 1)

**APIs à intégrer :**
- API Adresse (data.gouv.fr)
- Google Maps Nearby Search

**Champs enrichis :**
- `latitude`, `longitude`
- `distanceMetro`, `distanceTram`
- `distanceEcoles`

**Livrable :** Score complétude 80%

---

### Phase 3 : Données financières (Semaine 2)

**Calculs automatiques :**
- Rendement estimé
- Loyer estimé
- Économie fiscale Jeanbrun
- PTZ éligibilité

**Champs enrichis :**
- `rendementEstime`, `loyerEstime`
- `economieJeanbrun`, `ptzEligible`

**Livrable :** Score complétude 90%

---

### Phase 4 : DPE et prestations (Semaine 2)

**Scraping avancé :**
- Performance énergétique (DPE, GES)
- Équipements et prestations
- Espaces communs

**Champs enrichis :**
- `dpe`, `ges`, `labelEnergie`
- `equipements`, `prestations`

**Livrable :** Score complétude 95%

---

## 📊 Impact SEO et conversion

### Avant enrichissement (30% complétude)

```
❌ Fiche programme basique
   - Nom + Prix
   - Lien vers promoteur
   - Pas de détails
   - Pas de photos
   - Pas de calcul Jeanbrun
```

**Taux de conversion estimé :** 0.5-1%

---

### Après enrichissement (95% complétude)

```
✅ Fiche programme complète
   - 5+ photos haute qualité
   - Description riche (200+ mots)
   - Proximité transports/écoles
   - Calcul Jeanbrun personnalisé
   - Équipements détaillés
   - DPE/GES/Labels
   - Carte interactive
   - Contact direct promoteur
```

**Taux de conversion estimé :** 3-5%  
**Amélioration :** +300-400% ! 🚀

---

### Impact SEO

| Critère | Avant | Après | Impact |
|---------|-------|-------|--------|
| **Contenu texte** | 50 mots | 500+ mots | ⭐⭐⭐⭐⭐ |
| **Rich snippets** | ❌ Non | ✅ Oui (JSON-LD) | ⭐⭐⭐⭐⭐ |
| **Images** | ❌ Aucune | ✅ 5+ photos | ⭐⭐⭐⭐ |
| **Mots-clés longue traîne** | Faible | Fort | ⭐⭐⭐⭐⭐ |
| **Temps sur page** | <30s | >2min | ⭐⭐⭐⭐⭐ |

**Potentiel ranking :** Position 1-3 sur "{programme} loi Jeanbrun"

---

## 💰 Estimation effort

| Phase | Tâches | Temps | Priorité |
|-------|--------|-------|----------|
| **Phase 1** | Scraping détail + images | 8h | ⭐⭐⭐⭐⭐ |
| **Phase 2** | Géolocalisation | 4h | ⭐⭐⭐⭐⭐ |
| **Phase 3** | Calculs financiers | 3h | ⭐⭐⭐⭐⭐ |
| **Phase 4** | DPE + prestations | 5h | ⭐⭐⭐ |
| **Total** | | **20h** | |

**Livraison :** 1-2 semaines (en parallèle du scraping quotidien)

---

## ✅ Recommandation

**Je recommande de lancer les Phases 1-3 immédiatement** (priorité maximale) :

1. ✅ **Phase 1** : Enrichir le scraping (adresse, description, images, typesLots)
2. ✅ **Phase 2** : Géolocaliser tous les programmes (lat/long + proximités)
3. ✅ **Phase 3** : Ajouter les calculs Jeanbrun automatiques

**Résultat attendu :** Score complétude 90% en 2 semaines !

La Phase 4 (DPE/prestations) peut venir ensuite pour passer à 95-100%.

---

## 🎯 Prochaine étape

Veux-tu que je :

1. **Commence tout de suite** l'enrichissement du scraping Nexity (Phase 1) ?
2. **Crée les scripts** de géolocalisation avec l'API Adresse ?
3. **Développe les calculs** Jeanbrun automatiques ?

Ou tu préfères que j'attende tes retours sur cette analyse ?
