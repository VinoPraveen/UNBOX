import './VisualizationProgress.css';

const MAX_DOTS = 26;

export default function VisualizationProgress({ step, total }) {
  return (
    <div className="viz-progress">
      <span className="viz-progress__pill" aria-live="polite">
        STEP {step} / {total}
      </span>
      {total <= MAX_DOTS ? (
        <div className="viz-progress__dots" role="img" aria-label={`Step ${step} of ${total}`}>
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={
                'viz-progress__dot' +
                (index + 1 === step ? ' viz-progress__dot--current' : '') +
                (index + 1 < step ? ' viz-progress__dot--done' : '')
              }
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <div
          className="viz-progress__bar"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step}
          aria-label={`Step ${step} of ${total}`}
        >
          <span
            className="viz-progress__bar-fill"
            style={{ width: `${(step / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
