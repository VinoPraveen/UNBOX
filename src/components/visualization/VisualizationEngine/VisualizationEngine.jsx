import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Construction } from 'lucide-react';
import { getVisualization } from '../../visualizations/registry.js';
import VisualizationContainer from '../VisualizationContainer/VisualizationContainer.jsx';
import VisualizationProgress from '../VisualizationProgress/VisualizationProgress.jsx';
import VisualizationControls from '../VisualizationControls/VisualizationControls.jsx';
import usePlayback from './usePlayback.js';
import './VisualizationEngine.css';

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function ComingSoon() {
  return (
    <VisualizationContainer>
      <div className="viz-engine__coming-soon">
        <Construction size={32} aria-hidden="true" />
        <p className="viz-engine__coming-text">Visualization coming soon.</p>
        <Link to="/explore" className="btn btn-ghost">
          <ArrowLeft size={16} />
          Back to Explore
        </Link>
      </div>
    </VisualizationContainer>
  );
}

export default function VisualizationEngine({ concept, embedded = false, autoPlay = false }) {
  const vizConfig = getVisualization(concept.visualization);

  if (!vizConfig) {
    return <ComingSoon />;
  }

  if (vizConfig.type === 'interactive') {
    return (
      <motion.div
        className="viz-engine"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
      >
        <VisualizationContainer>
          <vizConfig.Component concept={concept} />
        </VisualizationContainer>
      </motion.div>
    );
  }

  return (
    <StepBasedEngine
      concept={concept}
      vizConfig={vizConfig}
      embedded={embedded}
      autoPlay={autoPlay}
    />
  );
}

function StepBasedEngine({ concept, vizConfig, embedded = false, autoPlay = false }) {
  const {
    visualizationSteps,
    visualizationConfig,
    complexity,
    title,
  } = concept;

  const total = visualizationSteps.length;
  const [step, setStep] = useState(1);
  const snapshot = visualizationSteps[step - 1];

  const {
    isPlaying,
    speed,
    play,
    togglePlayPause,
    handleSpeedChange,
    reset,
  } = usePlayback({ total, setStep });

  useEffect(() => {
    if (autoPlay) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = useCallback(
    () => setStep((current) => Math.min(current + 1, total)),
    [total]
  );

  const handlePrev = useCallback(
    () => setStep((current) => Math.max(current - 1, 1)),
    []
  );

  const engineBody = (
    <>
      <div className="viz-engine__header">
        <div className="viz-engine__header-left">
          <h3 className="viz-engine__title">{title}</h3>
        </div>
        <VisualizationProgress step={step} total={total} />
      </div>
      <div className="viz-engine__stage">
        <vizConfig.Component
          config={{ ...visualizationConfig, title }}
          complexity={complexity}
          step={step}
          total={total}
          snapshot={snapshot}
        />
      </div>
    </>
  );

  return (
    <motion.div
      className="viz-engine"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={revealVariants}
    >
      {embedded ? (
        <>
          {engineBody}
          <div className="viz-engine__controls">
            <VisualizationControls
              step={step}
              total={total}
              speed={speed}
              isPlaying={isPlaying}
              onPrev={handlePrev}
              onNext={handleNext}
              onReset={reset}
              onTogglePlayPause={togglePlayPause}
              onSpeedChange={handleSpeedChange}
            />
          </div>
        </>
      ) : (
        <>
          <VisualizationContainer>
            {engineBody}
          </VisualizationContainer>
          <VisualizationControls
            step={step}
            total={total}
            speed={speed}
            isPlaying={isPlaying}
            onPrev={handlePrev}
            onNext={handleNext}
            onReset={reset}
            onTogglePlayPause={togglePlayPause}
            onSpeedChange={handleSpeedChange}
          />
        </>
      )}
    </motion.div>
  );
}
