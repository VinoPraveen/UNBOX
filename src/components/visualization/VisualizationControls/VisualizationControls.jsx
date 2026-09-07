import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';
import './VisualizationControls.css';

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

export default function VisualizationControls({
  step,
  total,
  speed,
  isPlaying,
  onPrev,
  onNext,
  onReset,
  onTogglePlayPause,
  onSpeedChange,
}) {
  const isFirst = step <= 1;
  const isLast = step >= total;

  return (
    <div className="viz-controls" role="group" aria-label="Visualization controls">
      <div className="viz-controls__timeline">
        <button
          type="button"
          className="btn btn-navy viz-controls__btn"
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Go to the previous step"
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        <button
          type="button"
          className="btn btn-navy viz-controls__btn viz-controls__play"
          onClick={onTogglePlayPause}
          aria-label={isPlaying ? 'Pause playback' : 'Play visualization'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          type="button"
          className="btn btn-gold viz-controls__btn"
          onClick={onNext}
          disabled={isLast}
          aria-label="Go to the next step"
        >
          Next
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="viz-controls__bottom">
        <button
          type="button"
          className="btn btn-ghost viz-controls__btn viz-controls__reset"
          onClick={onReset}
          aria-label="Reset to the first step"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <div className="viz-controls__speed" role="group" aria-label="Playback speed">
          <span className="viz-controls__speed-label">Speed</span>
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={
                'viz-controls__speed-btn' +
                (speed === option ? ' viz-controls__speed-btn--active' : '')
              }
              onClick={() => onSpeedChange(option)}
              aria-label={`${option}x speed`}
              aria-pressed={speed === option}
            >
              {option}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
