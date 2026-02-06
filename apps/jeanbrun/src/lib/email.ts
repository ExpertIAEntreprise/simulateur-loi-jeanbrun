import Mailjet from "node-mailjet";
import { emailLogger } from "@/lib/logger";

// Type for email sending
interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

// Get Mailjet client (lazy initialization)
function getMailjetClient(): Mailjet | null {
  const apiKey = process.env.MAILJET_API_KEY;
  const apiSecret = process.env.MAILJET_API_SECRET;

  if (!apiKey || !apiSecret) {
    return null;
  }

  return new Mailjet({ apiKey, apiSecret });
}

/**
 * Send an email via Mailjet.
 * Falls back to console logging in development if Mailjet is not configured.
 */
export async function sendEmail({
  to,
  subject,
  htmlContent,
  textContent,
}: SendEmailParams): Promise<boolean> {
  const client = getMailjetClient();
  const fromEmail = process.env.MAILJET_FROM_EMAIL || "noreply@example.com";
  const fromName = process.env.MAILJET_FROM_NAME || "Simulateur Loi Jeanbrun";

  // In development without Mailjet config, log instead of sending
  if (!client) {
    if (process.env.NODE_ENV === "development") {
      emailLogger.debug({ subject, hasContent: !!htmlContent }, "DEV EMAIL - Not sent (Mailjet not configured)");
      return true;
    }
    emailLogger.error("Mailjet not configured");
    return false;
  }

  try {
    await client.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [{ Email: to }],
          Subject: subject,
          TextPart: textContent || "",
          HTMLPart: htmlContent,
        },
      ],
    });
    return true;
  } catch (error) {
    emailLogger.error({ err: error }, "Failed to send email via Mailjet");
    return false;
  }
}

/**
 * Send password reset email.
 * URL is NOT logged - only a confirmation that email was sent.
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<boolean> {
  const appName = "Simulateur Loi Jeanbrun";

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Réinitialisation de votre mot de passe</h1>
    <p>Vous avez demandé à réinitialiser votre mot de passe sur ${appName}.</p>
    <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
    <p><a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a></p>
    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    <p>Ce lien expire dans 1 heure.</p>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${appName} - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
`;

  const textContent = `
Réinitialisation de votre mot de passe

Vous avez demandé à réinitialiser votre mot de passe sur ${appName}.

Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :
${resetUrl}

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
Ce lien expire dans 1 heure.

© ${new Date().getFullYear()} ${appName}
`;

  return sendEmail({
    to: email,
    subject: `[${appName}] Réinitialisation de votre mot de passe`,
    htmlContent,
    textContent,
  });
}

/**
 * Send email verification email.
 * URL is NOT logged - only a confirmation that email was sent.
 */
export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
): Promise<boolean> {
  const appName = "Simulateur Loi Jeanbrun";

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bienvenue sur ${appName} !</h1>
    <p>Merci de vous être inscrit. Pour finaliser la création de votre compte, veuillez confirmer votre adresse email.</p>
    <p><a href="${verificationUrl}" class="button">Confirmer mon email</a></p>
    <p>Si vous n'avez pas créé de compte sur ${appName}, ignorez cet email.</p>
    <p>Ce lien expire dans 24 heures.</p>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${appName} - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
`;

  const textContent = `
Bienvenue sur ${appName} !

Merci de vous être inscrit. Pour finaliser la création de votre compte, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :

${verificationUrl}

Si vous n'avez pas créé de compte sur ${appName}, ignorez cet email.
Ce lien expire dans 24 heures.

© ${new Date().getFullYear()} ${appName}
`;

  return sendEmail({
    to: email,
    subject: `[${appName}] Confirmez votre adresse email`,
    htmlContent,
    textContent,
  });
}

// ============================================================================
// Lead Notification Emails
// ============================================================================

interface PromoterLeadEmailParams {
  promoterEmail: string;
  promoterName: string;
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

/**
 * Send lead notification to promoter partner.
 */
export async function sendPromoterLeadNotification({
  promoterEmail,
  promoterName,
  leadPrenom,
  leadNom,
  leadEmail,
  leadTelephone,
  zone,
  budget,
  tmi,
  typeBien,
  economieFiscale,
  rendementNet,
}: PromoterLeadEmailParams): Promise<boolean> {
  const appName = "Simulateur Loi Jeanbrun";

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f6f9fc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .email-wrapper { background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #059669; font-size: 24px; margin: 0 0 10px 0; }
    .lead-info { background-color: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .lead-info h2 { color: #059669; font-size: 18px; margin: 0 0 10px 0; }
    .lead-info p { margin: 5px 0; }
    .simulation-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .simulation-table th { background-color: #f0fdf4; color: #059669; text-align: left; padding: 12px; border-bottom: 2px solid #059669; }
    .simulation-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .simulation-table tr:last-child td { border-bottom: none; }
    .highlight { background-color: #ecfdf5; font-weight: 600; }
    .message-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; padding: 14px 28px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .button:hover { background-color: #047857; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>✨ Nouveau prospect qualifié</h1>
        <p style="color: #666; margin: 0;">Bonjour ${promoterName},</p>
      </div>

      <div class="lead-info">
        <h2>📋 Coordonnées du prospect</h2>
        <p><strong>Nom :</strong> ${leadPrenom} ${leadNom}</p>
        <p><strong>Email :</strong> <a href="mailto:${leadEmail}" style="color: #059669;">${leadEmail}</a></p>
        <p><strong>Téléphone :</strong> ${leadTelephone}</p>
      </div>

      <h2 style="color: #333; font-size: 18px; margin: 30px 0 15px 0;">📊 Résumé de la simulation</h2>
      <table class="simulation-table">
        <tr>
          <th>Critère</th>
          <th>Valeur</th>
        </tr>
        <tr>
          <td>Zone fiscale</td>
          <td>${zone}</td>
        </tr>
        <tr>
          <td>Budget</td>
          <td><strong>${budget}</strong></td>
        </tr>
        <tr>
          <td>Tranche marginale d'imposition</td>
          <td>${tmi}</td>
        </tr>
        <tr>
          <td>Type de bien recherché</td>
          <td>${typeBien}</td>
        </tr>
        <tr class="highlight">
          <td>Économie fiscale annuelle</td>
          <td><strong style="color: #059669;">${economieFiscale}</strong></td>
        </tr>
        <tr class="highlight">
          <td>Rendement net estimé</td>
          <td><strong style="color: #059669;">${rendementNet}</strong></td>
        </tr>
      </table>

      <div class="message-box">
        <p style="margin: 0;"><strong>💡 Point important :</strong> Le prospect souhaite être contacté directement pour bénéficier de vos tarifs directs et offres en cours.</p>
      </div>

      <div style="text-align: center;">
        <a href="mailto:${leadEmail}?subject=Votre simulation loi Jeanbrun - ${zone}" class="button">
          📞 Contacter le prospect
        </a>
      </div>

      <div class="footer">
        <p>Ce lead vous a été transmis via le <strong>${appName}</strong>.</p>
        <p>Le prospect a donné son consentement explicite pour être contacté par un promoteur partenaire.</p>
        <p>© ${new Date().getFullYear()} ${appName} - Tous droits réservés</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const textContent = `
[${appName}] Nouveau prospect qualifié - ${leadPrenom} ${leadNom}

Bonjour ${promoterName},

COORDONNÉES DU PROSPECT
-----------------------
Nom : ${leadPrenom} ${leadNom}
Email : ${leadEmail}
Téléphone : ${leadTelephone}

RÉSUMÉ DE LA SIMULATION
-----------------------
Zone fiscale : ${zone}
Budget : ${budget}
Tranche marginale d'imposition : ${tmi}
Type de bien recherché : ${typeBien}
Économie fiscale annuelle : ${economieFiscale}
Rendement net estimé : ${rendementNet}

Le prospect souhaite être contacté directement pour bénéficier de vos tarifs directs et offres en cours.

Ce lead vous a été transmis via le ${appName}.
Le prospect a donné son consentement explicite pour être contacté par un promoteur partenaire.

© ${new Date().getFullYear()} ${appName}
`;

  return sendEmail({
    to: promoterEmail,
    subject: `[${appName}] Nouveau prospect qualifié - ${leadPrenom} ${leadNom}`,
    htmlContent,
    textContent,
  });
}

interface BrokerLeadEmailParams {
  brokerEmail: string;
  brokerName: string;
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

/**
 * Send lead notification to broker partner.
 */
export async function sendBrokerLeadNotification({
  brokerEmail,
  brokerName,
  leadPrenom,
  leadNom,
  leadEmail,
  leadTelephone,
  revenuMensuel,
  apport,
  budget,
  zone,
  capaciteEmprunt,
  tauxEndettement,
  dureeCredit,
}: BrokerLeadEmailParams): Promise<boolean> {
  const appName = "Simulateur Loi Jeanbrun";

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f6f9fc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .email-wrapper { background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #2563eb; font-size: 24px; margin: 0 0 10px 0; }
    .lead-info { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .lead-info h2 { color: #2563eb; font-size: 18px; margin: 0 0 10px 0; }
    .lead-info p { margin: 5px 0; }
    .financial-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .financial-table th { background-color: #eff6ff; color: #2563eb; text-align: left; padding: 12px; border-bottom: 2px solid #2563eb; }
    .financial-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .financial-table tr:last-child td { border-bottom: none; }
    .highlight { background-color: #dbeafe; font-weight: 600; }
    .message-box { background-color: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .button:hover { background-color: #1d4ed8; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>💼 Nouveau prospect financement</h1>
        <p style="color: #666; margin: 0;">Bonjour ${brokerName},</p>
      </div>

      <div class="lead-info">
        <h2>📋 Coordonnées du prospect</h2>
        <p><strong>Nom :</strong> ${leadPrenom} ${leadNom}</p>
        <p><strong>Email :</strong> <a href="mailto:${leadEmail}" style="color: #2563eb;">${leadEmail}</a></p>
        <p><strong>Téléphone :</strong> ${leadTelephone}</p>
      </div>

      <h2 style="color: #333; font-size: 18px; margin: 30px 0 15px 0;">📊 Profil financier</h2>
      <table class="financial-table">
        <tr>
          <th>Critère</th>
          <th>Valeur</th>
        </tr>
        <tr>
          <td>Revenus mensuels</td>
          <td><strong>${revenuMensuel}</strong></td>
        </tr>
        <tr>
          <td>Apport personnel</td>
          <td><strong>${apport}</strong></td>
        </tr>
        <tr>
          <td>Budget recherché</td>
          <td><strong>${budget}</strong></td>
        </tr>
        <tr>
          <td>Zone géographique</td>
          <td>${zone}</td>
        </tr>
        <tr class="highlight">
          <td>Capacité d'emprunt estimée</td>
          <td><strong style="color: #2563eb;">${capaciteEmprunt}</strong></td>
        </tr>
        <tr class="highlight">
          <td>Taux d'endettement</td>
          <td><strong style="color: #2563eb;">${tauxEndettement}</strong></td>
        </tr>
        <tr>
          <td>Durée de crédit souhaitée</td>
          <td>${dureeCredit}</td>
        </tr>
      </table>

      <div class="message-box">
        <p style="margin: 0;"><strong>🎯 Objectif :</strong> Le prospect recherche un financement pour un investissement locatif en loi Jeanbrun.</p>
      </div>

      <div style="text-align: center;">
        <a href="mailto:${leadEmail}?subject=Votre projet de financement loi Jeanbrun" class="button">
          📞 Contacter le prospect
        </a>
      </div>

      <div class="footer">
        <p>Ce lead vous a été transmis via le <strong>${appName}</strong>.</p>
        <p>Le prospect a donné son consentement explicite pour être contacté par un courtier partenaire.</p>
        <p>© ${new Date().getFullYear()} ${appName} - Tous droits réservés</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const textContent = `
[${appName}] Nouveau prospect financement - ${leadPrenom} ${leadNom}

Bonjour ${brokerName},

COORDONNÉES DU PROSPECT
-----------------------
Nom : ${leadPrenom} ${leadNom}
Email : ${leadEmail}
Téléphone : ${leadTelephone}

PROFIL FINANCIER
----------------
Revenus mensuels : ${revenuMensuel}
Apport personnel : ${apport}
Budget recherché : ${budget}
Zone géographique : ${zone}
Capacité d'emprunt estimée : ${capaciteEmprunt}
Taux d'endettement : ${tauxEndettement}
Durée de crédit souhaitée : ${dureeCredit}

Le prospect recherche un financement pour un investissement locatif en loi Jeanbrun.

Ce lead vous a été transmis via le ${appName}.
Le prospect a donné son consentement explicite pour être contacté par un courtier partenaire.

© ${new Date().getFullYear()} ${appName}
`;

  return sendEmail({
    to: brokerEmail,
    subject: `[${appName}] Nouveau prospect financement - ${leadPrenom} ${leadNom}`,
    htmlContent,
    textContent,
  });
}

interface ProspectConfirmationEmailParams {
  prospectEmail: string;
  prospectPrenom: string;
  economieFiscale: string;
  rendementNet: string;
  zone: string;
  consentPromoter: boolean;
  consentBroker: boolean;
}

/**
 * Send confirmation email to prospect (lead).
 */
export async function sendProspectConfirmation({
  prospectEmail,
  prospectPrenom,
  economieFiscale,
  rendementNet,
  zone,
  consentPromoter,
  consentBroker,
}: ProspectConfirmationEmailParams): Promise<boolean> {
  const appName = "Simulateur Loi Jeanbrun";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://simulateur-loi-jeanbrun.vercel.app";

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f6f9fc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .email-wrapper { background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
    h1 { color: #059669; font-size: 26px; margin: 0 0 10px 0; }
    .summary-box { background-color: #ecfdf5; border: 2px solid #059669; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .summary-box h2 { color: #059669; font-size: 20px; margin: 0 0 15px 0; }
    .summary-stat { display: inline-block; margin: 10px 20px; }
    .summary-stat .value { font-size: 28px; font-weight: 700; color: #059669; display: block; }
    .summary-stat .label { font-size: 14px; color: #666; display: block; margin-top: 5px; }
    .section { margin: 30px 0; }
    .section h3 { color: #333; font-size: 18px; margin: 0 0 15px 0; border-left: 4px solid #059669; padding-left: 12px; }
    .benefits-list { list-style: none; padding: 0; margin: 0; }
    .benefits-list li { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .benefits-list li:last-child { border-bottom: none; }
    .icon { color: #059669; font-weight: bold; margin-right: 8px; }
    .next-steps { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .next-steps p { margin: 8px 0; }
    .button { display: inline-block; padding: 14px 28px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .button:hover { background-color: #047857; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
    .rgpd-notice { background-color: #f9fafb; padding: 15px; margin-top: 20px; border-radius: 4px; font-size: 11px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>✅ Merci ${prospectPrenom} !</h1>
        <p style="color: #666; margin: 0;">Votre simulation est enregistrée</p>
      </div>

      <div class="summary-box">
        <h2>📊 Votre potentiel d'économie</h2>
        <div class="summary-stat">
          <span class="value">${economieFiscale}</span>
          <span class="label">Économie fiscale / an</span>
        </div>
        <div class="summary-stat">
          <span class="value">${rendementNet}</span>
          <span class="label">Rendement net estimé</span>
        </div>
      </div>

      <div class="section">
        <h3>🎁 Vos avantages</h3>
        <ul class="benefits-list">
          <li><span class="icon">✓</span> <strong>Accès direct au promoteur</strong>, sans intermédiaire</li>
          <li><span class="icon">✓</span> <strong>Tarifs promoteurs directs</strong> (pas de marge d'intermédiation)</li>
          <li><span class="icon">✓</span> <strong>Offres spéciales exclusives</strong> (frais de notaire offerts, remises...)</li>
        </ul>
      </div>

      <div class="section">
        <h3>📍 Prochaines étapes</h3>
        <div class="next-steps">
          ${consentPromoter ? '<p><strong>📞 Promoteur partenaire :</strong> Un promoteur partenaire vous contactera sous <strong>24h</strong> pour vous présenter les programmes éligibles dans votre zone <em>(' + zone + ')</em>.</p>' : ''}
          ${consentBroker ? '<p><strong>💼 Courtier partenaire :</strong> Un courtier partenaire vous contactera pour une proposition de financement personnalisée adaptée à votre projet.</p>' : ''}
          ${!consentPromoter && !consentBroker ? '<p>Vous pouvez relancer votre simulation à tout moment en cliquant sur le bouton ci-dessous.</p>' : ''}
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${appUrl}" class="button">
          🔄 Relancer ma simulation
        </a>
      </div>

      <div class="footer">
        <p><strong>${appName}</strong> - L'outil de simulation fiscale pour vos investissements locatifs</p>
        <div class="rgpd-notice">
          <p><strong>🔒 Conformité RGPD</strong></p>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données personnelles.</p>
          <p>Vous pouvez retirer votre consentement à tout moment en nous contactant ou en cliquant sur le lien de désinscription présent dans nos communications.</p>
          <p>Vos données sont uniquement utilisées pour vous mettre en relation avec nos partenaires et ne sont jamais vendues à des tiers.</p>
        </div>
        <p>© ${new Date().getFullYear()} ${appName} - Tous droits réservés</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const textContent = `
[${appName}] Votre rapport de simulation

Merci ${prospectPrenom} ! Votre simulation est enregistrée

VOTRE POTENTIEL D'ÉCONOMIE
--------------------------
Économie fiscale annuelle : ${economieFiscale}
Rendement net estimé : ${rendementNet}

VOS AVANTAGES
-------------
✓ Accès direct au promoteur, sans intermédiaire
✓ Tarifs promoteurs directs (pas de marge d'intermédiation)
✓ Offres spéciales exclusives (frais de notaire offerts, remises...)

PROCHAINES ÉTAPES
-----------------
${consentPromoter ? `📞 Promoteur partenaire : Un promoteur partenaire vous contactera sous 24h pour vous présenter les programmes éligibles dans votre zone (${zone}).` : ''}
${consentBroker ? '💼 Courtier partenaire : Un courtier partenaire vous contactera pour une proposition de financement personnalisée adaptée à votre projet.' : ''}

Relancer ma simulation : ${appUrl}

CONFORMITÉ RGPD
---------------
Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données personnelles.

Vous pouvez retirer votre consentement à tout moment en nous contactant.
Vos données sont uniquement utilisées pour vous mettre en relation avec nos partenaires et ne sont jamais vendues à des tiers.

© ${new Date().getFullYear()} ${appName}
`;

  return sendEmail({
    to: prospectEmail,
    subject: `[${appName}] Votre rapport de simulation`,
    htmlContent,
    textContent,
  });
}
