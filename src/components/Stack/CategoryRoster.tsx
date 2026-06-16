// Category roster — the center-left column of the Skill screen: the list of
// technology categories, P3R's party roster repurposed. Rows are flush to the
// screen's LEFT edge (their straight left side connects to the edge), stacked and
// vertically centered, each a CategoryRow. No frosted zone / header — the rows
// (with their red drop-shadows) are the whole visual. Presentational + static:
// it takes the full list + the default selected id; click/keyboard selection
// lands in Task 03.

import { CategoryRow } from './CategoryRow'
import { ROW_GAP } from './constants'
import type { Category } from './stack'

export function CategoryRoster({
  categories,
  selectedId,
}: {
  categories: readonly Category[]
  selectedId: string
}) {
  return (
    <div className="flex flex-col" style={{ gap: ROW_GAP }}>
      {categories.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          selected={category.id === selectedId}
        />
      ))}
    </div>
  )
}
