import { Binary } from 'lucide-react';

const ARRAY = [10, 20, 30, 40, 50, 60, 70];
const TARGET = 60;

const gather = (low, high) => ARRAY.slice(low, high + 1).join(' \u00B7 ');

const visualizationSteps = [
  {
    key: 1,
    low: 0,
    high: ARRAY.length - 1,
    mid: null,
    eliminated: [false, false, false, false, false, false, false],
    found: false,
    status: `Sorted array \u00B7 Target ${TARGET} \u00B7 Move through the search step by step.`,
    badge: 'Step 1',
    heading: 'Start wide.',
    detail:
      'The search covers the whole array. Binary search repeatedly compares the middle value to the target and discards half of the search space after every comparison.',
  },
  {
    key: 2,
    low: 0,
    high: ARRAY.length - 1,
    mid: 3,
    eliminated: [false, false, false, false, false, false, false],
    found: false,
    status: `MID 40 vs target ${TARGET} \u2014 check the middle element.`,
    badge: 'Step 2',
    heading: 'Check the middle element.',
    detail:
      'MID lands on 40 at the center of the array. 40 is less than 60, so the target can only live in the right half.',
  },
  {
    key: 3,
    low: 4,
    high: 6,
    mid: 5,
    eliminated: [true, true, true, true, false, false, false],
    found: false,
    status: `Searching ${gather(4, 6)} \u2014 the left half is gone.`,
    badge: 'Step 3',
    heading: '60 is greater than 40, so search the right half.',
    detail:
      '10 \u00B7 20 \u00B7 30 \u00B7 40 are eliminated. The range narrows to 50 \u00B7 60 \u00B7 70 and MID moves onto 60.',
  },
  {
    key: 4,
    low: 4,
    high: 6,
    mid: 5,
    eliminated: [true, true, true, true, false, false, false],
    found: true,
    status: `\u2713 Found ${TARGET} at index 5.`,
    badge: 'Step 4',
    heading: '60 found.',
    detail:
      'The middle element equals the target. Binary search locates 60 at index 5 in just 3 comparisons.',
  },
];

const binarySearch = {
  slug: 'binary-search',
  title: 'Binary Search',
  category: 'Algorithms',
  difficulty: 'Beginner',
  estimatedTime: '8 min',
  description: 'Find what you\u2019re looking for by repeatedly cutting the search space in half.',
  Icon: Binary,
  accent: '#22D3EE',
  tint: 'rgba(34, 211, 238, 0.1)',
  visualization: 'binary-search',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  visualizationBlurb:
    'Move through the search and see exactly how binary search narrows things down.',
  overview: {
    heading: 'What is Binary Search?',
    body: 'Binary search is an efficient algorithm for finding an element in a sorted collection. Instead of checking every element one by one, it repeatedly cuts the search area in half. Each comparison eliminates half of the remaining possibilities, making it dramatically faster than scanning every element.',
    array: ARRAY,
    target: TARGET,
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Look at the middle element.',
        description: 'Start with the full sorted array and identify the middle position.',
      },
      {
        number: 2,
        title: 'Compare it with the target.',
        description: 'If the middle element matches the target, you\u2019re done. If it\u2019s smaller, the target must be in the right half. If it\u2019s larger, the target must be in the left half.',
      },
      {
        number: 3,
        title: 'Discard the half that cannot contain the target.',
        description: 'Eliminate the impossible half and focus only on the remaining portion.',
      },
      {
        number: 4,
        title: 'Repeat until the target is found.',
        description: 'Keep narrowing the search space until the element is found or the range is empty.',
      },
    ],
  },
  visualizationSteps,
  visualizationConfig: { array: ARRAY, target: TARGET },
};

export default binarySearch;
