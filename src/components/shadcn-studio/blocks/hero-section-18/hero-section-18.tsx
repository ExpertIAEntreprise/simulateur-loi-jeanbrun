import { ChevronRight, PiggyBank, TrendingUp, Building2, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

const HeroSection = () => {
  return (
    <section className='relative flex flex-1 justify-end overflow-hidden py-12 sm:py-16 md:items-end lg:py-24'>
      {/* Image de fond */}
      <Image
        src="/loi-jeanbrun-appartement-neuf-hero.webp"
        alt="Appartement neuf éligible loi Jeanbrun - investissement locatif défiscalisation"
        fill
        priority
        className='object-cover'
      />
      {/* Overlay gradient */}
      <div className='absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent' />

      {/* Cadre blanc avec bouton rouge + texte - aligné avec le contenu en bas */}
      <div className='absolute bottom-[320px] left-1/2 z-10 w-full max-w-7xl -translate-x-1/2 px-4 sm:px-6 lg:px-8'>
        <div className='flex w-full gap-0 max-md:flex-col'>
          {/* Rectangle principal (2/3) avec cercle rouge */}
          <div className='flex w-2/3 items-center gap-8 rounded-l-xl bg-white/65 p-8 shadow-lg backdrop-blur-sm max-md:w-full max-md:rounded-xl'>
            {/* Texte titre + sous-titre */}
            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-[#1e3a5f] lg:text-4xl'>
                La révolution fiscale : l&apos;amortissement sur le revenu global
              </h1>
              <h2 className='mt-6 text-2xl font-bold text-[#1e3a5f] lg:text-3xl'>
                Jusqu&apos;à 12 000 euros de réduction du revenu imposable
              </h2>
              <p className='mt-6 text-lg text-[#1e3a5f]/80'>
                Le nouveau dispositif de défiscalisation Relance Logement 2026 dédié aux Français.
              </p>
              <p className='mt-2 text-lg text-[#1e3a5f]/80'>
                Calculez votre avantage fiscal en moins de 2 minutes.
              </p>
            </div>

            {/* Bouton rond rouge - pointe vers le formulaire à droite */}
            <Link
              href="/simulateur"
              className='flex size-56 shrink-0 flex-col items-center justify-center rounded-full bg-[#c41e3a] text-white shadow-xl transition-transform hover:scale-105 lg:size-64'
            >
              <span className='text-sm font-medium uppercase tracking-wide'>En quelques clics</span>
              <span className='mt-2 text-center text-base font-bold uppercase leading-tight'>
                ESTIMEZ VOTRE<br />RÉDUCTION D&apos;IMPÔT
              </span>
              <span className='mt-2 text-xs font-medium uppercase tracking-wide'>Gratuit sans engagement</span>
              <ChevronRight className='mt-2 size-8 animate-bounce' />
            </Link>
          </div>

          {/* Nouveau rectangle blanc (1/3) - aligné avec la barre de recherche */}
          <div className='flex w-1/3 flex-col max-md:mt-4 max-md:w-full'>
            {/* Bandeau au-dessus */}
            <div className='w-full rounded-t-xl bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] px-4 py-3 text-center'>
              <p className='text-lg font-semibold text-white'>
                Test d&apos;éligibilité à la loi Jeanbrun 2026
              </p>
            </div>
            {/* Contenu du rectangle */}
            <div className='flex flex-1 flex-col items-center justify-center gap-4 rounded-br-xl bg-white p-8 shadow-lg max-md:rounded-b-xl'>
              <p className='text-center text-base font-medium text-[#1e3a5f]'>
                Découvrez en 3 étapes si vous êtes éligible !
              </p>
              <h3 className='text-center text-xl font-bold text-[#1e3a5f]'>
                Quelle est votre situation matrimoniale ?
              </h3>
            <div className='flex w-full flex-col gap-2'>
              <Button variant='outline' className='w-full border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'>
                Marié / Pacsé
              </Button>
              <Button variant='outline' className='w-full border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'>
                Célibataire
              </Button>
              <Button variant='outline' className='w-full border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'>
                Divorcé / Séparé
              </Button>
              <Button variant='outline' className='w-full border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white'>
                Veuf / Veuve
              </Button>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOUVELLE Barre du bas - 4 tuiles objectifs */}
      <div className='absolute bottom-[185px] left-1/2 z-10 w-full max-w-7xl -translate-x-1/2 px-4 sm:px-6 lg:px-8'>
        <div className='flex w-full overflow-hidden rounded-xl max-md:flex-col'>
          {/* 3 tuiles blanches (2/3) */}
          <div className='grid w-2/3 grid-cols-3 max-md:w-full max-md:grid-cols-1'>
            {/* Tuile 1 - Réduire mes impôts */}
            <div className='bg-background flex flex-col items-center justify-center gap-2 px-4 py-5'>
              <PiggyBank className='size-8 text-[#1e3a5f]' />
              <p className='text-center text-base font-semibold text-[#1e3a5f]'>Réduire mes impôts pendant 9 ans minimum</p>
            </div>
            {/* Tuile 2 - Générer des revenus */}
            <div className='bg-background flex flex-col items-center justify-center gap-2 px-4 py-5'>
              <TrendingUp className='size-8 text-[#1e3a5f]' />
              <p className='text-center text-base font-semibold text-[#1e3a5f]'>Générer des revenus entièrement défiscalisés</p>
            </div>
            {/* Tuile 3 - Construire un patrimoine */}
            <div className='bg-background flex flex-col items-center justify-center gap-2 px-4 py-5'>
              <Building2 className='size-8 text-[#1e3a5f]' />
              <p className='text-center text-base font-semibold text-[#1e3a5f]'>Construire un patrimoine en utilisant l&apos;effet levier du crédit</p>
            </div>
          </div>
          {/* Tuile 4 - Préparer ma retraite (bleu - 1/3) */}
          <div className='flex w-1/3 flex-col items-center justify-center gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] px-4 py-5 max-md:w-full'>
            <Clock className='size-8 text-white' />
            <p className='text-center text-base font-semibold text-white'>Construire un patrimoine long terme compatible avec les objectifs retraite</p>
          </div>
        </div>
      </div>

    </section>
  )
}

export default HeroSection
