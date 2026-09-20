import { Waypoints } from 'lucide-react';
import VisualizationEngine from '../components/visualization/VisualizationEngine/VisualizationEngine.jsx';
import OperationHistory from '../components/playground/OperationHistory/OperationHistory.jsx';
import './GraphPlayground.css';

export default function createGraphPlaygroundRenderer({
  vizSlug,
  title,
  complexity,
  orderNote,
  autoPlay = true,
  idleText = 'Add nodes and edges to build a graph, then run an operation to watch each step.',
}) {
  return function GraphPlaygroundRenderer({ experiment, onAction }) {
    if (!experiment || !experiment.steps) {
      return (
        <div className="gpg-idle">
          <span className="gpg-idle__icon">
            <Waypoints size={22} aria-hidden="true" />
          </span>
          <p className="gpg-idle__title">Ready to experiment.</p>
          <p className="gpg-idle__text">{idleText}</p>
        </div>
      );
    }

    const concept = {
      visualization: vizSlug,
      title,
      complexity,
      visualizationConfig: { orderNote },
      visualizationSteps: experiment.steps,
    };

    return (
      <div className="gpg">
        <VisualizationEngine key={experiment.runId} concept={concept} embedded autoPlay={autoPlay} />
        {experiment.history && experiment.history.length > 0 ? (
          <OperationHistory history={experiment.history} onUndo={() => onAction('undo')} />
        ) : null}
      </div>
    );
  };
}
