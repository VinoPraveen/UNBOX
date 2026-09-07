import BinarySearchPlayground from './BinarySearchPlayground.jsx';
import { generateBinarySearchStates } from './binarySearchAlgorithm.js';

const ARRAY_DEFAULT = [10, 20, 30, 40, 50, 60, 70];
const TARGET_DEFAULT = 60;

const MAX_ARRAY_LENGTH = 30;

function parseArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string') return [];
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .map((part) => Number(part));
}

function parseTarget(raw) {
  if (typeof raw === 'number') return raw;
  if (typeof raw !== 'string') return Number.NaN;
  return Number(raw.trim());
}

export function validate(state) {
  const errors = {};
  const arr = parseArray(state.array);

  if (arr.length === 0) {
    errors.array = 'Please enter at least one number.';
  } else if (arr.length > MAX_ARRAY_LENGTH) {
    errors.array = `Please enter at most ${MAX_ARRAY_LENGTH} numbers for the best view.`;
  } else if (!arr.every((v) => Number.isFinite(v))) {
    errors.array = 'Please enter only valid numbers.';
  } else {
    const sorted = arr.every((v, i) => i === 0 || arr[i - 1] <= v);
    if (!sorted) {
      errors.array = 'Binary Search requires a sorted array.';
    }
  }

  const target = parseTarget(state.target);
  if (!Number.isFinite(target)) {
    errors.target = 'Please enter a valid target.';
  }

  return { ok: Object.keys(errors).length === 0, errors, parsedArray: arr, parsedTarget: target };
}

function run(values, { setErrors, setStatus, setExperiment }) {
  const { ok, errors, parsedArray, parsedTarget } = validate(values);

  if (!ok) {
    setErrors(errors ?? {});
    setExperiment(null);
    setStatus({
      kind: 'error',
      title: 'Please fix the input before running.',
      detail:
        Object.values(errors ?? {}).find(Boolean) ??
        'Check the highlighted fields and try again.',
    });
    return;
  }

  const states = generateBinarySearchStates(parsedArray, parsedTarget);
  const last = states[states.length - 1];
  const comparisons = last.comparisonCount;
  const unit = comparisons === 1 ? 'comparison' : 'comparisons';

  setErrors({});
  setExperiment({
    runId: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    array: parsedArray,
    target: parsedTarget,
    states,
  });

  setStatus(
    last.found
      ? {
          kind: 'success',
          title: 'Target found.',
          detail: `${parsedTarget} matches the array after ${comparisons} ${unit}.`,
        }
      : {
          kind: 'notice',
          title: 'Target not found.',
          detail: `${parsedTarget} is not present in this array after ${comparisons} ${unit}.`,
        }
  );
}

function onReset(_values, { setErrors, setStatus, setExperiment }) {
  setErrors({});
  setExperiment(null);
  setStatus({
    kind: 'idle',
    title: 'Ready to experiment.',
    detail:
      'Enter a sorted array and a target value, then press Run to step through the search.',
  });
}

const binarySearch = {
  slug: 'binary-search',
  title: 'Binary Search',
  description: 'Experiment with the algorithm and see what happens.',
  experience: 'full',
  conceptSlug: 'binary-search',
  Component: BinarySearchPlayground,
  inputs: [
    {
      id: 'array',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: ARRAY_DEFAULT,
      placeholder: '10, 20, 30, 40, 50, 60, 70',
      help: 'Comma-separated numbers in ascending order.',
    },
    {
      id: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: TARGET_DEFAULT,
      placeholder: '60',
      help: 'The value you want to find.',
    },
  ],
  operations: [
    { id: 'run', label: 'Run', variant: 'gold', ariaLabel: 'Run binary search' },
    {
      id: 'reset',
      label: 'Reset',
      variant: 'ghost',
      ariaLabel: 'Reset the experiment',
    },
  ],
  validate,
  run,
  onReset,
};

export default binarySearch;
