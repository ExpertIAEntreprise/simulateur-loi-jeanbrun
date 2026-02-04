'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

import TestimonialStack from '@/components/shadcn-studio/blocks/features-section-27/testimonial-stack'
import type { TestimonialCard } from '@/components/shadcn-studio/blocks/features-section-27/testimonial-stack'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

import { MotionPreset } from '@/components/ui/motion-preset'

type Tab = {
  name: string
  value: string
  image: string
  icon: ReactNode
  title: string
  description: string
  link: string
  testimonials: TestimonialCard[]
}[]

const Features = ({ tabs }: { tabs: Tab }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || 'sales')

  return (
    <section className='pt-2 pb-8 sm:py-16 lg:py-24'>
      <div className='border-y'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <div className='grid border-x-1 lg:grid-cols-3'>
              {/* Left Section */}
              <div className='flex flex-col justify-between lg:col-span-2'>
                <h2 className='px-4 py-9 text-3xl font-medium md:text-4xl lg:text-5xl'>
                  Qu&apos;est-ce que la <span className='text-primary'>loi Jeanbrun</span> ?
                </h2>
                <Separator />
                {tabs.map(tab => (
                  <TabsContent key={tab.value} value={tab.value} className='px-4 pt-8'>
                    <MotionPreset fade blur transition={{ duration: 0.5 }}>
                      <div className='space-y-4'>
                        <h3 className='text-2xl font-semibold'>{tab.title}</h3>
                        <p className='text-lg whitespace-pre-line'>{tab.description}</p>
                      </div>
                    </MotionPreset>
                  </TabsContent>
                ))}
                {/* Tab Triggers */}
                <TabsList className='*:not-last:border-r-border mt-8 h-auto min-h-20 w-full justify-start divide-x rounded-none border-t bg-transparent p-0'>
                  {tabs.map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className='data-[state=active]:bg-muted data-[state=active]:[&>span:first-child]:bg-primary data-[state=active]:[&>span:first-child]:text-primary-foreground [&>span:first-child]:text-primary [&>span:first-child]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:text-primary dark:data-[state=active]:bg-muted basis-1/3 gap-x-2 gap-y-1 overflow-hidden rounded-none px-2 font-normal data-[state=active]:shadow-none max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:py-3 sm:h-18'
                    >
                      <span className='flex size-7 shrink-0 items-center justify-center rounded-md [&>svg]:size-4'>
                        {tab.icon}
                      </span>
                      <span className='text-xs text-wrap sm:text-base lg:text-xl'>{tab.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Right Section - Image and Reviews */}
              {tabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value} asChild className='border-l max-lg:hidden'>
                  <div className='relative h-140 w-full'>
                    <img src={tab.image} alt={`${tab.name} Image`} className='size-full object-cover' />
                    <div className='absolute inset-x-6 bottom-6'>
                      <TestimonialStack testimonials={tab.testimonials} />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default Features
