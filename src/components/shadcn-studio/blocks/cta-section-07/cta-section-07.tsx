import { CheckIcon, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  'Spécialiste immobilier neuf',
  'Simulation gratuite et sans engagement',
  'Analyse personnalisée de votre fiscalité',
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
                {/* Photo expert - mobile uniquement */}
                <div className='flex flex-col items-center gap-3 pt-4 lg:hidden'>
                  <img
                    src='/herve-voirin.avif'
                    alt='Hervé Voirin'
                    className='h-[16rem] w-auto rounded-xl object-cover shadow-lg sm:h-[20rem]'
                  />
                  <div className='text-center'>
                    <h3 className='text-xl font-bold text-foreground'>Hervé Voirin</h3>
                    <p className='text-sm text-muted-foreground'>Conseiller en Gestion de Patrimoine</p>
                  </div>
                </div>
              </div>
              <p className='text-muted-foreground text-lg leading-relaxed'>
                Avec <strong>plus de 20 ans d&apos;expérience</strong> dans l&apos;immobilier neuf et un <strong>Master en Gestion de Patrimoine</strong>, j&apos;ai accompagné plus de <strong>200 investisseurs</strong> dans l&apos;optimisation de leur fiscalité.              </p>

              <div className='grid gap-2'>
                {features.map((feature, index) => (
                  <div key={index} className='flex items-center gap-3 py-1'>
                    <div className='flex size-5 items-center justify-center rounded-full bg-[#1e3a5f] p-0.5'>
                      <CheckIcon className='size-4 text-white' />
                    </div>
                    <span className='font-medium text-foreground'>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stats bar - mobile only */}
              <div className='flex flex-col items-center justify-around bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] rounded-xl p-4 sm:flex-row sm:p-6 lg:hidden'>
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
                  <div className='text-3xl font-bold text-white'>55k€</div>
                  <div className='text-sm text-white/80'>Gain fiscal moyen</div>
                </div>
              </div>

              {/* Télécharger un exemple de simulation */}
              <div className='flex flex-col items-center gap-3 rounded-xl border border-[#1e3a5f]/20 bg-[#1e3a5f]/5 p-5'>
                <div className='flex items-center gap-3'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='size-8 text-[#c41e3a]' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/><line x1='12' y1='18' x2='12' y2='12'/><polyline points='9 15 12 18 15 15'/></svg>
                  <div>
                    <p className='text-base font-semibold text-[#1e3a5f]'>Exemple de simulation chiffrée</p>
                    <p className='text-sm text-muted-foreground'>Découvrez un cas concret d&apos;investissement Loi Jeanbrun</p>
                  </div>
                </div>
                <Button size='lg' className='w-full rounded-lg bg-[#c41e3a] text-base hover:bg-[#a01830]' asChild>
                  <a href='/exemple-simulation-jeanbrun.pdf' download>
                    Télécharger l&apos;exemple (PDF)
                  </a>
                </Button>
              </div>

              <Button size='lg' className='w-full rounded-lg bg-[#1e3a5f] text-base hover:bg-[#1e3a5f]/90'>
                Prendre rendez-vous
              </Button>
            </div>
            <div className='hidden shrink-0 flex-col items-center gap-4 lg:flex'>
              <img
                src='/herve-voirin.avif'
                alt='Hervé Voirin'
                className='h-[16rem] w-auto rounded-xl object-cover shadow-lg sm:h-[20rem] lg:h-[28rem]'
              />
              <div className='text-center'>
                <h3 className='text-xl font-bold text-foreground'>Hervé Voirin</h3>
                <p className='text-sm text-muted-foreground'>Conseiller en Gestion de Patrimoine</p>
              </div>
              {/* Stats bar - desktop only */}
              <div className='flex w-full items-center justify-around bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] rounded-xl p-4'>
                <div className='text-center flex-1'>
                  <div className='text-3xl font-bold text-white'>20+</div>
                  <div className='text-sm text-white/80'>Années d&apos;expérience</div>
                </div>
                <div className='w-px h-12 bg-white/20'></div>
                <div className='text-center flex-1'>
                  <div className='text-3xl font-bold text-white'>200+</div>
                  <div className='text-sm text-white/80'>Clients accompagnés</div>
                </div>
                <div className='w-px h-12 bg-white/20'></div>
                <div className='text-center flex-1'>
                  <div className='text-3xl font-bold text-white'>55k€</div>
                  <div className='text-sm text-white/80'>Gain fiscal moyen</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CTASection
