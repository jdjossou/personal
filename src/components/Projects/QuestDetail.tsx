// Quest detail readout (Task 03) — the lower "master–detail" panel that swaps to
// show the active project's full info as selection changes in QuestList (the
// reference's lower `Task` panel under the highlighted quest row). It is purely
// presentational: it renders whatever Project it is handed, with no selection
// state of its own.
//
// Why the links live HERE and not inside QuestRow: the rows are interactive
// listbox options, so an <a> placed inside one would be swallowed by (or fight
// with) the row's selection handler. Keeping the action links in this panel —
// structurally outside the listbox — means clicking a link never doubles as a
// row selection.
//
// Everything past name/date/status is rendered "only when present": a project
// with no `details`, no `links`, or no `screenshots` simply omits those blocks,
// so the panel always reads cleanly (no empty link bar or image frame).

import Image from 'next/image'
import { StatusBadge } from './StatusBadge'
import {
  LINKS_LABEL,
  VIEW_HINT,
  formatDateRange,
  type Project,
} from './constants'

export function QuestDetail({ project }: { project: Project | undefined }) {
  // Neutral fallback — only reached if an unknown slug is active (Task 04 could
  // pass one); the default selection is the first row, so normally a project is
  // always present.
  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-sm tracking-wide text-white/60">
          {VIEW_HINT}
        </p>
      </div>
    )
  }

  return (
    <article className="flex flex-col gap-4">
      {/* Heading row — name, with date + status pinned right (echoes the row). */}
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-white/15 pb-3">
        <h2 className="font-display text-3xl leading-none tracking-wide text-white uppercase md:text-4xl">
          {project.name}
        </h2>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs whitespace-nowrap text-white/80 tabular-nums">
            {formatDateRange(project.start, project.end)}
          </span>
          <StatusBadge status={project.status} />
        </div>
      </header>

      {/* All tags — the full set (the row truncates to MAX_ROW_TAGS). */}
      <div className="flex flex-wrap gap-x-3 gap-y-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[0.7rem] tracking-wide whitespace-nowrap text-white/70 uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Body — summary lead, then the longer details when present. */}
      <p className="max-w-3xl text-base leading-relaxed text-white/90">
        {project.summary}
      </p>
      {project.details && (
        <p className="max-w-3xl text-sm leading-relaxed text-white/70">
          {project.details}
        </p>
      )}

      {/* Links — clear angular action buttons; new-tab + rel only where flagged. */}
      {project.links && project.links.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/50 uppercase">
            {LINKS_LABEL}
          </span>
          <div className="flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.newTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 px-4 py-1.5 font-mono text-[0.7rem] font-semibold tracking-[0.15em] text-[#0A0A0A] uppercase transition-colors hover:bg-white"
              >
                {link.label}
                {link.newTab && <span aria-hidden>↗</span>}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Screenshots — rendered only when useful (present). Paths are plain
          strings (not static imports), so each fills a fixed-ratio frame to
          avoid layout shift. */}
      {project.screenshots && project.screenshots.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {project.screenshots.map((shot) => (
            <div
              key={shot.src}
              className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/15"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
