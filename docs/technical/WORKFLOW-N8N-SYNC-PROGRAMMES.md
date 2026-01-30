# Workflow n8n - Synchronisation Programmes

Ce document décrit le workflow n8n pour synchroniser quotidiennement les programmes immobiliers neufs depuis l'API agrégateur vers EspoCRM.

---

## Vue d'ensemble

```
┌──────────────┐
│ Cron Trigger │ (Quotidien 3h du matin)
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ HTTP Request     │ → Appel API Agrégateur
│ (Get Programmes) │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Loop Over Items  │ → Pour chaque programme
└──────┬───────────┘
       │
       ├──► ┌────────────────────┐
       │    │ Function Node      │ → Enrichissement données
       │    │ (Enrich Programme) │    (Éligibilité Jeanbrun, zone)
       │    └──────┬─────────────┘
       │           │
       │           ▼
       │    ┌────────────────────┐
       │    │ HTTP Request       │ → Chercher si existe dans EspoCRM
       │    │ (Check Existing)   │    (par cIdExterne)
       │    └──────┬─────────────┘
       │           │
       │           ▼
       │    ┌────────────────────┐
       │    │ IF Node            │ → Existe déjà ?
       │    └──┬────────────┬────┘
       │       │ OUI        │ NON
       │       ▼            ▼
       │    ┌─────────┐  ┌─────────┐
       │    │ UPDATE  │  │ CREATE  │
       │    │ (PUT)   │  │ (POST)  │
       │    └────┬────┘  └────┬────┘
       │         │            │
       │         └────────┬───┘
       │                  │
       └──────────────────┘
       │
       ▼
┌──────────────────┐
│ Update Counters  │ → Mise à jour compteurs villes
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Send Summary     │ → Email récapitulatif
└──────────────────┘
```

---

## Nodes détaillés

### 1. Cron Trigger

**Type:** Schedule Trigger
**Configuration:**
- Mode: `Custom`
- Cron Expression: `0 3 * * *` (tous les jours à 3h)
- Timezone: `Europe/Paris`

### 2. HTTP Request - Get Programmes

**Type:** HTTP Request
**Configuration:**

```json
{
  "method": "GET",
  "url": "https://api.agregateur-immo.fr/v1/programmes",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer {{ $credentials.agregateur_token }}"
      }
    ]
  },
  "qs": {
    "eligible_jeanbrun": "true",
    "statut": "disponible",
    "limit": "500"
  }
}
```

### 3. Loop Over Items

**Type:** Split In Batches
**Configuration:**
- Batch Size: `10` (traiter 10 programmes à la fois)

### 4. Function Node - Enrich Programme

**Type:** Code
**Code:**

```javascript
// Enrichir les données du programme
const programme = $input.item.json;

// Déterminer l'éligibilité Jeanbrun
const isEligible = (
  programme.type === 'neuf' &&
  programme.prix_min >= 100000 &&
  programme.prix_max <= 500000 &&
  programme.date_livraison > new Date()
);

// Mapper zone fiscale
const zoneFiscaleMap = {
  'A_bis': 'A_bis',
  'A': 'A',
  'B1': 'B1',
  'B2': 'B2',
  'C': 'C'
};

// Trouver la ville dans EspoCRM
const villeSlug = programme.ville.toLowerCase().replace(/ /g, '-');

// Construire l'objet pour EspoCRM
const espoData = {
  name: programme.nom,
  cSlug: programme.slug || programme.nom.toLowerCase().replace(/ /g, '-'),
  cPromoteur: programme.promoteur,
  cAdresse: programme.adresse,
  cLatitude: programme.latitude,
  cLongitude: programme.longitude,
  cPrixMin: programme.prix_min,
  cPrixMax: programme.prix_max,
  cPrixM2Moyen: Math.round((programme.prix_min + programme.prix_max) / 2 / programme.surface_moyenne),
  cNbLotsTotal: programme.nb_lots_total,
  cNbLotsDisponibles: programme.nb_lots_disponibles,
  cTypesLots: programme.types_lots, // ["T2", "T3", "T4"]
  cDateLivraison: programme.date_livraison,
  cEligibleJeanbrun: isEligible,
  cZoneFiscale: zoneFiscaleMap[programme.zone_fiscale] || 'B1',
  description: programme.description,
  cSourceApi: 'agregateur-immo',
  cIdExterne: programme.id,
  cUrlExterne: programme.url,
  cStatut: programme.statut === 'disponible' ? 'disponible' : 'epuise',
  dateMaj: new Date().toISOString(),

  // Pour la recherche de ville
  _villeSlug: villeSlug,
  _villeNom: programme.ville
};

return {
  json: espoData
};
```

### 5. HTTP Request - Check Existing

**Type:** HTTP Request
**Configuration:**

```json
{
  "method": "GET",
  "url": "https://espocrm.expert-ia-entreprise.fr/api/v1/cProgramme",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "X-Api-Key",
        "value": "={{ $credentials.espocrm_api_key }}"
      }
    ]
  },
  "qs": {
    "where[0][type]": "equals",
    "where[0][attribute]": "cIdExterne",
    "where[0][value]": "={{ $json.cIdExterne }}",
    "maxSize": "1"
  }
}
```

### 6. IF Node

**Type:** IF
**Configuration:**

```json
{
  "conditions": {
    "number": [
      {
        "value1": "={{ $json.total }}",
        "operation": "larger",
        "value2": 0
      }
    ]
  }
}
```

### 7a. HTTP Request - UPDATE (branche TRUE)

**Type:** HTTP Request
**Configuration:**

```json
{
  "method": "PUT",
  "url": "https://espocrm.expert-ia-entreprise.fr/api/v1/cProgramme/={{ $json.list[0].id }}",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "X-Api-Key",
        "value": "={{ $credentials.espocrm_api_key }}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "bodyParametersJson": "={{ $('Function Node - Enrich Programme').item.json }}"
}
```

### 7b. HTTP Request - CREATE (branche FALSE)

**Type:** HTTP Request
**Configuration:**

Identique à UPDATE mais avec `method: "POST"` et URL sans ID:

```json
{
  "method": "POST",
  "url": "https://espocrm.expert-ia-entreprise.fr/api/v1/cProgramme",
  ...
}
```

**Important:** Avant de créer, il faut récupérer l'ID de la ville via un sous-workflow.

#### Sous-workflow: Get Ville ID

```javascript
// Function Node pour récupérer ID ville
const villeSlug = $json._villeSlug;

// HTTP Request pour chercher la ville
const villeResponse = await fetch(
  `https://espocrm.expert-ia-entreprise.fr/api/v1/cVille?where[0][type]=equals&where[0][attribute]=cSlug&where[0][value]=${villeSlug}`,
  {
    headers: {
      'X-Api-Key': $credentials.espocrm_api_key
    }
  }
);

const villeData = await villeResponse.json();

if (villeData.total > 0) {
  $json.cVilleId = villeData.list[0].id;
} else {
  // Ville non trouvée, créer une entrée basique
  console.log(`Ville non trouvée: ${$json._villeNom}`);
  $json.cVilleId = null; // Sera géré manuellement
}

return $json;
```

### 8. Update Counters (après la loop)

**Type:** Code
**Configuration:**

```javascript
// Récupérer toutes les villes
const villesResponse = await fetch(
  'https://espocrm.expert-ia-entreprise.fr/api/v1/cVille?maxSize=500',
  {
    headers: { 'X-Api-Key': $credentials.espocrm_api_key }
  }
);
const villes = await villesResponse.json();

const results = [];

for (const ville of villes.list) {
  // Compter les programmes pour cette ville
  const programmesResponse = await fetch(
    `https://espocrm.expert-ia-entreprise.fr/api/v1/cProgramme?where[0][type]=equals&where[0][attribute]=cVilleId&where[0][value]=${ville.id}&maxSize=1`,
    {
      headers: { 'X-Api-Key': $credentials.espocrm_api_key }
    }
  );
  const programmesCount = await programmesResponse.json();

  // Mettre à jour le compteur
  await fetch(
    `https://espocrm.expert-ia-entreprise.fr/api/v1/cVille/${ville.id}`,
    {
      method: 'PUT',
      headers: {
        'X-Api-Key': $credentials.espocrm_api_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cNbProgrammesNeufs: programmesCount.total
      })
    }
  );

  results.push({
    ville: ville.name,
    programmes: programmesCount.total
  });
}

return results;
```

### 9. Send Summary

**Type:** Send Email (SendGrid)
**Configuration:**

```json
{
  "to": "admin@expert-ia-entreprise.fr",
  "subject": "Sync Programmes Loi Jeanbrun - {{ $now.format('DD/MM/YYYY') }}",
  "body": "html",
  "htmlContent": `
    <h1>Synchronisation Programmes</h1>
    <p>Date: {{ $now.format('DD/MM/YYYY HH:mm') }}</p>

    <h2>Résumé</h2>
    <ul>
      <li>Programmes traités: {{ $('Loop Over Items').itemMatching(0).json.total_count }}</li>
      <li>Nouveaux: {{ $('HTTP Request - CREATE').itemCount }}</li>
      <li>Mis à jour: {{ $('HTTP Request - UPDATE').itemCount }}</li>
    </ul>

    <h2>Compteurs par ville</h2>
    <table border="1">
      <tr>
        <th>Ville</th>
        <th>Programmes</th>
      </tr>
      {{#each $('Update Counters').all()}}
      <tr>
        <td>{{ this.json.ville }}</td>
        <td>{{ this.json.programmes }}</td>
      </tr>
      {{/each}}
    </table>
  `
}
```

---

## Credentials nécessaires

### EspoCRM API Key

1. Aller dans n8n → **Credentials** → **Add Credential**
2. Type: `Header Auth`
3. Name: `EspoCRM API`
4. Header Name: `X-Api-Key`
5. Header Value: `<votre_clé_api_espocrm>`

### Agrégateur API Token

1. Type: `Header Auth`
2. Name: `Agrégateur Immo API`
3. Header Name: `Authorization`
4. Header Value: `Bearer <votre_token>`

### SendGrid

1. Type: `SendGrid API`
2. API Key: `<votre_clé_sendgrid>`

---

## Gestion des erreurs

### Error Trigger

Ajouter un **Error Trigger** au workflow:

```json
{
  "type": "on-workflow-error",
  "action": "send-email",
  "to": "admin@expert-ia-entreprise.fr",
  "subject": "ERREUR - Sync Programmes",
  "body": "{{ $json.error.message }}\n\nStack: {{ $json.error.stack }}"
}
```

### Retry Strategy

Pour les nodes HTTP Request:

```json
{
  "retryOnFail": true,
  "maxTries": 3,
  "waitBetweenTries": 1000
}
```

---

## Monitoring

### Logs à surveiller

- Nombre de programmes traités
- Nombre de créations vs mises à jour
- Erreurs API (401, 500, etc.)
- Temps d'exécution total

### Alertes recommandées

- Si aucun programme traité (API down?)
- Si taux d'erreur > 10%
- Si temps d'exécution > 30 minutes

---

## Optimisations possibles

### V1 (actuel)

- Sync séquentielle (un programme à la fois)
- Vérification systématique de l'existence

### V2 (améliorée)

- Batch processing (10 programmes simultanés)
- Cache des IDs de villes en mémoire
- Webhook push depuis agrégateur (au lieu de pull quotidien)

### V3 (avancée)

- Change detection (sync uniquement si modifié)
- Queue Redis pour gérer gros volumes
- Partitionnement par région

---

## Déploiement

### Installation

1. Importer le workflow dans n8n
2. Configurer les credentials
3. Activer le workflow
4. Faire un test manuel (bouton "Execute Workflow")

### Test manuel

```bash
# Déclencher manuellement via webhook
curl -X POST "https://n8n.expert-ia-entreprise.fr/webhook-test/sync-programmes" \
  -H "Content-Type: application/json"
```

---

## Exemple de JSON workflow n8n

Le fichier complet est disponible dans:
`/root/simulateur_loi_Jeanbrun/workflows/sync-programmes-jeanbrun.json`

Import dans n8n:
1. Workflows → Import from File
2. Sélectionner le JSON
3. Vérifier les credentials
4. Activer

---

## Maintenance

### Quotidien

- Vérifier l'email de résumé (succès ou erreur)
- Consulter les logs n8n

### Hebdomadaire

- Vérifier la cohérence des compteurs (`cNbProgrammesNeufs`)
- Supprimer les programmes "livrés" de plus de 6 mois

### Mensuel

- Audit des programmes "épuisés" (actualisation statut)
- Nettoyage des doublons éventuels

---

**Auteur:** Claude Code (n8n Expert)
**Dernière mise à jour:** 30 janvier 2026
