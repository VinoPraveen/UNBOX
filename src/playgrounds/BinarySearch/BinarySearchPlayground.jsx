import { Search } from 'lucide-react';
import VisualizationEngine from '../../components/visualization/VisualizationEngine/VisualizationEngine.jsx';
import './BinarySearchPlayground.css';

const COMPLEXITY = { time: 'O(log n)', space: 'O(1)' };

export default function BinarySearchPlayground({ experiment }) {
  if (!experiment) {
    return (
      <div className="bpg-idle">
        <span className="bpg-idle__icon">
          <Search size={22} aria-hidden="true" />
        </span>
        <p className="bpg-idle__title">Ready to experiment.</p>
        <p className="bpg-idle__text">
          Enter a sorted array and a target value, then press Run to walk through binary search
          step by step.
        </p>
      </div>
    );
  }

  const concept = {
    visualization: 'binary-search',
    title: 'Binary Search',
    complexity: COMPLEXITY,
    visualizationConfig: { array: experiment.array, target: experiment.target },
    visualizationSteps: experiment.states,
  };

  return <VisualizationEngine key={experiment.runId} concept={concept} />;
}