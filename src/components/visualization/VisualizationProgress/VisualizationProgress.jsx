import './VisualizationProgress.css';

export default function VisualizationProgress({ step, total }) {
  return (
    <div className="viz-progress">
      <span className="viz-progress__pill" aria-live="polite">
        STEP {step} / {total}
      </span>
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
    </div>
  );
}
