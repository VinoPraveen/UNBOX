import { createSortingPlayground } from '../sortingPlayground.js';

const insertionSort = createSortingPlayground({
  slug: 'insertion-sort',
  title: 'Insertion Sort',
  description:
    'Build the sorted region one element at a time by shifting larger values to make room.',
  algorithmSlug: 'insertion-sort',
  defaultArray: [12, 11, 13, 5, 6],
});

export default insertionSort;