import { QuestList } from '@/components/Projects/QuestList'
import { PROJECTS } from '@/components/Projects/projects'

// Deep-link route (Task 04) — the shareable per-project URL `/projects/<slug>`.
// It renders the very same QuestList as the bare `/projects` page; QuestList reads
// the active slug from `usePathname()`, so one component is the single source of
// truth for both routes and there's no param to thread down. An unknown slug is
// NOT a 404 — QuestList falls back to the default selection (see resolveActive).
export function generateStaticParams() {
  // Prerender the known project routes. `dynamicParams` defaults to true, so any
  // slug not listed here (e.g. an old/removed link) still renders on demand and
  // degrades gracefully in QuestList rather than hitting a hard 404.
  return PROJECTS.map((project) => ({ slug: project.slug }))
}

export default function ProjectDeepLinkPage() {
  return <QuestList />
}
