export const faqItems = [
  {
    question: "Qu'est-ce que la loi Jeanbrun ?",
    answer:
      "La loi Jeanbrun est un dispositif de defiscalisation immobiliere introduit dans le Projet de Loi de Finances (PLF) 2026. Elle remplace la loi Pinel qui a pris fin en decembre 2024. Ce dispositif permet aux investisseurs d'obtenir une reduction d'impot allant jusqu'a 12% du montant investi sur 12 ans, pour l'acquisition d'un logement neuf destine a la location.",
  },
  {
    question: 'Qui peut beneficier de la loi Jeanbrun ?',
    answer:
      "Tout contribuable francais domicilie fiscalement en France peut beneficier de la loi Jeanbrun. L'investisseur doit acheter un logement neuf ou en VEFA (Vente en l'Etat Futur d'Achevement) conforme a la norme RE2020, le louer nu en tant que residence principale du locataire, et respecter les plafonds de loyers et de ressources des locataires.",
  },
  {
    question: 'Quelles zones sont eligibles a la loi Jeanbrun ?',
    answer:
      "Les zones eligibles sont les zones tendues ou la demande de logements est superieure a l'offre : Zone A bis (Paris et 76 communes d'Ile-de-France), Zone A (grandes agglomerations comme Lyon, Marseille, Lille) et Zone B1 (agglomerations de plus de 250 000 habitants comme Nantes, Bordeaux, Toulouse). Les zones B2 et C ne sont pas eligibles.",
  },
  {
    question: "Quel est le plafond d'investissement ?",
    answer:
      "Le plafond d'investissement est de 300 000 EUR par an et par contribuable, avec un maximum de 2 logements par an. Le prix au metre carre est egalement plafonne a 5 500 EUR/m². Au-dela de ces plafonds, la reduction d'impot est calculee uniquement sur le montant plafonne.",
  },
  {
    question: "Peut-on cumuler la loi Jeanbrun avec d'autres dispositifs ?",
    answer:
      "Non, la loi Jeanbrun ne peut pas etre cumulee avec d'autres dispositifs de defiscalisation immobiliere sur le meme bien (Malraux, Monuments Historiques, Denormandie, etc.). En revanche, vous pouvez beneficier du dispositif Jeanbrun sur un bien et d'un autre dispositif sur un autre bien. De plus, la reduction d'impot Jeanbrun entre dans le plafonnement global des niches fiscales de 10 000 EUR par an.",
  },
  {
    question: "Quelle est la duree d'engagement minimale ?",
    answer:
      "La duree d'engagement minimale est de 6 ans, avec possibilite de prolonger jusqu'a 9 ou 12 ans. Plus la duree d'engagement est longue, plus le taux de reduction est eleve : 6% pour 6 ans, 9% pour 9 ans, et 12% pour 12 ans. L'engagement court a partir de la date de mise en location du bien.",
  },
  {
    question: "Que se passe-t-il si je vends avant la fin de l'engagement ?",
    answer:
      "Si vous vendez le bien ou cessez de le louer avant la fin de la periode d'engagement, vous devrez rembourser l'integralite des reductions d'impot dont vous avez beneficie depuis le debut. Il existe quelques exceptions : deces, invalidite, licenciement, ou divorce. Dans ces cas, la remise en cause peut etre evitee si certaines conditions sont remplies.",
  },
  {
    question: 'Les SCPI sont-elles eligibles a la loi Jeanbrun ?',
    answer:
      "Oui, les SCPI (Societes Civiles de Placement Immobilier) fiscales dites \"Jeanbrun\" permettent de beneficier du dispositif de maniere indirecte. La reduction d'impot est alors calculee sur le montant de la souscription, au prorata de la partie investie dans des biens eligibles. C'est une solution pour investir avec un budget plus modeste et diversifier son patrimoine.",
  },
  {
    question: "Comment declarer la reduction d'impot ?",
    answer:
      "La reduction d'impot se declare chaque annee sur votre declaration de revenus (formulaire 2042-C). Vous devez renseigner le montant de l'investissement, la date de mise en location, et joindre les justificatifs demandes (attestation de propriete, bail de location, etc.). La reduction est ensuite imputee sur votre impot sur le revenu. Si elle depasse l'impot du, l'excedent n'est ni reportable ni remboursable.",
  },
  {
    question: 'La loi Jeanbrun est-elle retroactive ?',
    answer:
      "Non, la loi Jeanbrun n'est pas retroactive. Elle s'applique uniquement aux acquisitions realisees a partir du 1er janvier 2026. Les investissements Pinel realises avant fin 2024 continuent de beneficier du dispositif Pinel selon les conditions en vigueur au moment de l'acquisition. Il n'est pas possible de requalifier un investissement Pinel en investissement Jeanbrun.",
  },
] as const

export type FaqItem = (typeof faqItems)[number]
