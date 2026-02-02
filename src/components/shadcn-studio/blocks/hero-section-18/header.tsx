import { MenuIcon } from 'lucide-react'

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
      <div className='relative mx-auto mt-8 inline-flex h-full max-w-7xl items-center justify-between gap-6 rounded-full bg-white/40 px-6 py-3.5 text-center align-middle antialiased shadow-[inset_1px_0.5px_0px_rgba(255,255,255,0.75),inset_-1px_-0.5px_0px_rgba(255,255,255,0.75)] backdrop-blur-sm transition-all duration-300 select-none before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50'>
        {/* Logo */}
        <a href='#'>
          <Logo className='gap-3 text-[#1e3a5f] [&>svg]:size-8' />
        </a>

        {/* Navigation */}
        <MenuNavigation
          navigationData={navigationData}
          className='max-md:hidden [&_[data-slot=navigation-menu-link]]:text-[#1e3a5f] [&_[data-slot=navigation-menu-link]]:hover:bg-transparent! [&_[data-slot=navigation-menu-link]]:hover:text-[#1e3a5f]! [&_[data-slot=navigation-menu-link]]:focus:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[active=true]:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[active=true]:hover:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[active=true]:focus:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[state=open]:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[state=open]:hover:bg-transparent! [&_[data-slot=navigation-menu-link]]:data-[state=open]:focus:bg-transparent! [&_[data-slot=navigation-menu-link]]:dark:hover:bg-transparent! [&_[data-slot=navigation-menu-list]]:flex-nowrap'
        />

        {/* Login Button */}
        <Button className='rounded-full bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 max-md:hidden' asChild>
          <a href='#'>Login</a>
        </Button>

        {/* Navigation for small screens */}
        <div className='flex gap-4 md:hidden'>
          <Button className='rounded-full bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90' asChild>
            <a href='#'>Login</a>
          </Button>

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
