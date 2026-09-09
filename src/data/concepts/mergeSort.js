import { GitMerge } from 'lucide-react';
import { generateMergeSortSteps } from '../../algorithms/sorting/mergeSort.js';

const ARRAY = [38, 27, 43, 3, 9, 82, 10];

const mergeSort = {
  slug: 'merge-sort',
  title: 'Merge Sort',
  category: 'Algorithms',
  difficulty: 'Intermediate',
  estimatedTime: '9 min',
  description: 'Split the array into halves, sort each half, and merge the sorted halves.',
  Icon: GitMerge,
  accent: '#7C3AED',
  tint: 'rgba(124, 58, 237, 0.1)',
  visualization: 'merge-sort',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
  },
  visualizationBlurb:
    'Watch merge sort divide the array into smaller runs, then weave the sorted runs back together — comparing two values at a time.',
  overview: {
    heading: 'What is Merge Sort?',
    body: "Merge sort is a divide-and-conquer algorithm. It repeatedly splits the array in half until each piece holds one value, then merges the sorted pieces back together. Because every merge works on sorted runs, it never wastes a comparison — which is why merge sort always runs in O(n log n) time, no matter the input.",
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Split the array in half.',
        description: 'Divide the array into two halves, repeated recursively until each sub-array holds a single element.',
      },
      {
        number: 2,
        title: 'Compare the smallest values.',
        description: 'In each merge, compare the smallest untouched value of the left run with the smallest of the right run.',
      },
      {
        number: 3,
        title: 'Place the smaller value first.',
        description: 'Write the smaller value into the output position and advance that run\u2019s pointer.',
      },
      {
        number: 4,
        title: 'Merge until sorted.',
        description: 'Keep comparing and placing, then copy any leftovers, until the two runs become one sorted run.',
      },
    ],
  },
  visualizationSteps: generateMergeSortSteps(ARRAY),
  visualizationConfig: { array: ARRAY },
};

export default mergeSort;