// Small UI glyphs for the About screen's composer + contact controls. Each is a
// single inline SVG drawn with currentColor so it inherits the button's colour
// (the external brand marks live in Landing/icons.tsx and are reused as-is).

type IconProps = { className?: string }

export const MicIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
)

// Filled square — the "stop / listening" state of the mic toggle.
export const StopIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
)

export const SpeakerIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M16 8a5 5 0 0 1 0 8" />
  </svg>
)

export const SpeakerOffIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M22 9l-6 6M16 9l6 6" />
  </svg>
)

export const SendIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
    <path d="M3 11.5 21 3l-8.5 18-2.2-7.3L3 11.5z" />
  </svg>
)

export const MailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
