import type { ComponentType } from 'react'

import { ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { MotionPreset } from '@/components/ui/motion-preset'

type Content = {
  buttonIcon: ComponentType<{ className?: string }>
  title: string
  description: string
  image: string
  documentationLink: string
}

type tabsData = {
  name: string
  icon: ComponentType<{ className?: string }>
  value: string
  content: Content
}[]

const Features = ({ tabs }: { tabs: tabsData }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-6 flex items-center justify-between gap-9 max-sm:flex-col'>
          <div className='max-w-3xl'>
            <MotionPreset
              component='h2'
              className='mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl'
              fade
              slide={{ direction: 'left', offset: 50 }}
              blur
              transition={{ duration: 0.5 }}
            >
              Exemples de simulations chiffrées
            </MotionPreset>
            <MotionPreset
              component='p'
              className='text-muted-foreground text-xl'
              fade
              blur
              slide={{ direction: 'left', offset: 50 }}
              delay={0.2}
              transition={{ duration: 0.5 }}
            >
              Découvrez 4 cas concrets d&apos;investissement Loi Jeanbrun selon votre profil fiscal. Tous les chiffres sont basés sur la législation PLF 2026.
            </MotionPreset>
          </div>
        </div>

        <Tabs defaultValue={tabs[0]?.value ?? ''} className='gap-8 sm:gap-16 lg:gap-24'>
          <MotionPreset fade blur slide={{ direction: 'left', offset: 50 }} delay={0.4} transition={{ duration: 0.5 }}>
            <TabsList className='h-auto flex-wrap justify-start gap-1.5 bg-transparent p-0 sm:gap-2'>
              {tabs.map(({ icon: Icon, name, value }) => (
                <TabsTrigger key={value} value={value} className='flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs data-[state=active]:border-[#1e3a5f] data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white data-[state=active]:shadow-none sm:gap-1.5 sm:px-4 sm:py-2 sm:text-base'>
                  <Icon className='size-3 sm:size-4' />
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </MotionPreset>

          {tabs.map(tab => {
            const IconComponent = tab.content.buttonIcon

            return (
              <TabsContent key={tab.value} value={tab.value}>
                <div className='flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-11'>
                  {/* Image mobile : au-dessus du titre */}
                  <MotionPreset fade blur zoom={{ initialScale: 0.75 }} transition={{ duration: 0.7 }} className='lg:hidden'>
                    <img src={tab.content.image} alt={tab.name} className='mt-8 h-auto max-w-full rounded-xl object-contain dark:hidden' />
                    <img
                      src={`${tab.content.image.replace('.png', '-dark.png')}`}
                      alt={tab.name}
                      className='mt-8 hidden h-auto max-w-full rounded-xl object-contain dark:inline-block'
                    />
                  </MotionPreset>

                  <MotionPreset fade slide={{ direction: 'down', offset: 70 }} blur transition={{ duration: 0.7 }}>
                    <div className='flex flex-col gap-4 lg:w-2xl'>
                      <Avatar className='border-primary hidden border sm:flex'>
                        <AvatarFallback className='text-primary bg-transparent [&>svg]:size-4'>
                          <IconComponent />
                        </AvatarFallback>
                      </Avatar>

                      <p className='text-primary hidden font-medium uppercase sm:block'>{tab.name}</p>

                      <h3 className='text-card-foreground text-2xl font-semibold'>{tab.content.title}</h3>

                      <p className='text-muted-foreground whitespace-pre-line'>{tab.content.description}</p>

                      <Button className='group w-fit rounded-full bg-[#1e3a5f] text-base has-[>svg]:px-6 hover:bg-[#1e3a5f]/90' size='lg' asChild>
                        <a href={tab.content.documentationLink}>
                          Lancer ma simulation{' '}
                          <ChevronRightIcon className='transition-transform duration-200 group-hover:translate-x-0.5' />
                        </a>
                      </Button>
                    </div>
                  </MotionPreset>

                  {/* Image desktop : à droite */}
                  <MotionPreset fade blur zoom={{ initialScale: 0.75 }} transition={{ duration: 0.7 }} className='hidden lg:block'>
                    <img src={tab.content.image} alt={tab.name} className='h-auto max-w-full object-contain dark:hidden sm:h-103 sm:w-118' />
                    <img
                      src={`${tab.content.image.replace('.png', '-dark.png')}`}
                      alt={tab.name}
                      className='hidden h-auto max-w-full object-contain dark:inline-block sm:h-103 sm:w-118'
                    />
                  </MotionPreset>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}

export default Features
