// Education "Stats Screen" data — the single source of truth the whole page
// renders over (the profile header, the ability rows, the detail panel, and any
// deep link all read from here). Pure data + the types that describe it: no
// React, no DOM, no helper logic (formatting/lookup live in helpers.ts; tunable
// look lives in constants.ts). This is the one file you edit to manage courses.
//
// Adding a future course is meant to be a single, obvious append to COURSES
// below — no UI code touched. That is the success test for this layer.

// --- Profile ---------------------------------------------------------------
// The fixed header data — the "character" whose abilities the courses are.
// Exactly one value (PROFILE); it is not a selectable row.
export type EducationProfile = {
  university: string // "University of Waterloo"
  degree: string // "BCS, Computer Science" (degree / program)
  expectedGraduation: string // ISO 'YYYY-MM' — formatted for display by formatGraduation()
  location?: string // "Waterloo, ON" (optional)
  tagline?: string // short factual line, optional (e.g. specialization)
}

export const PROFILE: EducationProfile = {
  university: 'University of Waterloo',
  degree: 'BCS, Computer Science',
  expectedGraduation: '2028-04',
  location: 'Waterloo, ON',
  tagline: 'Honours Computer Science, Co-op',
}

// --- Courses ---------------------------------------------------------------
export type CourseCategory = 'CORE' | 'ELECTIVE' | 'SEMINAR'

export type CourseLink = {
  label: string // "Syllabus", "Project", "Notes"…
  href: string
  newTab?: boolean // open in a new tab (external links)
}

export type Course = {
  // `slug` is the contract with selection (getCourseBySlug in helpers.ts, Task
  // 03) and the optional deep link (Task 04). It must be URL-safe, stable and
  // unique — changing it breaks any shared link that opens this course directly.
  slug: string
  code: string // "CS246"
  name: string // "Object-Oriented Software Development"
  category: CourseCategory // → the LEADER/PARTY badge slot
  // `term` is the ISO 'YYYY-MM' the course was taken — formatted by formatTerm().
  // Optional: a course with no recorded term still renders cleanly.
  term?: string
  units?: number // course weight/credits — factual figure; default 0.5 at Waterloo
  // `level` is an optional explicit override; otherwise it is derived from the
  // numeric part of `code` by levelFromCode() (CS246 → 2).
  level?: number
  summary: string // one-liner shown in / near the row and as the detail lead
  details?: string // longer "what it taught" body for the detail panel (optional)
  links?: readonly CourseLink[] // optional
}

// NOTE: there is intentionally NO grade / GPA field anywhere — the brief
// excludes it. The figures surfaced are factual only (term, units, level).
//
// Order is intentional: most signal first. The displayed /01 /02 numbering
// (Task 02) derives from this array order, NOT a stored field — reorder these
// entries to reorder the stats list.
export const COURSES: readonly Course[] = [
  {
    slug: 'cs246-object-oriented',
    code: 'CS246',
    name: 'Object-Oriented Software Development',
    category: 'CORE',
    term: '2025-01',
    units: 0.5,
    summary:
      'Designing and building software in C++ with sound object-oriented practice.',
    details:
      'Covered classes, inheritance, polymorphism, the standard library, RAII and resource management, and common design patterns — building larger C++ programs from clean, testable components.',
  },
  {
    slug: 'cs245-logic-computation',
    code: 'CS245',
    name: 'Logic and Computation',
    category: 'CORE',
    term: '2025-01',
    units: 0.5,
    summary:
      'Formal logic and the foundations of what computers can and cannot do.',
    details:
      'Propositional and predicate logic, formal proof systems, soundness and completeness, and an introduction to computability and undecidability.',
  },
  {
    slug: 'cs240-data-structures',
    code: 'CS240',
    name: 'Data Structures and Data Management',
    category: 'CORE',
    term: '2024-09',
    units: 0.5,
    summary:
      'The core data structures and the asymptotic analysis behind choosing them.',
    details:
      'Balanced trees, hashing, priority queues, tries, and sorting/searching — with rigorous runtime and space analysis for each structure and operation.',
  },
  {
    slug: 'cs341-algorithms',
    code: 'CS341',
    name: 'Algorithms',
    category: 'CORE',
    term: '2025-09',
    units: 0.5,
    summary:
      'Algorithm design paradigms and reasoning about complexity and tractability.',
    details:
      'Greedy algorithms, divide and conquer, dynamic programming, graph algorithms, and an introduction to NP-completeness and reductions.',
  },
  {
    slug: 'cs350-operating-systems',
    code: 'CS350',
    name: 'Operating Systems',
    category: 'CORE',
    term: '2026-01',
    units: 0.5,
    summary:
      'How an operating system manages processes, memory, and storage.',
    details:
      'Concurrency and synchronization, scheduling, virtual memory, and file systems — implemented hands-on against the OS/161 teaching kernel.',
  },
  {
    slug: 'cs136-elementary-algorithm-design',
    code: 'CS136',
    name: 'Elementary Algorithm Design and Data Abstraction',
    category: 'CORE',
    term: '2024-01',
    units: 0.5,
    summary:
      'The bridge from functional to imperative programming and abstract data types.',
  },
  {
    slug: 'cs370-numerical-computation',
    code: 'CS370',
    name: 'Numerical Computation',
    category: 'ELECTIVE',
    term: '2026-01',
    units: 0.5,
    summary:
      'Numerical methods and the floating-point realities behind scientific computing.',
    details:
      'Floating-point error, interpolation, numerical linear algebra, and methods for differentiation, integration, and differential equations.',
  },
  {
    slug: 'cs486-intro-ai',
    code: 'CS486',
    name: 'Introduction to Artificial Intelligence',
    category: 'ELECTIVE',
    term: '2026-09',
    units: 0.5,
    summary:
      'Core AI: search, reasoning under uncertainty, and machine learning foundations.',
    details:
      'Heuristic search, constraint satisfaction, Bayesian networks and probabilistic reasoning, decision making, and the foundations of supervised learning.',
  },
  {
    slug: 'pd-professional-development',
    code: 'PD11',
    name: 'Processes for Technical Report Writing',
    category: 'SEMINAR',
    units: 0.25,
    summary:
      'Co-op professional development on clear technical communication and reporting.',
  },
] as const
