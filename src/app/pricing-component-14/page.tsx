import Pricing from '@/components/shadcn-studio/blocks/pricing-component-14/pricing-component-14'

const plans = [
  {
    name: 'Free Plan',
    price: 0,
    suffix: '',
    description: 'Recommended for people with at least 1 year experience in crypto markets.',
    features: [
      'Access to basic trading tools',
      'Weekly market trend reports',
      'Exclusive customer feedback sessions',
      'Limited access to educational resources'
    ],
    buttonText: 'Get started for free'
  },
  {
    name: 'Enterprise',
    price: 99,
    suffix: '/month',
    description: 'Recommended for people with at least 1 year experience in crypto markets.',
    features: [
      'Dedicated account manager',
      '24/7 real-time market analysis',
      'Personalized portfolio reviews',
      'Invitations to premium webinars',
      'Access to exclusive industry reports'
    ],
    isPro: true,
    buttonText: 'Get started'
  }
]

const PricingPage = () => {
  return <Pricing plans={plans} />
}

export default PricingPage
