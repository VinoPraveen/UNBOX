import { createSortingPlayground } from '../sortingPlayground.js';

const quickSort = createSortingPlayground({
  slug: 'quick-sort',
  title: 'Quick Sort',
  description:
    'Selects a pivot and partitions the array around it, then recursively sorts the partitions.',
  algorithmSlug: 'quick-sort',
  defaultArray: [10, 7, 8, 9, 1, 5],
  statOrder: [
    { key: 'Comparisons', singular: 'comparison', plural: 'comparisons' },
    { key: 'Swaps', singular: 'swap', plural: 'swaps' },
    { key: 'Partitions', singular: 'partition', plural: 'partitions' },
  ],
});

export default quickSort;