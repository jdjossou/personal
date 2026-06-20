// Skills registry — THE single source of truth for every skill on the site.
//
// One entry per skill, keyed by its canonical display name. Projects, experience
// (and, later, education) reference these keys via the `SkillName` type, so a typo
// or an undeclared skill is a compile error — there is exactly one spelling of
// "Next.js" anywhere. The /stack page is fully *derived* from this file plus the
// places a skill is used (see src/components/Stack/stack.ts): you never hand-write
// back-links again.
//
// To add a skill: add one entry below. Give it a `category` to show it on /stack
// (under that category, in this file's insertion order); omit `category` to keep
// it a valid tag that stays OFF the /stack roster (one-off product/SDK tags).
// To add a certification or hosted doc: one entry under `certifications` whose
// `links` point at an external URL or a PDF in /public (e.g. '/docs/foo.pdf').
//
// This module imports nothing internal — it is the leaf everything else depends
// on (no import cycles). Pure data + types: no React, no DOM.

// --- Link + category primitives -------------------------------------------
// A reference link shown in the /stack tech dialog. Re-exported by stack.ts as
// `TechLink` for the existing UI components.
export interface TechLink {
  label: string // "Intact — Full-Stack", "Farmesh", "View certification"
  url: string // internal (/projects/<slug>, /experience/<slug>) or external URL
}

// The leading glyph a /stack category renders. Re-exported by stack.ts as
// `CategoryIconId` (consumed by CategoryIcon's GLYPHS map). Keep in sync with
// SKILL_CATEGORIES.
export type SkillIconId =
  | 'languages'
  | 'frameworks'
  | 'tools'
  | 'certifications'
  | 'databases'
  | 'spoken'

// Which /stack category a skill belongs to.
export type SkillCategoryId = SkillIconId

// --- Skill definition ------------------------------------------------------
export interface SkillDef {
  // Omit ⇒ the skill is a valid reference (no typos) but does NOT appear on the
  // /stack roster — for project-specific tech you don't want to showcase.
  category?: SkillCategoryId
  // Manual links that can't be derived from projects/experience: certifications
  // (external URL or hosted PDF), "This portfolio", etc. Merged AFTER the derived
  // usage links in the dialog.
  links?: readonly TechLink[]
}

// The registry. Insertion order within a category = display order on /stack.
// `satisfies` (not a `: Record<…>` annotation) keeps the literal keys so
// `SkillName` is the exact union of declared skills.
export const SKILLS = {
  // --- Languages -----------------------------------------------------------
  Java: { category: 'languages' },
  Python: { category: 'languages' },
  'C++': { category: 'languages' },
  TypeScript: { category: 'languages' },
  JavaScript: { category: 'languages' },
  Swift: { category: 'languages' },
  'HTML/CSS': { category: 'languages' },
  Dart: { category: 'languages' },
  C: { category: 'languages' },
  Racket: { category: 'languages' },
  Assembly: { category: 'languages' },
  MATLAB: { category: 'languages' },
  R: { category: 'languages' },

  // --- Frameworks & Libraries ---------------------------------------------
  'Spring Boot': { category: 'frameworks' },
  React: { category: 'frameworks' },
  'Next.js': {
    category: 'frameworks',
    links: [{ label: 'This portfolio', url: '/' }],
  },
  Angular: { category: 'frameworks' },
  PyTorch: { category: 'frameworks' },
  NumPy: { category: 'frameworks' },
  FastAPI: { category: 'frameworks' },
  Flutter: { category: 'frameworks' },

  // --- Tools & Platforms ---------------------------------------------------
  Git: { category: 'tools' },
  Kubernetes: { category: 'tools' },
  Kafka: { category: 'tools' },
  Jenkins: { category: 'tools' },
  Dynatrace: { category: 'tools' },
  Postman: { category: 'tools' },
  Jira: { category: 'tools' },
  AWS: { category: 'tools' },

  // --- Certifications ------------------------------------------------------
  'Microsoft Azure AZ-900': {
    category: 'certifications',
    links: [
      {
        label: 'View certification',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
      },
    ],
  },
  'Microsoft Azure AI-900': {
    category: 'certifications',
    links: [
      {
        label: 'View certification',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
      },
    ],
  },

  // --- Databases -----------------------------------------------------------
  PostgreSQL: { category: 'databases' },
  'Oracle SQL': { category: 'databases' },
  MongoDB: { category: 'databases' },
  Firebase: { category: 'databases' },

  // --- Spoken languages ----------------------------------------------------
  English: { category: 'spoken' },
  French: { category: 'spoken' },
  Japanese: { category: 'spoken' },

  // --- Uncategorized: valid tags, hidden from /stack -----------------------
  // One-off products/SDKs and soft tags referenced by a project/role but not
  // showcased on the roster. Give any of these a `category` to surface it.
  Railtracks: {},
  Playwright: {},
  Telnyx: {},
  Supabase: {},
  Backboard: {},
  Thymeleaf: {},
  JUnit: {},
  AI: {},
  Research: {},
  'Recommendation Systems': {},
  'Predictive Analytics': {},

  // --- Coursework skills: valid tags, hidden from /stack -------------------
  // Foundational/conceptual skills the degree taught (referenced by education
  // TERMS). Uncategorized so they stay off the /stack roster while still being
  // valid, typo-checked references that surface on the Education page.
  OOP: {},
  'Functional Programming': {},
  'Discrete Math': {},
  Probability: {},
  Statistics: {},
  Economics: {},
  'Linear Algebra': {},
  Logic: {},
  Communication: {},
  'Computer Architecture': {},
  Combinatorics: {},
  Calculus: {},
  'Differential Equations': {},
  'Technical Writing': {},
  'Data Structures': {},
  Algorithms: {},
  'Neural Networks': {},
  'Cognitive Science': {},
} as const satisfies Record<string, SkillDef>

// The exact union of every declared skill name — the type projects/experience/
// education reference. A tag outside this set is a compile error.
export type SkillName = keyof typeof SKILLS

// --- Category roster -------------------------------------------------------
// Ordered metadata driving the /stack category roster (left column). Order here
// = display order of the categories.
export const SKILL_CATEGORIES: readonly {
  id: SkillCategoryId
  label: string
  icon: SkillIconId
}[] = [
  { id: 'languages', label: 'Languages', icon: 'languages' },
  { id: 'frameworks', label: 'Frameworks & Libraries', icon: 'frameworks' },
  { id: 'tools', label: 'Tools & Platforms', icon: 'tools' },
  { id: 'certifications', label: 'Certifications', icon: 'certifications' },
  { id: 'databases', label: 'Databases', icon: 'databases' },
  { id: 'spoken', label: 'Spoken languages', icon: 'spoken' },
]
