import { linearSearchMetadata, generateLinearSearchSteps } from './searching/linearSearch.js';
import { binarySearchMetadata, generateBinarySearchStates } from './searching/binarySearch.js';
import { bubbleSortMetadata, generateBubbleSortSteps } from './sorting/bubbleSort.js';
import { selectionSortMetadata, generateSelectionSortSteps } from './sorting/selectionSort.js';
import { insertionSortMetadata, generateInsertionSortSteps } from './sorting/insertionSort.js';
import { mergeSortMetadata, generateMergeSortSteps } from './sorting/mergeSort.js';
import { quickSortMetadata, generateQuickSortSteps } from './sorting/quickSort.js';

const algorithms = {
  'linear-search': {
    ...linearSearchMetadata,
    generateSteps: generateLinearSearchSteps,
    kind: 'search',
  },
  'binary-search': {
    ...binarySearchMetadata,
    generateSteps: generateBinarySearchStates,
    kind: 'search',
  },
  'bubble-sort': {
    ...bubbleSortMetadata,
    generateSteps: generateBubbleSortSteps,
    kind: 'sort',
  },
  'selection-sort': {
    ...selectionSortMetadata,
    generateSteps: generateSelectionSortSteps,
    kind: 'sort',
  },
  'insertion-sort': {
    ...insertionSortMetadata,
    generateSteps: generateInsertionSortSteps,
    kind: 'sort',
  },
  'merge-sort': {
    ...mergeSortMetadata,
    generateSteps: generateMergeSortSteps,
    kind: 'sort',
  },
  'quick-sort': {
    ...quickSortMetadata,
    generateSteps: generateQuickSortSteps,
    kind: 'sort',
  },
};

const GROUP_ORDER = ['Searching', 'Sorting'];

export function getAlgorithm(slug) {
  return algorithms[slug] ?? null;
}

export function getAlgorithmGroups() {
  return GROUP_ORDER.map((name) => ({
    name,
    items: Object.values(algorithms)
      .filter((algorithm) => algorithm.category === name)
      .map((algorithm) => ({
        slug: algorithm.slug,
        name: algorithm.name,
        kind: algorithm.kind,
      })),
  })).filter((group) => group.items.length > 0);
}

export default algorithms;