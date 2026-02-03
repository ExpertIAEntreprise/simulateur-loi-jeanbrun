import TestimonialsComponent from '@/components/shadcn-studio/blocks/testimonials-component-05/testimonials-component-05'
import type { TestimonialItem } from '@/components/shadcn-studio/blocks/testimonials-component-05/testimonials-component-05'

const testimonials: TestimonialItem[] = [
  {
    name: 'Zain Vetrovs',
    role: 'CEO & Co Founder',
    company: 'Oracle',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    rating: 4.5,
    title: 'Enhanced Learning Experience',
    content:
      "ThemeSelection's admin template impresses me with its code structure, quality, and UI design. It's highly customizable, user-friendly, and comes with essential features and pre-designed components for quick setup. The support team is also very helpful."
  },
  {
    name: 'Sarah Johnson',
    role: 'Lead Designer',
    company: 'Figma',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
    rating: 5,
    title: 'Outstanding Design System',
    content:
      "shadcn/studio has revolutionized our design workflow. The components are beautifully crafted and incredibly intuitive. It's saved us countless hours in development and maintains consistency across our entire product suite."
  },
  {
    name: 'Michael Chen',
    role: 'Frontend Developer',
    company: 'Vercel',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    rating: 4.5,
    title: 'Developer Experience Excellence',
    content:
      'The developer experience with shadcn/studio is unmatched. Clean code, excellent documentation, and seamless integration. It has become an essential part of our development toolkit for building modern web applications.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    company: 'Stripe',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    rating: 5,
    title: 'Game-Changing Components',
    content:
      'shadcn/studio has transformed how we approach product development. The quality and attention to detail in every component is remarkable. It enables our team to focus on what matters most - delivering value to our users.'
  },
  {
    name: 'David Kim',
    role: 'Tech Lead',
    company: 'GitHub',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',
    rating: 4.5,
    title: 'Remarkable Code Quality',
    content:
      'The code quality and architecture of shadcn/studio components is exceptional. It follows best practices and provides excellent TypeScript support. Perfect for teams that value maintainable and scalable code.'
  },
  {
    name: 'Alex Turner',
    role: 'UX Designer',
    company: 'Airbnb',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',
    rating: 4.5,
    title: 'Intuitive User Experience',
    content:
      "shadcn/studio makes creating beautiful interfaces effortless. The design system is thoughtfully crafted and the components work seamlessly together. It has significantly improved our team's productivity."
  },
  {
    name: 'Lisa Park',
    role: 'Product Designer',
    company: 'Spotify',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',
    rating: 5,
    title: 'Perfect Design Foundation',
    content:
      "The attention to detail in shadcn/studio is incredible. Every component feels polished and production-ready. It's become our go-to solution for rapid prototyping and building scalable design systems."
  }
]

const TestimonialsComponentPage = () => {
  return <TestimonialsComponent testimonials={testimonials} />
}

export default TestimonialsComponentPage
