#!/usr/bin/env tsx

/**
 * Seed Demo Programme - Les Jardins du Parc
 *
 * Creates a demo programme "Les Jardins du Parc" in EspoCRM with realistic lot data
 * for development and testing purposes.
 *
 * Usage:
 *   npx tsx scripts/seed-demo-programme.ts
 *
 * Requirements:
 *   - ESPOCRM_API_KEY in .env.local
 *   - EspoCRM accessible at https://espocrm.expert-ia-entreprise.fr/api/v1
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Type Definitions
// ============================================================================

interface EspoCRMVille {
  id: string;
  name: string;
  slug: string;
  codePostal?: string;
  population?: number;
  zoneFiscale: 'A' | 'Abis' | 'B1' | 'B2' | 'C';
}

interface EspoCRMProgramme {
  id: string;
  name: string;
  promoteur: string;
  adresse: string;
  codePostal: string;
  villeId?: string;
  villeName?: string;
  prixMin: number;
  prixMax: number;
  prixM2Moyen: number;
  surfaceMin: number;
  surfaceMax: number;
  dateLivraison: string;
  imagePrincipale?: string | null;
  nbLotsTotal: number;
  nbLotsDisponibles: number;
  typesLots: string;
  zoneFiscale: 'A' | 'Abis' | 'B1' | 'B2' | 'C';
  eligibleJeanbrun: boolean;
  eligiblePtz: boolean;
  authorized: boolean;
  slug: string;
  statut: 'disponible' | 'bientot_disponible' | 'epuise' | 'livre';
  siteWeb?: string | null;
  telephone?: string | null;
  specialOffers?: string;
  lotsDetails?: string;
}

interface Lot {
  type: 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
  surface: number;
  etage: number;
  prix: number;
  prestations: string;
}

interface EspoCRMErrorResponse {
  statusCode: number;
  message?: string;
  reason?: string;
}

interface EspoCRMListResponse<T> {
  total: number;
  list: T[];
}

// ============================================================================
// Environment Configuration
// ============================================================================

interface EnvConfig {
  ESPOCRM_API_KEY: string;
  ESPOCRM_BASE_URL: string;
}

function loadEnv(): EnvConfig {
  const envPath = path.resolve(__dirname, '../../.env.local');

  if (!fs.existsSync(envPath)) {
    throw new Error(`.env.local not found at ${envPath}`);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars: Record<string, string> = {};

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });

  const apiKey = envVars['ESPOCRM_API_KEY'];
  if (!apiKey) {
    throw new Error('ESPOCRM_API_KEY not found in .env.local');
  }

  return {
    ESPOCRM_API_KEY: apiKey,
    ESPOCRM_BASE_URL: 'https://espocrm.expert-ia-entreprise.fr/api/v1'
  };
}

// ============================================================================
// EspoCRM API Client
// ============================================================================

class EspoCRMClient {
  private config: EnvConfig;

  constructor(config: EnvConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.ESPOCRM_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Api-Key': this.config.ESPOCRM_API_KEY,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `EspoCRM API error: ${response.status} ${response.statusText}`;

      try {
        const errorData: EspoCRMErrorResponse = await response.json();
        if (errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }
        if (errorData.reason) {
          errorMessage += ` (${errorData.reason})`;
        }
      } catch {
        // If JSON parsing fails, use the default error message
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async findVilleBySlug(slug: string): Promise<EspoCRMVille | null> {
    try {
      const response = await this.request<EspoCRMListResponse<EspoCRMVille>>(
        `/CJeanbrunVille?where[0][type]=equals&where[0][attribute]=slug&where[0][value]=${encodeURIComponent(slug)}&maxSize=1`
      );

      if (response.total > 0 && response.list.length > 0) {
        return response.list[0];
      }

      return null;
    } catch (error) {
      console.error(`Error finding ville by slug "${slug}":`, error);
      throw error;
    }
  }

  async findProgrammeBySlug(slug: string): Promise<EspoCRMProgramme | null> {
    try {
      const response = await this.request<EspoCRMListResponse<EspoCRMProgramme>>(
        `/CJeanbrunProgramme?where[0][type]=equals&where[0][attribute]=slug&where[0][value]=${encodeURIComponent(slug)}&maxSize=1`
      );

      if (response.total > 0 && response.list.length > 0) {
        return response.list[0];
      }

      return null;
    } catch (error) {
      console.error(`Error finding programme by slug "${slug}":`, error);
      throw error;
    }
  }

  async createProgramme(data: Omit<EspoCRMProgramme, 'id'>): Promise<EspoCRMProgramme> {
    try {
      const programme = await this.request<EspoCRMProgramme>('/CJeanbrunProgramme', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return programme;
    } catch (error) {
      console.error('Error creating programme:', error);
      throw error;
    }
  }
}

// ============================================================================
// Demo Data
// ============================================================================

const DEMO_LOTS: Lot[] = [
  {
    type: 'T1',
    surface: 28,
    etage: 2,
    prix: 185000,
    prestations: 'Balcon',
  },
  {
    type: 'T1',
    surface: 32,
    etage: 4,
    prix: 198000,
    prestations: 'Balcon, Vue degagee',
  },
  {
    type: 'T2',
    surface: 45,
    etage: 1,
    prix: 245000,
    prestations: 'Terrasse 10m2',
  },
  {
    type: 'T2',
    surface: 48,
    etage: 3,
    prix: 262000,
    prestations: 'Balcon, Parking',
  },
  {
    type: 'T2',
    surface: 50,
    etage: 5,
    prix: 275000,
    prestations: 'Terrasse, Vue panoramique',
  },
  {
    type: 'T3',
    surface: 65,
    etage: 2,
    prix: 320000,
    prestations: 'Balcon, Parking, Cave',
  },
  {
    type: 'T3',
    surface: 70,
    etage: 4,
    prix: 345000,
    prestations: 'Terrasse 15m2, Parking',
  },
  {
    type: 'T4',
    surface: 85,
    etage: 1,
    prix: 395000,
    prestations: 'Jardin privatif, 2 Parkings',
  },
  {
    type: 'T4',
    surface: 95,
    etage: 6,
    prix: 450000,
    prestations: 'Terrasse 25m2, Vue panoramique, 2 Parkings',
  },
];

const SPECIAL_OFFERS = {
  fraisNotaireOfferts: true,
  remiseCommerciale: '5%',
  cuisineEquipee: true,
};

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log('🌱 Seeding Demo Programme: Les Jardins du Parc\n');

  // Load environment
  console.log('📋 Loading environment variables...');
  const config = loadEnv();
  console.log('✅ Environment loaded\n');

  // Initialize client
  const client = new EspoCRMClient(config);

  // Check if programme already exists
  console.log('🔍 Checking if programme already exists...');
  const existingProgramme = await client.findProgrammeBySlug('les-jardins-du-parc-lyon-3eme');

  if (existingProgramme) {
    console.log('✨ Demo programme already exists!');
    console.log(`   ID: ${existingProgramme.id}`);
    console.log(`   Name: ${existingProgramme.name}`);
    console.log(`   Slug: ${existingProgramme.slug}`);
    console.log('\n💡 Programme already seeded. No action needed.');
    process.exit(0);
  }

  console.log('✅ Programme does not exist yet\n');

  // Find Lyon ville
  console.log('🔍 Looking up Lyon (ville)...');
  const lyon = await client.findVilleBySlug('lyon');

  if (!lyon) {
    throw new Error(
      'Lyon not found in CJeanbrunVille. Please seed cities first.'
    );
  }

  console.log(`✅ Found Lyon (ID: ${lyon.id}, Zone: ${lyon.zoneFiscale})\n`);

  // Prepare programme data
  const typesLots = Array.from(
    new Set(DEMO_LOTS.map(lot => lot.type))
  ).sort();

  const programmeData: Omit<EspoCRMProgramme, 'id'> = {
    name: 'Les Jardins du Parc - Lyon 3eme',
    promoteur: 'Demo Promoteur',
    adresse: '45 rue de la Republique',
    codePostal: '69003',
    villeId: lyon.id,
    prixMin: Math.min(...DEMO_LOTS.map(l => l.prix)),
    prixMax: Math.max(...DEMO_LOTS.map(l => l.prix)),
    prixM2Moyen: 4800,
    surfaceMin: Math.min(...DEMO_LOTS.map(l => l.surface)),
    surfaceMax: Math.max(...DEMO_LOTS.map(l => l.surface)),
    dateLivraison: '2027-06-01',
    imagePrincipale: null,
    nbLotsTotal: 48,
    nbLotsDisponibles: 32,
    typesLots: JSON.stringify(typesLots),
    zoneFiscale: lyon.zoneFiscale,
    eligibleJeanbrun: true,
    eligiblePtz: true,
    authorized: true,
    slug: 'les-jardins-du-parc-lyon-3eme',
    statut: 'disponible',
    siteWeb: null,
    telephone: null,
    specialOffers: JSON.stringify(SPECIAL_OFFERS),
    lotsDetails: JSON.stringify(DEMO_LOTS),
  };

  // Create programme
  console.log('🚀 Creating programme in EspoCRM...');
  const createdProgramme = await client.createProgramme(programmeData);

  console.log('✅ Programme created successfully!\n');
  console.log('📋 Programme Details:');
  console.log(`   ID: ${createdProgramme.id}`);
  console.log(`   Name: ${createdProgramme.name}`);
  console.log(`   Slug: ${createdProgramme.slug}`);
  console.log(`   Promoteur: ${createdProgramme.promoteur}`);
  console.log(`   Ville: ${lyon.name} (${createdProgramme.villeId})`);
  console.log(`   Zone Fiscale: ${createdProgramme.zoneFiscale}`);
  console.log(`   Prix: ${createdProgramme.prixMin.toLocaleString('fr-FR')}€ - ${createdProgramme.prixMax.toLocaleString('fr-FR')}€`);
  console.log(`   Surface: ${createdProgramme.surfaceMin}m² - ${createdProgramme.surfaceMax}m²`);
  console.log(`   Lots: ${createdProgramme.nbLotsDisponibles}/${createdProgramme.nbLotsTotal} disponibles`);
  console.log(`   Types: ${typesLots.join(', ')}`);
  console.log(`   Livraison: ${createdProgramme.dateLivraison}`);
  console.log(`   Eligible Jeanbrun: ${createdProgramme.eligibleJeanbrun ? 'Oui' : 'Non'}`);
  console.log(`   Eligible PTZ: ${createdProgramme.eligiblePtz ? 'Oui' : 'Non'}`);
  console.log(`   Statut: ${createdProgramme.statut}`);
  console.log('\n🎉 Demo programme seeded successfully!');
}

// ============================================================================
// Script Entry Point
// ============================================================================

main().catch((error) => {
  console.error('\n❌ Seeding failed:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
