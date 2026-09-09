import { generateBinarySearchStates } from '../../playgrounds/BinarySearch/binarySearchAlgorithm.js';

export const binarySearchMetadata = {
  slug: 'binary-search',
  name: 'Binary Search',
  category: 'Searching',
  description:
    'Repeatedly cuts the search space in half by comparing the middle element with the target.',
  complexity: { time: 'O(log n)', space: 'O(1)' },
};

export { generateBinarySearchStates };