import Link from 'next/link'

// Minimal stand-in for a portfolio section (Task 06). Renders the section name
// over the shared P3R water background with a link back to the menu, so menu
// navigation works end-to-end before the real sections are built.
type SectionPlaceholderProps = {
  title: string
}

export function SectionPlaceholder({ title }: SectionPlaceholderProps) {
  return (
    <main className="fixed inset-0 z-0 flex flex-col items-center justify-center bg-transparent select-none">
      <h1 className="font-display text-6xl tracking-wide text-white uppercase">
        {title}
      </h1>
      <Link
        href="/"
        className="mt-6 font-mono text-xs tracking-[0.3em] text-white/50 uppercase hover:text-white/80"
      >
        ← Back to menu
      </Link>
    </main>
  )
}
