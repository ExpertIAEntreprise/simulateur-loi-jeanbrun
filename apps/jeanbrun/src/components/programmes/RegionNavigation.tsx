/**
 * Navigation par region - Server Component
 *
 * Affiche tous les programmes groupes par region > departement > ville
 * en accordeons imbriques avec compteurs et liens vers /villes/{slug}
 *
 * Donnees:
 * - Fetch tous les programmes (EspoCRM) pour compter par ville
 * - Fetch toutes les villes (EspoCRM) pour slugs et codes postaux
 * - Mapping codePostal -> departement -> region via regions-mapping.ts
 *
 * @see Phase 7 du plan page-programme
 */

import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  getEspoCRMClient,
  type EspoVille,
  type EspoProgramme,
} from "@/lib/espocrm";
import {
  getCodeDepartement,
  DEPARTEMENT_TO_REGION,
  DEPARTEMENT_NAMES,
} from "@/lib/geo/regions-mapping";

/* ------------------------------------------------------------------ */
/*  Types internes                                                     */
/* ------------------------------------------------------------------ */

interface VilleInfo {
  name: string;
  slug: string;
  nbProgrammes: number;
}

interface DepartementInfo {
  code: string;
  name: string;
  nbProgrammes: number;
  villes: VilleInfo[];
}

interface RegionInfo {
  name: string;
  nbProgrammes: number;
  departements: DepartementInfo[];
}

/* ------------------------------------------------------------------ */
/*  Data fetching (server-side, ISR cache 1h)                          */
/* ------------------------------------------------------------------ */

async function fetchAllProgrammes(): Promise<EspoProgramme[]> {
  const client = getEspoCRMClient();
  const all: EspoProgramme[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await client.getProgrammes({ authorized: true }, { limit, offset });
    all.push(...response.list);
    hasMore = response.list.length >= limit;
    offset += limit;
  }

  return all;
}

async function fetchAllVilles(): Promise<EspoVille[]> {
  const client = getEspoCRMClient();
  const all: EspoVille[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await client.getVilles(undefined, { limit, offset });
    all.push(...response.list);
    hasMore = response.list.length >= limit;
    offset += limit;
  }

  return all;
}

/* ------------------------------------------------------------------ */
/*  Hierarchy builder                                                  */
/* ------------------------------------------------------------------ */

type DeptData = { name: string; villes: VilleInfo[] };

function buildRegionHierarchy(
  programmes: readonly EspoProgramme[],
  villes: readonly EspoVille[],
): RegionInfo[] {
  // Map villeId -> { slug, codePostal, name }
  const villeMap = new Map<
    string,
    { slug: string; codePostal: string; name: string }
  >();
  for (const v of villes) {
    if (v.slug && v.codePostal) {
      villeMap.set(v.id, {
        slug: v.slug,
        codePostal: v.codePostal,
        name: v.name,
      });
    }
  }

  // Count programmes per villeId
  const programmeCount = new Map<string, number>();
  for (const p of programmes) {
    programmeCount.set(p.villeId, (programmeCount.get(p.villeId) ?? 0) + 1);
  }

  // Build region -> dept -> villes hierarchy
  const regionMap = new Map<string, Map<string, DeptData>>();

  for (const [villeId, count] of programmeCount) {
    const ville = villeMap.get(villeId);
    if (!ville) continue;

    const deptCode = getCodeDepartement(ville.codePostal);
    const regionName = DEPARTEMENT_TO_REGION[deptCode];
    const deptName = DEPARTEMENT_NAMES[deptCode];
    if (!regionName || !deptName) continue;

    let deptMap = regionMap.get(regionName);
    if (!deptMap) {
      deptMap = new Map<string, DeptData>();
      regionMap.set(regionName, deptMap);
    }

    let dept = deptMap.get(deptCode);
    if (!dept) {
      dept = { name: deptName, villes: [] };
      deptMap.set(deptCode, dept);
    }

    dept.villes.push({
      name: ville.name,
      slug: ville.slug,
      nbProgrammes: count,
    });
  }

  // Convert to sorted arrays
  const regions: RegionInfo[] = [];

  for (const [regionName, deptMap] of regionMap) {
    const departements: DepartementInfo[] = [];

    for (const [code, data] of deptMap) {
      const sortedVilles = [...data.villes].sort((a, b) =>
        a.name.localeCompare(b.name, "fr"),
      );
      departements.push({
        code,
        name: data.name,
        nbProgrammes: sortedVilles.reduce((s, v) => s + v.nbProgrammes, 0),
        villes: sortedVilles,
      });
    }

    departements.sort((a, b) => a.name.localeCompare(b.name, "fr"));

    regions.push({
      name: regionName,
      nbProgrammes: departements.reduce((s, d) => s + d.nbProgrammes, 0),
      departements,
    });
  }

  regions.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return regions;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export async function RegionNavigation() {
  let regions: RegionInfo[] = [];

  try {
    const [programmes, villes] = await Promise.all([
      fetchAllProgrammes(),
      fetchAllVilles(),
    ]);
    regions = buildRegionHierarchy(programmes, villes);
  } catch (error) {
    console.error("Erreur chargement navigation region:", error);
    return null;
  }

  if (regions.length === 0) return null;

  const totalProgrammes = regions.reduce((s, r) => s + r.nbProgrammes, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Programmes par region</h3>
        <Badge variant="secondary">
          {totalProgrammes} programme{totalProgrammes > 1 ? "s" : ""}
        </Badge>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {regions.map((region) => (
          <AccordionItem key={region.name} value={region.name}>
            <AccordionTrigger className="text-base">
              <span className="flex items-center gap-2">
                {region.name}
                <Badge variant="outline" className="text-xs font-normal">
                  {region.nbProgrammes}
                </Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full pl-4">
                {region.departements.map((dept) => (
                  <AccordionItem key={dept.code} value={dept.code}>
                    <AccordionTrigger className="text-sm">
                      <span className="flex items-center gap-2">
                        {dept.name} ({dept.code})
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {dept.nbProgrammes}
                        </Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-4">
                        {dept.villes.map((ville) => (
                          <li key={ville.slug}>
                            <Link
                              href={`/villes/${ville.slug}`}
                              aria-label={`${ville.name} - ${ville.nbProgrammes} programme${ville.nbProgrammes > 1 ? "s" : ""}`}
                              className="group inline-flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <MapPin
                                className="size-3.5 text-muted-foreground group-hover:text-primary"
                                aria-hidden="true"
                              />
                              {ville.name}
                              <Badge
                                variant="secondary"
                                className="text-xs font-normal"
                              >
                                {ville.nbProgrammes} prog.
                              </Badge>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
