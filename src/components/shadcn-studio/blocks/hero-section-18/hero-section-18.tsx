import { ChevronRight, PiggyBank, TrendingUp, Building2, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

const HeroSection = () => {
  return (
    <section className='relative flex flex-1 flex-col justify-end overflow-hidden pt-24 pb-12 sm:pt-16 sm:pb-16 lg:py-24'>
      {/* Image de fond */}
      <Image
        src="/loi-jeanbrun-appartement-neuf-hero.webp"
        alt="Appartement neuf éligible loi Jeanbrun - investissement locatif défiscalisation"
        fill
        priority
        className='object-cover object-bottom sm:object-center'
      />
      {/* Overlay gradient */}
      <div className='absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent' />

      {/* Cadre blanc avec bouton rouge + texte - aligné avec le contenu en bas */}
      <div className='relative z-10 mt-auto w-full px-4 sm:px-6 lg:absolute lg:bottom-[320px] lg:left-1/2 lg:max-w-7xl lg:-translate-x-1/2 lg:px-8'>
        <div className='flex w-full gap-0 max-lg:flex-col max-lg:gap-4'>
          {/* Rectangle principal (2/3) avec cercle rouge */}
          <div className='flex w-full items-center gap-8 max-lg:p-4 lg:rounded-l-xl lg:rounded-r-none lg:bg-white/65 lg:p-8 lg:shadow-lg lg:backdrop-blur-sm'>
            {/* Texte titre + sous-titre */}
            <div className='flex-1'>
              <h1 className='text-4xl font-bold text-[#1e3a5f] sm:text-3xl md:text-4xl lg:text-[2.75rem]'>
                <span className='mb-2 block text-5xl text-[#c41e3a] lg:mb-0 lg:text-[2.75rem]'>Loi Jeanbrun</span>
                La révolution fiscale !
              </h1>
              <h2 className='mt-3 text-2xl font-bold text-[#1e3a5f] sm:mt-4 sm:text-xl md:text-2xl lg:mt-6 lg:text-3xl'>
                Jusqu&apos;à 12 000 euros de réduction du revenu imposable
              </h2>

              {/* 4 tuiles objectifs - mobile uniquement */}
              <div className='mt-8 grid grid-cols-2 gap-3 lg:hidden'>
                <div className='flex flex-col items-center gap-1 rounded-lg bg-white/80 px-3 py-3 backdrop-blur-sm'>
                  <PiggyBank className='size-6 text-[#1e3a5f]' />
                  <p className='text-center text-xs font-semibold text-[#1e3a5f]'>Réduire mes impôts pendant 9 ans minimum</p>
                </div>
                <div className='flex flex-col items-center gap-1 rounded-lg bg-white/80 px-3 py-3 backdrop-blur-sm'>
                  <TrendingUp className='size-6 text-[#1e3a5f]' />
                  <p className='text-center text-xs font-semibold text-[#1e3a5f]'>Générer des revenus entièrement défiscalisés</p>
                </div>
                <div className='flex flex-col items-center gap-1 rounded-lg bg-white/80 px-3 py-3 backdrop-blur-sm'>
                  <Building2 className='size-6 text-[#1e3a5f]' />
                  <p className='text-center text-xs font-semibold text-[#1e3a5f]'>Construire un patrimoine avec l&apos;effet levier du crédit</p>
                </div>
                <div className='flex flex-col items-center gap-1 rounded-lg bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] px-3 py-3'>
                  <Clock className='size-6 text-white' />
                  <p className='text-center text-xs font-semibold text-white'>Patrimoine long terme compatible retraite</p>
                </div>
              </div>

              {/* Bouton rond rouge - mobile: masqué */}

              <p className='mt-3 hidden text-lg text-[#1e3a5f]/80 sm:mt-4 lg:mt-6 lg:block'>
                Le nouveau dispositif de défiscalisation Relance Logement 2026 dédié aux Français.
              </p>
              <p className='mt-2 hidden text-lg text-[#1e3a5f]/80 lg:block'>
                Calculez votre avantage fiscal en moins de 2 minutes.
              </p>
            </div>

            {/* Bouton rond rouge - desktop: à droite du texte */}
            <Link
              href="/simulateur"
              className='hidden shrink-0 flex-col items-center justify-center rounded-full bg-[#c41e3a] text-white shadow-xl transition-transform hover:scale-105 lg:flex lg:size-56'
            >
              <span className='text-xs font-medium uppercase tracking-wide sm:text-sm'>En quelques clics</span>
              <span className='mt-2 text-center text-sm font-bold uppercase leading-tight sm:text-base'>
                ESTIMEZ VOTRE<br />RÉDUCTION D&apos;IMPÔT
              </span>
              <span className='mt-2 text-[10px] font-medium uppercase tracking-wide sm:text-xs'>Gratuit sans engagement</span>
              <ChevronRight className='mt-2 size-5 animate-bounce sm:size-8' />
            </Link>
          </div>

          {/* Nouveau rectangle blanc (1/3) - aligné avec la barre de recherche */}
          <div className='mt-4 flex w-full flex-col lg:mt-0 lg:w-1/3'>
            {/* Bandeau au-dessus */}
            <div className='w-full rounded-t-xl bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] px-4 py-3 text-center'>
              <p className='text-lg font-semibold text-white'>
                Test d&apos;éligibilité à la loi Jeanbrun 2026
              </p>
            </div>
            {/* Contenu du rectangle */}
            <div className='flex flex-1 flex-col items-center justify-center gap-4 rounded-b-xl bg-white p-8 shadow-lg lg:rounded-bl-none lg:rounded-br-xl'>
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

      {/* NOUVELLE Barre du bas - 4 tuiles objectifs (desktop uniquement) */}
      <div className='relative z-10 mt-4 hidden w-full px-4 sm:px-6 lg:absolute lg:bottom-[185px] lg:left-1/2 lg:block lg:max-w-7xl lg:-translate-x-1/2 lg:px-8'>
        <div className='flex w-full flex-col overflow-hidden rounded-xl lg:flex-row'>
          {/* 3 tuiles blanches (2/3) */}
          <div className='grid w-full grid-cols-1 sm:grid-cols-3 lg:w-2/3'>
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
          <div className='flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] px-4 py-5 lg:w-1/3'>
            <Clock className='size-8 text-white' />
            <p className='text-center text-base font-semibold text-white'>Construire un patrimoine long terme compatible avec les objectifs retraite</p>
          </div>
        </div>
      </div>

    </section>
  )
}

export default HeroSection
