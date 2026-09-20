import { Undo2 } from 'lucide-react';
import './OperationHistory.css';

export default function OperationHistory({ history = [], onUndo }) {
  if (!history || history.length === 0) return null;

  const recent = history.slice(-8).reverse();

  return (
    <div className="op-history">
      <div className="op-history__header">
        <span className="op-history__title">OPERATIONS</span>
        <button
          type="button"
          className="op-history__undo"
          onClick={onUndo}
          aria-label="Undo the last operation"
        >
          <Undo2 size={14} aria-hidden="true" />
          Undo
        </button>
      </div>
      <ol className="op-history__list" aria-label="Operation history">
        {recent.map((entry) => (
          <li key={entry.id} className="op-history__item">
            <span className="op-history__dot" aria-hidden="true" />
            <span className="op-history__message">{entry.message}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}