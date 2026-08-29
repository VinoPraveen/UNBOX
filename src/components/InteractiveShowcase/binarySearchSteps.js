export const ARRAY = [10, 20, 30, 40, 50, 60, 70];
export const TARGET = 60;

const gather = (low, high) => ARRAY.slice(low, high + 1).join(' \u00B7 ');

/*
 * 4 meaningful visualization states:
 *   STEP 1 START  — full array, full search range
 *   STEP 2 CHECK  — MID lands on 40 (index 3)
 *   STEP 3 NARROW — left half eliminated, range narrows to 50·60·70, MID -> 60
 *   STEP 4 FOUND  — 60 matches the target
 * Each snapshot drives both the visualization and the explanation panel.
 */
export const STEPS = [
  {
    key: 1,
    low: 0,
    high: ARRAY.length - 1,
    mid: null,
    eliminated: [false, false, false, false, false, false, false],
    found: false,
    status: `Sorted array · Target ${TARGET} · Move through the search step by step.`,
    badge: 'STEP 1',
    heading: 'Start wide.',
    detail:
      'The search covers the whole array. Binary search repeatedly compares the middle value to the target and discards half of the search space after every comparison.',
  },
  {
    key: 2,
    low: 0,
    high: ARRAY.length - 1,
    mid: 3,
    eliminated: [false, false, false, false, false, false, false],
    found: false,
    status: `MID 40 vs target ${TARGET} — check the middle element.`,
    badge: 'STEP 2',
    heading: 'Check the middle element.',
    detail:
      'MID lands on 40 at the center of the array. 40 is less than 60, so the target can only live in the right half.',
  },
  {
    key: 3,
    low: 4,
    high: 6,
    mid: 5,
    eliminated: [true, true, true, true, false, false, false],
    found: false,
    status: `Searching ${gather(4, 6)} — the left half is gone.`,
    badge: 'STEP 3',
    heading: '60 is greater than 40, so search the right half.',
    detail:
      '10 · 20 · 30 · 40 are eliminated. The range narrows to 50 · 60 · 70 and MID moves onto 60.',
  },
  {
    key: 4,
    low: 4,
    high: 6,
    mid: 5,
    eliminated: [true, true, true, true, false, false, false],
    found: true,
    status: `\u2713 Found ${TARGET} at index 5.`,
    badge: 'STEP 4',
    heading: '60 found.',
    detail:
      'The middle element equals the target. Binary search locates 60 at index 5 in just 3 comparisons.',
  },
];

export function narrationFor(stepNumber) {
  return STEPS[stepNumber - 1] ?? STEPS[STEPS.length - 1];
}