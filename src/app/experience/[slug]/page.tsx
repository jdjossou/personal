import { SocialLinkScreen } from '@/components/Experience/SocialLinkScreen'
import { ROLES } from '@/components/Experience/experience'

// Deep-link route — the shareable per-role URL `/experience/<slug>`. It renders
// the very same SocialLinkScreen as the bare `/experience` page; the screen reads
// the active slug from `usePathname()`, so one component is the single source of
// truth for both routes and there's no param to thread down. An unknown slug is
// NOT a 404 — the screen falls back to the default (most-recent) role and cleans
// the URL (see resolveActive in SocialLinkScreen).
export function generateStaticParams() {
  // Prerender the known role routes. `dynamicParams` defaults to true, so any
  // slug not listed here still renders on demand and degrades gracefully in
  // SocialLinkScreen rather than hitting a hard 404.
  return ROLES.map((role) => ({ slug: role.slug }))
}

export default function ExperienceDeepLinkPage() {
  return <SocialLinkScreen />
}
