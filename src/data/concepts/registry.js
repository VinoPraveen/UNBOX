import binarySearch from './binarySearch.js';
import linearSearch from './linearSearch.js';
import bubbleSort from './bubbleSort.js';
import selectionSort from './selectionSort.js';
import insertionSort from './insertionSort.js';
import mergeSort from './mergeSort.js';
import quickSort from './quickSort.js';
import stack from './stack.js';
import queue from './queue.js';

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

export function getConceptData(slug) {
  return registry[slug] ?? null;
}

export default registry;
