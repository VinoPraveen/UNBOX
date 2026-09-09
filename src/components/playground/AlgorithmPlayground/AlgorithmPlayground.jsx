import { Search } from 'lucide-react';
import VisualizationEngine from '../../visualization/VisualizationEngine/VisualizationEngine.jsx';
import { getAlgorithm } from '../../../algorithms/registry.js';
import './AlgorithmPlayground.css';

export default function createAlgorithmPlayground(algorithmSlug) {
  const algorithm = getAlgorithm(algorithmSlug);

  return function AlgorithmPlaygroundRenderer({ experiment }) {
    if (!experiment) {
      return (
        <div className="apg-idle">
          <span className="apg-idle__icon">
            <Search size={22} aria-hidden="true" />
          </span>
          <p className="apg-idle__title">Ready to experiment.</p>
          <p className="apg-idle__text">
            {algorithm
              ? `Enter an array${algorithm.kind === 'search' ? ' and a target value' : ''}, then press Run to watch ${algorithm.name.toLowerCase()} execute step by step.`
              : 'Enter your input, then press Run to watch the algorithm execute step by step.'}
          </p>
        </div>
      );
    }

    const concept = {
      visualization: algorithmSlug,
      title: algorithm.name,
      complexity: algorithm.complexity,
      visualizationConfig: { array: experiment.array, target: experiment.target },
      visualizationSteps: experiment.states,
    };

    return (
      <VisualizationEngine
        key={experiment.runId}
        concept={concept}
        embedded
        autoPlay
      />
    );
  };
}