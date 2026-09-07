import BinarySearchVisualizer from './BinarySearch/BinarySearchVisualizer.jsx';
import StackVisualizer from './Stack/StackVisualizer.jsx';
import QueueVisualizer from './Queue/QueueVisualizer.jsx';

const visualizations = {
  'binary-search': {
    type: 'step-based',
    Component: BinarySearchVisualizer,
  },
  stack: {
    type: 'interactive',
    Component: StackVisualizer,
  },
  queue: {
    type: 'interactive',
    Component: QueueVisualizer,
  },
};

export function getVisualization(slug) {
  return visualizations[slug] ?? null;
}

export default visualizations;
