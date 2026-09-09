import { Zap } from 'lucide-react';
import { generateQuickSortSteps } from '../../algorithms/sorting/quickSort.js';

const ARRAY = [10, 7, 8, 9, 1, 5];

const quickSort = {
  slug: 'quick-sort',
  title: 'Quick Sort',
  category: 'Algorithms',
  difficulty: 'Advanced',
  estimatedTime: '10 min',
  description: 'Choose a pivot, partition around it, and recursively sort each side.',
  Icon: Zap,
  accent: '#7C3AED',
  tint: 'rgba(124, 58, 237, 0.1)',
  visualization: 'quick-sort',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n\u00B2)',
    space: 'O(log n)',
  },
  visualizationBlurb:
    'Watch quick sort pick a pivot, sweep the array with a scan pointer, and swap smaller values to the left until the pivot lands in its final position.',
  overview: {
    heading: 'What is Quick Sort?',
    body: "Quick sort is a divide-and-conquer algorithm that sorts in place. It picks a pivot value, then partitions the array so everything smaller than the pivot is on its left and everything larger is on its right. Once the pivot is placed, it's permanently in position — and quick sort recursively does the same for each side.",
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Choose a pivot.',
        description: 'Pick a value from the array (here, the last element) to partition the current span around.',
      },
      {
        number: 2,
        title: 'Scan and swap.',
        description: 'Walk the span with a scan pointer and swap any value smaller than the pivot toward the left boundary.',
      },
      {
        number: 3,
        title: 'Place the pivot.',
        description: 'Swap the pivot into the boundary index. It now sits between the smaller and larger values — and is in its final place.',
      },
      {
        number: 4,
        title: 'Sort each side.',
        description: 'Recursively quick-sort everything left of the pivot and everything right of it.',
      },
    ],
  },
  visualizationSteps: generateQuickSortSteps(ARRAY),
  visualizationConfig: { array: ARRAY },
};

export default quickSort;