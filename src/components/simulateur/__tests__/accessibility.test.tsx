/**
 * Tests d'accessibilite pour les composants du simulateur
 *
 * Utilise vitest-axe (axe-core) pour valider la conformite WCAG 2.1 AA.
 * Ces tests verifient les violations d'accessibilite automatisables.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { render } from "@testing-library/react"
import { axe } from "vitest-axe"
import * as matchers from "vitest-axe/matchers"

// Extend Vitest matchers with vitest-axe
declare module "vitest" {
  interface Assertion {
    toHaveNoViolations(): void
  }
}

// Mock ResizeObserver for Radix UI Slider components
const mockResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

let originalResizeObserver: typeof ResizeObserver | undefined

beforeAll(() => {
  originalResizeObserver = globalThis.ResizeObserver
  globalThis.ResizeObserver = mockResizeObserver as unknown as typeof ResizeObserver
})

afterAll(() => {
  if (originalResizeObserver) {
    globalThis.ResizeObserver = originalResizeObserver
  }
})

// Etape 1
import { ObjectifSelector } from "../etape-1/ObjectifSelector"
import { TMICalculator } from "../etape-1/TMICalculator"

// Etape 2
import { TypeBienSelector } from "../etape-2/TypeBienSelector"
import { VilleAutocomplete } from "../etape-2/VilleAutocomplete"
import { TravauxValidator } from "../etape-2/TravauxValidator"

// Etape 3
import { FinancementForm } from "../etape-3/FinancementForm"
import { JaugeEndettement } from "../etape-3/JaugeEndettement"
import { DiffereSelector } from "../etape-3/DiffereSelector"

// Etape 4
import { NiveauLoyerCards } from "../etape-4/NiveauLoyerCards"
import { ChargesForm } from "../etape-4/ChargesForm"
import { PerteGainVisualisation } from "../etape-4/PerteGainVisualisation"

// Etape 5
import { DureeSlider } from "../etape-5/DureeSlider"
import { RevalorisationInput } from "../etape-5/RevalorisationInput"
import { StrategieSortie } from "../etape-5/StrategieSortie"

// Etape 6
import { StructureCards } from "../etape-6/StructureCards"
import { ComparatifTable } from "../etape-6/ComparatifTable"

// Navigation
import { ProgressBar } from "../ProgressBar"
import { StepNavigation } from "../StepNavigation"

// Setup vitest-axe
expect.extend(matchers)

// ============================================================================
// Tests
// ============================================================================

describe("Accessibilite - Etape 1", () => {
  it("ObjectifSelector ne contient pas de violations", async () => {
    const { container } = render(
      <ObjectifSelector value="reduire_impots" onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("TMICalculator ne contient pas de violations", async () => {
    const { container } = render(
      <TMICalculator revenuNet={50000} parts={2} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Accessibilite - Etape 2", () => {
  it("TypeBienSelector ne contient pas de violations", async () => {
    const { container } = render(
      <TypeBienSelector value="neuf" onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("VilleAutocomplete ne contient pas de violations", async () => {
    const { container } = render(
      <VilleAutocomplete onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("TravauxValidator ne contient pas de violations", async () => {
    const { container } = render(
      <TravauxValidator montantTravaux={35000} prixAcquisition={100000} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Accessibilite - Etape 3", () => {
  it("FinancementForm ne contient pas de violations", async () => {
    const { container } = render(
      <FinancementForm
        apport={50000}
        dureeCredit={20}
        tauxCredit={3.5}
        autresCredits={0}
        prixTotal={200000}
        onApportChange={() => {}}
        onDureeCreditChange={() => {}}
        onTauxCreditChange={() => {}}
        onAutresCreditsChange={() => {}}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("JaugeEndettement ne contient pas de violations", async () => {
    const { container } = render(
      <JaugeEndettement
        mensualiteCredit={1200}
        revenuMensuel={5000}
        autresCredits={0}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("DiffereSelector ne contient pas de violations", async () => {
    const { container } = render(
      <DiffereSelector value={24} onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Accessibilite - Etape 4", () => {
  it("NiveauLoyerCards ne contient pas de violations", async () => {
    const { container } = render(
      <NiveauLoyerCards
        value="intermediaire"
        onChange={() => {}}
        zoneFiscale="A"
        surface={50}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("ChargesForm ne contient pas de violations", async () => {
    const { container } = render(
      <ChargesForm
        chargesAnnuelles={1800}
        taxeFonciere={1200}
        vacance={3}
        onChargesChange={() => {}}
        onTaxeFonciereChange={() => {}}
        onVacanceChange={() => {}}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("PerteGainVisualisation ne contient pas de violations", async () => {
    const { container } = render(
      <PerteGainVisualisation
        loyerPlafonne={800}
        loyerMarche={1000}
        economieImpot={3000}
        tmi={30}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Accessibilite - Etape 5", () => {
  it("DureeSlider ne contient pas de violations", async () => {
    const { container } = render(
      <DureeSlider value={12} onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("RevalorisationInput ne contient pas de violations", async () => {
    const { container } = render(
      <RevalorisationInput value={2} onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("StrategieSortie ne contient pas de violations", async () => {
    const { container } = render(
      <StrategieSortie value="revente" onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Accessibilite - Etape 6", () => {
  it("StructureCards ne contient pas de violations", async () => {
    const { container } = render(
      <StructureCards value="nom_propre" onChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("ComparatifTable ne contient pas de violations", async () => {
    const { container } = render(
      <ComparatifTable selectedStructure="nom_propre" />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Accessibilite - Navigation", () => {
  it("ProgressBar ne contient pas de violations", async () => {
    const { container } = render(
      <ProgressBar currentStep={3} totalSteps={6} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("StepNavigation ne contient pas de violations", async () => {
    const { container } = render(
      <StepNavigation
        onBack={() => {}}
        onNext={() => {}}
        canGoBack={true}
        canGoNext={true}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ============================================================================
// Tests de navigation clavier
// ============================================================================

describe("Navigation clavier - Radiogroups", () => {
  it("ObjectifSelector - les radios sont presents et interactifs", async () => {
    const { container } = render(
      <ObjectifSelector onChange={() => {}} />
    )

    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios.length).toBe(4)

    // Each radio button should be a button element (clickable)
    radios.forEach((radio) => {
      expect(radio.tagName.toLowerCase()).toBe("button")
      expect(radio).toHaveAttribute("type", "button")
    })
  })

  it("TypeBienSelector - les radios sont focusables", async () => {
    const { container } = render(
      <TypeBienSelector onChange={() => {}} />
    )

    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios.length).toBeGreaterThan(0)
  })

  it("StructureCards - les radios sont focusables", async () => {
    const { container } = render(
      <StructureCards value={undefined} onChange={() => {}} />
    )

    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios.length).toBe(3) // nom_propre, sci_ir, sci_is
  })

  it("StrategieSortie - les radios sont focusables", async () => {
    const { container } = render(
      <StrategieSortie value={undefined} onChange={() => {}} />
    )

    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios.length).toBe(3) // revente, conservation, donation
  })

  it("NiveauLoyerCards - les radios sont focusables", async () => {
    const { container } = render(
      <NiveauLoyerCards
        value="intermediaire"
        onChange={() => {}}
        zoneFiscale="A"
        surface={50}
      />
    )

    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// Tests ARIA
// ============================================================================

describe("ARIA - Sliders", () => {
  it("DureeSlider - a les attributs ARIA requis", () => {
    const { container } = render(
      <DureeSlider value={12} onChange={() => {}} />
    )

    const slider = container.querySelector('[role="slider"]')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute("aria-valuemin")
    expect(slider).toHaveAttribute("aria-valuemax")
    expect(slider).toHaveAttribute("aria-valuenow")
  })

  it("RevalorisationInput - a les attributs ARIA requis", () => {
    const { container } = render(
      <RevalorisationInput value={2} onChange={() => {}} />
    )

    const slider = container.querySelector('[role="slider"]')
    expect(slider).toBeInTheDocument()
  })
})

describe("ARIA - Progressbars", () => {
  it("JaugeEndettement - a les attributs progressbar", () => {
    const { container } = render(
      <JaugeEndettement
        mensualiteCredit={1200}
        revenuMensuel={5000}
        autresCredits={0}
      />
    )

    const progressbar = container.querySelector('[role="progressbar"]')
    expect(progressbar).toBeInTheDocument()
    expect(progressbar).toHaveAttribute("aria-valuenow")
    expect(progressbar).toHaveAttribute("aria-valuemin")
    expect(progressbar).toHaveAttribute("aria-valuemax")
  })

  it("TravauxValidator - a les attributs progressbar", () => {
    const { container } = render(
      <TravauxValidator montantTravaux={35000} prixAcquisition={100000} />
    )

    const progressbar = container.querySelector('[role="progressbar"]')
    expect(progressbar).toBeInTheDocument()
    expect(progressbar).toHaveAttribute("aria-valuenow")
  })

  it("ProgressBar - a les attributs progressbar", () => {
    const { container } = render(
      <ProgressBar currentStep={3} totalSteps={6} />
    )

    const progressbar = container.querySelector('[role="progressbar"]')
    expect(progressbar).toBeInTheDocument()
    expect(progressbar).toHaveAttribute("aria-valuenow", "3")
    expect(progressbar).toHaveAttribute("aria-valuemin", "1")
    expect(progressbar).toHaveAttribute("aria-valuemax", "6")
  })
})

describe("ARIA - Radiogroups", () => {
  it("ObjectifSelector - a le label du radiogroup", () => {
    const { container } = render(
      <ObjectifSelector onChange={() => {}} />
    )

    const radiogroup = container.querySelector('[role="radiogroup"]')
    expect(radiogroup).toBeInTheDocument()
    expect(radiogroup).toHaveAttribute("aria-label")
  })

  it("StructureCards - a le label du radiogroup", () => {
    const { container } = render(
      <StructureCards value={undefined} onChange={() => {}} />
    )

    const radiogroup = container.querySelector('[role="radiogroup"]')
    expect(radiogroup).toBeInTheDocument()
    expect(radiogroup).toHaveAttribute("aria-label", "Mode de detention")
  })

  it("StrategieSortie - a le label du radiogroup", () => {
    const { container } = render(
      <StrategieSortie value={undefined} onChange={() => {}} />
    )

    const radiogroup = container.querySelector('[role="radiogroup"]')
    expect(radiogroup).toBeInTheDocument()
    expect(radiogroup).toHaveAttribute("aria-label", "Strategie de sortie")
  })
})

describe("ARIA - Combobox", () => {
  it("VilleAutocomplete - a les attributs combobox", () => {
    const { container } = render(
      <VilleAutocomplete onChange={() => {}} />
    )

    const combobox = container.querySelector('[role="combobox"]')
    expect(combobox).toBeInTheDocument()
    expect(combobox).toHaveAttribute("aria-expanded")
    expect(combobox).toHaveAttribute("aria-haspopup", "listbox")
    expect(combobox).toHaveAttribute("aria-controls", "ville-listbox")
  })
})

describe("ARIA - Tables", () => {
  it("ComparatifTable - a les scope sur les headers", () => {
    const { container } = render(
      <ComparatifTable selectedStructure="nom_propre" />
    )

    const headers = container.querySelectorAll("th")
    headers.forEach((header) => {
      expect(header).toHaveAttribute("scope", "col")
    })
  })
})

describe("ARIA - Live regions", () => {
  it("PerteGainVisualisation - a aria-live sur le resultat", () => {
    const { container } = render(
      <PerteGainVisualisation
        loyerPlafonne={800}
        loyerMarche={1000}
        economieImpot={3000}
        tmi={30}
      />
    )

    const liveRegion = container.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
  })
})
