import { MailIcon, ClockIcon, ArrowRightIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type BlogCard = {
  image: string
  alt: string
  tags: string[]
  title: string
  date: string
  blogLink: string
}[]

const Blog = ({ blogCards }: { blogCards: BlogCard }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Blog Title */}
        <h2 className='text-3xl font-semibold text-center mb-8 sm:mb-12 md:text-4xl lg:text-5xl'>
          Blog <span className='text-primary'>Loi Jeanbrun</span>
        </h2>

        {/* Blog Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {blogCards.map((card, index) => (
            <a href={card.blogLink} key={index}>
              <Card className='py-0 shadow-none max-lg:last:col-span-full'>
                <CardContent className='px-0'>
                  <img src={card.image} alt={card.alt} className='w-full aspect-video rounded-t-xl object-cover' />
                  <div className='gap-4 space-y-4 p-6'>
                    <div className='mb-2 flex flex-wrap gap-2'>
                      {card.tags.map((tag, index) => (
                        <Badge key={index} className='bg-primary/10 text-primary border-none text-sm'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className='text-xl font-medium'>{card.title}</CardTitle>

                    {/* Author */}
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-10'>
                        <AvatarImage src='/herve-voirin.avif' alt='Hervé Voirin' className='object-cover object-top' />
                        <AvatarFallback>HV</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='text-sm font-semibold text-foreground'>Hervé Voirin</span>
                        <span className='text-xs text-muted-foreground'>Conseiller en Gestion de Patrimoine</span>
                      </div>
                    </div>

                    <CardDescription className='flex items-center gap-1.5 py-1 text-base'>
                      <ClockIcon className='text-muted-foreground size-5' />
                      <span className='text-muted-foreground'>{card.date}</span>
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Header + Newsletter - below articles */}
        <div className='mt-8 grid grid-cols-1 gap-8 sm:mt-12 sm:gap-12 md:grid-cols-2 lg:mt-24 lg:gap-16'>
          <div className='space-y-4'>
            <h3 className='text-2xl font-semibold md:text-3xl'>
              Votre veille fiscale et immobilière
            </h3>
            <p className='text-muted-foreground text-xl'>
              Analyses, conseils et actualités pour optimiser votre investissement locatif et réduire vos impôts.
            </p>
            <Button className='group rounded-lg text-base has-[>svg]:px-6' size='lg' asChild>
              <a href='/blog'>
                Découvrir tous les articles
                <ArrowRightIcon className='transition-transform duration-200 group-hover:translate-x-0.5' />
              </a>
            </Button>
          </div>

          {/* Newsletter Card */}
          <Card className='h-fit shadow-none'>
            <CardHeader className='flex gap-4'>
              <Avatar className='size-11.5'>
                <AvatarFallback className='bg-primary/10 text-primary'>
                  <MailIcon className='size-7.5' />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-0.5'>
                <CardTitle className='text-lg'>Restez informé</CardTitle>
                <CardDescription className='text-lg'>
                  Les meilleures opportunités d&apos;investissement Loi Jeanbrun directement dans votre boîte mail.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className='border-primary flex items-center gap-2.5 rounded-xl border-2 px-3 py-2'>
                <Input
                  type='email'
                  placeholder='Votre email'
                  className='h-10 border-0 !bg-transparent shadow-none focus-visible:ring-0'
                />
                <Button size='lg' className='rounded-lg text-base'>
                  M&apos;inscrire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Blog
