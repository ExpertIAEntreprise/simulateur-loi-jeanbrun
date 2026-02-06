import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - Simulateur Loi Jeanbrun',
  description: 'Politique de confidentialité et protection des données personnelles du simulateur fiscal Loi Jeanbrun',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Expert IA Entreprise (ci-après &quot;nous&quot;, &quot;notre&quot;) accorde une grande importance à la protection de vos données personnelles. La présente politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos données dans le cadre de l&apos;utilisation du simulateur fiscal Loi Jeanbrun.
            </p>
            <p>
              Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) n°2016/679 du 27 avril 2016 et à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Identité du responsable de traitement</h2>
            <p className="mb-2"><strong>Responsable de traitement :</strong></p>
            <div className="pl-4 space-y-1">
              <p>Expert IA Entreprise</p>
              <p>15 rue de la République, 75011 Paris, France</p>
              <p>Email : <a href="mailto:contact@expert-ia-entreprise.fr" className="text-primary hover:underline">contact@expert-ia-entreprise.fr</a></p>
              <p>SIRET : [À compléter]</p>
            </div>
            <p className="mt-4">
              <strong>Délégué à la Protection des Données (DPO) :</strong> [Nom ou &quot;Non requis pour une entreprise de cette taille&quot;]
            </p>
            <p>
              Contact DPO : <a href="mailto:dpo@expert-ia-entreprise.fr" className="text-primary hover:underline">dpo@expert-ia-entreprise.fr</a>
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Données personnelles collectées</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.1. Données d&apos;identification</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone (optionnel)</li>
              <li>Adresse postale (si fournie)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2. Données patrimoniales et fiscales</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Revenus fonciers</li>
              <li>Tranche marginale d&apos;imposition</li>
              <li>Situation familiale (nombre de parts fiscales)</li>
              <li>Patrimoine immobilier existant</li>
              <li>Caractéristiques du projet d&apos;investissement (prix d&apos;achat, localisation, type de bien)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.3. Données de connexion</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Adresse IP</li>
              <li>Logs de connexion</li>
              <li>Type de navigateur et système d&apos;exploitation</li>
              <li>Pages consultées et durée de visite</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.4. Données de simulation</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Résultats de simulation fiscale</li>
              <li>Paramètres de simulation sauvegardés</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Finalités et bases légales du traitement</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 font-semibold">Finalité</th>
                    <th className="text-left p-2 font-semibold">Base légale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-2">Fourniture du service de simulation</td>
                    <td className="p-2">Exécution du contrat</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">Support client</td>
                    <td className="p-2">Exécution du contrat</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">Facturation et comptabilité</td>
                    <td className="p-2">Obligation légale</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">Amélioration du service</td>
                    <td className="p-2">Intérêt légitime</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">Communication marketing (newsletter)</td>
                    <td className="p-2">Consentement</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">Sécurité et prévention de la fraude</td>
                    <td className="p-2">Intérêt légitime</td>
                  </tr>
                  <tr>
                    <td className="p-2">Respect des obligations légales (fiscales, comptables)</td>
                    <td className="p-2">Obligation légale</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Destinataires des données</h2>
            <p className="mb-4">Vos données personnelles peuvent être transmises aux catégories de destinataires suivants :</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.1. Services internes</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Équipe support client</li>
              <li>Équipe technique et développement</li>
              <li>Service comptabilité</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2. Sous-traitants et prestataires</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Vercel Inc.</strong> (États-Unis) - Hébergement de l&apos;application</li>
              <li><strong>Neon</strong> (États-Unis) - Hébergement de la base de données PostgreSQL</li>
              <li><strong>EspoCRM</strong> (auto-hébergé) - Gestion de la relation client</li>
              <li><strong>Mailjet</strong> (France) - Envoi d&apos;emails transactionnels</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3. Transferts hors UE</h3>
            <p className="mb-4">
              Certains de nos prestataires sont situés aux États-Unis. Les transferts de données vers ces pays sont encadrés par :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les clauses contractuelles types de la Commission européenne</li>
              <li>Le Data Privacy Framework (DPF) pour les entreprises certifiées</li>
              <li>Des garanties appropriées conformément à l&apos;article 46 du RGPD</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.4. Autorités légales</h3>
            <p>
              Vos données peuvent être communiquées aux autorités compétentes sur réquisition judiciaire ou dans le cadre d&apos;obligations légales (administration fiscale, URSSAF, etc.).
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Durée de conservation des données</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 font-semibold">Type de données</th>
                    <th className="text-left p-2 font-semibold">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-2">Données de compte actif</td>
                    <td className="p-2">Durée de la relation contractuelle + 3 ans</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">Données de simulation</td>
                    <td className="p-2">Durée du compte actif + 1 an</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">Logs de connexion</td>
                    <td className="p-2">1 an (obligation légale sécurité)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2">Données prospects (non-clients)</td>
                    <td className="p-2">3 ans à compter du dernier contact</td>
                  </tr>
                  <tr>
                    <td className="p-2">Compte supprimé</td>
                    <td className="p-2">Suppression immédiate sauf obligations légales</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Vos droits sur vos données</h2>
            <p className="mb-4">
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.1. Droit d&apos;accès (Article 15 RGPD)</h3>
            <p>
              Vous pouvez obtenir une copie de toutes les données personnelles vous concernant que nous détenons.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.2. Droit de rectification (Article 16 RGPD)</h3>
            <p>
              Vous pouvez demander la correction de vos données inexactes ou incomplètes.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.3. Droit à l&apos;effacement (Article 17 RGPD)</h3>
            <p>
              Vous pouvez demander la suppression de vos données dans certains cas (retrait du consentement, données non nécessaires, opposition au traitement).
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.4. Droit à la limitation du traitement (Article 18 RGPD)</h3>
            <p>
              Vous pouvez demander la suspension temporaire du traitement de vos données.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.5. Droit à la portabilité (Article 20 RGPD)</h3>
            <p>
              Vous pouvez recevoir vos données dans un format structuré et couramment utilisé, et les transmettre à un autre responsable de traitement.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.6. Droit d&apos;opposition (Article 21 RGPD)</h3>
            <p>
              Vous pouvez vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière (notamment pour le marketing direct).
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.7. Droit de retirer votre consentement</h3>
            <p>
              Pour les traitements basés sur le consentement, vous pouvez le retirer à tout moment.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.8. Droit de définir des directives post-mortem</h3>
            <p>
              Vous pouvez définir des directives relatives au sort de vos données après votre décès.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Comment exercer vos droits ?</h3>
            <p className="mb-2">
              Pour exercer l&apos;un de ces droits, contactez-nous :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Par email : <a href="mailto:dpo@expert-ia-entreprise.fr" className="text-primary hover:underline">dpo@expert-ia-entreprise.fr</a></li>
              <li>Par courrier : Expert IA Entreprise, 15 rue de la République, 75011 Paris, France</li>
            </ul>
            <p className="mt-4">
              Nous vous répondrons dans un délai d&apos;un mois maximum (prolongeable de 2 mois si la demande est complexe).
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Droit de réclamation auprès de la CNIL</h3>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL) :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a></li>
              <li>Adresse : CNIL - 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</li>
              <li>Téléphone : 01 53 73 22 22</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Sécurité des données</h2>
            <p className="mb-4">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre la destruction accidentelle ou illicite, la perte, l&apos;altération, la divulgation ou l&apos;accès non autorisé.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Mesures de sécurité techniques :</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chiffrement des données en transit (HTTPS/TLS)</li>
              <li>Chiffrement des données au repos (base de données)</li>
              <li>Authentification forte des utilisateurs</li>
              <li>Pare-feu et protection contre les attaques DDoS</li>
              <li>Sauvegardes régulières et chiffrées</li>
              <li>Surveillance et journalisation des accès</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Mesures organisationnelles :</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accès aux données limité aux personnes habilitées</li>
              <li>Clauses de confidentialité dans les contrats de travail</li>
              <li>Sensibilisation du personnel à la sécurité des données</li>
              <li>Procédures de gestion des incidents de sécurité</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Cookies et technologies similaires</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.1. Cookies utilisés</h3>
            <p className="mb-4">
              Notre site utilise uniquement des cookies strictement nécessaires au fonctionnement du service. Aucun cookie de tracking publicitaire n&apos;est utilisé.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Types de cookies :</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies de session :</strong> Nécessaires à l&apos;authentification et à la navigation (supprimés à la fermeture du navigateur)</li>
              <li><strong>Cookies de sécurité :</strong> Protection CSRF et autres mesures de sécurité</li>
              <li><strong>Cookies de préférence :</strong> Mémorisation du thème clair/sombre choisi</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.2. Gestion des cookies</h3>
            <p className="mb-2">
              Vous pouvez paramétrer votre navigateur pour refuser les cookies. Toutefois, cela peut altérer le fonctionnement du service.
            </p>
            <p>
              Pour plus d&apos;informations sur les cookies : <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr/fr/cookies-et-autres-traceurs</a>
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Mineurs</h2>
            <p>
              Notre service n&apos;est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données personnelles concernant des mineurs. Si vous êtes parent ou tuteur et pensez que votre enfant nous a fourni des données personnelles, contactez-nous immédiatement.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Modifications de la politique</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute modification substantielle vous sera notifiée par email et/ou via une notification sur le site.
            </p>
            <p>
              La version en vigueur est toujours accessible sur cette page. Nous vous encourageons à la consulter régulièrement.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Liens vers d&apos;autres sites</h2>
            <p>
              Notre site peut contenir des liens vers des sites tiers. Nous ne sommes pas responsables des pratiques de confidentialité de ces sites. Nous vous encourageons à lire leurs politiques de confidentialité.
            </p>
          </section>

          <Separator className="my-6" />

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email :</strong> <a href="mailto:dpo@expert-ia-entreprise.fr" className="text-primary hover:underline">dpo@expert-ia-entreprise.fr</a></li>
              <li><strong>Courrier :</strong> Expert IA Entreprise - Service DPO, 15 rue de la République, 75011 Paris, France</li>
              <li><strong>Téléphone :</strong> [À compléter]</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </Card>
    </div>
  )
}
