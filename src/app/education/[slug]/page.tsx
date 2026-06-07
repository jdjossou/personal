import { StatScreen } from '@/components/Education/StatScreen'
import { TERMS } from '@/components/Education/education'

// Deep-link route — the shareable per-term URL `/education/<slug>`. It renders
// the very same StatScreen as the bare `/education` page; StatScreen reads the
// active slug from `usePathname()`, so one component is the single source of
// truth for both routes and there's no param to thread down. An unknown slug is
// NOT a 404 — StatScreen falls back to the default selection (see resolveActive).
export function generateStaticParams() {
  // Prerender the known term routes. `dynamicParams` defaults to true, so any
  // slug not listed here still renders on demand and degrades gracefully in
  // StatScreen rather than hitting a hard 404.
  return TERMS.map((term) => ({ slug: term.slug }))
}

export default function EducationDeepLinkPage() {
  return <StatScreen />
}
