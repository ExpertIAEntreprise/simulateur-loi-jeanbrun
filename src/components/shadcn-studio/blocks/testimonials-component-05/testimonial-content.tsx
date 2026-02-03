'use client'

import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'

import { cn } from '@/lib/utils'
import { Rating } from '@/components/ui/rating'

type Testimonial = {
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  title: string
  content: string
}

const TestimonialContent = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <>
      {/* Users Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true
        }}
        className='relative flex items-center justify-center gap-6'
      >
        {/* Carousel Previous Button */}
        <CarouselPrevious variant='ghost' className='static size-9 translate-y-0' />

        {/* Carousel Content */}
        <CarouselContent className='ml-0 h-18 items-center'>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className='flex basis-1/3 justify-center pl-0 sm:basis-1/5'>
              <Avatar
                className={cn('size-13 rounded-lg transition-all duration-300', {
                  'size-18': current === index,
                  'size-15.5':
                    current === 0
                      ? index === testimonials.length - 1 || current + 1 === index
                      : current === testimonials.length - 1
                        ? current - 1 === index || index === 0
                        : current - 1 === index || current + 1 === index
                })}
              >
                <AvatarImage src={`${testimonial.avatar}?width=80&height=80&format=auto`} alt={testimonial.name} />
                <AvatarFallback className='rounded-lg text-sm'>
                  {testimonial.name
                    .split(' ', 2)
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Next Button */}
        <CarouselNext variant='ghost' className='static size-9 translate-y-0' />
      </Carousel>

      {/* Testimonial Details */}
      {testimonials[current] != null && (
      <Card className='shadow-none'>
        <CardContent className='flex gap-6 max-sm:flex-col sm:items-center'>
          <Avatar className='size-44 rounded-lg'>
            <AvatarImage
              src={`${testimonials[current].avatar}?width=176&height=176&format=auto`}
              alt={testimonials[current].name}
            />
            <AvatarFallback className='rounded-lg'>
              {testimonials[current].name
                .split(' ', 2)
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 space-y-4'>
            <h3 className='text-xl font-semibold'>{testimonials[current].title}</h3>
            <p className='text-muted-foreground'>{testimonials[current].content}</p>
            <hr className='w-20' />
            <div className='flex items-center justify-between gap-6'>
              <div className='space-y-3'>
                <h4 className='font-medium'>{testimonials[current].name}</h4>
                <p className='text-muted-foreground text-sm'>
                  {testimonials[current].role} at{' '}
                  <span className='text-card-foreground font-medium'>{testimonials[current].company}</span>
                </p>
              </div>

              <Rating readOnly variant='yellow' size={24} value={testimonials[current].rating} precision={0.5} />
            </div>
          </div>
        </CardContent>
      </Card>
      )}
    </>
  )
}

export default TestimonialContent
