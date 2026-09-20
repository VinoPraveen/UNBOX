import { Network } from 'lucide-react';
import VisualizationEngine from '../components/visualization/VisualizationEngine/VisualizationEngine.jsx';
import OperationHistory from '../components/playground/OperationHistory/OperationHistory.jsx';
import './TreePlayground.css';

export default function createTreePlaygroundRenderer({ vizSlug, title, complexity, heightNote }) {
  return function TreePlaygroundRenderer({ experiment, onAction }) {
    if (!experiment || !experiment.steps) {
      return (
        <div className="tpg-idle">
          <span className="tpg-idle__icon">
            <Network size={22} aria-hidden="true" />
          </span>
          <p className="tpg-idle__title">Ready to experiment.</p>
          <p className="tpg-idle__text">
            Build a tree, then run an operation to watch each step — visit, move, compare, and
            see the result build up.
          </p>
        </div>
      );
    }

    const concept = {
      visualization: vizSlug,
      title,
      complexity,
      visualizationConfig: { heightNote },
      visualizationSteps: experiment.steps,
    };

    return (
      <div className="tpg">
        <VisualizationEngine key={experiment.runId} concept={concept} embedded autoPlay />
        {experiment.history && experiment.history.length > 0 ? (
          <OperationHistory history={experiment.history} onUndo={() => onAction('undo')} />
        ) : null}
      </div>
    );
  };
}
