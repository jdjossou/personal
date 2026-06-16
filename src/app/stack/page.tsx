import { SkillScreen } from '@/components/Stack/SkillScreen'

// The STACK route renders the P3R "Skill" screen (docs/stack/stack_reference.png):
// a center-left roster of category quadrilaterals (red drop-shadows, the selected
// one bright-white), a top-right cyan technology list under the category name in
// thick black, two white triangles + the cropped vertical STACK title over the
// shared bright water, and a wired Back-to-menu control. The roster is interactive
// (click / hover / keyboard select a category, swapping the right list; one tech is
// always focused; activating it opens a reference dialog) — all in-page state, no
// deep links.
export default function StackPage() {
  return <SkillScreen />
}
