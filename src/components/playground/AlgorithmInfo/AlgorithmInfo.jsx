import { getAlgorithm } from '../../../algorithms/registry.js';
import './AlgorithmInfo.css';

export default function AlgorithmInfo({ slug }) {
  const algorithm = getAlgorithm(slug);
  if (!algorithm) return null;

  const rows = algorithm.complexity.best
    ? [
        ['Best', algorithm.complexity.best],
        ['Average', algorithm.complexity.average],
        ['Worst', algorithm.complexity.worst],
      ]
    : [];

  return (
    <section className="algorithm-info" aria-label="Algorithm information">
      <span className="playground__section-label">About this algorithm</span>
      <p className="algorithm-info__description">{algorithm.description}</p>
      <div className="algorithm-info__complexity">
        {rows.length > 0 ? (
          rows.map(([label, value]) => (
            <span className="algorithm-info__row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </span>
          ))
        ) : (
          <span className="algorithm-info__row">
            <span>Time</span>
            <strong>{algorithm.complexity.time}</strong>
          </span>
        )}
        <span className="algorithm-info__row">
          <span>Space</span>
          <strong>{algorithm.complexity.space}</strong>
        </span>
      </div>
    </section>
  );
}