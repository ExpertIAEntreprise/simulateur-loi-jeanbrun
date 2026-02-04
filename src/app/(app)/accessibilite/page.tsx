import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibilite - Simulateur Loi Jeanbrun",
  description:
    "Declaration d'accessibilite du simulateur fiscal Loi Jeanbrun. Conformite RGAA, technologies utilisees et contact.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AccessibilitePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="p-8">
        <h1 className="mb-8 text-3xl font-bold">Declaration d&apos;accessibilite</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Engagement</h2>
            <p className="mb-2">
              Expert IA Entreprise s&apos;engage a rendre son site internet
              accessible conformement a l&apos;article 47 de la loi n&deg;2005-102 du
              11 fevrier 2005.
            </p>
            <p>
              Cette declaration d&apos;accessibilite s&apos;applique au site{" "}
              <strong>Simulateur Loi Jeanbrun</strong> (simulateur-loi-jeanbrun.vercel.app).
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              2. Etat de conformite
            </h2>
            <p className="mb-4">
              Le site <strong>Simulateur Loi Jeanbrun</strong> est en{" "}
              <strong>conformite partielle</strong> avec le referentiel general
              d&apos;amelioration de l&apos;accessibilite (RGAA) version 4.1.
            </p>
            <p>
              Un audit de conformite est prevu pour ameliorer le niveau
              d&apos;accessibilite du site.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              3. Technologies utilisees
            </h2>
            <p className="mb-2">
              Le site est construit avec les technologies suivantes :
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>HTML5 semantique</li>
              <li>CSS (Tailwind CSS v4)</li>
              <li>JavaScript / TypeScript (React 19, Next.js 16)</li>
              <li>Composants accessibles (shadcn/ui, basés sur Radix UI)</li>
              <li>Attributs ARIA pour les composants interactifs</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              4. Contenu non accessible
            </h2>
            <p className="mb-2">
              Les contenus suivants ne sont pas encore pleinement accessibles :
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Certaines images decoratives peuvent ne pas disposer d&apos;un texte
                alternatif suffisant
              </li>
              <li>
                Les graphiques interactifs (historique des prix) ne disposent pas
                d&apos;alternative textuelle complete
              </li>
              <li>
                La navigation au clavier dans les menus deroulants peut etre
                amelioree sur certains navigateurs
              </li>
              <li>
                Le contraste de certains elements decoratifs peut etre
                insuffisant en mode sombre
              </li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              5. Ameliorations prevues
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Audit RGAA complet avec correction des non-conformites</li>
              <li>Amelioration du support lecteur d&apos;ecran</li>
              <li>Ajout de descriptions textuelles pour tous les graphiques</li>
              <li>Navigation clavier optimisee sur l&apos;ensemble du site</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Contact</h2>
            <p className="mb-4">
              Si vous rencontrez un defaut d&apos;accessibilite vous empechant
              d&apos;acceder a un contenu ou une fonctionnalite du site, vous pouvez
              nous contacter :
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Par email :{" "}
                <a
                  href="mailto:contact@expert-ia-entreprise.fr"
                  className="text-primary hover:underline"
                >
                  contact@expert-ia-entreprise.fr
                </a>
              </li>
              <li>
                Par courrier : Expert IA Entreprise, 15 rue de la Republique,
                75011 Paris, France
              </li>
            </ul>
            <p className="mt-4">
              Nous nous engageons a vous repondre dans un delai de 7 jours
              ouvrables.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              7. Voies de recours
            </h2>
            <p className="mb-4">
              Si vous constatez un defaut d&apos;accessibilite et que nous ne
              parvenons pas a le resoudre, vous pouvez :
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Ecrire au Defenseur des droits :{" "}
                <a
                  href="https://formulaire.defenseurdesdroits.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  formulaire.defenseurdesdroits.fr
                </a>
              </li>
              <li>
                Contacter le delegue territorial du Defenseur des droits dans
                votre region
              </li>
              <li>
                Envoyer un courrier au Defenseur des droits : Libre reponse
                71120, 75342 Paris CEDEX 07
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>
            Derniere mise a jour :{" "}
            {new Date().toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </Card>
    </div>
  );
}
