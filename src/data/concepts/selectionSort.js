import { Target } from 'lucide-react';
import { generateSelectionSortSteps } from '../../algorithms/sorting/selectionSort.js';

const ARRAY = [64, 25, 12, 22, 11];

const selectionSort = {
  slug: 'selection-sort',
  title: 'Selection Sort',
  category: 'Algorithms',
  difficulty: 'Beginner',
  estimatedTime: '7 min',
  description: 'Sort by repeatedly picking out the smallest remaining value.',
  Icon: Target,
  accent: '#7C3AED',
  tint: 'rgba(124, 58, 237, 0.1)',
  visualization: 'selection-sort',
  complexity: { best: 'O(n\u00B2)', average: 'O(n\u00B2)', worst: 'O(n\u00B2)', space: 'O(1)' },
  visualizationBlurb:
    'See the scan hunt for the minimum in the unsorted region and swap it into its final slot.',
  overview: {
    heading: 'What is Selection Sort?',
    body: 'Selection sort grows a sorted region from the front of the array. On every pass it scans the unsorted values, finds the smallest one, and swaps it into the first unsorted position. The sorted region keeps getting larger until nothing is left.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Lock the next position.',
        description: 'Imagine the first unsorted slot as the place the next minimum must go.',
      },
      {
        number: 2,
        title: 'Scan for the minimum.',
        description: 'Walk through the unsorted region and track the smallest value seen so far.',
      },
      {
        number: 3,
        title: 'Swap it into place.',
        description: 'Move the minimum into the locked slot, extending the sorted region by one.',
      },
      {
        number: 4,
        title: 'Repeat the pass.',
        description: 'Continue until every position has been filled by the smallest remaining value.',
      },
    ],
  },
  visualizationSteps: generateSelectionSortSteps(ARRAY),
  visualizationConfig: { array: ARRAY },
};

export default selectionSort;