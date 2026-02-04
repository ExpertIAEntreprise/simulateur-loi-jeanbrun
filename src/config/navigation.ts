import type { NavigationSection } from "@/components/shadcn-studio/blocks/menu-navigation";

export type { NavigationSection };

export const navigationData: NavigationSection[] = [
  {
    title: "Loi Jeanbrun",
    items: [
      { title: "Comprendre le dispositif", href: "/loi-jeanbrun" },
      { title: "Zones eligibles", href: "/villes" },
      { title: "Programmes neufs", href: "/programmes" },
    ],
  },
  {
    title: "Simulateur",
    href: "/simulateur",
  },
  {
    title: "Ressources",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Barometre", href: "/barometre" },
      { title: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Accompagnement",
    href: "/a-propos",
  },
];
