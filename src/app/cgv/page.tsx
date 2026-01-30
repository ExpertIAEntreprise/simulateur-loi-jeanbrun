import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente - Simulateur Loi Jeanbrun',
  description: 'Conditions Générales de Vente du simulateur fiscal Loi Jeanbrun',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CGVPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8">Conditions Générales de Vente</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Préambule</h2>
            <p className="mb-4">
              Les présentes Conditions Générales de Vente (CGV) régissent l&apos;utilisation du simulateur fiscal Loi Jeanbrun (ci-après le &quot;Service&quot;) proposé par Expert IA Entreprise (ci-après l&apos;&quot;Éditeur&quot;).
            </p>
            <p>
              En utilisant le Service, vous acceptez sans réserve les présentes CGV. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser le Service.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Objet</h2>
            <p className="mb-4">
              Le Service permet aux utilisateurs de simuler l&apos;impact fiscal d&apos;un investissement immobilier dans le cadre de la Loi Jeanbrun.
            </p>
            <p>
              <strong className="text-destructive">Avertissement important :</strong> Les résultats fournis par le simulateur sont donnés à titre purement indicatif et ne constituent en aucun cas un conseil fiscal, juridique ou financier. Il est impératif de consulter un expert-comptable ou un conseiller en gestion de patrimoine avant toute décision d&apos;investissement.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Description des offres</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.1. Offre Gratuite</h3>
            <p className="mb-2">L&apos;offre gratuite comprend :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accès au simulateur fiscal de base</li>
              <li>Calcul des économies d&apos;impôts estimées</li>
              <li>Rapport de simulation en format simplifié</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2. Pack Pro (9,90€ HT/mois)</h3>
            <p className="mb-2">Le Pack Pro comprend :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Toutes les fonctionnalités de l&apos;offre gratuite</li>
              <li>Simulations illimitées</li>
              <li>Rapports détaillés au format PDF</li>
              <li>Historique complet des simulations</li>
              <li>Comparatifs d&apos;investissements</li>
              <li>Scénarios fiscaux avancés</li>
              <li>Support prioritaire par email</li>
            </ul>
            <p className="mt-4">
              <strong>Prix :</strong> 9,90€ HT par mois (soit 11,88€ TTC avec TVA à 20%)
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Modalités de souscription</h2>
            <p className="mb-4">
              La souscription au Pack Pro s&apos;effectue directement en ligne via l&apos;interface du Service.
            </p>
            <p className="mb-4">
              L&apos;utilisateur doit fournir les informations suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email valide</li>
              <li>Informations de paiement (carte bancaire)</li>
            </ul>
            <p className="mt-4">
              La validation de la commande implique l&apos;acceptation des présentes CGV et l&apos;obligation de paiement.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Prix et modalités de paiement</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.1. Prix</h3>
            <p className="mb-4">
              Les prix sont indiqués en euros hors taxes (HT) et toutes taxes comprises (TTC), TVA française à 20% incluse.
            </p>
            <p>
              L&apos;Éditeur se réserve le droit de modifier ses tarifs à tout moment. Les modifications tarifaires ne s&apos;appliquent pas aux abonnements en cours.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2. Modalités de paiement</h3>
            <p className="mb-2">Le paiement s&apos;effectue par :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Carte bancaire (Visa, Mastercard, American Express)</li>
              <li>Via la plateforme de paiement sécurisée Stripe</li>
            </ul>
            <p className="mt-4">
              Le paiement est exigible immédiatement à la souscription, puis mensuellement à date anniversaire pour les abonnements.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3. Facturation</h3>
            <p>
              Une facture est automatiquement envoyée par email à chaque prélèvement. Les factures sont également accessibles depuis l&apos;espace utilisateur.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Droit de rétractation</h2>
            <p className="mb-4">
              Conformément aux articles L221-18 et suivants du Code de la consommation, vous disposez d&apos;un délai de 14 jours à compter de la souscription pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
            </p>
            <p className="mb-4">
              Pour exercer ce droit, vous devez nous notifier votre décision de rétractation au moyen d&apos;une déclaration dénuée d&apos;ambiguïté par email à : <a href="mailto:contact@expert-ia-entreprise.fr" className="text-primary hover:underline">contact@expert-ia-entreprise.fr</a>
            </p>
            <p>
              En cas de rétractation, nous vous rembourserons tous les paiements reçus dans un délai de 14 jours à compter du jour où nous sommes informés de votre décision.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Durée et résiliation</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.1. Durée</h3>
            <p>
              Les abonnements au Pack Pro sont à durée indéterminée, avec reconduction tacite mensuelle.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.2. Résiliation par l&apos;utilisateur</h3>
            <p className="mb-4">
              Vous pouvez résilier votre abonnement à tout moment depuis votre espace utilisateur ou en contactant le support. La résiliation prend effet à la fin de la période d&apos;abonnement en cours.
            </p>
            <p>
              Aucun remboursement au prorata ne sera effectué pour la période en cours.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.3. Suspension ou résiliation par l&apos;Éditeur</h3>
            <p className="mb-2">
              L&apos;Éditeur se réserve le droit de suspendre ou de résilier l&apos;accès au Service en cas de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Non-paiement</li>
              <li>Utilisation frauduleuse ou abusive du Service</li>
              <li>Violation des présentes CGV</li>
              <li>Comportement portant atteinte à l&apos;Éditeur ou à d&apos;autres utilisateurs</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Obligations de l&apos;utilisateur</h2>
            <p className="mb-2">L&apos;utilisateur s&apos;engage à :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir des informations exactes et à jour</li>
              <li>Utiliser le Service de manière conforme à sa destination</li>
              <li>Ne pas tenter de contourner les mesures de sécurité</li>
              <li>Ne pas revendre ou céder son accès au Service</li>
              <li>Maintenir la confidentialité de ses identifiants de connexion</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Responsabilités et garanties</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.1. Disponibilité du Service</h3>
            <p className="mb-4">
              L&apos;Éditeur s&apos;efforce d&apos;assurer une disponibilité du Service 24h/24 et 7j/7. Toutefois, des interruptions pour maintenance ou pour des raisons techniques peuvent survenir.
            </p>
            <p>
              L&apos;Éditeur ne saurait être tenu responsable des dommages résultant de l&apos;indisponibilité temporaire du Service.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.2. Exactitude des simulations</h3>
            <p className="mb-4">
              <strong className="text-destructive">Les simulations fiscales fournies sont données à titre purement indicatif.</strong>
            </p>
            <p className="mb-4">
              L&apos;Éditeur ne garantit pas l&apos;exactitude, la fiabilité ou l&apos;exhaustivité des résultats. Les calculs sont basés sur les informations fournies par l&apos;utilisateur et sur l&apos;interprétation de la législation fiscale en vigueur.
            </p>
            <p>
              <strong>L&apos;Éditeur décline toute responsabilité en cas de décision d&apos;investissement prise sur la base des simulations.</strong> Il est impératif de consulter un professionnel qualifié.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.3. Limitation de responsabilité</h3>
            <p>
              Dans les limites autorisées par la loi, la responsabilité de l&apos;Éditeur est limitée au montant total des sommes versées par l&apos;utilisateur au cours des 12 derniers mois.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Propriété intellectuelle</h2>
            <p className="mb-4">
              Le Service, son contenu, ses fonctionnalités et tous les éléments qui le composent sont et restent la propriété exclusive de l&apos;Éditeur.
            </p>
            <p>
              L&apos;utilisation du Service ne confère aucun droit de propriété intellectuelle à l&apos;utilisateur. Toute reproduction, représentation, modification ou exploitation non autorisée est interdite.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Protection des données personnelles</h2>
            <p>
              Les données personnelles collectées dans le cadre de l&apos;utilisation du Service sont traitées conformément à notre <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de confidentialité</a> et au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Modification des CGV</h2>
            <p className="mb-4">
              L&apos;Éditeur se réserve le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront informés par email de toute modification substantielle.
            </p>
            <p>
              La version applicable est celle en vigueur à la date d&apos;utilisation du Service. Les CGV sont datées et archivées.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Règlement des litiges</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">13.1. Médiation</h3>
            <p className="mb-4">
              Conformément à l&apos;article L612-1 du Code de la consommation, en cas de litige, vous avez le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige.
            </p>
            <p>
              Coordonnées du médiateur : [À compléter selon le médiateur référencé]
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">13.2. Droit applicable</h3>
            <p>
              Les présentes CGV sont régies par le droit français. En cas de litige non résolu à l&apos;amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <Separator className="my-6" />

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact</h2>
            <p className="mb-2">Pour toute question relative aux présentes CGV :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email : <a href="mailto:contact@expert-ia-entreprise.fr" className="text-primary hover:underline">contact@expert-ia-entreprise.fr</a></li>
              <li>Adresse : Expert IA Entreprise, 15 rue de la République, 75011 Paris, France</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
          <p>Version en vigueur au : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </Card>
    </div>
  )
}
