// Stack "Skill Screen" data — the single source of truth the whole Stack page
// renders over (the left category roster, the right technology list, the
// reference-link dialog, and the `/stack/<category>` deep link all read from
// here). Pure data + the types that describe it: no React, no DOM, no helper
// logic (lookup lives in helpers.ts; tunable look lives in constants.ts). This
// is the one file you edit to manage the stack.
//
// Adding a future technology is meant to be a single, obvious append to a
// category's `items` array (with or without `links`) — no UI code touched. That
// is the success test for this layer. Adding a whole category is one append to
// CATEGORIES.
//
// See docs/stack/00-overview.md for the P3R Skill-screen mapping.

// --- Category icon ---------------------------------------------------------
// The id of the leading glyph a category renders (the analog of a P3R party
// member's portrait — no character art). Task 02's CategoryIcon component maps
// each id to a concrete glyph. Keep this union in sync with CATEGORIES.
export type CategoryIconId =
  | 'languages'
  | 'frameworks'
  | 'tools'
  | 'certifications'
  | 'databases'
  | 'spoken'

// --- Technology ------------------------------------------------------------
export interface TechLink {
  label: string // "Intact — Full-Stack", "Farmesh", "View badge"
  url: string // internal (/experience/<slug>, /projects/<slug>) or external URL
}

export interface Technology {
  name: string // "Spring Boot", "Microsoft Azure AZ-900"
  links?: TechLink[] // where it was used; 0 / 1 / many (Task 03 dialog handles empty)
}

// --- Category --------------------------------------------------------------
export interface Category {
  id: string // stable kebab-case deep-link slug ("languages", "spoken-languages")
  label: string // display name ("Frameworks & Libraries")
  icon: CategoryIconId // which leading glyph
  items: Technology[]
}

// Order of the array = display order in the roster (newest/most important first,
// per goal.md). Content is verbatim from docs/stack/goal.md — no invented
// technologies. Internal links prefer existing site content; a tech with no
// match omits `links`.
export const CATEGORIES: Category[] = [
  {
    id: 'languages',
    label: 'Languages',
    icon: 'languages',
    items: [
      {
        name: 'Java',
        links: [
          { label: 'Intact — Full-Stack', url: '/experience/intact-fullstack-2026' },
          { label: 'Intact — Backend', url: '/experience/intact-backend-2025' },
        ],
      },
      {
        name: 'Python',
        links: [
          { label: 'Agent²', url: '/projects/agent-squared' },
          { label: 'AI Research — Local Technologies', url: '/experience/li-ai-researcher-2025' },
        ],
      },
      { name: 'C++' },
      {
        name: 'TypeScript',
        links: [
          { label: 'Farmesh', url: '/projects/farmesh' },
          { label: 'Intact — Full-Stack', url: '/experience/intact-fullstack-2026' },
        ],
      },
      { name: 'JavaScript' },
      { name: 'Swift' },
      {
        name: 'HTML/CSS',
        links: [{ label: 'Intact — Backend', url: '/experience/intact-backend-2025' }],
      },
      {
        name: 'Dart',
        links: [{ label: 'Befriend', url: '/projects/befriend' }],
      },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    icon: 'frameworks',
    items: [
      {
        name: 'Spring Boot',
        links: [
          { label: 'Intact — Full-Stack', url: '/experience/intact-fullstack-2026' },
          { label: 'Intact — Backend', url: '/experience/intact-backend-2025' },
        ],
      },
      { name: 'React' },
      {
        name: 'Next.js',
        links: [
          { label: 'Farmesh', url: '/projects/farmesh' },
          { label: 'This portfolio', url: '/' },
        ],
      },
      {
        name: 'Angular',
        links: [
          { label: 'Intact — Full-Stack', url: '/experience/intact-fullstack-2026' },
          { label: 'Intact — Backend', url: '/experience/intact-backend-2025' },
        ],
      },
      {
        name: 'PyTorch',
        links: [{ label: 'AI Research — Local Technologies', url: '/experience/li-ai-researcher-2025' }],
      },
      {
        name: 'NumPy',
        links: [{ label: 'AI Research — Local Technologies', url: '/experience/li-ai-researcher-2025' }],
      },
      {
        name: 'FastAPI',
        links: [{ label: 'Agent²', url: '/projects/agent-squared' }],
      },
      {
        name: 'Flutter',
        links: [{ label: 'Befriend', url: '/projects/befriend' }],
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Platforms',
    icon: 'tools',
    items: [
      { name: 'Git' },
      {
        name: 'Kubernetes',
        links: [{ label: 'Intact — Backend', url: '/experience/intact-backend-2025' }],
      },
      {
        name: 'Kafka',
        links: [
          { label: 'Intact — Full-Stack', url: '/experience/intact-fullstack-2026' },
          { label: 'Intact — Backend', url: '/experience/intact-backend-2025' },
        ],
      },
      {
        name: 'Jenkins',
        links: [{ label: 'Intact — Backend', url: '/experience/intact-backend-2025' }],
      },
      {
        name: 'Dynatrace',
        links: [{ label: 'Intact — Backend', url: '/experience/intact-backend-2025' }],
      },
      {
        name: 'Postman',
        links: [{ label: 'Intact — Backend', url: '/experience/intact-backend-2025' }],
      },
      {
        name: 'Jira',
        links: [
          { label: 'Intact — Full-Stack', url: '/experience/intact-fullstack-2026' },
          { label: 'Intact — Backend', url: '/experience/intact-backend-2025' },
        ],
      },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: 'certifications',
    items: [
      {
        name: 'Microsoft Azure AZ-900',
        links: [
          {
            label: 'View certification',
            url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
          },
        ],
      },
      {
        name: 'Microsoft Azure AI-900',
        links: [
          {
            label: 'View certification',
            url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
          },
        ],
      },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: 'databases',
    items: [
      {
        name: 'PostgreSQL',
        links: [{ label: 'Farmesh', url: '/projects/farmesh' }],
      },
      {
        name: 'Oracle SQL',
        links: [
          { label: 'Intact — Full-Stack', url: '/experience/intact-fullstack-2026' },
          { label: 'Intact — Backend', url: '/experience/intact-backend-2025' },
        ],
      },
      {
        name: 'MongoDB',
        links: [{ label: 'Intact — Full-Stack', url: '/experience/intact-fullstack-2026' }],
      },
      {
        name: 'Firebase Firestore',
        links: [{ label: 'Befriend', url: '/projects/befriend' }],
      },
    ],
  },
  {
    id: 'spoken-languages',
    label: 'Spoken languages',
    icon: 'spoken',
    items: [
      { name: 'English' },
      { name: 'French' },
    ],
  },
]
