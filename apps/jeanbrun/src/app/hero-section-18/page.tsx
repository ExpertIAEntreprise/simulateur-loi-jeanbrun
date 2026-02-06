import HeroSection from '@/components/shadcn-studio/blocks/hero-section-18/hero-section-18'
import Header from '@/components/shadcn-studio/blocks/hero-section-18/header'
import type { NavigationSection } from '@/components/shadcn-studio/blocks/menu-navigation'

const navigationData: NavigationSection[] = [
  {
    title: 'Home',
    href: '#'
  },
  {
    title: 'Products',
    href: '#'
  },
  {
    title: 'About Us',
    href: '#'
  },
  {
    title: 'Contacts',
    href: '#'
  }
]

const HeroSectionPage = () => {
  return (
    <div className='relative flex min-h-screen flex-col bg-[url(https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/hero/image-34.png)] bg-cover bg-fixed bg-center bg-no-repeat'>
      {/* Header Section */}
      <Header navigationData={navigationData} />

      {/* Main Content */}
      <main className='flex flex-1 flex-col'>
        <HeroSection />
      </main>
    </div>
  )
}

export default HeroSectionPage
