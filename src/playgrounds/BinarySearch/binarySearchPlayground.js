import BinarySearchPlayground from './BinarySearchPlayground.jsx';
import { generateBinarySearchStates } from './binarySearchAlgorithm.js';

const ARRAY_DEFAULT = [10, 20, 30, 40, 50, 60, 70];
const TARGET_DEFAULT = 60;

export function validate(state) {
  const errors = {};

  if (!Array.isArray(state.array) || state.array.length === 0) {
    errors.array = 'Please enter at least one number.';
  } else if (
    !state.array.every((value) => typeof value === 'number' && Number.isFinite(value))
  ) {
    errors.array = 'Please enter only valid numbers.';
  } else {
    const sorted = state.array.every((value, i) => i === 0 || state.array[i - 1] <= value);
    if (!sorted) errors.array = 'Binary Search requires a sorted array.';
  }

  if (typeof state.target !== 'number' || !Number.isFinite(state.target)) {
    errors.target = 'Please enter a valid target.';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

function run(values, { setErrors, setStatus, setExperiment }) {
  const { ok, errors } = validate(values);

  if (!ok) {
    setErrors(errors ?? {});
    setExperiment(null);
    setStatus({
      kind: 'error',
      title: 'Please fix the input before running.',
      detail: Object.values(errors ?? {}).find(Boolean) ?? 'Check the highlighted fields and try again.',
    });
    return;
  }

  const states = generateBinarySearchStates(values.array, values.target);
  const last = states[states.length - 1];
  const comparisons = last.comparisonCount;
  const unit = comparisons === 1 ? 'comparison' : 'comparisons';

  setErrors({});
  setExperiment({
    runId: Date.now(),
    array: values.array,
    target: values.target,
    states,
  });

  setStatus(
    last.found
      ? {
          kind: 'success',
          title: 'Target found.',
          detail: `${values.target} matches the array after ${comparisons} ${unit}.`,
        }
      : {
          kind: 'notice',
          title: 'Target not found.',
          detail: `${values.target} is not present in this array after ${comparisons} ${unit}.`,
        }
  );
}

function onReset(_values, { setErrors, setStatus, setExperiment }) {
  setErrors({});
  setExperiment(null);
  setStatus({
    kind: 'idle',
    title: 'Ready to experiment.',
    detail: 'Enter a sorted array and a target value, then press Run to step through the search.',
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
      help: 'Comma-separated numbers, ascending order. Up to 50 values for the best view.',
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
    { id: 'reset', label: 'Reset', variant: 'ghost', ariaLabel: 'Reset the experiment' },
  ],
  validate,
  run,
  onReset,
};

export default binarySearch;