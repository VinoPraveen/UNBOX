import binarySearch from '../../playgrounds/BinarySearch/binarySearchPlayground.js';
import linearSearch from '../../playgrounds/LinearSearch/linearSearchPlayground.js';
import bubbleSort from '../../playgrounds/BubbleSort/bubbleSortPlayground.js';
import selectionSort from '../../playgrounds/SelectionSort/selectionSortPlayground.js';
import insertionSort from '../../playgrounds/InsertionSort/insertionSortPlayground.js';
import mergeSort from '../../playgrounds/MergeSort/mergeSortPlayground.js';
import quickSort from '../../playgrounds/QuickSort/quickSortPlayground.js';
import stack from '../../playgrounds/Stack/stackPlayground.js';
import queue from '../../playgrounds/Queue/queuePlayground.js';

const registry = {
  'binary-search': binarySearch,
  'linear-search': linearSearch,
  'bubble-sort': bubbleSort,
  'selection-sort': selectionSort,
  'insertion-sort': insertionSort,
  'merge-sort': mergeSort,
  'quick-sort': quickSort,
  stack,
  queue,
};

export function getPlayground(slug) {
  return registry[slug] ?? null;
}

export default registry;
