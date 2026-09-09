import { ArrowLeftRight } from 'lucide-react';
import { generateInsertionSortSteps } from '../../algorithms/sorting/insertionSort.js';

const ARRAY = [12, 11, 13, 5, 6];

const insertionSort = {
  slug: 'insertion-sort',
  title: 'Insertion Sort',
  category: 'Algorithms',
  difficulty: 'Beginner',
  estimatedTime: '7 min',
  description: 'Sort by taking each value and sliding it back into place.',
  Icon: ArrowLeftRight,
  accent: '#7C3AED',
  tint: 'rgba(124, 58, 237, 0.1)',
  visualization: 'insertion-sort',
  complexity: { best: 'O(n)', average: 'O(n\u00B2)', worst: 'O(n\u00B2)', space: 'O(1)' },
  visualizationBlurb:
    'Watch each key get pulled out and shifted back until it slides into its correct position.',
  overview: {
    heading: 'What is Insertion Sort?',
    body: 'Insertion sort builds the sorted region from left to right. It takes the next element, the key, and shifts larger values right to open a gap, then drops the key into place. Like sorting cards in your hand, each element slots in where it belongs.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Take the next key.',
        description: 'Grab the first element of the unsorted region as the value to insert.',
      },
      {
        number: 2,
        title: 'Compare it with the sorted region.',
        description: 'Look left at the already-sorted values, starting with the one closest to the key.',
      },
      {
        number: 3,
        title: 'Shift larger values right.',
        description: 'Move each greater value one position right to open up a gap for the key.',
      },
      {
        number: 4,
        title: 'Insert the key.',
        description: 'Drop the key into the gap and repeat with the next element until the array is sorted.',
      },
    ],
  },
  visualizationSteps: generateInsertionSortSteps(ARRAY),
  visualizationConfig: { array: ARRAY },
};

export default insertionSort;