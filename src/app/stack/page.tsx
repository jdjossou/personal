import { SkillScreen } from '@/components/Stack/SkillScreen'

// The STACK route renders the P3R "Skill" screen (docs/stack/stack_reference.png):
// a center-left roster of category quadrilaterals (red drop-shadows, default
// bright-white selected), a top-right cyan technology list under the category name
// in thick black, two white triangles + the cropped vertical STACK title over the
// shared bright water, and a wired Back-to-menu control. The composition is static
// (default category selected, first tech focused); category selection + swapping +
// `/stack/<category>` deep links + the reference dialog land in Task 03.
export default function StackPage() {
  return <SkillScreen />
}
