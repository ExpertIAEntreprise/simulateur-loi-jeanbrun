import Link from 'next/link'
import { Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SocialLink {
  name: string
  url: string
  icon: typeof Linkedin
}

interface SocialLinksProps {
  linkedin?: string
  twitter?: string
  email?: string
  phone?: string
  location?: string
}

export function SocialLinks({
  linkedin = "https://linkedin.com/in/expert-jeanbrun",
  twitter,
  email = "contact@simulateur-jeanbrun.fr",
  phone,
  location = "Paris, France",
}: SocialLinksProps) {
  const socialLinks: SocialLink[] = [
    ...(linkedin ? [{ name: "LinkedIn", url: linkedin, icon: Linkedin }] : []),
    ...(twitter ? [{ name: "Twitter", url: twitter, icon: Twitter }] : []),
  ]

  const contactInfo = [
    ...(email ? [{ name: "Email", value: email, icon: Mail, href: `mailto:${email}` }] : []),
    ...(phone ? [{ name: "Telephone", value: phone, icon: Phone, href: `tel:${phone}` }] : []),
    ...(location ? [{ name: "Localisation", value: location, icon: MapPin }] : []),
  ]

  return (
    <section id="contact" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Restons en contact
          </h2>
          <p className="mb-8 text-muted-foreground">
            Retrouvez-moi sur les reseaux sociaux ou contactez-moi directement
          </p>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-8 flex justify-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.name}
                    variant="outline"
                    size="lg"
                    asChild
                    className="gap-2"
                  >
                    <Link href={social.url} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                      {social.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
            {contactInfo.map((info) => {
              const Icon = info.icon
              const content = (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{info.value}</span>
                </div>
              )

              if ('href' in info && info.href) {
                return (
                  <Link
                    key={info.name}
                    href={info.href}
                    className="rounded-lg border bg-card px-4 py-2 transition-colors hover:bg-accent"
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <div
                  key={info.name}
                  className="rounded-lg border bg-card px-4 py-2"
                >
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
