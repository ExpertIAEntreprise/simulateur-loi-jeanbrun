import ProcessFlow from '@/components/shadcn-studio/blocks/features-section-23/process-flow'
import type { Process } from '@/components/shadcn-studio/blocks/features-section-23/process-flow'

import { Badge } from '@/components/ui/badge'

import { MotionPreset } from '@/components/ui/motion-preset'

const Features = ({ features }: { features: Process[] }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 xl:gap-16'>
          {/* Left content */}
          <div className='space-y-4'>
            <MotionPreset fade blur slide={{ direction: 'down', offset: 50 }} transition={{ duration: 0.5 }}>
              <Badge variant='outline' className='text-sm font-normal'>
                Pourquoi investir maintenant
              </Badge>
            </MotionPreset>
            <MotionPreset
              component='h2'
              className='text-2xl font-semibold md:text-3xl lg:text-4xl'
              fade
              blur
              slide={{ direction: 'down', offset: 50 }}
              delay={0.15}
              transition={{ duration: 0.5 }}
            >
              Les 4 piliers de l'investissement Loi Jeanbrun
            </MotionPreset>
            <MotionPreset
              component='p'
              className='text-muted-foreground text-xl'
              fade
              blur
              slide={{ direction: 'down', offset: 50 }}
              delay={0.3}
              transition={{ duration: 0.5 }}
            >
              Un dispositif unique qui combine défiscalisation, protection familiale, préparation retraite et revenus fonciers optimisés. Découvrez pourquoi investir dans l'immobilier neuf n'a jamais été aussi avantageux.
            </MotionPreset>

          </div>

          {/* Right content */}
          <MotionPreset fade blur transition={{ duration: 0.7 }} className='h-82.5 max-sm:h-97.5'>
            <ProcessFlow initialProcess={features} />
          </MotionPreset>
        </div>
      </div>
    </section>
  )
}

export default Features
