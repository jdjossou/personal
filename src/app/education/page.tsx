import { StatScreen } from '@/components/Education/StatScreen'

// The EDUCATION route renders the P3R "Academic Status / Check Status" screen: a
// study-term roster + an always-on identity panel (university / degree / Class
// of 20XX) with diagonal blue slashes over the shared P3R background. The active
// term mirrors into `/education/<slug>` (see StatScreen); this bare path shows
// the default term.
export default function EducationPage() {
  return <StatScreen />
}
