'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Rating } from '@/components/ui/rating'
import { useEffect, useRef } from 'react'

type Testimonial = {
  name: string
  title: string
  text: string
  rating: number
}

type TestimonialsProps = {
  testimonials: Testimonial[]
}

export default function TestimonialsSimple({ testimonials }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollInterval: NodeJS.Timeout

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollLeft = 0
        } else {
          scrollContainer.scrollLeft += 1
        }
      }, 30)
    }

    startScroll()

    return () => clearInterval(scrollInterval)
  }, [])

  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <p className='text-primary text-sm font-medium uppercase mb-2'>Témoignages clients</p>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl mb-4'>
            Ils nous font confiance
          </h2>
          <p className='text-muted-foreground text-xl mb-6'>
            Découvrez les retours d'expérience de nos clients qui ont investi avec succès grâce à notre accompagnement expert.
          </p>

          {/* Global Rating */}
          <div className='flex items-center justify-center gap-3'>
            <Rating readOnly variant='yellow' size={24} value={4.7} precision={0.1} />
            <span className='text-2xl font-bold text-foreground'>4.7/5</span>
            <span className='text-muted-foreground'>(92 avis)</span>
          </div>
        </div>

        {/* Testimonials Grid with Auto-Scroll */}
        <div
          ref={scrollRef}
          className='flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
          style={{ scrollBehavior: 'auto' }}
        >
          {testimonials.map((testimonial, index) => (
            <Card key={index} className='w-[380px] flex-shrink-0 shadow-sm'>
              <CardContent className='p-6 space-y-3'>
                {/* Rating */}
                <Rating readOnly variant='yellow' size={20} value={testimonial.rating} precision={0.5} />

                {/* Title */}
                <h3 className='text-base font-bold text-foreground'>{testimonial.title}</h3>

                {/* Text */}
                <p className='text-muted-foreground text-sm leading-relaxed line-clamp-4'>
                  {testimonial.text}
                </p>

                {/* Name */}
                <p className='font-semibold text-foreground text-sm'>{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
