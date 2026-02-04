import { MenuIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import MenuDropdown from '@/components/shadcn-studio/blocks/menu-dropdown'
import MenuNavigation from '@/components/shadcn-studio/blocks/menu-navigation'
import type { NavigationSection } from '@/components/shadcn-studio/blocks/menu-navigation'

import { cn } from '@/lib/utils'

import Logo from '@/components/shadcn-studio/logo'

type HeaderProps = {
  navigationData: NavigationSection[]
  className?: string
}

const Header = ({ navigationData, className }: HeaderProps) => {
  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 flex justify-center', className)}>
      <div className='relative flex h-full w-full items-center bg-white/70 px-4 py-2.5 antialiased shadow-sm backdrop-blur-md transition-all duration-300 select-none lg:px-8 lg:py-3.5'>
        {/* Logo */}
        <Link href='/' className='shrink-0'>
          <Logo className='gap-3 text-[#1e3a5f] [&>svg]:size-8' />
        </Link>

        {/* Navigation - centré */}
        <div className='flex flex-1 justify-center max-md:hidden'>
          <MenuNavigation
            navigationData={navigationData}
            className='[&_[data-slot=navigation-menu-link]]:text-[#1e3a5f] [&_[data-slot=navigation-menu-link]]:hover:bg-transparent! [&_[data-slot=navigation-menu-link]]:hover:text-[#1e3a5f]! [&_[data-slot=navigation-menu-link]]:focus:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[active=true]:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[active=true]:hover:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[active=true]:focus:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[state=open]:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[state=open]:hover:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[state=open]:focus:bg-transparent! [&_[data-slot=navigation-menu-link]]:dark:hover:bg-transparent! [&_[data-slot=navigation-menu-list]]:flex-nowrap'
          />
        </div>

        {/* Login Button */}
        <Button className='shrink-0 rounded-full bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 max-md:hidden' asChild>
          <Link href='/login'>Connexion</Link>
        </Button>

        {/* Navigation for small screens */}
        <div className='flex gap-4 md:hidden'>
          <MenuDropdown
            align='end'
            navigationData={navigationData}
            trigger={
              <Button className='bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90' size='icon'>
                <MenuIcon />
                <span className='sr-only'>Menu</span>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  )
}

export default Header
