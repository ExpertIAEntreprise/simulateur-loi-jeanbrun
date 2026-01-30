# Intégration EspoCRM - Simulateur Loi Jeanbrun

**Dernière mise à jour:** 30 janvier 2026

## Vue d'ensemble

Le simulateur Loi Jeanbrun s'intègre avec EspoCRM pour:
1. **Récupérer les villes éligibles** (51 villes) avec leurs données marché
2. **Afficher les programmes immobiliers** neufs par ville
3. **Synchroniser les leads** générés par les simulations

## Architecture

```
┌──────────────────────────────────────────┐
│   Simulateur (Next.js + Neon)            │
│                                          │
│   ┌──────────┐         ┌──────────┐     │
│   │ Villes   │◄───────►│ EspoCRM  │     │
│   │ (DB)     │  Sync   │ Client   │────►│ API EspoCRM
│   └──────────┘         └──────────┘     │ https://espocrm.expert-ia-entreprise.fr
│                                          │
│   ┌──────────┐                          │
│   │ Leads    │                          │
│   │ (DB)     │──────────────────────────►│ Contact (cSource: "simulateur-jeanbrun")
│   └──────────┘         Envoi            │
│                                          │
└──────────────────────────────────────────┘
```

## Entités EspoCRM

### 1. CJeanbrunVille

**Rôle:** Liste des 51 villes éligibles au dispositif Jeanbrun (PLF 2026)

**Champs:**
| Champ API | Type | Description |
|-----------|------|-------------|
| `id` | string | ID EspoCRM |
| `name` | string | Nom de la ville |
| `cCodeInsee` | string | Code INSEE |
| `cDepartement` | string | Code département (75, 92, etc.) |
| `cRegion` | string | Région |
| `cZoneFiscale` | enum | A_BIS, A, B1, B2, C |
| `cTensionLocative` | enum | tres_tendu, tendu, equilibre, detendu |
| `cNiveauLoyer` | enum | haut, moyen, bas |
| `cPrixM2Moyen` | number | Prix moyen au m² (en euros) |
| `cLoyerM2Moyen` | number | Loyer moyen au m²/mois (en euros) |
| `cPopulationCommune` | number | Population de la commune |
| `cSlug` | string | Slug URL (paris, lyon, marseille...) |

**Utilisation:**
- Page `/villes` (liste des villes)
- Page `/ville/[slug]` (détail ville + programmes)
- Formulaire de simulation (sélection ville)

**Synchronisation:**
```typescript
// Sprint 4 - Sync initial
const espoVilles = await client.getVilles();

for (const espoVille of espoVilles.list) {
  const villeLocale = fromEspoVille(espoVille);

  await db.insert(villes).values(villeLocale).onConflictDoUpdate({
    target: villes.espoId,
    set: villeLocale,
  });
}
```

### 2. CJeanbrunProgramme

**Rôle:** Programmes immobiliers neufs éligibles

**Champs:**
| Champ API | Type | Description |
|-----------|------|-------------|
| `id` | string | ID EspoCRM |
| `name` | string | Nom du programme |
| `cPromoteur` | string | Nom du promoteur |
| `cAdresse` | string | Adresse |
| `cCodePostal` | string | Code postal |
| `cVilleId` | string | Relation vers CJeanbrunVille |
| `cPrixMin` | number | Prix minimum (en euros) |
| `cPrixMax` | number | Prix maximum (en euros) |
| `cSurfaceMin` | number | Surface minimale (en m²) |
| `cSurfaceMax` | number | Surface maximale (en m²) |
| `cDateLivraison` | string | Date livraison prévue (ISO) |
| `cActif` | boolean | Programme actif/inactif |

**Utilisation:**
- Page `/ville/[slug]` (liste programmes de la ville)
- Formulaire simulation (auto-complétion adresse)
- Recommandations personnalisées post-simulation

### 3. Contact (Leads)

**Rôle:** Stocker les prospects générés par le simulateur

**Champs:**
| Champ API | Type | Description |
|-----------|------|-------------|
| `id` | string | ID EspoCRM (auto-généré) |
| `emailAddress` | string | Email (requis) |
| `phoneNumber` | string | Téléphone |
| `firstName` | string | Prénom |
| `lastName` | string | Nom |
| `cSource` | enum | **"simulateur-jeanbrun"** (fixe) |
| `cSimulationId` | string | ID de la simulation locale |
| `cConsentementRgpd` | boolean | Consentement RGPD |
| `cConsentementMarketing` | boolean | Consentement marketing |
| `cDateConsentement` | string | Date consentement (ISO) |
| `cSourceUtm` | string | UTM source (tracking) |

**Flow création lead:**
```typescript
// 1. Utilisateur soumet le formulaire de contact
const leadData: LeadInput = {
  email: "investisseur@example.com",
  telephone: "+33612345678",
  prenom: "Marie",
  nom: "Dupont",
  simulationId: "uuid-simulation-locale",
  consentementRgpd: true,
  consentementMarketing: true,
  sourceUtm: "google-ads-jeanbrun",
};

// 2. Créer dans DB locale
const lead = await db.insert(leads).values(leadData);

// 3. Synchroniser avec EspoCRM (si API_KEY configurée)
if (isEspoCRMAvailable()) {
  const client = getEspoCRMClient();
  const espoLead = toEspoLead(leadData);

  try {
    const createdLead = await client.createLead(espoLead);

    // 4. Mettre à jour DB locale avec espoId
    await db.update(leads)
      .set({ espoId: createdLead.id })
      .where(eq(leads.id, lead.id));
  } catch (error) {
    console.error("Failed to sync lead to EspoCRM:", error);
    // Ne pas bloquer le flow utilisateur
  }
}
```

## Client API

### Installation

```bash
# Variables d'environnement (.env.local)
ESPOCRM_API_KEY=your_api_key_here
ESPOCRM_BASE_URL=https://espocrm.expert-ia-entreprise.fr/api/v1
```

### Utilisation

```typescript
import { getEspoCRMClient, isEspoCRMAvailable } from "@/lib/espocrm";

// Vérifier disponibilité
if (!isEspoCRMAvailable()) {
  console.warn("EspoCRM is not configured");
}

// Récupérer le client singleton
const client = getEspoCRMClient();

// API methods
await client.getVilles(filters?, options?);
await client.getVilleBySlug(slug);
await client.getProgrammes(filters?, options?);
await client.getProgrammeById(id);
await client.createLead(lead);
await client.findLeadByEmail(email);
await client.healthCheck();
```

### Gestion d'erreurs

Le client implémente:
- **Retry automatique** (3 tentatives, exponential backoff: 1s, 2s, 4s)
- **Gestion erreurs 4xx** (pas de retry)
- **Gestion erreurs 5xx** (retry)
- **Gestion erreurs réseau** (retry)

```typescript
import { EspoCRMError } from "@/lib/espocrm";

try {
  const villes = await client.getVilles();
} catch (error) {
  if (error instanceof EspoCRMError) {
    console.error("EspoCRM error:", error.message);
    console.error("Status:", error.statusCode);
  }
}
```

## Sprints d'implémentation

### Sprint 4 (SEO + EspoCRM)

**Tâches:**
1. ✅ Créer client API EspoCRM (`src/lib/espocrm/`)
2. ✅ Endpoint de test (`/api/espocrm/test`)
3. 🔲 Créer entités dans EspoCRM (CJeanbrunVille, CJeanbrunProgramme)
4. 🔲 Importer les 51 villes éligibles
5. 🔲 Sync DB locale ← EspoCRM (cron quotidien?)
6. 🔲 Générer pages statiques `/ville/[slug]` (ISR)
7. 🔲 Intégrer sync leads sur formulaire contact

### Sprint 5 (Paiements + Exports)

**Tâches:**
1. 🔲 Pipeline EspoCRM: Lead → Opportunité (si paiement)
2. 🔲 Webhook Stripe → EspoCRM (mise à jour statut)
3. 🔲 Auto-envoi PDF simulation par email (n8n?)

## Tests

### Test manuel

```bash
# 1. Démarrer le serveur
pnpm dev

# 2. Tester l'endpoint (autre terminal)
curl http://localhost:3000/api/espocrm/test
```

Réponse attendue:
```json
{
  "success": true,
  "villes": [
    {
      "id": "...",
      "name": "Paris",
      "cCodeInsee": "75056",
      "cZoneFiscale": "A_BIS",
      ...
    }
  ],
  "count": 51,
  "message": "EspoCRM API is working. Found 51 villes, showing first 5."
}
```

### Tests automatisés (Sprint 6)

```typescript
// tests/integration/espocrm.test.ts
describe("EspoCRM Client", () => {
  it("should fetch villes", async () => {
    const client = getEspoCRMClient();
    const response = await client.getVilles();

    expect(response.total).toBe(51);
    expect(response.list.length).toBeGreaterThan(0);
  });

  it("should create lead", async () => {
    const lead = toEspoLead({
      email: "test@example.com",
      consentementRgpd: true,
    });

    const created = await client.createLead(lead);
    expect(created.id).toBeDefined();
    expect(created.cSource).toBe("simulateur-jeanbrun");
  });
});
```

## Sécurité

### RGPD

- **Consentement explicite** requis avant envoi à EspoCRM
- **Opt-in marketing** séparé du consentement traitement
- **Droit à l'oubli** via EspoCRM (suppression manuelle admin)

### API Key

- Stockée dans variable d'environnement serveur uniquement
- Jamais exposée au client
- Rotation tous les 6 mois (bonne pratique)

### Rate limiting

- EspoCRM: max 100 req/min
- Client implémente retry avec backoff
- Pas de cache côté client (utiliser DB locale)

## Troubleshooting

### Erreur "ESPOCRM_API_KEY is not configured"

```bash
# Vérifier .env.local
cat .env.local | grep ESPOCRM_API_KEY

# Ajouter si manquant
echo "ESPOCRM_API_KEY=your_key_here" >> .env.local

# Redémarrer le serveur
pnpm dev
```

### Erreur 401 Unauthorized

- Vérifier que la clé API est valide
- Vérifier que la clé n'a pas expiré dans EspoCRM
- Tester avec curl:

```bash
curl -X GET "https://espocrm.expert-ia-entreprise.fr/api/v1/Contact?maxSize=1" \
  -H "X-Api-Key: YOUR_KEY"
```

### Erreur 500 Server Error

- Vérifier logs EspoCRM: `docker logs espocrm --tail 100`
- Vérifier que l'entité existe dans EspoCRM
- Vérifier les permissions de l'API Key (Admin → API Users)

## Ressources

- **EspoCRM Skill:** `~/.claude/skills/espocrm-patterns/SKILL.md`
- **API Docs:** https://docs.espocrm.com/development/api/
- **Client code:** `/root/simulateur_loi_Jeanbrun/src/lib/espocrm/`
- **VPS CardImmo:** https://espocrm.expert-ia-entreprise.fr (Docker)
