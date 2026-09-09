import { createSortingPlayground } from '../sortingPlayground.js';

const bubbleSort = createSortingPlayground({
  slug: 'bubble-sort',
  title: 'Bubble Sort',
  description:
    'Compare adjacent pairs and let the largest value bubble to the end on every pass.',
  algorithmSlug: 'bubble-sort',
  defaultArray: [64, 34, 25, 12, 22, 11, 90],
});

export default bubbleSort;