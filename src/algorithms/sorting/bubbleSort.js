import { gather, noun } from '../utils.js';

export const bubbleSortMetadata = {
  slug: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Sorting',
  description:
    'Repeatedly compares adjacent elements and swaps them when they are in the wrong order.',
  complexity: { best: 'O(n)', average: 'O(n\u00B2)', worst: 'O(n\u00B2)', space: 'O(1)' },
};

export function generateBubbleSortSteps(array) {
  if (!Array.isArray(array) || array.length === 0) return [];

  const arr = array.slice();
  const n = arr.length;
  const terms = [];
  let comparisons = 0;
  let swaps = 0;
  let passes = 0;

  const withLockedTail = (cells, lockedFrom) => {
    return cells.map((cell, index) =>
      index >= lockedFrom ? { ...cell, state: 'sorted' } : cell
    );
  };

  terms.push({
    key: 1,
    array: arr.slice(),
    elements: arr.map((value) => ({ value, state: 'default' })),
    pointers: [],
    facts: { Comparisons: 0, Swaps: 0, Passes: 0 },
    sortedFlag: false,
    status: `Array ${gather(arr)} \u00B7 Ready to bubble the largest value to the end.`,
    badge: 'Step 1',
    heading: 'Start sorting with bubble sort.',
    detail:
      'Bubble sort compares adjacent pairs and swaps them when the left value is larger, so the biggest value floats to the end of the array on every pass.',
  });

  for (let pass = 0; pass < n - 1; pass += 1) {
    passes += 1;
    const lockedFrom = n - pass;

    for (let j = 0; j < n - 1 - pass; j += 1) {
      comparisons += 1;
      const left = arr[j];
      const right = arr[j + 1];

      terms.push({
        key: terms.length + 1,
        array: arr.slice(),
        elements: withLockedTail(
          arr.map((value, index) => {
            let state = 'default';
            if (index === j || index === j + 1) state = 'comparing';
            return { value, state };
          }),
          lockedFrom
        ),
        pointers: [
          { index: j, label: 'i', kind: 'scan' },
          { index: j + 1, label: 'j', kind: 'scan' },
        ],
        facts: { Comparisons: comparisons, Swaps: swaps, Passes: passes },
        sortedFlag: false,
        status: `Compare ${left} vs ${right} \u00B7 ${noun(comparisons, 'comparison', 'comparisons')} \u00B7 Pass ${passes}.`,
        badge: `Step ${terms.length + 1}`,
        heading: `Pass ${passes} \u00B7 Compare ${left} and ${right}.`,
        detail:
          left > right
            ? `${left} is greater than ${right}, so they are out of order and need to swap.`
            : `${left} is not greater than ${right}, so they are already in order.`,
      });

      if (left > right) {
        arr[j] = right;
        arr[j + 1] = left;
        swaps += 1;

        terms.push({
          key: terms.length + 1,
          array: arr.slice(),
          elements: withLockedTail(
            arr.map((value, index) => {
              let state = 'default';
              if (index === j || index === j + 1) state = 'swapping';
              return { value, state };
            }),
            lockedFrom
          ),
          pointers: [
            { index: j, label: 'i', kind: 'scan' },
            { index: j + 1, label: 'j', kind: 'scan' },
          ],
          facts: { Comparisons: comparisons, Swaps: swaps, Passes: passes },
          sortedFlag: false,
          status: `Swap ${right} and ${left} \u00B7 Swaps: ${swaps}.`,
          badge: `Step ${terms.length + 1}`,
          heading: `${right} < ${left} — swap them.`,
          detail: `${right} is smaller, so it moves one position left. The larger value ${left} bubbles one step closer to its final place.`,
        });
      }
    }

    const settledIndex = n - 1 - pass;
    const settled = arr[settledIndex];
    terms.push({
      key: terms.length + 1,
      array: arr.slice(),
      elements: arr.map((value, index) => ({
        value,
        state: index >= settledIndex ? 'sorted' : 'default',
      })),
      pointers: [],
      facts: { Comparisons: comparisons, Swaps: swaps, Passes: passes },
      sortedFlag: false,
      status: `Pass ${passes} complete \u00B7 ${settled} is in its final position.`,
      badge: `Step ${terms.length + 1}`,
      heading: `Pass ${passes} finished \u2014 ${settled} settled.`,
      detail: `After this pass, the region from index ${settledIndex} onward is locked in place and will not be revisited.`,
    });
  }

  terms.push({
    key: terms.length + 1,
    array: arr.slice(),
    elements: arr.map((value) => ({ value, state: 'sorted' })),
    pointers: [],
    facts: { Comparisons: comparisons, Swaps: swaps, Passes: passes },
    sortedFlag: true,
    status: `\u2713 Array sorted in ${passes} ${noun(passes, 'pass', 'passes')} \u00B7 ${gather(arr)}.`,
    badge: `Step ${terms.length + 1}`,
    heading: 'Array sorted.',
    detail: `Bubble sort ordered the array with ${comparisons} ${noun(comparisons, 'comparison', 'comparisons')} and ${swaps} ${noun(swaps, 'swap', 'swaps')} across ${passes} ${noun(passes, 'pass', 'passes')}.`,
  });

  return terms;
}