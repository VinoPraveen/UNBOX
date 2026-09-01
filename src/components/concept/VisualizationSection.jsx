import { useState } from 'react';
import { motion } from 'framer-motion';
import { visualizations } from '../visualizations/registry.js';
import './VisualizationSection.css';

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function VisualizationSection({ concept }) {
  const {
    visualizationSteps,
    visualizationConfig,
    complexity,
    title,
    visualization,
    visualizationBlurb,
  } = concept;
  const Visualizer = visualizations[visualization];
  const [step, setStep] = useState(1);
  const total = visualizationSteps.length;
  const snapshot = visualizationSteps[step - 1];

  const handleNext = () => setStep((current) => Math.min(current + 1, total));
  const handlePrev = () => setStep((current) => Math.max(current - 1, 1));
  const handleReset = () => setStep(1);

  return (
    <section id="visualize" className="concept-section concept-viz">
      <div className="concept-viz__inner">
        <motion.div
          className="concept-viz__header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={revealVariants}
        >
          <p className="concept-viz__label">Interactive Visualization</p>
          <h2 className="concept-viz__heading">Watch it happen, step by step.</h2>
          <p className="concept-viz__subtitle">{visualizationBlurb}</p>
        </motion.div>

        <motion.div
          className="concept-viz__body"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
        >
          {Visualizer && (
            <Visualizer
              config={{ ...visualizationConfig, title }}
              complexity={complexity}
              step={step}
              total={total}
              snapshot={snapshot}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
