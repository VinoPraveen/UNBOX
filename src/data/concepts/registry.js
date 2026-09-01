import binarySearch from './binarySearch.js';
import stack from './stack.js';
import queue from './queue.js';

const registry = {
  'binary-search': binarySearch,
  stack,
  queue,
};

export function getConceptData(slug) {
  return registry[slug] ?? null;
}

export default registry;
