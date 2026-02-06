/**
 * Lead Dispatch Orchestrator
 *
 * Queries the database for matching partners, sends notification emails,
 * and updates lead records. Called asynchronously (fire-and-forget) after
 * a new lead is created via POST /api/leads.
 *
 * This module is the "glue" between:
 * - @repo/leads (pure dispatch logic)
 * - @repo/database (Drizzle ORM)
 * - email.ts (Mailjet integration)
 */

import { db, eq } from "@repo/database";
import { leads, promoters, brokers } from "@repo/database/schema";
import {
  findMatchingPromoter,
  findMatchingBroker,
  extractZoneFromSimulation,
  extractPromoterPayload,
  extractBrokerPayload,
  extractProspectConfirmationPayload,
  type PromoterNotificationPayload,
  type BrokerNotificationPayload,
  type ProspectConfirmationPayload,
} from "@repo/leads";
import { sendEmail } from "./email";
import { createLogger } from "./logger";

const dispatchLogger = createLogger("lead-dispatch");

// ============================================================================
// Main dispatch function
// ============================================================================

/**
 * Dispatch a newly created lead to matching promoter and/or broker.
 *
 * Called asynchronously after lead creation (fire-and-forget).
 * Errors are logged but never thrown to avoid breaking the lead creation flow.
 *
 * Steps:
 * 1. Fetch the lead from DB
 * 2. If consentPromoter, find matching promoter by zone, send email, update lead
 * 3. If consentBroker, find matching broker by zone, send email, update lead
 * 4. If either dispatched, update lead status to "dispatched"
 * 5. Send prospect confirmation email
 */
export async function dispatchLead(leadId: string): Promise<void> {
  try {
    dispatchLogger.info({ leadId }, "Starting lead dispatch");

    // 1. Fetch the lead from DB
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) {
      dispatchLogger.error({ leadId }, "Lead not found in database");
      return;
    }

    const simulationData = (lead.simulationData as Record<string, unknown>) ?? {};
    const zone = extractZoneFromSimulation(simulationData);

    if (!zone) {
      dispatchLogger.warn(
        { leadId },
        "No valid zone found in simulation data - skipping partner dispatch"
      );
    }

    let promoterDispatched = false;
    let brokerDispatched = false;

    // 2. Dispatch to promoter if consented
    if (lead.consentPromoter && zone) {
      promoterDispatched = await dispatchToPromoter(lead, simulationData, zone);
    }

    // 3. Dispatch to broker if consented
    if (lead.consentBroker && zone) {
      brokerDispatched = await dispatchToBroker(lead, simulationData, zone);
    }

    // 4. Update lead status to "dispatched" if at least one partner was notified
    if (promoterDispatched || brokerDispatched) {
      await db
        .update(leads)
        .set({ status: "dispatched" })
        .where(eq(leads.id, leadId));

      dispatchLogger.info(
        {
          leadId,
          promoterDispatched,
          brokerDispatched,
        },
        "Lead status updated to dispatched"
      );
    }

    // 5. Send prospect confirmation email
    await sendProspectConfirmationEmail(lead, simulationData);

    dispatchLogger.info({ leadId }, "Lead dispatch completed");
  } catch (error) {
    // Fire-and-forget: log the error but never throw
    dispatchLogger.error(
      { leadId, err: error },
      "Lead dispatch failed unexpectedly"
    );
  }
}

// ============================================================================
// Promoter dispatch
// ============================================================================

interface LeadRecord {
  id: string;
  email: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  consentPromoter: boolean;
  consentBroker: boolean;
}

async function dispatchToPromoter(
  lead: LeadRecord,
  simulationData: Record<string, unknown>,
  zone: string
): Promise<boolean> {
  try {
    // Fetch all active promoters
    const activePromoters = await db
      .select({
        id: promoters.id,
        zones: promoters.zones,
        active: promoters.active,
        contactEmail: promoters.contactEmail,
        contactName: promoters.contactName,
        name: promoters.name,
      })
      .from(promoters)
      .where(eq(promoters.active, true));

    const match = findMatchingPromoter(zone, activePromoters);

    if (!match) {
      dispatchLogger.warn(
        { leadId: lead.id, zone },
        "No matching promoter found for zone"
      );
      return false;
    }

    // Get the full promoter record for the matched ID
    const matchedPromoter = activePromoters.find((p) => p.id === match.id);
    if (!matchedPromoter) return false;

    // Build payload
    const payload = extractPromoterPayload(lead, simulationData);

    // Send notification email
    const emailSent = await sendEmail({
      to: matchedPromoter.contactEmail,
      subject: `[Nouveau Lead] ${payload.leadPrenom} ${payload.leadNom} - Zone ${payload.zone}`,
      htmlContent: buildPromoterEmailHtml(payload, matchedPromoter.contactName),
    });

    if (!emailSent) {
      dispatchLogger.error(
        { leadId: lead.id, promoterId: match.id },
        "Failed to send promoter notification email"
      );
      return false;
    }

    // Update lead with matched promoter and dispatch timestamp
    await db
      .update(leads)
      .set({
        promoterId: match.id,
        dispatchedPromoterAt: new Date(),
      })
      .where(eq(leads.id, lead.id));

    dispatchLogger.info(
      { leadId: lead.id, promoterId: match.id, zone },
      "Lead dispatched to promoter"
    );

    return true;
  } catch (error) {
    dispatchLogger.error(
      { leadId: lead.id, err: error },
      "Promoter dispatch failed"
    );
    return false;
  }
}

// ============================================================================
// Broker dispatch
// ============================================================================

async function dispatchToBroker(
  lead: LeadRecord,
  simulationData: Record<string, unknown>,
  zone: string
): Promise<boolean> {
  try {
    // Fetch all active brokers
    const activeBrokers = await db
      .select({
        id: brokers.id,
        zones: brokers.zones,
        active: brokers.active,
        contactEmail: brokers.contactEmail,
        contactName: brokers.contactName,
        name: brokers.name,
      })
      .from(brokers)
      .where(eq(brokers.active, true));

    const match = findMatchingBroker(zone, activeBrokers);

    if (!match) {
      dispatchLogger.warn(
        { leadId: lead.id, zone },
        "No matching broker found for zone"
      );
      return false;
    }

    // Get the full broker record for the matched ID
    const matchedBroker = activeBrokers.find((b) => b.id === match.id);
    if (!matchedBroker) return false;

    // Build payload
    const payload = extractBrokerPayload(lead, simulationData);

    // Send notification email
    const emailSent = await sendEmail({
      to: matchedBroker.contactEmail,
      subject: `[Nouveau Lead Financement] ${payload.leadPrenom} ${payload.leadNom} - Zone ${payload.zone}`,
      htmlContent: buildBrokerEmailHtml(payload, matchedBroker.contactName),
    });

    if (!emailSent) {
      dispatchLogger.error(
        { leadId: lead.id, brokerId: match.id },
        "Failed to send broker notification email"
      );
      return false;
    }

    // Update lead with matched broker and dispatch timestamp
    await db
      .update(leads)
      .set({
        brokerId: match.id,
        dispatchedBrokerAt: new Date(),
      })
      .where(eq(leads.id, lead.id));

    dispatchLogger.info(
      { leadId: lead.id, brokerId: match.id, zone },
      "Lead dispatched to broker"
    );

    return true;
  } catch (error) {
    dispatchLogger.error(
      { leadId: lead.id, err: error },
      "Broker dispatch failed"
    );
    return false;
  }
}

// ============================================================================
// Prospect confirmation
// ============================================================================

async function sendProspectConfirmationEmail(
  lead: LeadRecord,
  simulationData: Record<string, unknown>
): Promise<void> {
  try {
    const payload = extractProspectConfirmationPayload(lead, simulationData);

    const emailSent = await sendEmail({
      to: payload.prospectEmail,
      subject: "Votre simulation Loi Jeanbrun - Confirmation",
      htmlContent: buildProspectConfirmationHtml(payload),
    });

    if (!emailSent) {
      dispatchLogger.error(
        { leadId: lead.id },
        "Failed to send prospect confirmation email"
      );
    } else {
      dispatchLogger.info(
        { leadId: lead.id },
        "Prospect confirmation email sent"
      );
    }
  } catch (error) {
    dispatchLogger.error(
      { leadId: lead.id, err: error },
      "Prospect confirmation email failed"
    );
  }
}

// ============================================================================
// Email HTML builders (inline templates)
// ============================================================================

const EMAIL_STYLES = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; }
  .header { background: #1e40af; color: #ffffff; padding: 24px; border-radius: 8px 8px 0 0; }
  .header h1 { margin: 0; font-size: 20px; }
  .body { padding: 24px; }
  .field { margin-bottom: 12px; }
  .label { font-weight: 600; color: #374151; }
  .value { color: #1a1a1a; }
  .highlight { background: #eff6ff; border-left: 4px solid #1e40af; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0; }
  .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
  .cta { display: inline-block; padding: 12px 24px; background: #1e40af; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 16px; }
`;

function buildPromoterEmailHtml(
  payload: PromoterNotificationPayload,
  contactName: string
): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>${EMAIL_STYLES}</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>Nouveau lead qualifie - Simulateur Loi Jeanbrun</h1>
  </div>
  <div class="body">
    <p>Bonjour ${escapeHtml(contactName)},</p>
    <p>Un nouveau prospect qualifie correspond a votre zone d'intervention :</p>

    <div class="highlight">
      <div class="field"><span class="label">Zone fiscale :</span> <span class="value">${escapeHtml(payload.zone)}</span></div>
      <div class="field"><span class="label">Budget :</span> <span class="value">${escapeHtml(payload.budget)}</span></div>
      <div class="field"><span class="label">Economie fiscale estimee :</span> <span class="value">${escapeHtml(payload.economieFiscale)}</span></div>
      <div class="field"><span class="label">Rendement net :</span> <span class="value">${escapeHtml(payload.rendementNet)}</span></div>
    </div>

    <h3>Coordonnees du prospect</h3>
    <div class="field"><span class="label">Nom :</span> <span class="value">${escapeHtml(payload.leadPrenom)} ${escapeHtml(payload.leadNom)}</span></div>
    <div class="field"><span class="label">Email :</span> <span class="value">${escapeHtml(payload.leadEmail)}</span></div>
    <div class="field"><span class="label">Telephone :</span> <span class="value">${escapeHtml(payload.leadTelephone)}</span></div>

    <h3>Details simulation</h3>
    <div class="field"><span class="label">TMI :</span> <span class="value">${escapeHtml(payload.tmi)}</span></div>
    <div class="field"><span class="label">Type de bien :</span> <span class="value">${escapeHtml(payload.typeBien)}</span></div>

    <p>Nous vous recommandons de contacter ce prospect dans les <strong>24 heures</strong> pour maximiser les chances de conversion.</p>

    <div class="footer">
      <p>Ce lead a ete genere par le Simulateur Loi Jeanbrun. Le prospect a expressement consenti a etre contacte par un promoteur immobilier.</p>
      <p>&copy; ${new Date().getFullYear()} Simulateur Loi Jeanbrun</p>
    </div>
  </div>
</div>
</body>
</html>`;
}

function buildBrokerEmailHtml(
  payload: BrokerNotificationPayload,
  contactName: string
): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>${EMAIL_STYLES}</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>Nouveau lead financement - Simulateur Loi Jeanbrun</h1>
  </div>
  <div class="body">
    <p>Bonjour ${escapeHtml(contactName)},</p>
    <p>Un nouveau prospect recherche un financement dans votre zone :</p>

    <div class="highlight">
      <div class="field"><span class="label">Zone fiscale :</span> <span class="value">${escapeHtml(payload.zone)}</span></div>
      <div class="field"><span class="label">Budget investissement :</span> <span class="value">${escapeHtml(payload.budget)}</span></div>
      <div class="field"><span class="label">Revenu mensuel :</span> <span class="value">${escapeHtml(payload.revenuMensuel)}</span></div>
      <div class="field"><span class="label">Apport :</span> <span class="value">${escapeHtml(payload.apport)}</span></div>
    </div>

    <h3>Coordonnees du prospect</h3>
    <div class="field"><span class="label">Nom :</span> <span class="value">${escapeHtml(payload.leadPrenom)} ${escapeHtml(payload.leadNom)}</span></div>
    <div class="field"><span class="label">Email :</span> <span class="value">${escapeHtml(payload.leadEmail)}</span></div>
    <div class="field"><span class="label">Telephone :</span> <span class="value">${escapeHtml(payload.leadTelephone)}</span></div>

    <h3>Profil financier</h3>
    <div class="field"><span class="label">Capacite d'emprunt :</span> <span class="value">${escapeHtml(payload.capaciteEmprunt)}</span></div>
    <div class="field"><span class="label">Taux d'endettement :</span> <span class="value">${escapeHtml(payload.tauxEndettement)}</span></div>
    <div class="field"><span class="label">Duree credit souhaitee :</span> <span class="value">${escapeHtml(payload.dureeCredit)}</span></div>

    <p>Nous vous recommandons de contacter ce prospect dans les <strong>24 heures</strong> pour maximiser les chances de conversion.</p>

    <div class="footer">
      <p>Ce lead a ete genere par le Simulateur Loi Jeanbrun. Le prospect a expressement consenti a etre contacte par un courtier en credit.</p>
      <p>&copy; ${new Date().getFullYear()} Simulateur Loi Jeanbrun</p>
    </div>
  </div>
</div>
</body>
</html>`;
}

function buildProspectConfirmationHtml(
  payload: ProspectConfirmationPayload
): string {
  const partnerLines: string[] = [];
  if (payload.consentPromoter) {
    partnerLines.push(
      "Un <strong>promoteur immobilier</strong> specialise dans votre zone vous contactera prochainement."
    );
  }
  if (payload.consentBroker) {
    partnerLines.push(
      "Un <strong>courtier en credit</strong> vous proposera les meilleures conditions de financement."
    );
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>${EMAIL_STYLES}</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>Votre simulation Loi Jeanbrun</h1>
  </div>
  <div class="body">
    <p>Bonjour ${escapeHtml(payload.prospectPrenom)},</p>
    <p>Merci d'avoir utilise notre simulateur. Voici un recapitulatif de votre simulation :</p>

    <div class="highlight">
      <div class="field"><span class="label">Zone fiscale :</span> <span class="value">${escapeHtml(payload.zone)}</span></div>
      <div class="field"><span class="label">Economie fiscale estimee :</span> <span class="value">${escapeHtml(payload.economieFiscale)}</span></div>
      <div class="field"><span class="label">Rendement net :</span> <span class="value">${escapeHtml(payload.rendementNet)}</span></div>
    </div>

    <h3>Prochaines etapes</h3>
    ${partnerLines.map((line) => `<p>${line}</p>`).join("\n    ")}

    <p>Si vous avez des questions, n'hesitez pas a repondre a cet email.</p>

    <div class="footer">
      <p>Conformement au RGPD, vous pouvez a tout moment retirer votre consentement en nous contactant.</p>
      <p>&copy; ${new Date().getFullYear()} Simulateur Loi Jeanbrun</p>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ============================================================================
// HTML escaping
// ============================================================================

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}
