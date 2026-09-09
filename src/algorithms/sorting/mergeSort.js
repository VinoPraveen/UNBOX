import { gather, noun } from '../utils.js';

export const mergeSortMetadata = {
  slug: 'merge-sort',
  name: 'Merge Sort',
  category: 'Sorting',
  description:
    'Divides the array into smaller parts, sorts them, and merges the sorted parts back together.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
};

export function generateMergeSortSteps(array) {
  if (!Array.isArray(array) || array.length === 0) return [];

  const arr = array.slice();
  const n = arr.length;
  const terms = [];
  const finished = new Array(n).fill(false);

  let comparisons = 0;
  let merges = 0;
  let divisions = 0;
  let writes = 0;

  const facts = () => ({ Comparisons: comparisons, Merges: merges, Divisions: divisions, ArrayWrites: writes });

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
      phase: opts.phase,
      dividers: opts.dividers ?? [],
    });
  };

  const mergeRegionStates = ({ lo, mid, hi, i, j, k, place, comparing }) => {
    return arr.map((value, index) => {
      if (index < lo || index > hi) return { value, state: stateAt(index) };
      if (place !== undefined && index === place) return { value, state: 'placed' };
      if (comparing && (index === i || index === j)) return { value, state: 'comparing' };
      if (index < k) return { value, state: 'merged' };
      if (index <= mid) return { value, state: 'left-run' };
      return { value, state: 'right-run' };
    });
  };

  const divideRegionStates = ({ lo, mid, hi, currentOnly }) => {
    return arr.map((value, index) => {
      if (index < lo || index > hi) return { value, state: stateAt(index) };
      if (index === lo && index === hi && currentOnly) return { value, state: 'current' };
      if (index <= mid) return { value, state: 'left-run' };
      return { value, state: 'right-run' };
    });
  };

  em({
    phase: 'intro',
    region: { lo: 0, mid: -1, hi: n - 1 },
    elements: arr.map((value) => ({ value, state: 'default' })),
    status: `Array ${gather(arr)} \u00B7 Split it in half, sort each half, then merge.`,
    heading: 'Start sorting with merge sort.',
    detail:
      'Merge sort is a divide-and-conquer algorithm. It keeps splitting the array into halves until every piece holds one value, then merges the sorted pieces back together.',
  });

  function mergeSortRange(lo, hi) {
    const size = hi - lo + 1;

    if (size <= 1) {
      if (size === 1) {
        finished[lo] = true;
        em({
          phase: 'divide',
          region: { lo, mid: lo, hi },
          elements: divideRegionStates({ lo, mid: lo, hi, currentOnly: true }),
          status: `Reached a single element: ${arr[lo]}.`,
          heading: `Single element ${arr[lo]} — already sorted.`,
          detail: `An array of one value needs no comparisons. Merge sort treats it as sorted and starts merging it back together.`,
        });
      }
      return;
    }

    const mid = (lo + hi) >> 1;
    divisions += 1;

    em({
      phase: 'divide',
      region: { lo, mid, hi },
      elements: divideRegionStates({ lo, mid, hi }),
      dividers: [mid],
      pointers: [
        { index: lo, label: 'START', kind: 'range' },
        { index: hi, label: 'END', kind: 'range' },
      ],
      status: `Split ${gather(arr.slice(lo, hi + 1))} into ${gather(arr.slice(lo, mid + 1))} \u00B7 ${gather(arr.slice(mid + 1, hi + 1))}.`,
      heading: 'Split the array into two halves.',
      detail: `The range [${lo}\u2026${hi}] is divided at the midpoint (index ${mid}). The left half becomes ${gather(arr.slice(lo, mid + 1))} and the right half ${gather(arr.slice(mid + 1, hi + 1))}. Each half is sorted independently before being merged.`,
    });

    mergeSortRange(lo, mid);
    mergeSortRange(mid + 1, hi);

    merges += 1;
    const temp = arr.slice(lo, hi + 1);
    const leftLen = mid - lo + 1;
    const runLen = hi - lo + 1;
    let i = 0;
    let j = leftLen;
    let k = lo;

    while (i < leftLen && j < runLen) {
      const left = temp[i];
      const right = temp[j];
      comparisons += 1;

      em({
        phase: 'merge',
        region: { lo, mid, hi },
        elements: mergeRegionStates({ lo, mid, hi, i: lo + i, j: mid + 1 + (j - leftLen), k, comparing: true }),
        dividers: [mid],
        pointers: [
          { index: lo + i, label: `LEFT ${left}`, kind: 'left' },
          { index: mid + 1 + (j - leftLen), label: `RIGHT ${right}`, kind: 'right' },
          { index: k, label: 'WRITE', kind: 'write' },
        ],
        status: `Compare ${left} (left) with ${right} (right) \u00B7 ${noun(comparisons, 'comparison', 'comparisons')}.`,
        heading: `Compare ${left} and ${right}.`,
        detail: `Both runs are sorted, so their next values ${left} and ${right} are the smallest left in each. The smaller one is written next into the merged range at index ${k}.`,
      });

      let picked;
      let from;
      if (left <= right) {
        picked = left;
        from = 'left';
        i += 1;
      } else {
        picked = right;
        from = 'right';
        j += 1;
      }

      arr[k] = picked;
      writes += 1;

      em({
        phase: 'merge',
        region: { lo, mid, hi },
        elements: mergeRegionStates({
          lo, mid, hi,
          i: lo + i, j: mid + 1 + (j - leftLen), k, place: k,
        }),
        dividers: [mid],
        pointers: [
          { index: lo + i, label: `LEFT ${i < leftLen ? temp[i] : '—'}`, kind: 'left' },
          { index: mid + 1 + (j - leftLen), label: `RIGHT ${j < runLen ? temp[j] : '—'}`, kind: 'right' },
          { index: k, label: 'WRITE', kind: 'write' },
        ],
        status: `Place ${picked} at index ${k} \u00B7 the ${from} value is smaller.`,
        heading: `${picked} is smaller \u2014 place ${picked} first.`,
        detail: `${picked} from the ${from} run is written into position ${k} of the merged range. The ${from} pointer advances to the next value, and index ${k} is now part of the merged output.`,
      });

      k += 1;
    }

    while (i < leftLen) {
      const value = temp[i];
      arr[k] = value;
      writes += 1;
      em({
        phase: 'merge',
        region: { lo, mid, hi },
        elements: mergeRegionStates({ lo, mid, hi, i: lo + i, j: mid + 1 + (j - leftLen), k, place: k }),
        dividers: [mid],
        pointers: [
          { index: lo + i, label: `LEFT ${value}`, kind: 'left' },
          { index: mid + 1 + (j - leftLen), label: 'RIGHT —', kind: 'right' },
          { index: k, label: 'WRITE', kind: 'write' },
        ],
        status: `Copy ${value} from the left run into index ${k}.`,
        heading: 'Right run is empty — copy remaining values.',
        detail: `No values are left in the right run, so the remaining left-run value ${value} is copied straight into the merged range.`,
      });
      i += 1;
      k += 1;
    }

    while (j < runLen) {
      const value = temp[j];
      arr[k] = value;
      writes += 1;
      em({
        phase: 'merge',
        region: { lo, mid, hi },
        elements: mergeRegionStates({ lo, mid, hi, i: lo + i, j: mid + 1 + (j - leftLen), k, place: k }),
        dividers: [mid],
        pointers: [
          { index: lo + i, label: 'LEFT —', kind: 'left' },
          { index: mid + 1 + (j - leftLen), label: `RIGHT ${value}`, kind: 'right' },
          { index: k, label: 'WRITE', kind: 'write' },
        ],
        status: `Copy ${value} from the right run into index ${k}.`,
        heading: 'Left run is empty — copy remaining values.',
        detail: `No values are left in the left run, so the remaining right-run value ${value} is copied straight into the merged range.`,
      });
      j += 1;
      k += 1;
    }

    for (let idx = lo; idx <= hi; idx += 1) finished[idx] = true;

    em({
      phase: 'merge',
      region: { lo, mid, hi },
      elements: arr.map((value, index) =>
        index >= lo && index <= hi ? { value, state: 'merged' } : { value, state: stateAt(index) }
      ),
      status: `Merged range [${lo}\u2026${hi}] \u2192 ${gather(arr.slice(lo, hi + 1))}.`,
      heading: 'The two halves are now merged.',
      detail: `Indices ${lo}\u2026${hi} now hold one sorted run. This run will be merged with its sibling at the next level up until the whole array is sorted.`,
    });
  }

  mergeSortRange(0, n - 1);

  terms.push({
    key: terms.length + 1,
    array: arr.slice(),
    elements: arr.map((value) => ({ value, state: 'sorted' })),
    pointers: [],
    facts: facts(),
    sortedFlag: true,
    status: `\u2713 Array sorted \u00B7 ${gather(arr)}.`,
    badge: `Step ${terms.length + 1}`,
    heading: 'Merge Sort is complete.',
    detail: `Merge sort ordered the array with ${comparisons} ${noun(comparisons, 'comparison', 'comparisons')}, ${merges} ${noun(merges, 'merge operation', 'merge operations')}, ${divisions} ${noun(divisions, 'division', 'divisions')}, and ${writes} array ${noun(writes, 'write', 'writes')}.`,
    region: { lo: 0, mid: -1, hi: n - 1 },
    phase: 'complete',
    dividers: [],
  });

  return terms;
}