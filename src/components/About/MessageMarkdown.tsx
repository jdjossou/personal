// Renders an assistant reply that may contain Markdown (the model often returns
// lists, bold, links, inline code, etc.). react-markdown + remark-gfm handle the
// parsing; the component map below restyles every element to the About screen's
// rounded-sans voice + P3R blue accents, so a Markdown answer reads like the rest
// of the dialogue instead of default browser HTML.

import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ACCENT_BLUE } from './constants'

const MD_COMPONENTS: Components = {
  // Paragraphs keep the spoken body size; tight vertical rhythm between blocks.
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:opacity-80"
      style={{ color: ACCENT_BLUE }}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 marker:text-[color:var(--md-accent)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-[color:var(--md-accent)]">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => <h3 className="mt-3 mb-1 text-[1.05rem] font-semibold text-white">{children}</h3>,
  h2: ({ children }) => <h3 className="mt-3 mb-1 text-[1.05rem] font-semibold text-white">{children}</h3>,
  h3: ({ children }) => <h4 className="mt-3 mb-1 text-[1rem] font-semibold text-white">{children}</h4>,
  blockquote: ({ children }) => (
    <blockquote
      className="my-2 border-l-2 pl-3 italic opacity-90"
      style={{ borderColor: `${ACCENT_BLUE}66` }}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-white/15" />,
  code: ({ className, children }) => {
    // react-markdown gives block code a `language-*` className; inline code has none.
    const isBlock = /language-/.test(className ?? '')
    if (isBlock) {
      return (
        <code className="block whitespace-pre-wrap break-words font-mono text-[0.82rem]">{children}</code>
      )
    }
    return (
      <code
        className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.82rem]"
        style={{ color: ACCENT_BLUE }}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded bg-black/35 p-3">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-[0.85rem]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-white/15 px-2 py-1 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-white/15 px-2 py-1">{children}</td>,
}

export function MessageMarkdown({ text }: { text: string }) {
  return (
    <div
      className="font-rounded text-[0.95rem]"
      style={{ ['--md-accent' as string]: ACCENT_BLUE }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
        {text}
      </ReactMarkdown>
    </div>
  )
}
