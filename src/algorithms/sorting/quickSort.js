import { gather, noun } from '../utils.js';

export const quickSortMetadata = {
  slug: 'quick-sort',
  name: 'Quick Sort',
  category: 'Sorting',
  description:
    'Selects a pivot and partitions the array around it, then recursively sorts the partitions.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n\u00B2)', space: 'O(log n)' },
};

export function generateQuickSortSteps(array) {
  if (!Array.isArray(array) || array.length === 0) return [];

  const arr = array.slice();
  const n = arr.length;
  const terms = [];
  const finished = new Array(n).fill(false);

  let comparisons = 0;
  let swaps = 0;
  let partitions = 0;

  const facts = () => ({ Comparisons: comparisons, Swaps: swaps, Partitions: partitions });
  const stateAt = (index) => (finished[index] ? 'sorted' : 'default');

  const em = (opts) => {
    terms.push({
      key: terms.length + 1,
      array: arr.slice(),
      elements: opts.elements,
      pointers: opts.pointers ?? [],
      facts: facts(),
      sortedFlag: false,
      status: opts.status,
      badge: `Step ${terms.length + 1}`,
      heading: opts.heading,
      detail: opts.detail,
      region: opts.region ?? null,
      pivotIndex: opts.pivotIndex ?? null,
      phase: opts.phase,
      dividers: opts.dividers ?? [],
    });
  };

  const spanStates = ({ lo, hi, pivot, partitionBoundary, compareIndex, swapA, swapB, pivotAt }) => {
    return arr.map((value, index) => {
      if (index < lo || index > hi) return { value, state: stateAt(index) };
      if (pivot !== undefined && index === pivot) return { value, state: 'pivot' };
      if (pivotAt !== undefined && index === pivotAt) return { value, state: 'pivot' };
      if (compareIndex !== undefined && index === compareIndex) return { value, state: 'comparing' };
      if (swapA !== undefined && (index === swapA || index === swapB)) return { value, state: 'swapping' };
      if (partitionBoundary !== undefined && index < partitionBoundary) return { value, state: 'partitioned' };
      return { value, state: 'in-range' };
    });
  };

  em({
    phase: 'intro',
    region: { lo: 0, hi: n - 1 },
    pivotIndex: null,
    elements: arr.map((value) => ({ value, state: 'default' })),
    status: `Array ${gather(arr)} \u00B7 Pick a pivot, partition, and recurse.`,
    heading: 'Start sorting with quick sort.',
    detail:
      'Quick sort picks a pivot value, moves everything smaller than the pivot to its left and everything larger to its right, then recursively sorts each side. The pivot ends up in its final position after every partition.',
  });

  function quickSortRange(lo, hi) {
    const size = hi - lo + 1;

    if (size <= 0) return;

    if (size === 1) {
      finished[lo] = true;
      em({
        phase: 'partition',
        region: { lo, hi: lo },
        pivotIndex: null,
        elements: arr.map((value, index) =>
          index === lo ? { value, state: 'current' } : { value, state: stateAt(index) }
        ),
        status: `Single element ${arr[lo]} at index ${lo} \u2014 already in its final place.`,
        heading: `${arr[lo]} is trivially sorted.`,
        detail: `A range with one value needs no pivoting. Quick sort treats index ${lo} as finished and moves on.`,
      });
      return;
    }

    const pivot = arr[hi];
    partitions += 1;

    em({
      phase: 'choose',
      region: { lo, hi },
      pivotIndex: hi,
      elements: spanStates({ lo, hi, pivot: hi, partitionBoundary: lo }),
      pointers: [{ index: hi, label: `PIVOT ${pivot}`, kind: 'pivot' }],
      status: `Choose ${pivot} at index ${hi} as the pivot.`,
      heading: `Pivot = ${pivot} (last element).`,
      detail: `Every other value in [${lo}\u2026${hi}] will be compared against ${pivot}. Values smaller than ${pivot} move to the left side; larger ones stay right.`,
    });

    let i = lo;

    for (let j = lo; j < hi; j += 1) {
      const value = arr[j];
      comparisons += 1;

      if (i === j) {
        em({
          phase: 'partition',
          region: { lo, hi },
          pivotIndex: hi,
          elements: spanStates({ lo, hi, pivot: hi, partitionBoundary: i, compareIndex: j }),
          pointers: [
            { index: i, label: 'LEFT', kind: 'part' },
            { index: j, label: 'SCAN', kind: 'scan' },
            { index: hi, label: `PIVOT ${pivot}`, kind: 'pivot' },
          ],
          status: `Compare ${value} (index ${j}) with pivot ${pivot} \u00B7 ${noun(comparisons, 'comparison', 'comparisons')}.`,
          heading: `Scan index ${j}: is ${value} < ${pivot}?`,
          detail:
            value < pivot
              ? `${value} is smaller than the pivot, so it already belongs on the left side — the left boundary advances past it without a swap.`
              : `${value} is not smaller than the pivot, so it belongs on the right side and the scan continues.`,
        });
        if (value < pivot) i += 1;
        continue;
      }

      em({
        phase: 'partition',
        region: { lo, hi },
        pivotIndex: hi,
        elements: spanStates({ lo, hi, pivot: hi, partitionBoundary: i, compareIndex: j }),
        pointers: [
          { index: i, label: 'LEFT', kind: 'part' },
          { index: j, label: 'SCAN', kind: 'scan' },
          { index: hi, label: `PIVOT ${pivot}`, kind: 'pivot' },
        ],
        status: `Compare ${value} (index ${j}) with pivot ${pivot} \u00B7 ${noun(comparisons, 'comparison', 'comparisons')}.`,
        heading: `Scan index ${j}: is ${value} < ${pivot}?`,
        detail:
          value < pivot
            ? `${value} is smaller than the pivot, so it must swap into the left partition at index ${i}.`
            : `${value} is not smaller than the pivot, so it stays on the right side and the scan continues.`,
      });

      if (value < pivot) {
        const leftValue = arr[i];
        arr[i] = value;
        arr[j] = leftValue;
        swaps += 1;

        em({
          phase: 'partition',
          region: { lo, hi },
          pivotIndex: hi,
          elements: spanStates({ lo, hi, pivot: hi, partitionBoundary: i, swapA: i, swapB: j }),
          pointers: [
            { index: i, label: 'LEFT', kind: 'part' },
            { index: j, label: 'SCAN', kind: 'scan' },
            { index: hi, label: `PIVOT ${pivot}`, kind: 'pivot' },
          ],
          status: `Swap ${leftValue} and ${value} \u00B7 Swaps: ${swaps}.`,
          heading: `${value} < ${pivot} — swap into the left partition.`,
          detail: `${value} (index ${j}) swaps with ${leftValue} at the left boundary (index ${i}). The left partition now grows one cell, and the smaller value is stored on the left side of the pivot zone.`,
        });
        i += 1;
      }
    }

    const pivotDefault = arr[i];
    arr[i] = pivot;
    arr[hi] = pivotDefault;
    swaps += 1;

    em({
      phase: 'place',
      region: { lo, hi },
      pivotIndex: i,
      elements: spanStates({ lo, hi, pivotAt: i, swapA: i, swapB: hi, partitionBoundary: i }),
      pointers: [
        { index: i, label: `PIVOT ${pivot}`, kind: 'pivot' },
        { index: hi, label: '—', kind: 'scan' },
      ],
      status: `Pivot ${pivot} placed at index ${i} \u00B7 Swaps: ${swaps}.`,
      heading: `Pivot ${pivot} is in its final position.`,
      detail: `${pivot} swaps with ${pivotDefault} and lands at index ${i}. Because everything to its left is smaller and everything to its right is larger, index ${i} will never change again.`,
    });

    finished[i] = true;

    em({
      phase: 'place',
      region: { lo, hi },
      pivotIndex: i,
      elements: spanStates({ lo, hi, pivotAt: i, partitionBoundary: i }),
      dividers: [i],
      pointers: [
        { index: lo, label: 'LEFT SUBARRAY', kind: 'part' },
        { index: hi, label: 'RIGHT SUBARRAY', kind: 'scan' },
        { index: i, label: `PIVOT ${pivot}`, kind: 'pivot' },
      ],
      status: `Partition [${lo}\u2026${hi}] complete \u00B7 left \u2264 ${pivot} \u00B7 right > ${pivot}.`,
      heading: 'Two partitions: sort each side next.',
      detail: `All values left of index ${i} (${arr.slice(lo, i).join(' \u00B7 ') || 'none'}) are smaller than the pivot, and all values right of it (${arr.slice(i + 1, hi + 1).join(' \u00B7 ') || 'none'}) are greater. Quick sort now recurses into [${lo}\u2026${i - 1}] and [${i + 1}\u2026${hi}].`,
    });

    quickSortRange(lo, i - 1);
    quickSortRange(i + 1, hi);
  }

  quickSortRange(0, n - 1);

  terms.push({
    key: terms.length + 1,
    array: arr.slice(),
    elements: arr.map((value) => ({ value, state: 'sorted' })),
    pointers: [],
    facts: facts(),
    sortedFlag: true,
    status: `\u2713 Array sorted \u00B7 ${gather(arr)}.`,
    badge: `Step ${terms.length + 1}`,
    heading: 'Quick Sort is complete.',
    detail: `Quick sort ordered the array with ${comparisons} ${noun(comparisons, 'comparison', 'comparisons')}, ${swaps} ${noun(swaps, 'swap', 'swaps')}, and ${partitions} ${noun(partitions, 'partition', 'partitions')}.`,
    region: { lo: 0, hi: n - 1 },
    pivotIndex: null,
    phase: 'complete',
    dividers: [],
  });

  return terms;
}