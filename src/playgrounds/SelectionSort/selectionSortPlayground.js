import { createSortingPlayground } from '../sortingPlayground.js';

const selectionSort = createSortingPlayground({
  slug: 'selection-sort',
  title: 'Selection Sort',
  description: 'Find the smallest remaining value and swap it into the next sorted slot.',
  algorithmSlug: 'selection-sort',
  defaultArray: [64, 25, 12, 22, 11],
});

export default selectionSort;