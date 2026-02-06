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
