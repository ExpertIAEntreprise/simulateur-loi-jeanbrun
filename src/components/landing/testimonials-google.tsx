'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Rating } from '@/components/ui/rating'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { BadgeCheck } from 'lucide-react'
import { useState } from 'react'

type Testimonial = {
  name: string
  date: string
  text: string
  rating: number
  initials: string
  avatarColor: string
}

type TestimonialsProps = {
  testimonials: Testimonial[]
}

// Logo Google SVG
const GoogleLogo = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
    <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
    <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
    <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
    <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
    <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
  </svg>
)

export default function TestimonialsGoogle({ testimonials }: TestimonialsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className='bg-background py-12 sm:py-16 lg:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header avec logo Google */}
        <div className='mb-12 flex flex-col items-center justify-center'>
          <GoogleLogo className='mb-4 h-10 w-auto' />

          {/* 5 étoiles pleines */}
          <div className='mb-2'>
            <Rating readOnly variant='yellow' size={28} value={5} precision={1} />
          </div>

          {/* Basée sur X avis */}
          <p className='text-lg font-medium text-foreground'>
            Basée sur <strong>79 avis</strong>
          </p>
        </div>

        {/* Carousel de témoignages */}
        <Carousel
          opts={{
            align: 'start',
            loop: true
          }}
          className='mx-auto w-full max-w-6xl'
        >
          <CarouselContent className='-ml-4'>
            {testimonials.map((testimonial, index) => {
              const isExpanded = expandedIndex === index
              const shouldTruncate = testimonial.text.length > 150

              return (
                <CarouselItem key={index} className='pl-4 md:basis-1/2 lg:basis-1/3'>
                  <Card className='h-full shadow-md hover:shadow-lg transition-shadow'>
                    <CardContent className='p-6 space-y-4'>
                      {/* Header: Avatar + Nom + Logo Google */}
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-3'>
                          {/* Avatar avec initiales */}
                          <div
                            className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white'
                            style={{ backgroundColor: testimonial.avatarColor }}
                          >
                            {testimonial.initials}
                          </div>

                          {/* Nom + Date */}
                          <div>
                            <p className='font-semibold text-foreground'>{testimonial.name}</p>
                            <p className='text-sm text-muted-foreground'>{testimonial.date}</p>
                          </div>
                        </div>

                        {/* Mini logo Google */}
                        <GoogleLogo className='h-5 w-auto flex-shrink-0' />
                      </div>

                      {/* Rating avec badge vérifié */}
                      <div className='flex items-center gap-2'>
                        <Rating readOnly variant='yellow' size={18} value={5} precision={1} />
                        <BadgeCheck className='h-5 w-5 text-blue-500 fill-blue-500' />
                      </div>

                      {/* Texte du témoignage */}
                      <div className='min-h-[80px]'>
                        <p className='text-sm leading-relaxed text-muted-foreground'>
                          {isExpanded || !shouldTruncate
                            ? testimonial.text
                            : `${testimonial.text.slice(0, 150)}...`}
                        </p>
                      </div>

                      {/* Lien "Lire la suite" */}
                      {shouldTruncate && (
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : index)}
                          className='text-sm font-medium text-primary hover:underline'
                        >
                          {isExpanded ? 'Voir moins' : 'Lire la suite'}
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          {/* Flèches de navigation */}
          <CarouselPrevious className='-left-12' />
          <CarouselNext className='-right-12' />
        </Carousel>
      </div>
    </section>
  )
}
