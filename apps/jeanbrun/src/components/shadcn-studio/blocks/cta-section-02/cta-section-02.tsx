import { SendIcon, CheckCircleIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const guideContents = [
  "Qu'est-ce que la loi Jeanbrun ?",
  "La réduction d'impôt",
  "Les conditions d'éligibilité",
  "Où investir en 2026 ?",
  "Exemple d'investissement chiffré",
  "Risques et pièges à éviter",
  "Ma déclaration d'impôts",
]

const CTASection = () => {
  return (
    <section className='bg-muted py-6 sm:py-10 lg:py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Card className='bg-background rounded-3xl py-6 shadow-none sm:py-8 lg:py-10'>
          <CardContent className='flex items-center justify-between gap-12 px-8 max-lg:flex-col sm:px-16 lg:px-24'>
            {/* Left: Guide Image */}
            <div className='flex-shrink-0'>
              <img
                src='/loi-jeanbrun-guide-defiscalisation-2026.webp'
                alt='Guide officiel défiscalisation Loi Jeanbrun 2026'
                className='h-auto w-full max-w-[300px] rounded-lg shadow-lg'
              />
            </div>

            {/* Right: Text content + Form */}
            <div className='flex flex-1 flex-col gap-6'>
              <Badge className='w-fit bg-[#1e3a5f] text-sm font-normal uppercase tracking-wide text-white'>
                Guide gratuit et sans engagement
              </Badge>
              <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
                Recevez le guide officiel de la défiscalisation
              </h2>
              <p className='text-muted-foreground text-xl'>
                Loi Jeanbrun immobilière 2026
              </p>
              <ul className='mt-2 grid gap-3 sm:grid-cols-2'>
                {guideContents.map((item, index) => (
                  <li key={index} className='flex items-center gap-2 text-sm'>
                    <CheckCircleIcon className='size-5 shrink-0 text-[#c41e3a]' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Email Form */}
              <div className='mt-4 flex flex-col gap-3 sm:flex-row sm:items-center'>
                <Input
                  type='email'
                  placeholder='Votre adresse email'
                  required
                  className='h-12 sm:flex-1'
                />
                <Button size='lg' className='rounded-lg bg-[#c41e3a] text-base hover:bg-[#a01830]'>
                  <SendIcon className='mr-2 size-5' />
                  Recevoir le guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CTASection
