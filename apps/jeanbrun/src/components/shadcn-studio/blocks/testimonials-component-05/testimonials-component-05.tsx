import { Badge } from '@/components/ui/badge'

import TestimonialContent from '@/components/shadcn-studio/blocks/testimonials-component-05/testimonial-content'

export type TestimonialItem = {
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  title: string
  content: string
}

type TestimonialsComponentProps = {
  testimonials: TestimonialItem[]
}

const TestimonialsComponent = ({ testimonials }: TestimonialsComponentProps) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-12 px-4 sm:space-y-16 sm:px-6 lg:space-y-24 lg:px-8'>
        {/* Header Content */}
        <div className='space-y-4 text-center'>
          <Badge variant='outline' className='text-sm font-normal'>
            Testimonial
          </Badge>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Some of our valuable customers feedback</h2>
          <p className='text-muted-foreground text-xl'>
            Predictive analytics, and recommendations to optimize their processes and better business outcomes.
          </p>
        </div>

        {/* Testimonials Content */}
        <TestimonialContent testimonials={testimonials} />
      </div>
    </section>
  )
}

export default TestimonialsComponent
