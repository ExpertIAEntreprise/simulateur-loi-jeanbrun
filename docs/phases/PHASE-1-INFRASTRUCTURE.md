# Phase 1 - Infrastructure

**Sprint:** 1
**Semaines:** S1-S2 (03-14 Février 2026)
**Effort estimé:** 10,5 jours
**Objectif:** Environnement de développement fonctionnel avec stack complète

---

## 1. Objectifs du sprint

### 1.1 Livrables attendus

| Livrable | Description | Critère de validation |
|----------|-------------|----------------------|
| Projet Next.js | Application Next.js 14 initialisée | `npm run dev` fonctionne |
| Configuration TypeScript | Mode strict activé | Pas d'erreur `tsc` |
| Design System | Tailwind v4 + shadcn/ui | Composants de base disponibles |
| Docker | Conteneurisation complète | `docker-compose up` fonctionne |
| Nginx | Reverse proxy configuré | Routing vers Next.js |
| Redis | Cache applicatif | Connexion Redis OK |
| Client EspoCRM | Wrapper API | CRUD opérationnel |
| Entités EspoCRM | 4 entités custom | Création via admin EspoCRM |
| Données test | 266 communes Rhône | Import réussi |
| CI/CD | GitHub Actions | Build automatique |

### 1.2 Dépendances

- Accès VPS CardImmo (147.93.53.108)
- Accès admin EspoCRM
- Données loyers_2025.json et communes.json disponibles

---

## 2. Tâches détaillées

### 2.1 Setup projet Next.js (1j)

**ID:** 1.1
**Commandes:**

```bash
cd /root/simulateur_loi_Jeanbrun
npx create-next-app@14 app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd app
```

**Structure initiale:**

```
app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   └── types/
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

### 2.2 Configuration TypeScript strict (0,5j)

**ID:** 1.2
**Fichier:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### 2.3 Installation Tailwind v4 + shadcn/ui (1j)

**ID:** 1.3

**Installation Tailwind v4:**

```bash
npm install tailwindcss@next @tailwindcss/postcss@next
```

**Fichier:** `postcss.config.mjs`

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

**Fichier:** `src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.2 250);
  --color-primary-foreground: oklch(0.98 0.01 250);
  --color-secondary: oklch(0.5 0.1 180);
  --color-accent: oklch(0.7 0.15 80);
  --color-background: oklch(0.99 0.005 250);
  --color-foreground: oklch(0.15 0.01 250);
  --color-destructive: oklch(0.55 0.2 25);

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
}
```

**Installation shadcn/ui:**

```bash
npx shadcn@latest init
npx shadcn@latest add button input select slider card badge progress alert tooltip
```

**Composants prioritaires:**

| Composant | Usage |
|-----------|-------|
| button | CTAs, navigation |
| input | Formulaires |
| select | Dropdowns |
| slider | Budget, durée |
| card | Résultats, programmes |
| badge | Statuts, zones |
| progress | Barre étapes |
| alert | Messages info/erreur |
| tooltip | Aide contextuelle |

---

### 2.4 Configuration ESLint + Prettier (0,5j)

**ID:** 1.4

**Fichier:** `.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**Fichier:** `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

### 2.5 Setup Docker + docker-compose (1j)

**ID:** 1.5

**Fichier:** `docker/Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3005
ENV PORT 3005
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Fichier:** `docker/docker-compose.yml`

```yaml
version: '3.8'

services:
  simulateur:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: simulateur-jeanbrun
    restart: unless-stopped
    ports:
      - "127.0.0.1:3005:3005"
    environment:
      - NODE_ENV=production
      - ESPOCRM_URL=${ESPOCRM_URL}
      - ESPOCRM_API_KEY=${ESPOCRM_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - REDIS_URL=redis://redis:6379
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
    depends_on:
      - redis
    networks:
      - simulateur-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3005/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: simulateur-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - simulateur-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

networks:
  simulateur-network:
    driver: bridge

volumes:
  redis-data:
```

**Fichier:** `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'espocrm.expert-ia-entreprise.fr',
      },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
```

---

### 2.6 Configuration nginx reverse proxy (1j)

**ID:** 1.6

**Fichier:** `/etc/nginx/sites-available/simulateur-jeanbrun`

```nginx
upstream simulateur {
    server 127.0.0.1:3005;
    keepalive 64;
}

server {
    listen 80;
    server_name simuler-loi-fiscale-jeanbrun.fr www.simuler-loi-fiscale-jeanbrun.fr;
    return 301 https://simuler-loi-fiscale-jeanbrun.fr$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.simuler-loi-fiscale-jeanbrun.fr;

    ssl_certificate /etc/letsencrypt/live/simuler-loi-fiscale-jeanbrun.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/simuler-loi-fiscale-jeanbrun.fr/privkey.pem;

    return 301 https://simuler-loi-fiscale-jeanbrun.fr$request_uri;
}

server {
    listen 443 ssl http2;
    server_name simuler-loi-fiscale-jeanbrun.fr;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/simuler-loi-fiscale-jeanbrun.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/simuler-loi-fiscale-jeanbrun.fr/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache static assets
    location /_next/static {
        proxy_cache_valid 60m;
        proxy_pass http://simulateur;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API - no cache
    location /api {
        proxy_pass http://simulateur;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Main app
    location / {
        proxy_pass http://simulateur;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Commandes d'activation:**

```bash
sudo ln -s /etc/nginx/sites-available/simulateur-jeanbrun /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 2.7 Setup Redis cache (0,5j)

**ID:** 1.7

**Fichier:** `src/lib/api/cache.ts`

```typescript
import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType | null = null

export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    })
    redisClient.on('error', (err) => console.error('Redis Client Error', err))
    await redisClient.connect()
  }
  return redisClient
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const client = await getRedisClient()
  const cached = await client.get(key)

  if (cached) {
    return JSON.parse(cached) as T
  }

  const data = await fetcher()
  await client.setEx(key, ttlSeconds, JSON.stringify(data))
  return data
}

export async function invalidateCache(pattern: string): Promise<void> {
  const client = await getRedisClient()
  const keys = await client.keys(pattern)
  if (keys.length > 0) {
    await client.del(keys)
  }
}
```

**TTL par type de données:**

| Donnée | TTL | Clé pattern |
|--------|-----|-------------|
| Villes | 24h | `ville:*` |
| Programmes | 1h | `programme:*` |
| Autocomplete | 6h | `autocomplete:*` |
| Simulation | 30min | `simulation:*` |

---

### 2.8 Client API EspoCRM (1,5j)

**ID:** 1.8

**Fichier:** `src/lib/api/espocrm.ts`

```typescript
interface EspoCRMConfig {
  baseUrl: string
  apiKey: string
}

interface EspoCRMResponse<T> {
  list: T[]
  total: number
}

class EspoCRMClient {
  private config: EspoCRMConfig

  constructor() {
    this.config = {
      baseUrl: process.env.ESPOCRM_URL || '',
      apiKey: process.env.ESPOCRM_API_KEY || '',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Api-Key': this.config.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`EspoCRM API error: ${response.status}`)
    }

    return response.json()
  }

  // cVille methods
  async getVilles(params?: {
    where?: object[]
    maxSize?: number
    offset?: number
    orderBy?: string
  }): Promise<EspoCRMResponse<CVille>> {
    const searchParams = new URLSearchParams()
    if (params?.maxSize) searchParams.set('maxSize', String(params.maxSize))
    if (params?.offset) searchParams.set('offset', String(params.offset))
    if (params?.orderBy) searchParams.set('orderBy', params.orderBy)
    if (params?.where) searchParams.set('where', JSON.stringify(params.where))

    return this.request<EspoCRMResponse<CVille>>(`/cVille?${searchParams}`)
  }

  async getVilleBySlug(slug: string): Promise<CVille | null> {
    const response = await this.getVilles({
      where: [{ type: 'equals', attribute: 'slug', value: slug }],
      maxSize: 1,
    })
    return response.list[0] || null
  }

  // cProgramme methods
  async getProgrammes(params?: {
    villeId?: string
    eligible?: boolean
    maxSize?: number
    offset?: number
  }): Promise<EspoCRMResponse<CProgramme>> {
    const where: object[] = []
    if (params?.villeId) {
      where.push({ type: 'equals', attribute: 'villeId', value: params.villeId })
    }
    if (params?.eligible !== undefined) {
      where.push({ type: 'equals', attribute: 'eligibleJeanbrun', value: params.eligible })
    }

    const searchParams = new URLSearchParams()
    if (params?.maxSize) searchParams.set('maxSize', String(params.maxSize))
    if (params?.offset) searchParams.set('offset', String(params.offset))
    if (where.length) searchParams.set('where', JSON.stringify(where))

    return this.request<EspoCRMResponse<CProgramme>>(`/cProgramme?${searchParams}`)
  }

  // cSimulation methods
  async createSimulation(data: Partial<CSimulation>): Promise<CSimulation> {
    return this.request<CSimulation>('/cSimulation', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSimulation(id: string): Promise<CSimulation | null> {
    try {
      return await this.request<CSimulation>(`/cSimulation/${id}`)
    } catch {
      return null
    }
  }

  // Contact methods (for quotas)
  async updateContactQuota(
    contactId: string,
    newQuota: number
  ): Promise<void> {
    await this.request(`/Contact/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({ cSimulationsRestantes: newQuota }),
    })
  }
}

export const espocrm = new EspoCRMClient()
```

**Fichier:** `src/types/espocrm.ts`

```typescript
export interface CVille {
  id: string
  name: string
  slug: string
  departement: string
  region: string
  zoneFiscale: 'A' | 'A_bis' | 'B1' | 'B2' | 'C'
  prixM2Moyen: number
  prixM2Median: number
  evolutionPrix1An: number
  loyerM2Moyen: number
  tensionLocative: 'faible' | 'moyenne' | 'forte' | 'tres_forte'
  plafondIntermediaire: number
  plafondSocial: number
  plafondTresSocial: number
  nbProgrammes: number
  metaTitle: string
  metaDescription: string
  contenuEditorial: string
  dateMaj: string
}

export interface CProgramme {
  id: string
  name: string
  slug: string
  promoteur: string
  villeId: string
  adresse: string
  latitude: number
  longitude: number
  prixMin: number
  prixMax: number
  prixM2Moyen: number
  nbLotsTotal: number
  nbLotsDisponibles: number
  typesLots: string[]
  dateLivraison: string
  eligibleJeanbrun: boolean
  images: string[]
  description: string
  statut: 'disponible' | 'epuise' | 'livre'
}

export interface CSimulation {
  id: string
  email: string
  typeBien: 'neuf' | 'ancien'
  villeId: string
  budget: number
  revenus: number
  niveauLoyer: 'intermediaire' | 'social' | 'tres_social'
  economieFiscaleAnnuelle: number
  economieFiscaleTotale: number
  loyerEstime: number
  dateCreation: string
  premium: boolean
}
```

---

### 2.9 Créer entités EspoCRM (2j)

**ID:** 1.9

**Procédure manuelle via admin EspoCRM:**

1. Connexion: https://espocrm.expert-ia-entreprise.fr/admin
2. Administration > Entity Manager > Create Entity

**Entité cVille (38 champs):**

Voir documentation complète: `/root/simulateur_loi_Jeanbrun/docs/ESPOCRM-SCHEMA.md`

| Champ | Type | Required |
|-------|------|----------|
| name | Varchar | Yes |
| slug | Varchar | Yes (unique) |
| departement | Varchar | Yes |
| region | Varchar | Yes |
| zoneFiscale | Enum | Yes |
| prixM2Moyen | Currency | No |
| prixM2Median | Currency | No |
| evolutionPrix1An | Float | No |
| loyerM2Moyen | Currency | No |
| tensionLocative | Enum | No |
| plafondIntermediaire | Currency | No |
| plafondSocial | Currency | No |
| plafondTresSocial | Currency | No |
| nbProgrammes | Int | No |
| metaTitle | Varchar | No |
| metaDescription | Text | No |
| contenuEditorial | Wysiwyg | No |
| dateMaj | Date | No |

**Entité cProgramme (24 champs):**

| Champ | Type | Required |
|-------|------|----------|
| name | Varchar | Yes |
| slug | Varchar | Yes (unique) |
| promoteur | Varchar | Yes |
| villeId | Link | Yes |
| adresse | Address | No |
| prixMin | Currency | No |
| prixMax | Currency | No |
| prixM2Moyen | Currency | No |
| nbLotsTotal | Int | No |
| nbLotsDisponibles | Int | No |
| typesLots | Array | No |
| dateLivraison | Date | No |
| eligibleJeanbrun | Bool | Yes |
| images | AttachmentMultiple | No |
| description | Wysiwyg | No |
| statut | Enum | Yes |

**Entité cSimulation (34 champs):**

| Champ | Type | Required |
|-------|------|----------|
| email | Email | Yes |
| typeBien | Enum | Yes |
| villeId | Link | Yes |
| budget | Currency | Yes |
| revenus | Currency | Yes |
| niveauLoyer | Enum | Yes |
| economieFiscaleAnnuelle | Currency | No |
| economieFiscaleTotale | Currency | No |
| loyerEstime | Currency | No |
| premium | Bool | No |

**Entité cAgence (22 champs):** (Phase 2)

---

### 2.10 Import données test (1j)

**ID:** 1.10

**Script d'import:** `scripts/import-test-data.ts`

```typescript
import { espocrm } from '../src/lib/api/espocrm'
import loyersData from '../data/loyers_2025.json'
import communesData from '../data/communes.json'

async function importCommunes() {
  console.log(`Importing ${communesData.length} communes...`)

  for (const commune of communesData) {
    const loyer = loyersData.find(
      (l) => l.code_insee === commune.code_insee
    )

    await espocrm.createVille({
      name: commune.nom,
      slug: slugify(commune.nom),
      departement: commune.departement,
      region: commune.region,
      zoneFiscale: commune.zone_fiscale,
      loyerM2Moyen: loyer?.loyer_moyen || 0,
      // ... autres champs
    })

    console.log(`Imported: ${commune.nom}`)
  }

  console.log('Import completed!')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

importCommunes().catch(console.error)
```

**Vérification:**

```bash
curl -X GET "https://espocrm.expert-ia-entreprise.fr/api/v1/cVille?maxSize=5" \
  -H "X-Api-Key: $ESPOCRM_API_KEY" | jq
```

---

### 2.11 CI/CD GitHub Actions (0,5j)

**ID:** 1.11

**Fichier:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test -- --coverage
      - uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

---

## 3. Variables d'environnement

**Fichier:** `.env.example`

```bash
# EspoCRM
ESPOCRM_URL=https://espocrm.expert-ia-entreprise.fr/api/v1
ESPOCRM_API_KEY=your_api_key_here

# Redis
REDIS_URL=redis://localhost:6379

# Stripe (Phase 5)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Site
NEXT_PUBLIC_SITE_URL=https://simuler-loi-fiscale-jeanbrun.fr
NODE_ENV=development
```

---

## 4. Checklist de fin de sprint

### 4.1 Validations techniques

- [ ] `npm run dev` démarre sans erreur
- [ ] `npm run build` produit un build de production
- [ ] `npm run lint` passe sans erreur
- [ ] `npm run typecheck` passe sans erreur
- [ ] Docker compose up lance l'application
- [ ] Health check endpoint répond 200

### 4.2 Validations fonctionnelles

- [ ] Nginx route correctement vers Next.js (port 3005)
- [ ] API EspoCRM accessible depuis l'app
- [ ] Redis cache fonctionnel (test GET/SET)
- [ ] 4 entités custom créées dans EspoCRM
- [ ] 266 communes de test importées
- [ ] GitHub Actions build passe

### 4.3 Documentation

- [ ] README.md mis à jour
- [ ] .env.example documenté
- [ ] Commandes Docker documentées

---

## 5. Risques identifiés

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| EspoCRM API lente | Moyen | Moyenne | Cache Redis agressif |
| Certificat SSL non disponible | Bloquant | Faible | Utiliser certbot avant config nginx |
| Port 3005 déjà utilisé | Bloquant | Faible | Vérifier ports avec `netstat` |

---

## 6. Ressources

| Ressource | URL |
|-----------|-----|
| Documentation Next.js 14 | https://nextjs.org/docs |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com |
| EspoCRM API | https://docs.espocrm.com/development/api/ |
| Schéma EspoCRM | /root/simulateur_loi_Jeanbrun/docs/ESPOCRM-SCHEMA.md |

---

**Auteur:** Équipe Claude Code
**Date:** 30 janvier 2026
