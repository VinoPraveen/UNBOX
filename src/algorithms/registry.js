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
  'binary-tree': {
    slug: 'binary-tree',
    name: 'Binary Tree',
    category: 'Trees',
    description:
      'A tree where each node can have at most two children. Build from level-order values and traverse.',
    kind: 'tree',
    motto: 'ROOT → PARENT → CHILDREN → LEAVES',
    complexity: {
      operations: [
        { label: 'Traversal', value: 'O(n)' },
        { label: 'Height', value: 'O(n)' },
        { label: 'Space', value: 'O(h)' },
      ],
    },
  },
  'binary-search-tree': {
    slug: 'binary-search-tree',
    name: 'Binary Search Tree',
    category: 'Trees',
    description:
      'A binary tree where values smaller than a node go left and larger values go right. Duplicates are not inserted.',
    kind: 'tree',
    motto: 'COMPARE → LEFT / RIGHT → REPEAT',
    complexity: {
      operations: [
        { label: 'Average Search', value: 'O(log n)' },
        { label: 'Average Insert', value: 'O(log n)' },
        { label: 'Average Delete', value: 'O(log n)' },
        { label: 'Worst-case Search', value: 'O(n)' },
        { label: 'Worst-case Insert', value: 'O(n)' },
        { label: 'Worst-case Delete', value: 'O(n)' },
      ],
    },
  },
  'tree-traversals': {
    slug: 'tree-traversals',
    name: 'Tree Traversals',
    category: 'Trees',
    description:
      'Traversal is visiting every node in a specific order: Preorder, Inorder, Postorder, Level Order.',
    kind: 'tree',
    motto: 'VISIT → MOVE → VISIT → RESULT',
    complexity: {
      operations: [
        { label: 'Traversal', value: 'O(n)' },
        { label: 'Space', value: 'O(h)' },
      ],
    },
  },
  'graph-basics': {
    slug: 'graph-basics',
    name: 'Graph Basics',
    category: 'Graphs',
    description:
      'Vertices and edges: build undirected, directed, and weighted graphs node by node.',
    kind: 'graph',
    motto: 'VERTEX ↔ EDGE',
    complexity: {
      operations: [
        { label: 'Add node / edge', value: 'O(1)' },
        { label: 'Neighbors', value: 'O(V + E)' },
        { label: 'Space (adjacency list)', value: 'O(V + E)' },
      ],
    },
  },
  bfs: {
    slug: 'bfs',
    name: 'BFS',
    category: 'Graphs',
    description: 'Explore level by level with a QUEUE — first in, first out.',
    kind: 'graph',
    motto: 'QUEUE → LEVEL BY LEVEL',
    complexity: {
      operations: [
        { label: 'Time (adjacency list)', value: 'O(V + E)' },
        { label: 'Space', value: 'O(V)' },
      ],
    },
  },
  dfs: {
    slug: 'dfs',
    name: 'DFS',
    category: 'Graphs',
    description: 'Go deep with a STACK, backtracking at dead ends — last in, first out.',
    kind: 'graph',
    motto: 'STACK → GO DEEP → BACKTRACK',
    complexity: {
      operations: [
        { label: 'Time (adjacency list)', value: 'O(V + E)' },
        { label: 'Space', value: 'O(V)' },
      ],
    },
  },
};

const GROUP_ORDER = ['Searching', 'Sorting', 'Data Structures', 'Trees', 'Graphs'];

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