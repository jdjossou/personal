// Stack "Skill Screen" data — the shape the Stack page renders over (the left
// category roster, the right technology list, and the reference-link dialog all
// read from here). The actual CONTENT is no longer hand-written here: it is
// DERIVED from the skills registry (src/data/skills.ts) plus the places each
// skill is used (projects, experience). You never hand-maintain back-links again.
//
// To add/change a skill: edit src/data/skills.ts (one entry). To link a skill to
// a project/experience: just list it in that project's `tags` / role's
// `technologies` — its back-link appears on /stack automatically.
//
// This file keeps exporting the same types (Category, Technology, TechLink,
// CategoryIconId) and the same `CATEGORIES` value the UI components import, so no
// component changes. See docs/stack/00-overview.md for the P3R Skill-screen mapping.

import { PROJECTS } from '@/components/Projects/projects'
import { ROLES } from '@/components/Experience/experience'
import {
  SKILLS,
  SKILL_CATEGORIES,
  type SkillName,
  type SkillDef,
  type TechLink,
  type SkillIconId,
} from '@/data/skills'

// Re-exported so existing Stack components keep importing these from './stack'.
export type { TechLink }
export type CategoryIconId = SkillIconId

// --- Technology ------------------------------------------------------------
export interface Technology {
  name: string // "Spring Boot", "Microsoft Azure AZ-900"
  links?: TechLink[] // where it was used; 0 / 1 / many (the dialog handles empty)
}

// --- Category --------------------------------------------------------------
export interface Category {
  id: string // stable id / React key ("languages", "spoken")
  label: string // display name ("Frameworks & Libraries")
  icon: CategoryIconId // which leading glyph
  items: Technology[]
}

// --- Derivation ------------------------------------------------------------
// One row per place a skill can be "used". Adding a new source (e.g. the future
// EDUCATION revamp: a `skills` field on TERMS → base '/education') is a single
// append here — nothing else changes.
type SkillSource = {
  base: string // route prefix, e.g. '/projects'
  items: readonly { slug: string; skills: readonly SkillName[]; label: string }[]
}

const SOURCES: readonly SkillSource[] = [
  {
    base: '/projects',
    items: PROJECTS.map((p) => ({ slug: p.slug, skills: p.tags, label: p.stackLabel ?? p.name })),
  },
  {
    base: '/experience',
    items: ROLES.map((r) => ({ slug: r.slug, skills: r.technologies, label: r.stackLabel ?? r.company })),
  },
]

// Index every skill → its derived usage links, scanning the sources in order
// (projects first, then experience), each source in its own array order.
function usageLinks(): Map<SkillName, TechLink[]> {
  const map = new Map<SkillName, TechLink[]>()
  for (const source of SOURCES) {
    for (const item of source.items) {
      const url = `${source.base}/${item.slug}`
      for (const skill of item.skills) {
        const list = map.get(skill) ?? []
        list.push({ label: item.label, url })
        map.set(skill, list)
      }
    }
  }
  return map
}

// Build the roster the UI renders: for each category (in SKILL_CATEGORIES order),
// the skills assigned to it (in registry insertion order), each carrying its
// derived usage links followed by any manual registry links (certs, portfolio).
function buildCategories(): Category[] {
  const usage = usageLinks()
  const names = Object.keys(SKILLS) as SkillName[]
  return SKILL_CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label,
    icon: cat.icon,
    items: names
      .filter((name) => (SKILLS[name] as SkillDef).category === cat.id)
      .map((name) => {
        const links = [...(usage.get(name) ?? []), ...((SKILLS[name] as SkillDef).links ?? [])]
        return links.length ? { name, links } : { name }
      }),
  }))
}

// The single value the whole Stack page renders over (kept for the existing
// helpers.ts and components). Computed once at module load.
export const CATEGORIES: Category[] = buildCategories()
