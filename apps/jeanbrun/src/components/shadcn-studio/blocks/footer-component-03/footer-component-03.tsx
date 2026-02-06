'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import Logo from '@/components/shadcn-studio/logo'
import { FooterVilles, FooterVillesCompact } from '@/components/villes/FooterVilles'

type FooterLink = {
  readonly label: string
  readonly href: string
}

type FooterColumn = {
  readonly title: string
  readonly links: readonly FooterLink[]
}

const footerColumns: readonly FooterColumn[] = [
  {
    title: 'Simulateur',
    links: [
      { label: 'Simulation gratuite', href: '/simulateur' },
      { label: 'Simulation avancee', href: '/simulateur/avance' },
      { label: 'Resultats', href: '/simulateur' },
    ],
  },
  {
    title: 'Comprendre',
    links: [
      { label: 'Loi Jeanbrun 2026', href: '/loi-jeanbrun' },
      { label: 'Zones eligibles', href: '/villes' },
      { label: 'Programmes neufs', href: '/programmes' },
      { label: 'Guide investisseur', href: '/loi-jeanbrun#guide' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Barometre mensuel', href: '/barometre' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Actualites', href: '/blog' },
    ],
  },
  {
    title: 'A propos',
    links: [
      { label: 'Herve Voirin', href: '/a-propos' },
      { label: 'Accompagnement', href: '/a-propos#accompagnement' },
      { label: 'Prendre RDV', href: '/a-propos#rdv' },
      { label: 'Contact', href: '/a-propos#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Mentions legales', href: '/mentions-legales' },
      { label: 'CGU', href: '/cgv' },
      { label: 'Confidentialite', href: '/politique-confidentialite' },
      { label: 'Accessibilite', href: '/accessibilite' },
    ],
  },
] as const

const Footer = () => {
  return (
    <footer className='border-t bg-muted/30'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 md:py-24'>
        {/* Newsletter */}
        <div className='mb-10 grid items-center gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <h6 className='text-2xl font-semibold'>Restez informe</h6>
            <p className='text-muted-foreground'>
              Recevez les meilleures opportunites Loi Jeanbrun directement dans votre boite mail.
            </p>
          </div>
          <form className='flex flex-col gap-3 sm:flex-row' onSubmit={(e) => e.preventDefault()}>
            <Input type='email' placeholder='Votre email' className='h-10 flex-1' required />
            <Button className='w-full rounded-lg text-base sm:w-auto' type='submit' size='lg'>
              M&apos;inscrire
            </Button>
          </form>
        </div>

        {/* 5 colonnes de liens */}
        <div className='grid grid-flow-row grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5'>
          {footerColumns.map((column, index) => (
            <div key={column.title} className={index === footerColumns.length - 1 ? 'col-span-2 flex flex-col gap-5 md:col-span-1' : 'flex flex-col gap-5'}>
              <div className='text-lg font-medium'>{column.title}</div>
              <ul className={index === footerColumns.length - 1 ? 'text-muted-foreground grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-1' : 'text-muted-foreground space-y-3'}>
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className='hover:text-foreground transition-colors duration-300'>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bande villes SEO */}
        <div className='mt-12 border-t pt-8'>
          <h2 className='mb-4 text-base font-semibold text-foreground'>
            Villes eligibles a la loi Jeanbrun
          </h2>
          {/* Version complete sur desktop */}
          <div className='hidden md:block'>
            <FooterVilles />
          </div>
          {/* Version compacte sur mobile */}
          <div className='md:hidden'>
            <FooterVillesCompact />
          </div>
        </div>
      </div>

      <Separator />

      {/* Copyright */}
      <div className='mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6'>
        <Link href='/'>
          <Logo className='gap-3' />
        </Link>
        <div className='text-sm text-muted-foreground'>
          <p className='font-medium'>
            &copy;{new Date().getFullYear()} Expert IA Entreprise. Tous droits reserves.
          </p>
          <p className='mt-1 text-xs text-muted-foreground/70'>
            Les simulations sont fournies a titre indicatif et ne constituent pas un conseil fiscal.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
