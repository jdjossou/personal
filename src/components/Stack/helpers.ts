// Stack "Skill Screen" helpers — the pure (React/DOM-free) lookup functions the
// components lean on, kept out of the data file (stack.ts) and the constants
// file so each stays single-purpose. Same separation as Education/helpers.ts.

import { CATEGORIES, type Category } from './stack'

// Resolve a category from its stable `id` slug — used by selection and the deep
// link (`/stack/<category>`). Returns undefined for an unknown slug so callers
// can fall back to the default selection. Mirrors Education's getTermBySlug.
export const getCategoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find((category) => category.id === slug)

// The first category in display order — the initial selection when no deep-link
// slug is present.
export const getDefaultCategory = (): Category => CATEGORIES[0]

// Every category slug, in display order — for generateStaticParams (Task 03).
export const categorySlugs = (): string[] =>
  CATEGORIES.map((category) => category.id)
