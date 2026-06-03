'use client'

// Main menu — Task 01: static layout foundation.
// No animation, no interactivity, no selection state, no cursor — just the
// three-zone game-HUD skeleton that later menu tasks build on. The component
// is a transparent full-screen overlay so the global P3R water background
// (mounted in layout.tsx, z-index -1) stays visible behind everything.

const INACTIVE_BLUE = '#7EB8E8'

const MENU_ITEMS = [
  'PROJECTS',
  'EDUCATION',
  'EXPERIENCE',
  'STACK',
  'ASKME',
] as const

export function MainMenu() {
  return (
    <main className="fixed inset-0 z-0 overflow-hidden bg-transparent select-none">
      {/* Zone A — left ~42%: reserved for the laptop illustration (task 04). */}
      <div
        className="absolute inset-y-0 left-0 z-0 w-[42%]"
        aria-hidden
        // Placeholder bounds for the floating laptop / developer machine.
      />

      {/* Zone B — right side: the vertical menu list, left-aligned so every
          item shares a common left edge, set in from the zone's left margin. */}
      <nav className="absolute inset-y-0 right-0 z-10 flex w-[58%] flex-col justify-center pl-[4vw]">
        <ul className="flex flex-col items-start gap-4 text-left sm:gap-5">
          {MENU_ITEMS.map((item) => (
            <li
              key={item}
              data-menu-item={item}
              className="font-display text-4xl leading-none tracking-wide uppercase sm:text-5xl lg:text-6xl"
              style={{
                color: INACTIVE_BLUE,
                WebkitTextStroke: `0.75px ${INACTIVE_BLUE}`,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      {/* Zone C — bottom bar: index panel (lower-left) + selected-section info
          with the nav prompts stacked beneath it (lower-right). */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 px-[4vw] pb-6">
        {/* Lower-left: main index panel placeholder (built in task 05). */}
        <div
          className="w-fit border border-dashed border-white/30 px-3 py-2 font-display text-sm leading-tight tracking-widest text-white/60"
          data-placeholder="main-index"
        >
          MAIN
          <br />
          01
        </div>

        {/* Lower-right: selected-section tooltip placeholder (wired in task 05),
            with the navigation prompts directly below it. */}
        <div className="flex flex-col items-end gap-2 text-right">
          <div
            className="border border-dashed border-white/30 px-3 py-2 font-mono text-xs tracking-wide text-white/40"
            data-placeholder="section-tooltip"
          >
            selected-section info
          </div>

          {/* Navigation prompts (desktop). */}
          <div
            className="hidden gap-6 font-mono text-xs tracking-wide text-white/50 sm:flex"
            data-nav-prompts
          >
            <span>↑ ↓ / Move</span>
            <span>Enter / Select</span>
            <span>Esc / Back</span>
          </div>

          {/* Touch hint (mobile). */}
          <div className="font-mono text-xs tracking-wide text-white/50 sm:hidden">
            Tap a command to open it
          </div>
        </div>
      </div>
    </main>
  )
}
