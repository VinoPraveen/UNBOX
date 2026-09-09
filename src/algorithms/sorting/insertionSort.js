import { gather, noun } from '../utils.js';

export const insertionSortMetadata = {
  slug: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'Sorting',
  description:
    'Builds the sorted region one element at a time by shifting larger values to make room.',
  complexity: { best: 'O(n)', average: 'O(n\u00B2)', worst: 'O(n\u00B2)', space: 'O(1)' },
};

export function generateInsertionSortSteps(array) {
  if (!Array.isArray(array) || array.length === 0) return [];

  const arr = array.slice();
  const n = arr.length;
  const terms = [];
  let comparisons = 0;
  let shifts = 0;

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
    facts: { Comparisons: 0, Shifts: 0 },
    sortedFlag: false,
    status: `Array ${gather(arr)} \u00B7 Grow the sorted region from the left.`,
    badge: 'Step 1',
    heading: 'Start sorting with insertion sort.',
    detail:
      'Insertion sort treats index 0 as the start of the sorted region. Each pass takes the next element as the key and slides it left into its correct place.',
  });

  for (let i = 1; i < n; i += 1) {
    const key = arr[i];
    let j = i - 1;

    terms.push({
      key: terms.length + 1,
      array: arr.slice(),
      elements: elements((index) => {
        if (index < i) return 'sorted';
        if (index === i) return 'current';
        return 'default';
      }),
      pointers: [{ index: i, label: 'KEY', kind: 'key' }],
      facts: { Comparisons: comparisons, Shifts: shifts },
      sortedFlag: false,
      status: `Take the key ${key} from index ${i} \u00B7 Sorted region: ${gather(arr.slice(0, i))}.`,
      badge: `Step ${terms.length + 1}`,
      heading: `Key = ${key}.`,
      detail: `The sorted region is ${gather(arr.slice(0, i))}. The key is removed from position ${i}; insertion sort slides it left until it fits.`,
    });

    while (j >= 0 && arr[j] > key) {
      comparisons += 1;

      terms.push({
        key: terms.length + 1,
        array: arr.slice(),
        elements: elements((index) => {
          if (index < j) return 'sorted';
          if (index === j) return 'comparing';
          if (index > j && index <= i) return 'shifting';
          return 'default';
        }),
        pointers: [
          { index: j, label: '> KEY', kind: 'scan' },
          { index: i, label: 'KEY', kind: 'key' },
        ],
        facts: { Comparisons: comparisons, Shifts: shifts },
        sortedFlag: false,
        status: `Compare ${arr[j]} vs key ${key} \u00B7 ${noun(comparisons, 'comparison', 'comparisons')}.`,
        badge: `Step ${terms.length + 1}`,
        heading: `${arr[j]} > ${key} — shift ${arr[j]} right.`,
        detail: `${arr[j]} is greater than the key, so it must move one slot right to make room for ${key}.`,
      });

      arr[j + 1] = arr[j];
      shifts += 1;

      terms.push({
        key: terms.length + 1,
        array: arr.slice(),
        elements: elements((index) => {
          if (index < j) return 'sorted';
          if (index === j || index === j + 1) return 'shifting';
          if (index === i) return 'current';
          return 'default';
        }),
        pointers: [
          { index: j, label: 'OPEN', kind: 'scan' },
          { index: i, label: 'KEY', kind: 'key' },
        ],
        facts: { Comparisons: comparisons, Shifts: shifts },
        sortedFlag: false,
        status: `Shift ${arr[j + 1]} right to index ${j + 1} \u00B7 Shifts: ${shifts}.`,
        badge: `Step ${terms.length + 1}`,
        heading: `${arr[j + 1]} moved one slot right.`,
        detail: `Index ${j + 1} now holds the shifted value and index ${j} is the open slot where the key may land next.`,
      });

      j -= 1;
    }

    if (j >= 0) {
      comparisons += 1;

      terms.push({
        key: terms.length + 1,
        array: arr.slice(),
        elements: elements((index) => {
          if (index < i) return 'sorted';
          if (index === j) return 'comparing';
          if (index === i) return 'current';
          return 'default';
        }),
        pointers: [
          { index: j, label: '\u2264 KEY', kind: 'scan' },
          { index: i, label: 'KEY', kind: 'key' },
        ],
        facts: { Comparisons: comparisons, Shifts: shifts },
        sortedFlag: false,
        status: `Compare ${arr[j]} vs key ${key} \u00B7 ${noun(comparisons, 'comparison', 'comparisons')}.`,
        badge: `Step ${terms.length + 1}`,
        heading: `${arr[j]} \u2264 ${key} — stop shifting.`,
        detail: `The key is no longer smaller than ${arr[j]}, so the open slot is at index ${j + 1}.`,
      });
    }

    arr[j + 1] = key;

    terms.push({
      key: terms.length + 1,
      array: arr.slice(),
      elements: elements((index) => {
        if (index <= j + 1) return 'sorted';
        return 'default';
      }),
      pointers: [],
      facts: { Comparisons: comparisons, Shifts: shifts },
      sortedFlag: false,
      status: `Insert ${key} at index ${j + 1} \u00B7 Sorted region now: ${gather(arr.slice(0, i + 1))}.`,
      badge: `Step ${terms.length + 1}`,
      heading: `${key} fits at index ${j + 1}.`,
      detail: `The key is placed into the open slot. Indices 0\u2026${i} now form the sorted region ${gather(arr.slice(0, i + 1))}.`,
    });
  }

  terms.push({
    key: terms.length + 1,
    array: arr.slice(),
    elements: elements((index) => (index <= n - 1 ? 'sorted' : 'default')),
    pointers: [],
    facts: { Comparisons: comparisons, Shifts: shifts, Passes: n - 1 },
    sortedFlag: true,
    status: `\u2713 Array sorted \u00B7 ${gather(arr)}.`,
    badge: `Step ${terms.length + 1}`,
    heading: 'Array sorted.',
    detail: `Insertion sort ordered the array with ${comparisons} ${noun(comparisons, 'comparison', 'comparisons')} and ${shifts} ${noun(shifts, 'shift', 'shifts')} across ${n - 1} ${noun(n - 1, 'pass', 'passes')}.`,
  });

  return terms;
}