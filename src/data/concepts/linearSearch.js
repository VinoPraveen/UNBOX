import { Search } from 'lucide-react';
import { generateLinearSearchSteps } from '../../algorithms/searching/linearSearch.js';

const ARRAY = [10, 20, 30, 40, 50];
const TARGET = 40;

const linearSearch = {
  slug: 'linear-search',
  title: 'Linear Search',
  category: 'Algorithms',
  difficulty: 'Beginner',
  estimatedTime: '6 min',
  description: 'Find a value by checking every element in order.',
  Icon: Search,
  accent: '#22D3EE',
  tint: 'rgba(34, 211, 238, 0.1)',
  visualization: 'linear-search',
  complexity: { time: 'O(n)', space: 'O(1)' },
  visualizationBlurb:
    'Follow the scan as it checks every element in order and find out how many comparisons each search really takes.',
  overview: {
    heading: 'What is Linear Search?',
    body: 'Linear search is the simplest way to find a value in an array: check the first element, then the next, and keep going until the target is found or the array runs out. It needs no special setup, which makes it perfect for small or unordered collections.',
    array: ARRAY,
    target: TARGET,
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Start at the first element.',
        description: 'Begin the scan at index 0 and remember the value you are looking for.',
      },
      {
        number: 2,
        title: 'Compare it with the target.',
        description: 'If the current element equals the target, the search is complete.',
      },
      {
        number: 3,
        title: 'Move to the next element.',
        description: 'When there is no match, advance by one position and compare again.',
      },
      {
        number: 4,
        title: 'Reach the end.',
        description: 'If every element has been checked without a match, the target is not in the array.',
      },
    ],
  },
  visualizationSteps: generateLinearSearchSteps(ARRAY, TARGET),
  visualizationConfig: { array: ARRAY, target: TARGET },
};

export default linearSearch;