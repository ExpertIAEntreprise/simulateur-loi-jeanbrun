import { ArrowRightIcon } from 'lucide-react'

// Component Imports
import { MatterButton } from '@/components/ui/matter-button'
import { Card, CardContent } from '@/components/ui/card'
import { MotionPreset } from '@/components/ui/motion-preset'

const CTA = () => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <MotionPreset fade blur slide={{ direction: 'down', offset: 50 }} transition={{ duration: 0.7 }}>
          <Card className='group relative z-1 overflow-hidden rounded-2xl border-0 py-0 shadow-none'>
            <div className='absolute inset-0 -z-1'>
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/template/landing-page/matter/image-14.png'
                alt='background home assistant robot'
                className='h-full w-full object-cover dark:hidden'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/template/landing-page/matter/image-14-dark.png'
                alt='background home assistant robot dark'
                className='hidden h-full w-full object-cover dark:block'
              />
            </div>
            <CardContent className='lg:px-14'>
              <div className='grid grid-cols-1 items-end gap-5 lg:grid-cols-2 lg:gap-10'>
                {/* Left Column - Content */}
                <div className='flex h-full flex-col justify-center space-y-8 py-6 text-white'>
                  <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl text-yellow-500'>
                    AVANTAGE EXCEPTIONNEL
                  </h2>

                  <p className='text-base leading-relaxed opacity-90 md:text-xl'>
                    Le plafond de déficit foncier imputable sur le revenu global <strong>DOUBLE</strong>, passant de 10 700 € à <strong>21 400 € par an</strong> jusqu&apos;au 31 décembre 2027. Cet avantage est réservé à <strong>l&apos;immobilier ancien avec travaux de rénovation énergétique</strong> (non applicable au neuf).
                  </p>

                  {/* Button - desktop: sous le texte */}
                  <div className='hidden pt-2 lg:block'>
                    <MatterButton size='lg'>
                      <span>Simulez gratuitement votre avantage fiscal personnalisé</span>
                      <ArrowRightIcon className='h-4 w-4 -rotate-45' />
                    </MatterButton>
                  </div>
                </div>

                {/* Right Column - Image */}
                <div className='relative pt-6'>
                  <img
                    src='/couple-investisseur-loi-jeanbrun.webp'
                    alt='Couple investisseur avec guide Loi Jeanbrun 2026'
                    className='w-full object-cover transition-transform duration-300 group-hover:scale-105 max-lg:mx-auto max-lg:max-w-full max-lg:px-4'
                  />
                </div>
              </div>

              {/* Button - mobile: centré en dessous */}
              <div className='flex justify-center pb-6 pt-4 lg:hidden'>
                <MatterButton size='lg'>
                  <span className='sm:hidden'>Simuler mon avantage</span>
                  <span className='hidden sm:inline'>Simulez gratuitement votre avantage fiscal personnalisé</span>
                  <ArrowRightIcon className='h-4 w-4 -rotate-45' />
                </MatterButton>
              </div>
            </CardContent>
          </Card>
        </MotionPreset>
      </div>
    </section>
  )
}

export default CTA
