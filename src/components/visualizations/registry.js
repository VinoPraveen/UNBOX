import BinarySearchVisualizer from './BinarySearch/BinarySearchVisualizer.jsx';
import ArrayVisualization from './Array/ArrayVisualization.jsx';
import MergeSortVisualizer from './MergeSort/MergeSortVisualizer.jsx';
import QuickSortVisualizer from './QuickSort/QuickSortVisualizer.jsx';
import StackVisualizer from './Stack/StackVisualizer.jsx';
import QueueVisualizer from './Queue/QueueVisualizer.jsx';
import LinkedListVisualizer from './LinkedList/LinkedListVisualizer.jsx';

const visualizations = {
  'binary-search': {
    type: 'step-based',
    Component: BinarySearchVisualizer,
  },
  'linear-search': {
    type: 'step-based',
    Component: ArrayVisualization,
  },
  'bubble-sort': {
    type: 'step-based',
    Component: ArrayVisualization,
  },
  'selection-sort': {
    type: 'step-based',
    Component: ArrayVisualization,
  },
  'insertion-sort': {
    type: 'step-based',
    Component: ArrayVisualization,
  },
  'merge-sort': {
    type: 'step-based',
    Component: MergeSortVisualizer,
  },
  'quick-sort': {
    type: 'step-based',
    Component: QuickSortVisualizer,
  },
  stack: {
    type: 'interactive',
    Component: StackVisualizer,
  },
  queue: {
    type: 'interactive',
    Component: QueueVisualizer,
  },
  'linked-list': {
    type: 'interactive',
    Component: LinkedListVisualizer,
  },
};

export function getVisualization(slug) {
  return visualizations[slug] ?? null;
}

export default visualizations;
