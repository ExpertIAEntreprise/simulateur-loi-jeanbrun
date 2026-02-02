"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { Search, MapPin, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { ZoneFiscale } from "@/types/ville"

interface VilleData {
  id: string
  nom: string
  zoneFiscale: ZoneFiscale
  departement: string
}

interface VilleAutocompleteProps {
  value?: { id: string; nom: string; zoneFiscale: ZoneFiscale } | undefined
  onChange: (ville: { id: string; nom: string; zoneFiscale: ZoneFiscale }) => void
  className?: string
}

// Couleurs par zone fiscale
const ZONE_COLORS: Record<ZoneFiscale, string> = {
  A_BIS: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  A: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  B1: "bg-green-500/20 text-green-300 border-green-500/30",
  B2: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  C: "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

// Labels zone fiscale
const ZONE_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
}

// Donnees mock en attendant l'API
const VILLES_MOCK: VilleData[] = [
  { id: "paris", nom: "Paris", zoneFiscale: "A_BIS", departement: "75" },
  { id: "lyon", nom: "Lyon", zoneFiscale: "A", departement: "69" },
  { id: "marseille", nom: "Marseille", zoneFiscale: "A", departement: "13" },
  { id: "bordeaux", nom: "Bordeaux", zoneFiscale: "B1", departement: "33" },
  { id: "toulouse", nom: "Toulouse", zoneFiscale: "B1", departement: "31" },
  { id: "nantes", nom: "Nantes", zoneFiscale: "B1", departement: "44" },
  { id: "nice", nom: "Nice", zoneFiscale: "A", departement: "06" },
  { id: "lille", nom: "Lille", zoneFiscale: "A", departement: "59" },
  { id: "rennes", nom: "Rennes", zoneFiscale: "B1", departement: "35" },
  { id: "dijon", nom: "Dijon", zoneFiscale: "B2", departement: "21" },
  { id: "strasbourg", nom: "Strasbourg", zoneFiscale: "B1", departement: "67" },
  { id: "montpellier", nom: "Montpellier", zoneFiscale: "A", departement: "34" },
  { id: "grenoble", nom: "Grenoble", zoneFiscale: "B1", departement: "38" },
  { id: "angers", nom: "Angers", zoneFiscale: "B1", departement: "49" },
  { id: "reims", nom: "Reims", zoneFiscale: "B1", departement: "51" },
  { id: "tours", nom: "Tours", zoneFiscale: "B1", departement: "37" },
  { id: "saint-etienne", nom: "Saint-Etienne", zoneFiscale: "B2", departement: "42" },
  { id: "clermont-ferrand", nom: "Clermont-Ferrand", zoneFiscale: "B2", departement: "63" },
  { id: "brest", nom: "Brest", zoneFiscale: "B2", departement: "29" },
  { id: "le-havre", nom: "Le Havre", zoneFiscale: "B2", departement: "76" },
  { id: "limoges", nom: "Limoges", zoneFiscale: "C", departement: "87" },
  { id: "poitiers", nom: "Poitiers", zoneFiscale: "B2", departement: "86" },
  { id: "besancon", nom: "Besancon", zoneFiscale: "B2", departement: "25" },
  { id: "orleans", nom: "Orleans", zoneFiscale: "B1", departement: "45" },
  { id: "rouen", nom: "Rouen", zoneFiscale: "B1", departement: "76" },
]

// Fonction de recherche simulee (remplacer par appel API)
async function searchVilles(query: string): Promise<VilleData[]> {
  // Simule un delai reseau
  await new Promise((resolve) => setTimeout(resolve, 150))

  if (!query.trim()) return []

  const normalizedQuery = query.toLowerCase().trim()

  return VILLES_MOCK.filter(
    (ville) =>
      ville.nom.toLowerCase().includes(normalizedQuery) ||
      ville.departement.includes(normalizedQuery)
  ).slice(0, 10)
}

export function VilleAutocomplete({
  value,
  onChange,
  className,
}: VilleAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value?.nom ?? "")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<VilleData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [hasSearched, setHasSearched] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Sync input value with external value
  useEffect(() => {
    if (value?.nom) {
      setInputValue(value.nom)
    }
  }, [value?.nom])

  // Debounced search
  const performSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      setHasSearched(false)
      return
    }

    setIsLoading(true)

    debounceRef.current = setTimeout(async () => {
      try {
        const searchResults = await searchVilles(query)
        setResults(searchResults)
        setIsOpen(true)
        setHasSearched(true)
        setHighlightedIndex(-1)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [])

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      performSearch(newValue)
    },
    [performSearch]
  )

  // Handle item selection
  const handleSelect = useCallback(
    (ville: VilleData) => {
      setInputValue(ville.nom)
      setIsOpen(false)
      setResults([])
      setHasSearched(false)
      onChange({
        id: ville.id,
        nom: ville.nom,
        zoneFiscale: ville.zoneFiscale,
      })
    },
    [onChange]
  )

  // Handle clear
  const handleClear = useCallback(() => {
    setInputValue("")
    setResults([])
    setIsOpen(false)
    setHasSearched(false)
    inputRef.current?.focus()
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || results.length === 0) {
        if (e.key === "Escape") {
          setIsOpen(false)
        }
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (highlightedIndex >= 0) {
            const selectedVille = results[highlightedIndex]
            if (selectedVille) {
              handleSelect(selectedVille)
            }
          }
          break
        case "Escape":
          e.preventDefault()
          setIsOpen(false)
          break
      }
    },
    [isOpen, results, highlightedIndex, handleSelect]
  )

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-item]")
      const item = items[highlightedIndex]
      if (item) {
        item.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const showDropdown = isOpen && (results.length > 0 || (hasSearched && !isLoading))

  // Memoize selected zone badge
  const selectedZoneBadge = useMemo(() => {
    if (!value?.zoneFiscale) return null
    return (
      <Badge
        className={cn(
          "ml-2 border text-xs",
          ZONE_COLORS[value.zoneFiscale]
        )}
      >
        Zone {ZONE_LABELS[value.zoneFiscale]}
      </Badge>
    )
  }, [value?.zoneFiscale])

  return (
    <div className={cn("relative", className)}>
      {/* Input with search icon */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder="Rechercher une ville..."
          className={cn(
            "pl-10 pr-10",
            value?.zoneFiscale && "pr-24"
          )}
          autoComplete="off"
          aria-label="Rechercher une ville"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-controls="ville-listbox"
          role="combobox"
        />

        {/* Clear button or loading indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading ? (
            <Spinner size="sm" />
          ) : inputValue && !value?.zoneFiscale ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Selected zone badge (displayed below input) */}
      {value?.zoneFiscale && (
        <div className="mt-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {value.nom} ({value.zoneFiscale === "A_BIS" ? "75" :
              VILLES_MOCK.find(v => v.id === value.id)?.departement ?? ""})
          </span>
          {selectedZoneBadge}
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Changer de ville"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <ul
          ref={listRef}
          id="ville-listbox"
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-border bg-popover shadow-lg"
        >
          {results.length === 0 && hasSearched && !isLoading ? (
            <li className="px-4 py-3 text-sm text-muted-foreground text-center">
              Aucune ville trouvee
            </li>
          ) : (
            results.map((ville, index) => (
              <li
                key={ville.id}
                data-item
                role="option"
                aria-selected={highlightedIndex === index}
                className={cn(
                  "flex items-center justify-between px-4 py-2 cursor-pointer transition-colors",
                  highlightedIndex === index
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/50"
                )}
                onClick={() => handleSelect(ville)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">{ville.nom}</span>
                  <span className="text-muted-foreground">({ville.departement})</span>
                </div>
                <Badge
                  className={cn(
                    "border text-xs shrink-0",
                    ZONE_COLORS[ville.zoneFiscale]
                  )}
                >
                  Zone {ZONE_LABELS[ville.zoneFiscale]}
                </Badge>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
