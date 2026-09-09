import { createSortingPlayground } from '../sortingPlayground.js';

const mergeSort = createSortingPlayground({
  slug: 'merge-sort',
  title: 'Merge Sort',
  description:
    'Divides the array into smaller parts, sorts them, and merges the sorted parts back together.',
  algorithmSlug: 'merge-sort',
  defaultArray: [38, 27, 43, 3, 9, 82, 10],
  statOrder: [
    { key: 'Comparisons', singular: 'comparison', plural: 'comparisons' },
    { key: 'Merges', singular: 'merge operation', plural: 'merge operations' },
    { key: 'Divisions', singular: 'division', plural: 'divisions' },
    { key: 'ArrayWrites', singular: 'array write', plural: 'array writes' },
  ],
});

export default mergeSort;