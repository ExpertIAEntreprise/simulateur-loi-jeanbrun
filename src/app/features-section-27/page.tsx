import { BadgePercentIcon, TrendingUpIcon, CrownIcon } from 'lucide-react'

import Features from '@/components/shadcn-studio/blocks/features-section-27/features-section-27'

const tabs = [
  {
    name: 'Sales leader',
    value: 'sales',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/Orion/image-39.png',
    icon: <BadgePercentIcon />,
    title: 'Sales Leaders use ai agent to automate and optimise sales workflows',
    description:
      'This helps sales teams reduce tasks like lead qualification and follow-ups. With automated workflows, sales teams can focus on closing deals faster, prioritizing high-value prospects, and increasing conversion rates consistently.',
    link: '#',
    testimonials: [
      {
        id: '1',
        review: "By automating lead qualification and follow-up tasks, we've focused on high-impact sales activities."
      },
      { id: '2', review: 'AI has helped us streamline our sales processes, making the team more productive.' },
      {
        id: '3',
        review:
          'Our sales cycle has been cut down by 30%, thanks to the efficiency and precision provided by AI automation.'
      }
    ]
  },
  {
    name: 'Marketing leader',
    value: 'marketing',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/Orion/image-38.png',
    icon: <TrendingUpIcon />,
    title: 'Marketing Leaders leverage ai to optimize campaign performance',
    description:
      'AI-powered tools help marketing teams analyze customer behavior, personalize content, and automate campaign management at scale. This enables marketing leaders to drive better engagement, improved targeting, and higher ROI across channels.',
    link: '#',
    testimonials: [
      { id: '1', review: "With AI-driven insights, we've increased our campaign effectiveness by 40%." },
      {
        id: '2',
        review: 'AI tools have transformed how we optimize our marketing strategies, delivering exceptional ROI.'
      },
      {
        id: '3',
        review: "Thanks to AI, we've personalized campaigns at scale, leading to stronger customer engagement."
      }
    ]
  },
  {
    name: 'Founders',
    value: 'founders',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/Orion/image-37.png',
    icon: <CrownIcon />,
    title: 'Founders use ai to scale operations and make faster, smarter decisions',
    description:
      'AI helps founders automate routine work, gain clear insights from data, and run leaner operations efficiently. This allows them to focus on strategic growth, innovation, faster execution, and building long-term value.',
    link: '#',
    testimonials: [
      {
        id: '1',
        review: 'AI automation has helped us scale faster while maintaining quality across all operations.'
      },
      {
        id: '2',
        review: 'Leveraging AI has enabled us to optimize our workflow, cutting down overhead costs significantly.'
      },
      {
        id: '3',
        review: 'AI has given us deeper insights, helping us make data-driven decisions that fuel our growth.'
      }
    ]
  }
]

const FeaturesPage = () => {
  return <Features tabs={tabs} />
}

export default FeaturesPage
