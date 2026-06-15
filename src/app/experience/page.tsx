import { ExperienceList } from '@/components/Experience/ExperienceList'

// The EXPERIENCE route is now the LIST screen (menu → list → detail): a P3R
// "Social Link LIST" of every role over the shared animated water. Picking a
// card opens that role's detail collage at `/experience/<slug>` (SocialLinkScreen,
// rendered by the [slug] route). The bare `/experience` no longer renders a role
// directly — the detail lives exclusively under `/experience/<slug>`.
export default function ExperiencePage() {
  return <ExperienceList />
}
