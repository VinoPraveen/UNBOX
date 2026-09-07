import binarySearch from '../../playgrounds/BinarySearch/binarySearchPlayground.js';
import stack from '../../playgrounds/Stack/stackPlayground.js';
import queue from '../../playgrounds/Queue/queuePlayground.js';

const registry = {
  'binary-search': binarySearch,
  stack,
  queue,
};

export function getPlayground(slug) {
  return registry[slug] ?? null;
}

export default registry;
