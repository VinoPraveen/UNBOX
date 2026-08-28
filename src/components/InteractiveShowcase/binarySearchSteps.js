export const ARRAY = [10, 20, 30, 40, 50, 60, 70];
export const TARGET = 60;

function eliminatedSet(low, high) {
  return Array.from(
    { length: ARRAY.length },
    (_, index) => index < low || index > high
  );
}

function buildSteps() {
  const steps = [];
  let low = 0;
  let high = ARRAY.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = ARRAY[mid];

    // 1) Compare phase — show the middle element within the current range.
    const last = steps[steps.length - 1];
    if (!last || last.mid !== mid || last.low !== low) {
      steps.push({ low, high, mid, found: false, eliminated: eliminatedSet(low, high) });
    }

    if (value === TARGET) {
      // 2) Found phase — reveal the matched element.
      steps.push({ low, high, mid, found: true, eliminated: eliminatedSet(low, high) });
      break;
    }

    if (value < TARGET) low = mid + 1;
    else high = mid - 1;

    if (low > high) break;

    // 3) Eliminate phase — narrowed range with the next midpoint.
    const nextMid = Math.floor((low + high) / 2);
    steps.push({ low, high, mid: nextMid, found: false, eliminated: eliminatedSet(low, high) });
  }

  return steps;
}

export const STEPS = buildSteps();

const stepLabel = (index) => `STEP ${String(index).padStart(2, '0')}`;

export function narrationFor(stepNumber) {
  if (stepNumber === 0) {
    return {
      key: 0,
      badge: 'STEP 00',
      heading: 'Find 60 in the array.',
      detail:
        'The array is sorted, so binary search can discard half of it after every comparison. Press Next Step to check the middle element.',
      status: `Sorted array · Target ${TARGET} · Press Next Step to begin.`,
      found: false,
    };
  }

  const { mid, low, high, found } = STEPS[stepNumber - 1];
  const value = ARRAY[mid];
  const range = ARRAY.slice(low, high + 1).join(' · ');

  if (found) {
    return {
      key: stepNumber,
      badge: stepLabel(stepNumber),
      heading: 'MID equals the target.',
      detail: `${TARGET} is found at index ${mid} after ${stepNumber} comparison${stepNumber > 1 ? 's' : ''}.`,
      status: `✓ Found ${TARGET} at index ${mid}.`,
      found: true,
    };
  }

  const smaller = value < TARGET;
  const discardedHalf = smaller ? 'lower' : 'upper';

  if (stepNumber === 1) {
    return {
      key: stepNumber,
      badge: stepLabel(stepNumber),
      heading: 'We check the middle element.',
      detail: `MID lands on ${value} at index ${mid}. The whole array is still in range.`,
      status: `MID ${value} vs target ${TARGET} — ${value} is ${smaller ? 'less' : 'greater'}, so the ${discardedHalf} half is discarded.`,
      found: false,
    };
  }

  return {
    key: stepNumber,
    badge: stepLabel(stepNumber),
    heading: `We discard the ${discardedHalf} half.`,
    detail: `Everything ${smaller ? 'up to and including' : 'from'} the middle is gone. The search narrows to ${range}, and MID moves to ${ARRAY[mid]} at index ${mid}.`,
    status: `Searching ${range} — MID is ${ARRAY[mid]}.`,
    found: false,
  };
}