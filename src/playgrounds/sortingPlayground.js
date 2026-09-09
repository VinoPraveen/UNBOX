import createAlgorithmPlayground from '../components/playground/AlgorithmPlayground/AlgorithmPlayground.jsx';
import { getAlgorithm } from '../algorithms/registry.js';
import { randomUniqueArray, noun } from '../algorithms/utils.js';

const MAX_ARRAY_LENGTH = 30;

const DEFAULT_PRESETS = [
  { label: 'Small', values: [5, 2, 8, 1, 9] },
  { label: 'Medium', values: [64, 34, 25, 12, 22, 11, 90] },
  { label: 'Nearly Sorted', values: [10, 20, 30, 25, 40, 50] },
  { label: 'Reverse', values: [90, 70, 50, 30, 10] },
];

const DEFAULT_STAT_ORDER = [
  { key: 'Comparisons', singular: 'comparison', plural: 'comparisons' },
  { key: 'Swaps', singular: 'swap', plural: 'swaps' },
  { key: 'Passes', singular: 'pass', plural: 'passes' },
];

function parseArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string') return [];
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .map((part) => Number(part));
}

function makeSortingValidation() {
  return function validate(state) {
    const errors = {};
    const arr = parseArray(state.array);

    if (arr.length === 0) {
      errors.array = 'Please enter at least one number.';
    } else if (arr.length > MAX_ARRAY_LENGTH) {
      errors.array = `Please enter at most ${MAX_ARRAY_LENGTH} numbers for the best view.`;
    } else if (!arr.every((v) => Number.isFinite(v))) {
      errors.array = 'Please enter only valid numbers.';
    }

    return { ok: Object.keys(errors).length === 0, errors, parsedArray: arr };
  };
}

export function createSortingPlayground({
  slug,
  title,
  description,
  algorithmSlug,
  defaultArray,
  presets = DEFAULT_PRESETS,
  statOrder = DEFAULT_STAT_ORDER,
}) {
  const validate = makeSortingValidation();

  function run(values, { setErrors, setStatus, setExperiment }) {
    const { ok, errors, parsedArray } = validate(values);

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

    const algorithm = getAlgorithm(algorithmSlug);
    const states = algorithm.generateSteps(parsedArray);
    const last = states[states.length - 1];
    const statParts = statOrder
      .map(({ key, singular, plural }) => {
        const value = last.facts[key];
        return value === undefined ? null : `${value} ${noun(value, singular, plural)}`;
      })
      .filter(Boolean);

    setErrors({});
    setExperiment({
      runId: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      array: parsedArray,
      states,
    });

    setStatus({
      kind: 'success',
      title: 'Array sorted.',
      detail: `${algorithm.name} used ${statParts.join(', ')} to order this array.`,
    });
  }

  function onReset(_values, { setErrors, setStatus, setExperiment }) {
    setErrors({});
    setExperiment(null);
    setStatus({
      kind: 'idle',
      title: 'Ready to experiment.',
      detail: `Enter an array, then press Run to watch ${algorithmSlug.replace(/-/g, ' ')} execute step by step.`,
    });
  }

  return {
    slug,
    title,
    description,
    algorithmSlug,
    experience: 'full',
    conceptSlug: slug,
    Component: createAlgorithmPlayground(algorithmSlug),
    inputs: [
      {
        id: 'array',
        label: 'Array',
        type: 'array',
        defaultValue: defaultArray,
        placeholder: defaultArray.join(', '),
        help: 'Comma-separated numbers. They do not need to be sorted.',
        randomize: () => randomUniqueArray(8, 1, 99),
        presets,
      },
    ],
    operations: [
      { id: 'run', label: 'Run', variant: 'gold', ariaLabel: `Run ${title}` },
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
}