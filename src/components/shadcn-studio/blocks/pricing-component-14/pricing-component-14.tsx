import { CheckIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import { NumberTicker } from '@/components/ui/number-ticker'

type Plan = {
  name: string
  price: number
  suffix: string
  description: string
  features: string[]
  buttonText: string
  isPro?: boolean
  badge?: string
}[]

const Pricing = ({ plans }: { plans: Plan }) => {
  return (
    <section className='bg-muted px-4 py-12 sm:px-6 lg:px-8 lg:py-24'>
      <header className='mx-auto mb-8 max-w-7xl text-left sm:mb-12 lg:mb-24 lg:text-center'>
        <p className='text-primary text-sm font-medium tracking-wide uppercase'>NOS FORMULES</p>
        <h2 className='text-foreground mt-4 text-2xl font-semibold md:text-3xl lg:text-4xl'>Simulez gratuitement ou bénéficiez d&apos;un accompagnement expert</h2>
        <p className='text-muted-foreground mt-4 text-base sm:text-lg'>
          Démarrez avec notre simulateur gratuit, ou optez pour un accompagnement personnalisé avec notre expert certifié - remboursé à 100% si vous investissez.
        </p>
      </header>

      <div className='flex flex-col items-center justify-center gap-6 md:flex-row md:gap-0'>
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={cn('py-8', {
              'shadow-none': !plan.isPro,
              'bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] border-none shadow-xl md:-ml-4': plan.isPro
            })}
          >
            <CardContent className='flex max-w-lg flex-col gap-6 px-8'>
              <div className='gap-4'>
                {plan.badge && (
                  <div className='mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5'>
                    <span className='text-xs font-semibold text-white'>{plan.badge}</span>
                  </div>
                )}
                <h3 className={cn('mb-2 text-2xl font-semibold sm:text-3xl', { 'text-primary-foreground': plan.isPro })}>
                  {plan.name}
                </h3>
                <div className='flex gap-1'>
                  <span className={cn('text-4xl font-bold sm:text-5xl', { 'text-primary-foreground': plan.isPro })}>
                    <NumberTicker startValue={0} value={plan.price} />
                  </span>
                  {plan.suffix && (
                    <span className={cn('self-end text-lg', { 'text-primary-foreground': plan.isPro })}>
                      {plan.suffix}
                    </span>
                  )}
                </div>
                <p className={cn('text-muted-foreground mt-4', { 'text-primary-foreground': plan.isPro })}>
                  {plan.description}
                </p>
              </div>

              <ul className='flex flex-col gap-4.5'>
                {plan.features.map((feature, i) => (
                  <li key={i} className='flex items-center gap-2'>
                    <CheckIcon className={cn('size-3.5', { 'text-primary-foreground': plan.isPro })} />
                    <span className={cn({ 'text-primary-foreground': plan.isPro })}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.isPro ? 'secondary' : 'outline'} size='lg' className='w-full'>
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Pricing
