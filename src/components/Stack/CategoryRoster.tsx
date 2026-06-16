// Category roster — the center-left column of the Skill screen: the list of
// technology categories, P3R's party roster repurposed. Rows are flush to the
// screen's LEFT edge (their straight left side connects to the edge), stacked and
// vertically centered, each a CategoryRow. No frosted zone / header — the rows
// (with their red drop-shadows) are the whole visual. The container is an ARIA
// listbox; it takes the full list + the selected id and reports selection back
// through onSelect (clicking / hovering a row swaps the right tech list).

import { CategoryRow } from './CategoryRow'
import { ROW_GAP } from './constants'
import type { Category } from './stack'

export function CategoryRoster({
  categories,
  selectedId,
  onSelect,
}: {
  categories: readonly Category[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div role="listbox" aria-label="Technology categories" className="flex flex-col" style={{ gap: ROW_GAP }}>
      {categories.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          selected={category.id === selectedId}
          onSelect={() => onSelect(category.id)}
        />
      ))}
    </div>
  )
}
