/**
 * Lead Dispatch Service
 *
 * Contains the pure LOGIC for matching leads to promoters/brokers based on
 * zone fiscale. This module is intentionally free of I/O (no DB, no email)
 * so it can be tested in isolation and reused across platforms.
 *
 * The app layer (lead-dispatch.ts) orchestrates DB queries, email sending,
 * and status updates using these pure functions.
 */

// ============================================================================
// Payload Interfaces
// ============================================================================

export interface PromoterNotificationPayload {
  leadPrenom: string;
  leadNom: string;
  leadEmail: string;
  leadTelephone: string;
  zone: string;
  budget: string;
  tmi: string;
  typeBien: string;
  economieFiscale: string;
  rendementNet: string;
}

export interface BrokerNotificationPayload {
  leadPrenom: string;
  leadNom: string;
  leadEmail: string;
  leadTelephone: string;
  revenuMensuel: string;
  apport: string;
  budget: string;
  zone: string;
  capaciteEmprunt: string;
  tauxEndettement: string;
  dureeCredit: string;
}

export interface ProspectConfirmationPayload {
  prospectEmail: string;
  prospectPrenom: string;
  economieFiscale: string;
  rendementNet: string;
  zone: string;
  consentPromoter: boolean;
  consentBroker: boolean;
}

// ============================================================================
// Partner matching types
// ============================================================================

interface PartnerCandidate {
  id: string;
  zones: string[];
  active: boolean;
}

// ============================================================================
// Zone Matching
// ============================================================================

/** Zone priority order (most competitive first) */
const ZONE_PRIORITY: readonly string[] = ["A_BIS", "A", "B1", "B2", "C"];

/**
 * Find the best matching promoter for a lead based on zone fiscale.
 *
 * Matching rules:
 * 1. Only considers active promoters
 * 2. Exact zone match preferred
 * 3. If multiple promoters match the same zone, returns the first one
 *    (caller is responsible for shuffling/rotating if needed)
 * 4. Returns null if no active promoter covers the zone
 */
export function findMatchingPromoter(
  leadZone: string,
  promoters: readonly PartnerCandidate[]
): { id: string } | null {
  return findMatchingPartner(leadZone, promoters);
}

/**
 * Find the best matching broker for a lead based on zone fiscale.
 *
 * Same matching rules as findMatchingPromoter.
 */
export function findMatchingBroker(
  leadZone: string,
  brokers: readonly PartnerCandidate[]
): { id: string } | null {
  return findMatchingPartner(leadZone, brokers);
}

/**
 * Generic partner matching by zone.
 * Filters active partners, then finds first with exact zone match.
 */
function findMatchingPartner(
  leadZone: string,
  partners: readonly PartnerCandidate[]
): { id: string } | null {
  const normalizedZone = leadZone.toUpperCase().trim();

  const activePartners = partners.filter((p) => p.active);
  if (activePartners.length === 0) return null;

  // Exact zone match
  const exactMatch = activePartners.find((p) =>
    p.zones.some((z) => z.toUpperCase().trim() === normalizedZone)
  );

  if (exactMatch) return { id: exactMatch.id };

  // Fallback: find a partner covering a "nearby" zone (one step up/down)
  const zoneIndex = ZONE_PRIORITY.indexOf(normalizedZone);
  if (zoneIndex === -1) return null;

  // Try adjacent zones (prefer higher priority = lower index)
  const adjacentZones = [
    zoneIndex > 0 ? ZONE_PRIORITY[zoneIndex - 1] : undefined,
    zoneIndex < ZONE_PRIORITY.length - 1
      ? ZONE_PRIORITY[zoneIndex + 1]
      : undefined,
  ].filter((z): z is string => z !== undefined);

  for (const adjacentZone of adjacentZones) {
    const adjacentMatch = activePartners.find((p) =>
      p.zones.some((z) => z.toUpperCase().trim() === adjacentZone)
    );
    if (adjacentMatch) return { id: adjacentMatch.id };
  }

  return null;
}

// ============================================================================
// Zone Extraction
// ============================================================================

/** Valid zone values */
const VALID_ZONES = new Set(["A_BIS", "A", "B1", "B2", "C"]);

/**
 * Extract zone fiscale from simulation data (JSONB).
 *
 * Looks for the zone in multiple possible field names:
 * - zoneFiscale
 * - zone
 * - zoneGeographique
 *
 * Returns null if not found or invalid.
 */
export function extractZoneFromSimulation(
  simulationData: Record<string, unknown>
): string | null {
  const candidates = [
    simulationData.zoneFiscale,
    simulationData.zone,
    simulationData.zoneGeographique,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const normalized = candidate.toUpperCase().trim().replace(/-/g, "_");
      if (VALID_ZONES.has(normalized)) return normalized;
    }
  }

  return null;
}

// ============================================================================
// Payload Extraction
// ============================================================================

/**
 * Format a number as French currency (e.g., "250 000 EUR").
 * Returns "Non renseigne" for undefined/null/NaN values.
 */
export function formatFrenchCurrency(value: unknown): string {
  if (value === undefined || value === null) return "Non renseigne";
  const num = Number(value);
  if (!Number.isFinite(num)) return "Non renseigne";
  return `${num.toLocaleString("fr-FR")} EUR`;
}

/**
 * Format a number as a percentage (e.g., "3.8%").
 * Returns "Non renseigne" for undefined/null/NaN values.
 */
export function formatPercentage(value: unknown): string {
  if (value === undefined || value === null) return "Non renseigne";
  const num = Number(value);
  if (!Number.isFinite(num)) return "Non renseigne";
  return `${num.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}%`;
}

/**
 * Safely extract a string from unknown data, with a fallback.
 */
function safeString(value: unknown, fallback: string = "Non renseigne"): string {
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  return fallback;
}

/**
 * Format a zone code for display (e.g., "A_BIS" -> "A bis").
 */
function formatZoneDisplay(zone: string): string {
  const map: Record<string, string> = {
    A_BIS: "A bis",
    A: "A",
    B1: "B1",
    B2: "B2",
    C: "C",
  };
  return map[zone.toUpperCase()] ?? zone;
}

interface LeadContactInfo {
  prenom: string | null;
  nom: string | null;
  email: string;
  telephone: string | null;
}

/**
 * Extract promoter notification payload from lead + simulation data.
 *
 * Maps simulation JSONB fields to a structured payload for email templates.
 */
export function extractPromoterPayload(
  lead: LeadContactInfo,
  simulationData: Record<string, unknown>
): PromoterNotificationPayload {
  const zone = extractZoneFromSimulation(simulationData);

  return {
    leadPrenom: lead.prenom ?? "Non renseigne",
    leadNom: lead.nom ?? "Non renseigne",
    leadEmail: lead.email,
    leadTelephone: lead.telephone ?? "Non renseigne",
    zone: zone ? formatZoneDisplay(zone) : "Non renseigne",
    budget: formatFrenchCurrency(
      simulationData.montantInvestissement ?? simulationData.budget
    ),
    tmi: formatPercentage(simulationData.tmi ?? simulationData.trancheMarginalImposition),
    typeBien: safeString(simulationData.typeBien ?? simulationData.typeLogement),
    economieFiscale: formatFrenchCurrency(
      simulationData.economieFiscale ??
        simulationData.economieImpots ??
        simulationData.economieImpots10Ans
    ),
    rendementNet: formatPercentage(
      simulationData.rendementNet ?? simulationData.rendementNetNet
    ),
  };
}

/**
 * Extract broker notification payload from lead + simulation data.
 *
 * Maps simulation JSONB fields to a structured payload for email templates.
 */
export function extractBrokerPayload(
  lead: LeadContactInfo,
  simulationData: Record<string, unknown>
): BrokerNotificationPayload {
  const zone = extractZoneFromSimulation(simulationData);

  return {
    leadPrenom: lead.prenom ?? "Non renseigne",
    leadNom: lead.nom ?? "Non renseigne",
    leadEmail: lead.email,
    leadTelephone: lead.telephone ?? "Non renseigne",
    revenuMensuel: formatFrenchCurrency(
      simulationData.revenuMensuel ?? simulationData.revenusMensuels
    ),
    apport: formatFrenchCurrency(simulationData.apport ?? simulationData.apportPersonnel),
    budget: formatFrenchCurrency(
      simulationData.montantInvestissement ?? simulationData.budget
    ),
    zone: zone ? formatZoneDisplay(zone) : "Non renseigne",
    capaciteEmprunt: formatFrenchCurrency(
      simulationData.capaciteEmprunt ?? simulationData.capaciteFinancement
    ),
    tauxEndettement: formatPercentage(
      simulationData.tauxEndettement ?? simulationData.endettement
    ),
    dureeCredit: safeString(
      simulationData.dureeCredit ?? simulationData.dureeEmprunt,
      "Non renseigne"
    ),
  };
}

/**
 * Build the prospect confirmation payload from lead data + simulation.
 */
export function extractProspectConfirmationPayload(
  lead: LeadContactInfo & {
    consentPromoter: boolean;
    consentBroker: boolean;
  },
  simulationData: Record<string, unknown>
): ProspectConfirmationPayload {
  const zone = extractZoneFromSimulation(simulationData);

  return {
    prospectEmail: lead.email,
    prospectPrenom: lead.prenom ?? "Prospect",
    economieFiscale: formatFrenchCurrency(
      simulationData.economieFiscale ??
        simulationData.economieImpots ??
        simulationData.economieImpots10Ans
    ),
    rendementNet: formatPercentage(
      simulationData.rendementNet ?? simulationData.rendementNetNet
    ),
    zone: zone ? formatZoneDisplay(zone) : "Non renseigne",
    consentPromoter: lead.consentPromoter,
    consentBroker: lead.consentBroker,
  };
}
