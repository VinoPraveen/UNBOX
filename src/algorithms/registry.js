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
  stack: {
    slug: 'stack',
    name: 'Stack',
    category: 'Data Structures',
    description:
      'A LIFO structure where the newest item sits on top and is always the first one removed.',
    kind: 'data-structure',
    motto: 'LIFO \u2014 Last In, First Out',
    complexity: {
      operations: [
        { label: 'Push', value: 'O(1)' },
        { label: 'Pop', value: 'O(1)' },
        { label: 'Peek', value: 'O(1)' },
        { label: 'Space', value: 'O(n)' },
      ],
    },
  },
  queue: {
    slug: 'queue',
    name: 'Queue',
    category: 'Data Structures',
    description:
      'A FIFO structure where items are added at the rear and removed from the front.',
    kind: 'data-structure',
    motto: 'FIFO \u2014 First In, First Out',
    complexity: {
      operations: [
        { label: 'Enqueue', value: 'O(1)' },
        { label: 'Dequeue', value: 'O(1)' },
        { label: 'Front', value: 'O(1)' },
        { label: 'Rear', value: 'O(1)' },
        { label: 'Space', value: 'O(n)' },
      ],
    },
  },
  'linked-list': {
    slug: 'linked-list',
    name: 'Linked List',
    category: 'Data Structures',
    description:
      'A sequence of nodes where each node holds a value and a reference to the next node.',
    kind: 'data-structure',
    motto: 'Nodes connected through references.',
    complexity: {
      operations: [
        { label: 'Insert at head', value: 'O(1)' },
        { label: 'Insert at tail', value: 'O(n)' },
        { label: 'Search', value: 'O(n)' },
        { label: 'Delete', value: 'O(n)' },
        { label: 'Space', value: 'O(n)' },
      ],
    },
  },
};

const GROUP_ORDER = ['Searching', 'Sorting', 'Data Structures'];

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