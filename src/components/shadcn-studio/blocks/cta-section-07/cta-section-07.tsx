import { CheckIcon, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  '20+ ans d\'expertise immobilière',
  '200+ investisseurs accompagnés',
  'Master en Gestion de Patrimoine',
  'Spécialiste immobilier neuf',
  'Simulation gratuite et sans engagement',
  'Analyse personnalisée de votre fiscalité',
  'Suivi de votre projet sur 9 ans',
  'Réponse rapide sous 24h'
]

const CTASection = () => {
  return (
    <section className='bg-muted py-4 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Card className='rounded-3xl border-none py-4 shadow-none sm:py-8 lg:py-12'>
          <CardContent className='flex flex-col items-center justify-between gap-8 px-4 sm:gap-12 sm:px-8 lg:flex-row lg:gap-16 lg:px-12'>
            <div className='flex grow flex-col gap-8'>
              <div className='flex flex-col gap-3'>
                <h2 className='text-foreground text-2xl font-semibold md:text-3xl lg:text-4xl'>
                  Votre expert en défiscalisation immobilière Loi Jeanbrun
                </h2>
                <div className='inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2'>
                  <ShieldCheck className='size-4 text-white' />
                  <span className='text-sm font-semibold text-white'>Expert certifié</span>
                </div>
              </div>
              <p className='text-muted-foreground text-lg leading-relaxed'>
                Avec <strong>plus de 20 ans d&apos;expérience</strong> dans l&apos;immobilier neuf et un <strong>Master en Gestion de Patrimoine</strong>, j&apos;ai accompagné plus de <strong>200 investisseurs</strong> dans l&apos;optimisation de leur fiscalité. <strong className='text-foreground'>Pourquoi pas vous ?</strong>
              </p>

              <div className='grid gap-2 md:grid-cols-2'>
                {features.map((feature, index) => (
                  <div key={index} className='flex items-center gap-3 py-1'>
                    <div className='bg-primary flex size-5 items-center justify-center rounded-full p-0.5'>
                      <CheckIcon className='text-primary-foreground size-4' />
                    </div>
                    <span className='font-medium text-foreground'>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stats bar */}
              <div className='flex flex-col items-center justify-around bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] rounded-xl p-4 sm:flex-row sm:p-6'>
                <div className='text-center flex-1'>
                  <div className='text-3xl font-bold text-white'>20+</div>
                  <div className='text-sm text-white/80'>Années d&apos;expérience</div>
                </div>
                <div className='hidden w-px h-12 bg-white/20 sm:block'></div>
                <div className='text-center flex-1'>
                  <div className='text-3xl font-bold text-white'>200+</div>
                  <div className='text-sm text-white/80'>Clients accompagnés</div>
                </div>
                <div className='hidden w-px h-12 bg-white/20 sm:block'></div>
                <div className='text-center flex-1'>
                  <div className='text-3xl font-bold text-white'>75k€</div>
                  <div className='text-sm text-white/80'>Gain fiscal moyen</div>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <Button size='lg' className='rounded-lg text-base'>
                  Prendre rendez-vous
                </Button>
                <Button
                  size='lg'
                  className='bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 rounded-lg text-base'
                >
                  Faire une demande
                </Button>
              </div>
            </div>
            <div className='flex shrink-0 flex-col items-center gap-4'>
              <img
                src='/herve-voirin.avif'
                alt='Hervé Voirin'
                className='h-[16rem] w-auto rounded-xl object-cover shadow-lg sm:h-[20rem] lg:h-[28rem]'
              />
              <div className='text-center'>
                <h3 className='text-xl font-bold text-foreground'>Hervé Voirin</h3>
                <p className='text-sm text-muted-foreground'>Conseiller en Gestion de Patrimoine</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CTASection
