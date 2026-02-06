# Scripts Directory

Utility scripts for database seeding, migrations, and maintenance tasks.

## Available Scripts

### `seed-demo-programme.ts`

Seeds a demo programme "Les Jardins du Parc" in EspoCRM for development and testing purposes.

**Usage:**
```bash
# From project root
pnpm --filter jeanbrun exec tsx scripts/seed-demo-programme.ts

# Or if tsx is installed globally
npx tsx scripts/seed-demo-programme.ts
```

**Requirements:**
- `ESPOCRM_API_KEY` must be set in `.env.local`
- EspoCRM must be accessible at `https://espocrm.expert-ia-entreprise.fr/api/v1`
- Lyon city must exist in `CJeanbrunVille` entity (slug: `lyon`)

**What it creates:**
- Programme: "Les Jardins du Parc - Lyon 3eme"
- Location: 45 rue de la Republique, 69003 Lyon
- 9 realistic lots (T1, T2, T3, T4) with prices ranging from 185,000€ to 450,000€
- Special offers: Frais de notaire offerts, remise commerciale 5%, cuisine équipée

**Safety:**
- Checks if programme already exists by slug before creating
- Validates that Lyon city exists in database
- Idempotent: can be run multiple times safely

**Output:**
```
🌱 Seeding Demo Programme: Les Jardins du Parc

📋 Loading environment variables...
✅ Environment loaded

🔍 Checking if programme already exists...
✅ Programme does not exist yet

🔍 Looking up Lyon (ville)...
✅ Found Lyon (ID: abc123, Zone: A)

🚀 Creating programme in EspoCRM...
✅ Programme created successfully!

📋 Programme Details:
   ID: xyz789
   Name: Les Jardins du Parc - Lyon 3eme
   Slug: les-jardins-du-parc-lyon-3eme
   ...

🎉 Demo programme seeded successfully!
```

## Adding New Scripts

When adding new scripts to this directory:

1. Use TypeScript with strict type checking
2. Make scripts executable: `chmod +x scripts/your-script.ts`
3. Add shebang line: `#!/usr/bin/env tsx`
4. Include comprehensive error handling
5. Document the script in this README
6. Use the EspoCRM API client pattern from `seed-demo-programme.ts`

## TypeScript Execution

All scripts use `tsx` for TypeScript execution without compilation:

```bash
npx tsx scripts/your-script.ts
```

This is faster than `ts-node` and supports ESM/CJS modules seamlessly.
