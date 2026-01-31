'use client'

import { useRouter } from 'next/navigation'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Category {
  readonly id: string
  readonly label: string
}

interface BlogFiltersProps {
  categories: readonly Category[]
  selectedCategory: string
}

export function BlogFilters({ categories, selectedCategory }: BlogFiltersProps) {
  const router = useRouter()

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams()
    if (categoryId !== 'all') {
      params.set('category', categoryId)
    }
    params.set('page', '1')
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <section aria-label="Filtrer par categorie" className="mb-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(category.id)}
            className="shrink-0"
          >
            {category.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
