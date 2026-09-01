import binarySearch from './binarySearch.js';

const registry = {
  'binary-search': binarySearch,
};

export function getConceptData(slug) {
  return registry[slug] ?? null;
}

export default registry;
