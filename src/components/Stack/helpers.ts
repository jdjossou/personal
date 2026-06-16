// Stack "Skill Screen" helpers — the pure (React/DOM-free) lookup functions the
// components lean on, kept out of the data file (stack.ts) and the constants
// file so each stays single-purpose. Same separation as Education/helpers.ts.

import { CATEGORIES, type Category } from './stack'

// The first category in display order — the initial roster selection. There are
// no deep links, so selection is purely in-page state seeded from here.
export const getDefaultCategory = (): Category => CATEGORIES[0]
