import './PlaygroundControls.css';

export default function PlaygroundControls({ operations, onAction, disabled = {} }) {
  if (!operations || operations.length === 0) return null;

  return (
    <div className="playground-controls">
      {operations.map((op) => {
        const variant = op.variant ?? 'navy';
        const isDisabled = disabled[op.id] === true;
        return (
          <button
            key={op.id}
            type="button"
            className={`btn btn-${variant} playground-controls__btn`}
            onClick={() => onAction(op.id)}
            disabled={isDisabled}
            aria-label={op.ariaLabel ?? op.label}
          >
            {op.label}
          </button>
        );
      })}
    </div>
  );
}
