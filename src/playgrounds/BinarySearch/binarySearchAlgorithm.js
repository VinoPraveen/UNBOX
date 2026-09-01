function gather(array, low, high) {
  return array.slice(low, high + 1).join(' \u00B7 ');
}

function noun(count, singular, plural) {
  return count === 1 ? singular : plural;
}

export function generateBinarySearchStates(array, target) {
  if (!Array.isArray(array) || array.length === 0) return [];

  const n = array.length;
  const terms = [];
  const eliminated = new Array(n).fill(false);
  let comparisons = 0;

  const push = (fields) => {
    terms.push({
      key: terms.length + 1,
      eliminated: [...fields.eliminated],
      low: fields.low,
      high: fields.high,
      mid: fields.mid ?? null,
      found: Boolean(fields.found),
      notFound: Boolean(fields.notFound),
      comparisonCount: comparisons,
      status: fields.status,
      badge: `Step ${terms.length + 1}`,
      heading: fields.heading,
      detail: fields.detail,
    });
  };

  push({
    low: 0,
    high: n - 1,
    mid: null,
    eliminated,
    notFound: false,
    status: `Sorted array \u00B7 Target ${target} \u00B7 Press Play or Next to step through the search.`,
    heading: 'Start wide.',
    detail:
      'Binary search covers the whole array and repeatedly checks the middle value, discarding half of the search space after every comparison.',
  });

  let left = 0;
  let right = n - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = array[mid];
    comparisons += 1;
    const unit = noun(comparisons, 'comparison', 'comparisons');

    if (midValue === target) {
      push({
        low: left,
        high: right,
        mid,
        eliminated,
        found: true,
        notFound: false,
        status: `\u2713 Found ${target} at index ${mid} \u00B7 ${comparisons} ${unit}.`,
        heading: `${target} found.`,
        detail: `The middle element (${midValue}) equals the target. Binary search located ${target} at index ${mid} in ${comparisons} ${unit}.`,
      });
      break;
    }

    push({
      low: left,
      high: right,
      mid,
      eliminated,
      notFound: false,
      status:
        midValue < target
          ? `Compare ${midValue} vs target ${target} \u2014 move right.`
          : `Compare ${midValue} vs target ${target} \u2014 move left.`,
      heading:
        midValue < target
          ? `${midValue} is less than ${target}, so the target must be in the right half.`
          : `${midValue} is greater than ${target}, so the target must be in the left half.`,
      detail:
        midValue < target
          ? `Every value from index ${left} up to the middle is ${midValue} or smaller. Since ${target} is larger, that entire half can be discarded.`
          : `Every value from the middle through index ${right} is ${midValue} or larger. Since ${target} is smaller, that entire half can be discarded.`,
    });

    if (midValue < target) {
      for (let i = left; i <= mid; i += 1) eliminated[i] = true;
      left = mid + 1;
    } else {
      for (let i = mid; i <= right; i += 1) eliminated[i] = true;
      right = mid - 1;
    }

    if (left <= right) {
      push({
        low: left,
        high: right,
        mid: null,
        eliminated,
        notFound: false,
        status: `Searching ${gather(array, left, right)} \u2014 ${midValue < target ? 'the left half' : 'the right half'} is eliminated.`,
        heading:
          midValue < target
            ? `${target} is greater than ${midValue}, so eliminate the left half.`
            : `${target} is less than ${midValue}, so eliminate the right half.`,
        detail: `The discarded half can never equal ${target}. The search continues over ${gather(array, left, right)}.`,
      });
    } else {
      push({
        low: -1,
        high: -1,
        mid: null,
        eliminated: new Array(n).fill(true),
        found: false,
        notFound: true,
        status: `\u2715 ${target} is not present in this array \u00B7 ${comparisons} ${unit}.`,
        heading: 'Target not found.',
        detail: `The search range is empty after ${comparisons} ${unit}. Each comparison eliminated half of the remaining values, and ${target} was never found.`,
      });
    }
  }

  return terms;
}