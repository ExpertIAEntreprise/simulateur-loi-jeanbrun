import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales - Simulateur Loi Jeanbrun',
  description: 'Mentions légales du simulateur fiscal Loi Jeanbrun - Expert IA Entreprise',
  robots: {
    index: true,
    follow: true,
  },
}

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
            <p className="mb-2">
              Le présent site web est édité par :
            </p>
            <div className="pl-4 space-y-1">
              <p><strong>Raison sociale :</strong> Expert IA Entreprise</p>
              <p><strong>Forme juridique :</strong> Entreprise individuelle</p>
              <p><strong>Adresse du siège social :</strong> 15 rue de la République, 75011 Paris, France</p>
              <p><strong>Numéro SIRET :</strong> [À compléter]</p>
              <p><strong>Email :</strong> contact@expert-ia-entreprise.fr</p>
              <p><strong>Téléphone :</strong> [À compléter]</p>
            </div>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Directeur de la publication</h2>
            <p>
              Le directeur de la publication du site est [Nom du directeur], en qualité de représentant légal de Expert IA Entreprise.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Hébergement</h2>
            <p className="mb-2">
              Le site est hébergé par :
            </p>
            <div className="pl-4 space-y-1">
              <p><strong>Raison sociale :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://vercel.com</a></p>
            </div>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Protection des données personnelles</h2>
            <p className="mb-2">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Le responsable du traitement des données est Expert IA Entreprise</li>
              <li>Les traitements de données personnelles mis en œuvre font l&apos;objet d&apos;une inscription au registre des activités de traitement</li>
              <li>Pour plus d&apos;informations sur la gestion de vos données personnelles, consultez notre <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de confidentialité</a></li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Propriété intellectuelle</h2>
            <p className="mb-4">
              L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) est la propriété exclusive de Expert IA Entreprise, à l&apos;exception des marques, logos ou contenus appartenant à d&apos;autres sociétés partenaires ou auteurs.
            </p>
            <p className="mb-4">
              Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l&apos;accord exprès par écrit de Expert IA Entreprise.
            </p>
            <p>
              Cette représentation ou reproduction, par quelque procédé que ce soit, constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation de responsabilité</h2>
            <p className="mb-4">
              Expert IA Entreprise s&apos;efforce d&apos;assurer au mieux de ses possibilités, l&apos;exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, Expert IA Entreprise ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition sur ce site.
            </p>
            <p className="mb-4">
              En conséquence, Expert IA Entreprise décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
            </p>
            <p>
              <strong>Important :</strong> Les simulations fiscales fournies par ce site sont données à titre indicatif. Elles ne constituent en aucun cas un conseil fiscal ou juridique. Il est fortement recommandé de consulter un expert-comptable ou un conseiller en gestion de patrimoine pour toute décision d&apos;investissement.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Liens hypertextes</h2>
            <p className="mb-4">
              Le site peut contenir des liens hypertextes vers d&apos;autres sites. Expert IA Entreprise n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
            <p>
              La création de liens hypertextes vers le site nécessite l&apos;autorisation préalable écrite de Expert IA Entreprise.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d&apos;accord amiable, le tribunal compétent sera celui du ressort du siège social de Expert IA Entreprise.
            </p>
          </section>

          <Separator className="my-6" />

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Par email : <a href="mailto:contact@expert-ia-entreprise.fr" className="text-primary hover:underline">contact@expert-ia-entreprise.fr</a></li>
              <li>Par courrier : Expert IA Entreprise, 15 rue de la République, 75011 Paris, France</li>
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
