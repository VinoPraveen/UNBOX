import createAlgorithmPlayground from '../../components/playground/AlgorithmPlayground/AlgorithmPlayground.jsx';
import { generateLinearSearchSteps } from '../../algorithms/searching/linearSearch.js';
import { randomUniqueArray } from '../../algorithms/utils.js';

const ARRAY_DEFAULT = [10, 20, 30, 40, 50];
const TARGET_DEFAULT = 40;

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

  const states = generateLinearSearchSteps(parsedArray, parsedTarget);
  const last = states[states.length - 1];
  const comparisons = last.facts.Comparisons;
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
          detail: `${parsedTarget} was found at index ${last.foundIndex} after ${comparisons} ${unit}.`,
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
      'Enter an array and a target value, then press Run to watch linear search step through the array.',
  });
}

const linearSearch = {
  slug: 'linear-search',
  title: 'Linear Search',
  description: 'Watch every element get checked one by one until the target is found.',
  algorithmSlug: 'linear-search',
  experience: 'full',
  conceptSlug: 'linear-search',
  Component: createAlgorithmPlayground('linear-search'),
  inputs: [
    {
      id: 'array',
      label: 'Array',
      type: 'array',
      defaultValue: ARRAY_DEFAULT,
      placeholder: '10, 20, 30, 40, 50',
      help: 'Comma-separated numbers. Order does not matter for linear search.',
      randomize: () => randomUniqueArray(8, 1, 99),
      presets: [
        { label: 'Small', values: [5, 2, 8, 1, 9] },
        { label: 'Medium', values: [64, 34, 25, 12, 22, 11, 90] },
        { label: 'Nearly Sorted', values: [10, 20, 30, 25, 40, 50] },
        { label: 'Reverse', values: [90, 70, 50, 30, 10] },
      ],
    },
    {
      id: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: TARGET_DEFAULT,
      placeholder: '40',
      help: 'The value you want to find.',
    },
  ],
  operations: [
    { id: 'run', label: 'Run', variant: 'gold', ariaLabel: 'Run linear search' },
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

export default linearSearch;