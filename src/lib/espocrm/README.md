# Client API EspoCRM - Simulateur Loi Jeanbrun

Client TypeScript pour interagir avec l'API EspoCRM du projet CardImmo.

## Configuration

Ajouter dans `.env.local`:

```bash
# Obligatoire pour activer l'intégration
ESPOCRM_API_KEY=your_api_key_here

# Optionnel (utilise l'URL par défaut si absent)
ESPOCRM_BASE_URL=https://espocrm.expert-ia-entreprise.fr/api/v1
```

## Entités EspoCRM

### CJeanbrunVille (51 villes éligibles)
Villes éligibles au dispositif Jeanbrun avec données marché immobilier.

### CJeanbrunProgramme
Programmes immobiliers neufs liés aux villes éligibles.

### Contact (Leads)
Leads générés par le simulateur avec `cSource: "simulateur-jeanbrun"`.

## Utilisation

### Côté serveur (API routes, Server Components)

```typescript
import { getEspoCRMClient, isEspoCRMAvailable } from "@/lib/espocrm";

// Vérifier si EspoCRM est configuré
if (!isEspoCRMAvailable()) {
  console.warn("EspoCRM is not available");
}

// Récupérer le client singleton
const client = getEspoCRMClient();

// Récupérer toutes les villes
const villes = await client.getVilles();

// Récupérer villes d'un département
const villesParis = await client.getVilles({ departement: "75" });

// Récupérer une ville par slug
const ville = await client.getVilleBySlug("paris");

// Récupérer programmes d'une ville
const programmes = await client.getProgrammes({ villeId: ville.id });

// Créer un lead
import { toEspoLead } from "@/lib/espocrm";

const leadData: LeadInput = {
  email: "test@example.com",
  telephone: "+33612345678",
  prenom: "Jean",
  nom: "Dupont",
  consentementRgpd: true,
  consentementMarketing: true,
};

const espoLead = toEspoLead(leadData);
const createdLead = await client.createLead(espoLead);
```

### Conversion de types

Le client fournit des helpers pour convertir les types EspoCRM vers les types locaux:

```typescript
import { fromEspoVille, fromEspoProgramme } from "@/lib/espocrm";

const espoVille = await client.getVilleBySlug("lyon");
const villeLocale = fromEspoVille(espoVille); // Type Ville

const espoProgramme = await client.getProgrammeById("abc123");
const programmeLocal = fromEspoProgramme(espoProgramme); // Type Programme
```

### Gestion d'erreurs

```typescript
import { EspoCRMError } from "@/lib/espocrm";

try {
  const villes = await client.getVilles();
} catch (error) {
  if (error instanceof EspoCRMError) {
    console.error("EspoCRM error:", error.message);
    console.error("Status code:", error.statusCode);
    console.error("EspoCRM message:", error.espoMessage);
  }
}
```

### Pagination

```typescript
// Récupérer 20 villes à partir de l'offset 40
const response = await client.getVilles(undefined, { limit: 20, offset: 40 });

console.log(`Total: ${response.total}`);
console.log(`Page: ${response.list.length} villes`);
```

### Filtres avancés

```typescript
// Villes zone A en tension locative
const villesZoneA = await client.getVilles({
  zoneFiscale: "A",
  tensionLocative: "tres_tendu",
});

// Programmes actifs à Lyon, prix max 300k€
const programmes = await client.getProgrammes({
  villeId: "lyon-id",
  actif: true,
  prixMax: 300000,
});
```

## Retry automatique

Le client implémente un système de retry avec exponential backoff:
- **3 tentatives** maximum
- Délais: 1s, 2s, 4s
- Retry sur erreurs 5xx et erreurs réseau
- Pas de retry sur erreurs 4xx (client)

## Test de connexion

```bash
# Démarrer le serveur de dev
pnpm dev

# Tester l'endpoint (autre terminal)
curl http://localhost:3000/api/espocrm/test
```

Réponse attendue:

```json
{
  "success": true,
  "villes": [...],
  "count": 51,
  "message": "EspoCRM API is working. Found 51 villes, showing first 5."
}
```

## Patterns d'intégration

### Synchronisation bidirectionnelle

```typescript
// 1. Récupérer villes depuis EspoCRM
const espoVilles = await client.getVilles();

// 2. Convertir et insérer dans DB locale
import { db } from "@/lib/db";
import { villes } from "@/lib/schema";

for (const espoVille of espoVilles.list) {
  const villeLocale = fromEspoVille(espoVille);

  await db.insert(villes).values(villeLocale).onConflictDoUpdate({
    target: villes.espoId,
    set: villeLocale,
  });
}
```

### Déduplication de leads

```typescript
// Vérifier si le lead existe déjà
const existing = await client.findLeadByEmail(email);

if (existing) {
  console.log("Lead already exists in EspoCRM:", existing.id);
} else {
  const newLead = await client.createLead(toEspoLead(leadData));
  console.log("Lead created:", newLead.id);
}
```

## API Reference

Voir les JSDoc dans les fichiers:
- `client.ts` - Méthodes du client
- `types.ts` - Types et helpers de conversion

## Architecture

```
src/lib/espocrm/
├── client.ts       # EspoCRMClient class avec retry et gestion d'erreurs
├── types.ts        # Types TypeScript + helpers de conversion
├── index.ts        # Export centralisé + singleton
└── README.md       # Cette documentation
```
