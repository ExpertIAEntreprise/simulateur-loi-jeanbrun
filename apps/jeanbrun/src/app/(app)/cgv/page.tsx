import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Conditions Generales d'Utilisation - Simulateur Loi Jeanbrun",
  description: "Conditions Generales d'Utilisation du simulateur fiscal Loi Jeanbrun",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CGUPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8">Conditions Generales d&apos;Utilisation</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Preambule</h2>
            <p className="mb-4">
              Les presentes Conditions Generales d&apos;Utilisation (CGU) regissent l&apos;utilisation du simulateur fiscal Loi Jeanbrun (ci-apres le &quot;Service&quot;) propose par Expert IA Entreprise (ci-apres l&apos;&quot;Editeur&quot;).
            </p>
            <p>
              En utilisant le Service, vous acceptez sans reserve les presentes CGU. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser le Service.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Objet</h2>
            <p className="mb-4">
              Le Service permet aux utilisateurs de simuler gratuitement l&apos;impact fiscal d&apos;un investissement immobilier dans le cadre de la Loi Jeanbrun.
            </p>
            <p>
              <strong className="text-destructive">Avertissement important :</strong> Les resultats fournis par le simulateur sont donnes a titre purement indicatif et ne constituent en aucun cas un conseil fiscal, juridique ou financier. Il est imperatif de consulter un expert-comptable ou un conseiller en gestion de patrimoine avant toute decision d&apos;investissement.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Description du Service</h2>
            <p className="mb-2">Le Service gratuit comprend :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acces au simulateur fiscal complet</li>
              <li>Calcul des economies d&apos;impots estimees</li>
              <li>Tableau d&apos;amortissement annuel</li>
              <li>Comparatif Jeanbrun vs LMNP</li>
              <li>Graphique d&apos;evolution du patrimoine</li>
              <li>Assistant IA pour vos questions fiscales</li>
              <li>Support par email</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Acces au Service</h2>
            <p className="mb-4">
              L&apos;acces au simulateur est gratuit. La creation d&apos;un compte utilisateur permet de sauvegarder ses simulations et d&apos;acceder a l&apos;historique.
            </p>
            <p className="mb-4">
              L&apos;utilisateur doit fournir les informations suivantes pour creer un compte :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nom et prenom</li>
              <li>Adresse email valide</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Obligations de l&apos;utilisateur</h2>
            <p className="mb-2">L&apos;utilisateur s&apos;engage a :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir des informations exactes et a jour</li>
              <li>Utiliser le Service de maniere conforme a sa destination</li>
              <li>Ne pas tenter de contourner les mesures de securite</li>
              <li>Ne pas revendre ou ceder son acces au Service</li>
              <li>Maintenir la confidentialite de ses identifiants de connexion</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Responsabilites et garanties</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.1. Disponibilite du Service</h3>
            <p className="mb-4">
              L&apos;Editeur s&apos;efforce d&apos;assurer une disponibilite du Service 24h/24 et 7j/7. Toutefois, des interruptions pour maintenance ou pour des raisons techniques peuvent survenir.
            </p>
            <p>
              L&apos;Editeur ne saurait etre tenu responsable des dommages resultant de l&apos;indisponibilite temporaire du Service.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.2. Exactitude des simulations</h3>
            <p className="mb-4">
              <strong className="text-destructive">Les simulations fiscales fournies sont donnees a titre purement indicatif.</strong>
            </p>
            <p className="mb-4">
              L&apos;Editeur ne garantit pas l&apos;exactitude, la fiabilite ou l&apos;exhaustivite des resultats. Les calculs sont bases sur les informations fournies par l&apos;utilisateur et sur l&apos;interpretation de la legislation fiscale en vigueur.
            </p>
            <p>
              <strong>L&apos;Editeur decline toute responsabilite en cas de decision d&apos;investissement prise sur la base des simulations.</strong> Il est imperatif de consulter un professionnel qualifie.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Propriete intellectuelle</h2>
            <p className="mb-4">
              Le Service, son contenu, ses fonctionnalites et tous les elements qui le composent sont et restent la propriete exclusive de l&apos;Editeur.
            </p>
            <p>
              L&apos;utilisation du Service ne confere aucun droit de propriete intellectuelle a l&apos;utilisateur. Toute reproduction, representation, modification ou exploitation non autorisee est interdite.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Protection des donnees personnelles</h2>
            <p>
              Les donnees personnelles collectees dans le cadre de l&apos;utilisation du Service sont traitees conformement a notre <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de confidentialite</a> et au Reglement General sur la Protection des Donnees (RGPD).
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Modification des CGU</h2>
            <p className="mb-4">
              L&apos;Editeur se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs seront informes par email de toute modification substantielle.
            </p>
            <p>
              La version applicable est celle en vigueur a la date d&apos;utilisation du Service. Les CGU sont datees et archivees.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Reglement des litiges</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">10.1. Droit applicable</h3>
            <p>
              Les presentes CGU sont regies par le droit francais. En cas de litige non resolu a l&apos;amiable, les tribunaux francais seront seuls competents.
            </p>
          </section>

          <Separator className="my-6" />

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
            <p className="mb-2">Pour toute question relative aux presentes CGU :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email : <a href="mailto:contact@expert-ia-entreprise.fr" className="text-primary hover:underline">contact@expert-ia-entreprise.fr</a></li>
              <li>Adresse : Expert IA Entreprise, 15 rue de la Republique, 75011 Paris, France</li>
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
