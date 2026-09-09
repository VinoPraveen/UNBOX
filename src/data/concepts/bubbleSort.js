import { ArrowUpDown } from 'lucide-react';
import { generateBubbleSortSteps } from '../../algorithms/sorting/bubbleSort.js';

const ARRAY = [64, 34, 25, 12, 22, 11, 90];

const bubbleSort = {
  slug: 'bubble-sort',
  title: 'Bubble Sort',
  category: 'Algorithms',
  difficulty: 'Beginner',
  estimatedTime: '7 min',
  description: 'Sort by comparing neighbors and swapping them into place.',
  Icon: ArrowUpDown,
  accent: '#7C3AED',
  tint: 'rgba(124, 58, 237, 0.1)',
  visualization: 'bubble-sort',
  complexity: { best: 'O(n)', average: 'O(n\u00B2)', worst: 'O(n\u00B2)', space: 'O(1)' },
  visualizationBlurb:
    'Watch adjacent pairs get compared and swapped as the largest value bubbles to the end of each pass.',
  overview: {
    heading: 'What is Bubble Sort?',
    body: 'Bubble sort repeatedly walks through the array and swaps any adjacent pair that is out of order. After every pass the largest remaining value has bubbled to its final position, so the numbers never have to be visited again.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Compare adjacent elements.',
        description: 'Look at each pair of neighbors in the unsorted region.',
      },
      {
        number: 2,
        title: 'Swap when out of order.',
        description: 'If the left value is larger, swap the pair so the smaller value moves left.',
      },
      {
        number: 3,
        title: 'Bubble the largest to the end.',
        description: 'One full pass guarantees the biggest remaining value lands at the end of the array.',
      },
      {
        number: 4,
        title: 'Shrink the unsorted region.',
        description: 'Ignore the values already in place and repeat until everything is sorted.',
      },
    ],
  },
  visualizationSteps: generateBubbleSortSteps(ARRAY),
  visualizationConfig: { array: ARRAY },
};

export default bubbleSort;