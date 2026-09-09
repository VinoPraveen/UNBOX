import { noun } from '../utils.js';

export const linearSearchMetadata = {
  slug: 'linear-search',
  name: 'Linear Search',
  category: 'Searching',
  description:
    'Checks every element in order until the target is found (or the array runs out).',
  complexity: { time: 'O(n)', space: 'O(1)' },
};

export function generateLinearSearchSteps(array, target) {
  if (!Array.isArray(array) || array.length === 0) return [];

  const n = array.length;
  const terms = [];
  let comparisons = 0;

  const buildElements = (activeIndex, checkedThrough) => {
    return array.map((value, index) => {
      let state = 'default';
      if (activeIndex === index) state = 'active';
      else if (index < checkedThrough) state = 'eliminated';
      return { value, state };
    });
  };

  terms.push({
    key: 1,
    array: array.slice(),
    elements: array.map((value) => ({ value, state: 'default' })),
    pointers: [],
    facts: { Comparisons: 0 },
    found: false,
    notFound: false,
    status: `Array \u00B7 Target ${target} \u00B7 Scan starts at index 0.`,
    badge: 'Step 1',
    heading: 'Start scanning from the first element.',
    detail:
      'Linear search walks through the array from left to right, comparing each element with the target until a match is found or every element has been checked.',
  });

  for (let index = 0; index < n; index += 1) {
    const value = array[index];
    comparisons += 1;
    const unit = noun(comparisons, 'comparison', 'comparisons');

    if (value === target) {
      terms.push({
        key: terms.length + 1,
        array: array.slice(),
        elements: buildElements(-1, index).map((cell, cellIndex) =>
          cellIndex === index ? { ...cell, state: 'found' } : cell
        ),
        pointers: [],
        facts: { Comparisons: comparisons, 'Index found': index },
        found: true,
        notFound: false,
        foundIndex: index,
        status: `\u2713 Found ${target} at index ${index} \u00B7 ${comparisons} ${unit}.`,
        badge: `Step ${terms.length + 1}`,
        heading: `${target} found.`,
        detail: `${value} equals the target. Linear search located ${target} at index ${index} after ${comparisons} ${unit}.`,
      });
      break;
    }

    if (index < n - 1) {
      terms.push(
        {
          key: terms.length + 1,
          array: array.slice(),
          elements: buildElements(index, index),
          pointers: [{ index, label: 'CHECK', kind: 'scan' }],
          facts: { Comparisons: comparisons, Checking: `index ${index}` },
          found: false,
          notFound: false,
          status: `Compare ${value} vs target ${target} \u2014 no match yet \u00B7 ${comparisons} ${unit}.`,
          badge: `Step ${terms.length + 1}`,
          heading: `Checking index ${index}: ${value} against ${target}.`,
          detail: `${value} does not match the target ${target}. Move the scan forward to index ${index + 1}.`,
        },
        {
          key: terms.length + 2,
          array: array.slice(),
          elements: buildElements(index + 1, index + 1),
          pointers: [{ index: index + 1, label: 'CHECK', kind: 'scan' }],
          facts: { Comparisons: comparisons, Checking: `index ${index + 1}` },
          found: false,
          notFound: false,
          status: `Move to index ${index + 1} \u00B7 ${value} was already ruled out.`,
          badge: `Step ${terms.length + 2}`,
          heading: `${value} \u2260 ${target} — move to the next element.`,
          detail: `Index ${index} is now ruled out; the scan continues from index ${index + 1}.`,
        }
      );
    } else {
      terms.push({
        key: terms.length + 1,
        array: array.slice(),
        elements: array.map((cellValue) => ({ value: cellValue, state: 'eliminated' })),
        pointers: [],
        facts: { Comparisons: comparisons },
        found: false,
        notFound: true,
        status: `\u2715 ${target} is not present in this array \u00B7 ${comparisons} ${unit}.`,
        badge: `Step ${terms.length + 1}`,
        heading: 'Target not found.',
        detail: `All ${n} ${noun(n, 'element', 'elements')} were checked after ${comparisons} ${unit} and none matched ${target}.`,
      });
    }
  }

  return terms;
}