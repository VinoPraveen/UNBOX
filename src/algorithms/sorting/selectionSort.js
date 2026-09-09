import { gather, noun } from '../utils.js';

export const selectionSortMetadata = {
  slug: 'selection-sort',
  name: 'Selection Sort',
  category: 'Sorting',
  description:
    'Repeatedly finds the smallest remaining element and swaps it into the next sorted slot.',
  complexity: { best: 'O(n\u00B2)', average: 'O(n\u00B2)', worst: 'O(n\u00B2)', space: 'O(1)' },
};

export function generateSelectionSortSteps(array) {
  if (!Array.isArray(array) || array.length === 0) return [];

  const arr = array.slice();
  const n = arr.length;
  const terms = [];
  let comparisons = 0;
  let swaps = 0;

  const elements = (stateFn) =>
    arr.map((value, index) => ({
      value,
      state: stateFn(index),
    }));

  terms.push({
    key: 1,
    array: arr.slice(),
    elements: elements(() => 'default'),
    pointers: [],
    facts: { Comparisons: 0, Swaps: 0 },
    sortedFlag: false,
    status: `Array ${gather(arr)} \u00B7 Find the smallest value on every pass.`,
    badge: 'Step 1',
    heading: 'Start sorting with selection sort.',
    detail:
      'Selection sort scans the unsorted region for the smallest element, then swaps it into the next sorted slot. Each pass grows the sorted region by one.',
  });

  for (let i = 0; i < n - 1; i += 1) {
    let minIndex = i;

    terms.push({
      key: terms.length + 1,
      array: arr.slice(),
      elements: elements((index) => {
        if (index < i) return 'sorted';
        if (index === i) return 'current';
        return 'default';
      }),
      pointers: [{ index: i, label: 'POS', kind: 'scan' }],
      facts: { Comparisons: comparisons, Swaps: swaps },
      sortedFlag: false,
      status: `Current position ${i} \u00B7 Assume the minimum is ${arr[i]} at index ${i}.`,
      badge: `Step ${terms.length + 1}`,
      heading: `Find the minimum from index ${i} onward.`,
      detail: `The sorted region sits at indices 0\u2026${i - 1}. Selection sort scans the rest and assumes ${arr[i]} is the smallest so far.`,
    });

    for (let j = i + 1; j < n; j += 1) {
      comparisons += 1;

      terms.push({
        key: terms.length + 1,
        array: arr.slice(),
        elements: elements((index) => {
          if (index < i) return 'sorted';
          if (index === minIndex) return 'minimum';
          if (index === j) return 'comparing';
          return 'default';
        }),
        pointers: [
          { index: minIndex, label: 'MIN', kind: 'min' },
          { index: j, label: 'SCAN', kind: 'scan' },
        ],
        facts: { Comparisons: comparisons, Swaps: swaps },
        sortedFlag: false,
        status: `Compare ${arr[j]} vs current minimum ${arr[minIndex]} \u00B7 ${noun(comparisons, 'comparison', 'comparisons')}.`,
        badge: `Step ${terms.length + 1}`,
        heading: `Scan index ${j}: compare ${arr[j]} with ${arr[minIndex]}.`,
        detail:
          arr[j] < arr[minIndex]
            ? `${arr[j]} is smaller than ${arr[minIndex]}, so it becomes the new minimum candidate.`
            : `${arr[j]} is not smaller than ${arr[minIndex]}, so the minimum stays at index ${minIndex}.`,
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;

        terms.push({
          key: terms.length + 1,
          array: arr.slice(),
          elements: elements((index) => {
            if (index < i) return 'sorted';
            if (index === minIndex) return 'minimum';
            if (index === i) return 'current';
            return 'default';
          }),
          pointers: [{ index: minIndex, label: 'MIN', kind: 'min' }],
          facts: { Comparisons: comparisons, Swaps: swaps },
          sortedFlag: false,
          status: `New minimum: ${arr[minIndex]} at index ${minIndex}.`,
          badge: `Step ${terms.length + 1}`,
          heading: `New minimum found at index ${minIndex}: ${arr[minIndex]}.`,
          detail: `${arr[minIndex]} is now the smallest value seen in this pass. The scan continues from index ${minIndex + 1}.`,
        });
      }
    }

    if (minIndex !== i) {
      const a = arr[i];
      const b = arr[minIndex];
      arr[i] = b;
      arr[minIndex] = a;
      swaps += 1;

      terms.push({
        key: terms.length + 1,
        array: arr.slice(),
        elements: elements((index) => {
          if (index < i) return 'sorted';
          if (index === i || index === minIndex) return 'swapping';
          return 'default';
        }),
        pointers: [
          { index: i, label: 'SWAP', kind: 'scan' },
          { index: minIndex, label: 'SWAP', kind: 'min' },
        ],
        facts: { Comparisons: comparisons, Swaps: swaps },
        sortedFlag: false,
        status: `Swap position ${i} with ${minIndex} \u00B7 Swaps: ${swaps}.`,
        badge: `Step ${terms.length + 1}`,
        heading: `Place ${b} (the minimum) into slot ${i}.`,
        detail: `${b} at index ${minIndex} is swapped into position ${i}, locking it into the sorted region. ${a} moves to index ${minIndex}.`,
      });
    } else {
      terms.push({
        key: terms.length + 1,
        array: arr.slice(),
        elements: elements((index) => {
          if (index < i) return 'sorted';
          if (index === i) return 'swapping';
          return 'default';
        }),
        pointers: [{ index: i, label: 'IN PLACE', kind: 'scan' }],
        facts: { Comparisons: comparisons, Swaps: swaps },
        sortedFlag: false,
        status: `${arr[i]} is already the minimum \u2014 no swap needed.`,
        badge: `Step ${terms.length + 1}`,
        heading: `${arr[i]} is already in its final position.`,
        detail: `The minimum of the remaining region was already at index ${i}, so no swap is needed this pass.`,
      });
    }
  }

  terms.push({
    key: terms.length + 1,
    array: arr.slice(),
    elements: elements(() => 'sorted'),
    pointers: [],
    facts: { Comparisons: comparisons, Swaps: swaps },
    sortedFlag: true,
    status: `\u2713 Array sorted \u00B7 ${gather(arr)}.`,
    badge: `Step ${terms.length + 1}`,
    heading: 'Array sorted.',
    detail: `Selection sort ordered the array with ${comparisons} ${noun(comparisons, 'comparison', 'comparisons')} and ${swaps} ${noun(swaps, 'swap', 'swaps')}.`,
  });

  return terms;
}