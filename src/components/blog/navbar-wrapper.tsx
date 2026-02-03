import Navbar from '@/components/shadcn-studio/blocks/navbar-component-05/navbar-component-05'

type NavigationItem = {
  title: string
  href: string
}

const navigationData: NavigationItem[] = [
  {
    title: 'Accueil',
    href: '/',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'Simulateur',
    href: '/dashboard',
  },
  {
    title: 'Loi Jeanbrun',
    href: '/loi-jeanbrun',
  },
]

export default function NavbarWrapper() {
  return <Navbar navigationData={navigationData} />
}
